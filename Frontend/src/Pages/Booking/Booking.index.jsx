import React from "react";
import BookingInput from "./BookingInput";
import { MapImg } from "../../Constants/BookingConstants";
import { useState, useEffect, useRef } from "react";
import { FetchData } from "../../utility/fetchFromAPI";
import { alertSuccess } from "../../utility/Alert";

const Booking = () => {
  const MapInput = () => {
    const [address, setAddress] = useState("");
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [location, setLocation] = useState({
      lat: 28.681199800800137,
      lng: 77.2224575871163,
    }); // (Delhi, India)
    const mapRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
      const loadGoogleMaps = () => {
        if (!window.google) {
          const script = document.createElement("script");
          script.src = process.env.MAPS_URL;
          script.async = true;
          script.defer = true;
          script.onload = () => handleLocationPermission();
          document.head.appendChild(script);
        } else {
          handleLocationPermission();
        }
      };

      const handleLocationPermission = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setLocation(userLocation);
              initializeMap(userLocation); // map with user's location
            },
            () => {
              initializeMap(location); // default location if locationpermission is denied
            }
          );
        } else {
          initializeMap(location); // Use default location
        }
      };

      const initializeMap = (initialLocation) => {
        if (!window.google) {
          console.error("Google Maps API failed to load.");
          return;
        }

        const google = window.google;

        const newMap = new google.maps.Map(mapRef.current, {
          center: initialLocation,
          zoom: 16,
        });

        const newMarker = new google.maps.Marker({
          position: initialLocation,
          map: newMap,
          draggable: true,
        });

        const geocoder = new google.maps.Geocoder();

        newMarker.addListener("dragend", () => {
          const position = newMarker.getPosition();
          const newLocation = { lat: position.lat(), lng: position.lng() };
          setLocation(newLocation);

          geocoder.geocode({ location: newLocation }, (results, status) => {
            if (status === "OK" && results[0]) {
              setAddress(results[0].formatted_address);
            }
          });
        });

        newMap.addListener("click", (event) => {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };
          setLocation(clickedLocation);
          newMarker.setPosition(clickedLocation);

          geocoder.geocode({ location: clickedLocation }, (results, status) => {
            if (status === "OK" && results[0]) {
              setAddress(results[0].formatted_address);
            } else {
              setAddress("Address not found");
            }
          });
        });

        setMap(newMap);
        setMarker(newMarker);

        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current
        );
        autocomplete.setFields(["geometry", "formatted_address"]);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            const newPosition = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setLocation(newPosition);
            setAddress(place.formatted_address);

            newMarker.setPosition(newPosition);
            newMap.setCenter(newPosition);
          }
        });
      };

      loadGoogleMaps();
    }, []);

    return (
      <div>
        <div className="Map w-full  phone:h-[30vh] tablet:h-[27vh] laptop:h-[60vh] phone:hidden laptop:block">
          <div className="flex flex-row w-full h-screen bg-[#FFFFFF]">
            <div
              ref={mapRef}
              className="main_map w-full h-[500px] rounded-md shadow-lg bg-[#D5D5D7]"
            ></div>

            {/* Map UI */}
            <div className="absolute backdrop-blur-lg right-0 top-32 h-fit py-10 px-5 rounded-xl">
              <input
                ref={inputRef}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for a location..."
              />
              {/* Display selected address */}
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm mt-2 bg-gray-100"
                value={address}
                readOnly
              />
            </div>
          </div>
        </div>
          {/* Booking Input UI */}
          <BookingInput userAddress={address} userCords={location} />
      </div>
    );
  };

  return (
    <div>
      <MapInput />
      {/* <div className="Map w-full  phone:h-[30vh] tablet:h-[27vh] laptop:h-[60vh] phone:hidden laptop:block">
        <MapInput />
      </div>
      <BookingInput /> */}
    </div>
  );
};

export default Booking;
