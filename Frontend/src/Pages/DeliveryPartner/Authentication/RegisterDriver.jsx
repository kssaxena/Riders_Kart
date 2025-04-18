import { useRef, useState } from "react";
import Label from "../../../Components/Label";
import ButtonWrapper from "../../../Components/Buttons";
import ImageInput from "../../../Components/ImageInput";
import { FetchData } from "../../../utility/fetchFromAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser, clearUser } from "../../../utility/Slice/UserInfoSlice";
import { alertError, alertSuccess } from "../../../utility/Alert";
import { parseErrorMessage } from "../../../utility/ErrorMessageParser";
import Input from "../../../Components/Input";
function RegisterDriver() {
  // variables----------------------------------------------------------------
  const FormRef = useRef();
  const navigate = useNavigate();
  const Dispatch = useDispatch();

  // State to manage image previews
  const [imagePreviews, setImagePreviews] = useState({
    licenseImage: null,
    aadharImage: null,
    panImage: null,
    racFrontImage: null,
    racBackImage: null,
    insuranceImage: null,
    pollutionImage: null,
  });

  // State to manage number lengths
  const [numberLengths, setNumberLengths] = useState({
    phone: false,
    aadhar: false,
  });

  // function ----------------------------------------------------------------

  const getUsername = () => FormRef.current?.elements.name?.value;

  console.log(getUsername());
  const userName = getUsername();
  console.log(userName);

  // since the formRef is taking all the images from the input field
  // but I want the URL of the images which we are getting from the cloud
  // So here we are cleaning the image data and adding URL to the formData
  const AddUrl = (formData) => {
    //  creating array from imagePreviews object
    const imageFields = Object.keys(imagePreviews);

    imageFields.map((imageFile) => {
      formData.delete(imageFile);
      formData.append(imageFile, imagePreviews[imageFile]);
    });
  };

  // Handel submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(FormRef.current);

    // Clearing image data from the formData and adding url.
    AddUrl(formData);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Validate phone number (must be 10 digits)
    const phone = formData.get("phone");
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number");
      return;
    }

    // Validate Aadhar number (12 digits)
    const aadharNumber = formData.get("aadharNumber");
    const aadharRegex = /^\d{12}$/;
    if (!aadharRegex.test(aadharNumber)) {
      alert("Please enter a valid aadhar number");
      return;
    }

    // Validate PAN number (10 characters, alphanumeric, specific format)
    const panNumber = formData.get("panNumber");
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber)) {
      alert("Please enter a valid Pan number");
      return;
    }

    // Validate Driving License number (adjust based on local rules, typically alphanumeric)
    const licenseNumber = formData.get("licenseNumber");
    const dlRegex = /^[A-Z]{2}\d{13}$/; // Adjust this regex as per the regional format
    if (!dlRegex.test(licenseNumber)) {
      alert("Please enter a valid Driving License number");
      return;
    }

    const plateNumber = formData.get("plateNumber");
    const plateRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
    if (!plateRegex.test(plateNumber)) {
      alert("Please enter a valid Plate number");
      return;
    }

    try {
      const response = await FetchData("driver/register", "post", formData);

      console.log(response);

      // Storing data inside redux store
      Dispatch(clearUser());
      Dispatch(addUser(response.data.data.user));
      Dispatch(
        addUser({
          driver: true,
          Personal: false,
        })
      );

      alertSuccess(response.data.message);

      // Reset form fields and clear image previews
      FormRef.current.reset();
      setImagePreviews({
        licenseImage: null,
        aadharImage: null,
        panImage: null,
        racFrontImage: null,
        racBackImage: null,
        insuranceImage: null,
        pollutionImage: null,
      });

      // Navigate to home page and show success message
      navigate("/");
    } catch (error) {
      console.log(error);
      // alertError(parseErrorMessage(error.response.data));
    }
  };

  return (
    <div className="max-w-[80vw] mx-auto my-10  rounded-lg shadow-2xl shadow-white-300 p-8 bg-[#949597]">
      <h1 className="text-3xl font-bold mb-6 heading-text-gray">
        Personal Details <br />
        <span className="text-red-600 font-thin text-sm">
          **All fields are Required
        </span>
      </h1>
      <form
        onSubmit={handleSubmit}
        ref={FormRef}
        className="space-y-6 w-full flex justify-center items-center flex-col  "
      >
        <div className="Personal-details w-full grid laptop:grid-cols-3 phone:grid-cols-1 tablet:grid-cols-2 gap-6">
          {/* Name */}
          <div className="mb-3">
            <Label>Name:</Label>
            <Input
              placeholder={"Enter Name"}
              type="text"
              name="name"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="mb-3">
            <Label>Phone Number:</Label>
            <Input
              placeholder={"Contact Number"}
              type="number"
              name="phone"
              required
            />
            {numberLengths.phone && (
              <span className="text-red-500">
                Phone number should be 10 digits long.
              </span>
            )}
          </div>

          {/* Address */}
          <div className="mb-3">
            <Label>Address:</Label>
            <Input
              placeholder={"Address"}
              type="text"
              name="address"
              required
            />
          </div>

          {/* Driving License */}
          <div className="mb-3">
            <Label>Driving License Number:</Label>
            <Input
              placeholder={"Driving License Number"}
              type="text"
              name="licenseNumber"
              required
            />

            <Label>Upload Driving License Image:</Label>
            <ImageInput
              setImagePreviews={setImagePreviews}
              imagePreviews={imagePreviews.licenseImage}
              UserData={{
                inputName: "licenseImage",
                tags: ["document", "license Image"],
                userName: getUsername(),
              }}
            />
          </div>

          {/* Aadhar */}
          <div className="mb-3">
            <Label>Aadhar Number:</Label>
            <Input
              placeholder={"Aadhar Card Number"}
              type="number"
              name="aadharNumber"
              required
            />
            {numberLengths.aadhar && (
              <span className="text-red-500">
                Aadhar number should be 12 digits long.
              </span>
            )}
            <Label>Upload Aadhar Card Image:</Label>
            <ImageInput
              setImagePreviews={setImagePreviews}
              imagePreviews={imagePreviews.aadharImage}
              UserData={{
                inputName: "aadharImage",
                tags: ["document", "aadhar Image"],
                userName: getUsername(),
              }}
            />
          </div>

          {/* PAN */}
          <div className="mb-3">
            <Label>PAN Number:</Label>
            <Input
              placeholder={"PAN Number"}
              type="text"
              name="panNumber"
              required
            />
            <Label>Upload Pan card Image: </Label>
            <ImageInput
              setImagePreviews={setImagePreviews}
              imagePreviews={imagePreviews.panImage}
              UserData={{
                inputName: "panImage",
                tags: ["document", "pan card Image"],
                userName: getUsername(),
              }}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <Label>Password:</Label>
            <Input
              type="password"
              name="password"
              placeholder={"Password"}
              required
            />
          </div>

          {/* Physical Disability */}
          <div className="mb-3 flex items-center gap-4 justify-start  ">
            <input type="checkbox" name="physicallyDisabled" className="" />
            <Label htmlFor="disability">Any Physical Disability:</Label>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-5 w-full">Vehicle Details</h2>

        <div className="Vehicle-details grid laptop:grid-cols-3 phone:grid-cols-1 tablet:grid-cols-2 gap-4">
          {/* Vehicle Type */}
          <div className="mb-3">
            <Label>Select Vehicle Type:</Label>
            <select
              name="vehicleType"
              className=" border-l-2 border-b-2 backdrop-blur-xl border-gray-900/30 txt-light-brown text-sm rounded-lg block w-4/5 mb-4 p-2.5 dark:placeholder-white dark:text-black drop-shadow-xl focus:outline-none "
            >
              <option value="bike">Bike</option>
              <option value="scooty">Scooty</option>
              <option value="pickup">Pickup</option>
              <option value="truck">Truck</option>
              <option value="Electric Bike"> Electric Bike </option>
              <option value="Electric vehicle (3/4 wheeler)">
                Electric vehicle (3/4 wheeler)
              </option>
            </select>
          </div>

          {/* Vehicle Description */}
          <div className="mb-3">
            <Label>Vehicle Description:</Label>
            <textarea
              type="text"
              name="vehicleDescription"
              className=" border-l-2 border-b-2 backdrop-blur-xl border-gray-900/30 txt-light-brown text-sm rounded-lg block w-80 mb-4 p-2.5 dark:placeholder-white dark:text-black drop-shadow-xl focus:outline-none "
              required
            />
          </div>

          {/* Plate No */}
          <div className="mb-3">
            <Label>Plate Number:</Label>
            <Input
              type="text"
              name="plateNumber"
              placeholder="Plate Number"
              required
            />
          </div>

          {/* RAC Front and Back Images */}
          <div>
            <Label>Upload RAC Front Image:</Label>
            <ImageInput
              setImagePreviews={setImagePreviews}
              imagePreviews={imagePreviews.racFrontImage}
              UserData={{
                inputName: "racFrontImage",
                tags: ["document", "rac Front Image"],
                userName: getUsername(),
              }}
            />
          </div>
          <div>
            <Label>Upload RAC Back Image:</Label>
            <ImageInput
              setImagePreviews={setImagePreviews}
              imagePreviews={imagePreviews.racBackImage}
              UserData={{
                inputName: "racBackImage",
                tags: ["document", "rac Back Image"],
                userName: getUsername(),
              }}
            />
          </div>

          {/* Plate No */}
          {/* <div className="mb-3">
            <Label>Plate Number:</Label>
            <Input
              type="text"
              name="plateNumber"
              placeholder="Plate Number"
              required
            />
          </div> */}

          {/* Insurance Image */}
          <div className="mb-3">
            <Label>Insurance Number:</Label>
            <Input
              type="text"
              name="insuranceNumber"
              placeholder="Policy Number"
              required
            />

            <Label>Insurance Expiry:</Label>
            <Input
              type="date"
              name="insuranceExpiry"
              placeholder="Expiry Date"
              required
            />

            <Label>Upload Insurance Copy: </Label>
            <ImageInput
              setImagePreviews={setImagePreviews}
              imagePreviews={imagePreviews.insuranceImage}
              UserData={{
                inputName: "insuranceImage",
                tags: ["document", "insurance Image"],
                userName: getUsername(),
              }}
            />
          </div>

          {/* Pollution Certificate Image (Optional) */}
          <div className="mb-3">
            <Label>Upload Pollution Certificate:</Label>
            <ImageInput
              setImagePreviews={setImagePreviews}
              imagePreviews={imagePreviews.pollutionImage}
              UserData={{
                inputName: "pollutionImage",
                tags: ["document", "pollution Image"],
                userName: getUsername(),
              }}
            />
          </div>
        </div>

        <ButtonWrapper type="submit" className={"w-40  "}>
          Submit
        </ButtonWrapper>
      </form>
    </div>
  );
}

export default RegisterDriver;
