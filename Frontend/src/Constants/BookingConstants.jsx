import Map_Image from "../assets/Booking/Map_SC.png";
import {
  AddressInput,
  Estimation,
  ItemDetails,
  ReviewPart,
} from "../Components/AllInputComponents";

export const MapImg = Map_Image;

export const AllForms = [
  { formName: "Sender", formComponent: <AddressInput AddressFor={"Sender"} /> },
  {
    formName: "Receiver",
    formComponent: <AddressInput AddressFor={"Receiver"} />,
  },
  { formName: "Item", formComponent: <ItemDetails /> },
  { formName: "Estimate", formComponent: <Estimation /> },
  
];

export const AvailableDeliveryPartner = [
  {
    name: "Riders Kart",
    deliveryTime: "24 Sep - 25 Sep",
    price: 48,
  },
  {
    name: "Xpressbees",
    deliveryTime: "24 Sep - 25 Sep",
    price: 110,
  },
  {
    name: "Blue Dart",
    deliveryTime: "24 Sep - 25 Sep",
    price: 115,
  },
  {
    name: "Get Fast",
    deliveryTime: "25 Sep - 25 Sep",
    price: 95,
  },
];
