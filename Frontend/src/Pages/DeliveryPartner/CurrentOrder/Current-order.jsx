import { Package, User, Truck, Calendar, Box, MapPin } from "lucide-react";
import Card from "../../../Components/Card";
import ButtonWrapper from "../../../Components/Buttons";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FetchData } from "../../../utility/fetchFromAPI";
import Loader from "../../../Components/Loader";

export default function CurrentProduct() {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState(null);

  // Functions

  useEffect(() => {
    async function getCurrentOrder(orderId) {
      const Orders = await FetchData(
        `order/get-order-details/${orderId}`,
        "get"
      );
      //console.log(Orders);
      setCurrentOrder(Orders?.data?.data);
      return Orders;
    }

    getCurrentOrder(orderId);
  }, []);

  return !currentOrder ? (
    <Loader />
  ) : (
    <div className="min-h-screen bg-gray-100 p-4 phone:p-6 lg:p-8">
      <div className="max-w-[80vw] mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Parcel Details
        </h1>

        <div className="grid gap-6 ">
          <div className="grid grid-cols-2 gap-5 w-full">
            {/* Sender Card */}
            <Card>
              <h1 className="flex items-center text-blue-600 font-bold text-xl mb-5 ">
                <User className="mr-2" />
                Sender Information
              </h1>

              <div>
                <p className="font-semibold">{currentOrder?.sender?.name}</p>
                <p className="text-sm text-gray-500">
                  Address: {currentOrder?.sender?.address}
                </p>
                <p className="text-sm text-gray-500">
                  {currentOrder?.sender?.number}
                </p>
              </div>
            </Card>

            {/* Receiver Card */}
            <Card>
              <h1 className="flex items-center text-green-600 font-bold text-xl mb-5">
                <User className="mr-2" />
                Receiver Information
              </h1>

              <div>
                <p className="font-semibold">{currentOrder?.receiver?.name}</p>
                <p className="text-sm text-gray-500">
                  Address: {currentOrder?.receiver?.address}
                </p>
                <p className="text-sm text-gray-500">
                  {currentOrder?.receiver?.number}
                </p>
              </div>
            </Card>
          </div>

          {/* Product Card */}
          <Card className="md:col-span-2">
            <h1 className="flex items-center text-purple-600 font-bold text-xl mb-5">
              <Box className="mr-2" />
              Product Details
            </h1>

            <div>
              <div className="grid gap-4 laptop:grid-cols-2 phone:grid-cols-2">
                <div>
                  <p className="font-semibold">Item Description:</p>
                  <p>{currentOrder?.productDetails?.productType}</p>
                </div>
                <div>
                  <p className="font-semibold">Weight:</p>
                  <p>{currentOrder?.productDetails?.productWeight}</p>
                </div>
                <div>
                  <p className="font-semibold">Dimensions:</p>
                  <p>
                    {currentOrder?.productDetails?.Dimension.length} x{" "}
                    {currentOrder?.productDetails?.Dimension.width} x{" "}
                    {currentOrder?.productDetails?.Dimension.height}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Value:</p>
                  <p>{currentOrder?.productDetails?.value}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* TODO: Yet in development phase */}
          {/* Shipping Details */}
          <Card className="md:col-span-2">
            <h1 className="flex items-center text-orange-600 font-bold text-xl mb-5">
              <Truck className="mr-2" />
              Shipping Details ( In development phase )
            </h1>

            <div>
              <div className="grid gap-4 phone:grid-cols-2">
                <div>
                  <p className="font-semibold">Tracking Number:</p>
                  <p>1Z999AA1234567890</p>
                </div>
                <div>
                  <p className="font-semibold">Service Type:</p>
                  <p>Express Delivery</p>
                </div>
                <div>
                  <p className="font-semibold">Estimated Delivery:</p>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    June 15, 2023
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Current Location:</p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Transit Hub, TH City
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <ButtonWrapper className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Track Parcel
          </ButtonWrapper>
        </div>
      </div>
    </div>
  );
}
