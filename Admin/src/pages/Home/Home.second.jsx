import React, { useEffect, useRef, useState } from "react";
import { initialSections } from "../../Constants/Home.constant";
import { FetchData } from "../../Utils/fetchFromAPI";
import { Link, useParams } from "react-router-dom";
import { alertSuccess } from "../../Utils/Alert";
import { useSelector } from "react-redux";
import { truncateString } from "../../Utils/Utility-functions";
import ApiKeyCard from "../../Components/apiCard";
import PopUp from "../../Components/PopUpWrapper";

const Home2 = () => {
  const offerFormRef = useRef(null);
  const [sections, setSections] = useState(initialSections);
  const { sec } = useParams();
  const [selectedSection, setSelectedSection] = useState(sec ?? "All_Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [offerFilter, setOfferFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [apiDetails, setApiDetails] = useState(null);

  const user = useSelector((store) => store.UserInfo.user);

  const offerFormInputs = [
    { title: "offerName", type: "text" },
    { title: "offerDescription", type: "text" },
    { title: "offerPrice", type: "number" },
    { title: "offerPercentage", type: "number" },
    { title: "offerValidity", type: "date" },
  ];

  const handleOfferFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Access the current value of the ref and prepare FormData
      const formData = new FormData(offerFormRef.current);
      const audience = extractUserIds(OfferFilteredData);
      formData.append("audience", JSON.stringify(audience));

      // Example: Log the form data for testing
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Convert FormData to JSON (if backend supports JSON)
      // This step depends on whether your backend accepts FormData directly.
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Call FetchData with 'post' method and data
      const response = await FetchData(
        "admin/offer/create-new-offer",
        "post",
        data
      );

      // Handle success
      console.log("Form submitted successfully:", response.data);
      alertSuccess("Form submitted successfully");
      setShowOfferForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const userProfile = {
    name: user?.name || "Admin",
    profileImage: "",
  };

  // console.log("Header")

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, "0");
    return `${day}-${month}-${year}`;
    // return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    const fetchAllOrders = async () => {
      const Response = await FetchData("admin/order/get-all-order", "get");
      const data = Response?.data?.data;

      console.log(Response);

      if (Array.isArray(data)) {
        setSections((prevSections) => ({
          ...prevSections,
          All_Orders: {
            ...prevSections.All_Orders,
            tableData: data.map((order, i) => ({
              Sl_No: i + 1,
              BookingId: order._id,
              field: "orders",
              User_id: order.user,
              CustomerName: order.sender.name,
              Date: formatDate(order.createdAt),
              Status: order.status,
              Contact_Number: order.sender.number,
            })),
          },
        }));
      } else {
        console.error("Expected an array but got:", data);
      }
    };

    const fetchUsers = async () => {
      const Response = await FetchData("admin/user/get-all-users", "get");
      const data = Response?.data?.data;

      if (Array.isArray(data)) {
        setSections((prevSections) => ({
          ...prevSections,
          Users: {
            ...prevSections.Users,
            tableData: data.map((user, i) => ({
              Sl_No: i + 1,
              UserId: user._id,
              field: "users",
              Name: user.name,
              Email: user.email,
              allOrders: user.allOrders.length,
            })),
          },
        }));
      } else {
        console.error("Expected an array but got:", data);
      }
      // console.log(data);
    };

    const fetchDeliveryPartners = async () => {
      const Response = await FetchData(
        "admin/driver/get-all-pending-requests",
        "get"
      );
      const data = Response?.data?.data;

      if (Array.isArray(data)) {
        setSections((prevSections) => ({
          ...prevSections,
          DeliveryPartner: {
            ...prevSections.DeliveryPartner,
            tableData: data.map((partner, i) => ({
              Sl_No: i + 1,
              RequestId: partner._id,
              field: "pendingRequests",
              Name: partner.name,
              VehicleType: partner.vehicleDetails?.vehicleType,
              ApplicationDate: formatDate(partner.updatedAt),
              Status: partner.verificationStatus,
            })),
          },
        }));
      } else {
        console.error("Expected an array but got:", data);
      }
    };

    const fetchVerifiedDeliveryPartners = async () => {
      const Response = await FetchData(
        "admin/driver/get-all-verified-drivers",
        "get"
      );

      const data = Response?.data?.data;

      if (Array.isArray(data)) {
        setSections((prevSections) => ({
          ...prevSections,
          VerifiedDeliveryPartner: {
            ...prevSections.VerifiedDeliveryPartner,
            tableData: data.map((partner, i) => ({
              Sl_No: i + 1,
              PartnerId: partner._id,
              field: "verifiedPartners",
              Name: partner.name,
              VehicleType: partner.vehicleDetails?.vehicleType,
              ApplicationDate: formatDate(partner.updatedAt),
              Status: partner.verificationStatus,
            })),
          },
        }));
      } else {
        console.error("Expected an array but got:", data);
      }
    };

    const fetchAPIData = async () => {
      const Response = await FetchData("admin/api-key/", "get");
      const data = Response?.data?.data;

      console.log(Response);
      if (Array.isArray(data)) {
        setSections((prevSections) => ({
          ...prevSections,
          ApiKey: {
            ...prevSections.ApiKey,
            tableData: data.map((api, i) => ({
              Sl_No: i + 1,
              key: api.key,
              type: api.type,
              user: api.user.name,
              status: api.status,
              expiry: formatDate(api.expiresAt),
              createdAt: formatDate(api.createdAt),
            })),
          },
        }));
      } else {
        console.error("Expected an array but got:", data);
      }
    };

    fetchAllOrders();
    fetchUsers();
    fetchDeliveryPartners();
    fetchVerifiedDeliveryPartners();
    fetchAPIData();
  }, []);

  const OfferFilteredData = sections[selectedSection]?.tableData.filter(
    (row) => {
      const matchesSearchQuery = Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesStatusFilter =
        selectedSection === "All_Orders" && statusFilter
          ? row.Status?.toLowerCase() === statusFilter.toLowerCase()
          : true;

      const matchesOfferFilter =
        selectedSection === "Users" && offerFilter === "offer"
          ? row.allOrders >= 10
          : true;

      const matchesDateFilter =
        startDate && endDate
          ? new Date(row.Date?.split("-").reverse().join("-")) >=
              new Date(startDate) &&
            new Date(row.Date?.split("-").reverse().join("-")) <=
              new Date(endDate)
          : true;

      const matchesVehicleFilter =
        selectedSection === "VerifiedDeliveryPartner" && vehicleFilter
          ? row.vehicleType?.toLowerCase() === vehicleFilter.toLowerCase()
          : true;

      return (
        matchesSearchQuery &&
        matchesStatusFilter &&
        matchesOfferFilter &&
        matchesDateFilter &&
        matchesVehicleFilter
      );
    }
  );

  const extractUserIds = (filteredData) => {
    // Use a Set to avoid duplicate user IDs
    const userIds = new Set();
    filteredData.forEach((row) => {
      if (row.User_id) userIds.add(row.User_id);
    });

    // Convert Set back to Array if required
    return Array.from(userIds);
  };

  return (
    <div>
      <header className="flex fixed w-full items-center justify-end bg-gray-100 text-gray-800 p-4 shadow-lg">
        <div className="w-[50%] flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin</h1>
          <button className="flex items-center space-x-3 border px-4 py-1 text-gray-800 bg-blue-600 rounded-xl hover:bg-blue-700 transition hover:-translate-x-2">
            <span>{userProfile.name}</span>
            <img
              src={userProfile.profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-300"
            />
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="w-fit h-screen fixed overflow-hidden bg-gray-100 text-gray-800 p-6 shadow-lg">
          <h2 className="text-2xl mb-8 font-bold">Dashboard</h2>
          <nav>
            <ul className="space-y-4">
              {Object.entries(sections).map(([sectionKey, section]) => (
                <li key={sectionKey}>
                  <button
                    onClick={() => setSelectedSection(sectionKey)}
                    className={`w-full text-left py-2 px-4 rounded ${
                      selectedSection === sectionKey
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white transition"
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-10 overflow-y-hidden pl-80 mt-20">
          {sections[selectedSection] && (
            <section>
              <div className="grid grid-cols-2 grid-rows-2 gap-4">
                <h2 className="text-xl font-semibold mb-4">
                  {sections[selectedSection].title}
                </h2>
                {selectedSection != "All_Orders" && (
                  <span className="text-xl font-semibold ">
                    Total: {sections[selectedSection].tableData.length}
                  </span>
                )}
                <p className="text-gray-600 mb-4 col-span-2">
                  {sections[selectedSection].description}
                </p>
              </div>

              {selectedSection === "All_Orders" && (
                <div className="mb-4">
                  <div className="input_for_search">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by Booking ID or Contact Number"
                      className="p-2 border border-gray-300 rounded-lg w-full mb-2"
                    />
                  </div>

                  <div className="Filter_by_Status">
                    <label htmlFor="statusFilter" className="mr-2">
                      Filter by Status:
                    </label>
                    <select
                      id="statusFilter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">All</option>
                      <option value="created">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="cancelled">Delivered</option>
                    </select>
                  </div>

                  <div className="offer_filter_and_button mt-4">
                    <label htmlFor="offerFilter" className="mr-2">
                      Filter by Offers:
                    </label>
                    <select
                      id="offerFilter"
                      value={offerFilter}
                      onChange={(e) => setOfferFilter(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">All</option>
                      <option value="offer">
                        {/* Offers (Orders ≥ 10 & Days ≤ 10) */}
                        Eligible Users for Offer
                      </option>
                    </select>
                    <button
                      className="mx-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => setShowOfferForm(true)}
                    >
                      Generate Offer
                    </button>
                  </div>

                  <div className="Filter_by_DateRange flex items-center gap-2 mt-5">
                    <label className="mr-2">Filter by Date:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg"
                    />
                    <span>to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              )}
              {selectedSection === "Users" && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by User ID or Email"
                    className="p-2 border border-gray-300 rounded-lg w-full mb-2"
                  />

                  <div className="offer_filter_and_button mt-4">
                    <label htmlFor="offerFilter" className="mr-2">
                      Filter by Offers:
                    </label>
                    <select
                      id="offerFilter"
                      value={offerFilter}
                      onChange={(e) => setOfferFilter(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">All</option>
                      <option value="offer">
                        {/* Offers (Orders ≥ 10 & Days ≤ 10) */}
                        Eligible Users for Offer
                      </option>
                    </select>
                    <button
                      className="mx-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => setShowOfferForm(true)}
                    >
                      Generate Offer
                    </button>
                  </div>
                </div>
              )}
              {selectedSection === "DeliveryPartner" && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by User ID or Email"
                    className="p-2 border border-gray-300 rounded-lg w-full mb-2"
                  />
                </div>
              )}
              {selectedSection === "VerifiedDeliveryPartner" && (
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by User ID or Email"
                    className="p-2 border border-gray-300 rounded-lg w-full mb-2"
                  />

                  <div className="offer_filter_and_button mt-4">
                    <label htmlFor="offerFilter" className="mr-2">
                      Filter by Offers:
                    </label>
                    <select
                      id="offerFilter"
                      value={offerFilter}
                      onChange={(e) => setOfferFilter(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">All</option>
                      <option value="offer">
                        {/* Offers (Orders ≥ 10 & Days ≤ 10) */}
                        Eligible Users for Offer
                      </option>
                    </select>
                    <button
                      className="mx-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => setShowOfferForm(true)}
                    >
                      Generate Offer
                    </button>
                  </div>
                  <div className="Filter_by_Status mt-4 ">
                    <label htmlFor="statusFilter" className="mr-2">
                      Filter by vehicle type:
                    </label>
                    <select
                      id="statusFilter"
                      value={vehicleFilter}
                      onChange={(e) => setVehicleFilter(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">All</option>
                      <option value="created">Bike</option>
                      <option value="in-progress">Electric Bike</option>
                      <option value="cancelled">Truck</option>
                      <option value="cancelled">Scooty</option>
                    </select>
                  </div>
                </div>
              )}

              <table className="w-full border border-gray-900 rounded-lg shadow-sm overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    {Object.keys(OfferFilteredData[0] || {}).map((header) => (
                      <th
                        key={header}
                        className="px-4 py-2 border border-gray-300"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OfferFilteredData.map((row, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      {selectedSection === "All_Orders" &&
                        Object.values(row).map((cell, i) => (
                          <td
                            key={i}
                            className="px-1 py-1 border border-gray-300 text-center "
                          >
                            <Link
                              to={`/current-order/${row.BookingId}`}
                              className="hover:text-blue-500 hover:underline hover:underline-cyan-500"
                            >
                              {cell}
                            </Link>
                          </td>
                        ))}
                      {selectedSection === "Users" &&
                        Object.values(row).map((cell, i) => (
                          <td
                            key={i}
                            className="px-1 py-1 border border-gray-300 text-center "
                          >
                            <Link
                              to={`/current-user/${row.UserId}`}
                              className="hover:text-blue-500 hover:underline hover:underline-cyan-500"
                            >
                              {cell}
                            </Link>
                          </td>
                        ))}
                      {selectedSection === "DeliveryPartner" &&
                        Object.values(row).map((cell, i) => (
                          <td
                            key={i}
                            className="px-1 py-1 border border-gray-300 text-center "
                          >
                            <Link
                              to={`/current-pending-request/${row.RequestId}`}
                              className="hover:text-blue-500 hover:underline hover:underline-cyan-500"
                            >
                              {cell}
                            </Link>
                          </td>
                        ))}
                      {selectedSection === "VerifiedDeliveryPartner" &&
                        Object.values(row).map((cell, i) => (
                          <td
                            key={i}
                            className="px-1 py-1 border border-gray-300 text-center "
                          >
                            <Link
                              to={`/current-verified-partner/${row.PartnerId}`}
                              className="hover:text-blue-500 hover:underline hover:underline-cyan-500"
                            >
                              {cell}
                            </Link>
                          </td>
                        ))}
                      {selectedSection === "ApiKey" &&
                        Object.entries(row).map(([key, value], i) => (
                          <td
                            key={i}
                            className="px-1 py-1 border border-gray-300 text-center "
                          >
                            <Link
                              to={`#`}
                              onClick={() => setApiDetails(row)}
                              className="hover:text-blue-500 hover:underline hover:underline-cyan-500"
                            >
                              {key === "key"
                                ? truncateString(value, 20) // or your custom function
                                : value}
                            </Link>
                          </td>
                        ))}
                      {apiDetails !== null && selectedSection === "ApiKey" && (
                        <PopUp onClose={() => setApiDetails(null)}>
                          <ApiKeyCard apiKey={apiDetails} />
                        </PopUp>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </main>

        {showOfferForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Generate Offer</h2>
              <form ref={offerFormRef} onSubmit={handleOfferFormSubmit}>
                {offerFormInputs.map((field, index) => {
                  return (
                    <div key={index} className="mb-4">
                      <label
                        className="block font-medium mb-2"
                        htmlFor={field.title}
                      >
                        {field.title
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <input
                        type={field.type}
                        id={field.title}
                        name={field.title}
                        className="p-2 border border-gray-300 rounded-lg w-full"
                        required
                      />
                    </div>
                  );
                })}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowOfferForm(false)}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    // onClick={handleOfferFormSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home2;
