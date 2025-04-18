import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackGround from "../../assets/Home/HomeBackground.jpg";
import { motion } from "framer-motion";
import Label from "../../Components/Label";
import Input from "../../Components/Input";
import { FetchData } from "../../utility/fetchFromAPI";
import ButtonWrapper from "../../Components/Buttons";
import { termsData } from "../../Constants/API_terms";
import { alertSuccess } from "../../utility/Alert";

const ApiRequests = () => {
  const user = useSelector((store) => store.UserInfo.user);
  const { userId } = useParams();
  const formRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      const response = await FetchData("user/api-key/1234", "post", formData);
      console.log(response);
      // alert("A request has been generated for the API key successfully");
      alertSuccess("A request has been generated for the API key successfully");
      setIsOpen(false); // Close the form after submission
      navigate("/");
    } catch (error) {
      alert("Error submitting form. Please try again.");
      console.error("Error submitting form:", error);
    }
  };

  // UI elements for the API request form
  const ApiForm = () => {
    const [isDeveloper, setIsDeveloper] = useState(false);
    const [isProduction, setIsProduction] = useState(false);
    const [developerDate, setDeveloperDate] = useState("");
    const [productionDate, setProductionDate] = useState("");
    const [platformName, setPlatformName] = useState("");
    const [platformType, setPlatformType] = useState("");

    // Handle changes in Developer and Production toggles
    const handleDeveloperChange = (e) => {
      setIsDeveloper(e.target.value === "yes");
      if (e.target.value === "yes") setIsProduction(false); // Hide production if developer is selected
    };

    const handleProductionChange = (e) => {
      setIsProduction(e.target.value === "yes");
      if (e.target.value === "yes") setIsDeveloper(false); // Hide developer if production is selected
    };

    // Handling date changes
    const handleDeveloperDateChange = (e) => {
      setDeveloperDate(e.target.value);
    };

    const handleProductionDateChange = (e) => {
      setProductionDate(e.target.value);
    };

    return (
      <div className="w-3/4 mx-auto p-6 backdrop-blur-sm my-auto shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">ApiForm</h2>
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Are you a Developer */}
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
              Are you a Developer?
            </label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="developer"
                  value="yes"
                  onChange={handleDeveloperChange}
                  className="mr-2"
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="developer"
                  value="no"
                  onChange={handleDeveloperChange}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {/* Developer Section */}
          {isDeveloper && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <p className="text-red-600 font-semibold mb-4">
                Warning: Developer API key will be valid only for 30 days from
                validation.
              </p>
              <label className="block text-lg font-medium mb-2">
                Developer Date
              </label>
              <input
                type="date"
                value={developerDate}
                onChange={handleDeveloperDateChange}
                min={new Date().toISOString().split("T")[0]} // Only allow future dates
                className="w-full p-2 border border-gray-300 rounded"
              />
            </motion.div>
          )}

          {/* For Production Purpose */}
          {!isDeveloper && (
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                For Production Purpose?
              </label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="production"
                    value="yes"
                    onChange={handleProductionChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="production"
                    value="no"
                    onChange={handleProductionChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
          )}

          {/* Production Section */}
          {isProduction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter platform name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">
                  Platform Type
                </label>
                <input
                  type="text"
                  value={platformType}
                  onChange={(e) => setPlatformType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter platform type"
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">
                  Production Date
                </label>
                <input
                  type="date"
                  value={productionDate}
                  onChange={handleProductionDateChange}
                  min={new Date().toISOString().split("T")[0]} // Only allow future dates
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </motion.form>
      </div>
    );
  };

  const TermsAndConditions = () => {
    return (
      <div className="max-w-3xl h-5/6 mx-auto p-6 backdrop-blur-lg rounded-lg shadow-md overflow-y-scroll no-scrollbar">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          API Key Terms and Conditions
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          By generating and using an API key from our platform, you agree to the
          following terms and conditions:
        </p>

        {/* Map through each term section */}
        {termsData.map((section, index) => (
          <div key={index} className="mt-8">
            <h2 className="text-2xl font-medium text-gray-800 mb-4">
              {section.title}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setIsOpen(true)}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
          >
            Accept
          </button>
          <Link
            to={"/"}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
          >
            Decline
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="relative bg-red-400 h-screen w-screen overflow-hidden">
        <div className="absolute top-0 left-0">
          <img src={BackGround} className="phone:w-screen phone:h-screen" />
        </div>
        <div className="absolute overflow-scroll w-full h-full flex justify-center items-start py-10 top-0 left-0">
          {/* <ApiForm /> */}
          <TermsAndConditions />
          {isOpen && (
            <div className="backdrop-blur-md absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="bg-white px-10 py-10 rounded-lg shadow-lg flex flex-col gap-2 justify-center items-center"
              >
                <label htmlFor="">Select the expiry date for the API key</label>
                <Input
                  name={"expiresAt"}
                  type="date"
                  minimumDate={new Date().toISOString().split("T")[0]}
                  className={"w-full"}
                />
                <label htmlFor="">Select your API key type</label>
                <select
                  name={"type"}
                  id=""
                  className="border-gray-900/30 border txt-light-brown text-sm rounded-lg block w-5/6  p-2.5 dark:placeholder-gray-900 dark:text-black drop-shadow-xl focus:outline-none flex justify-center items-center"
                >
                  <option value="select" disabled>
                    Select
                  </option>
                  <option value={"testing"}>Testing</option>
                  <option value={"production"}>Production</option>
                </select>
                <ButtonWrapper
                  children={"Submit API request"}
                  type="submit"
                  className={"w-full bg-green-500 "}
                />
                <ButtonWrapper
                  className={"w-full "}
                  children={"Cancel"}
                  onClick={() => navigate("/")}
                />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiRequests;
