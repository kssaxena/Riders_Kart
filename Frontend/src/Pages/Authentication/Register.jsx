import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import ButtonWrapper from "../../Components/Buttons";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { alertError, alertSuccess } from "../../utility/Alert";
import { parseErrorMessage } from "../../utility/ErrorMessageParser";
import { FetchData } from "../../utility/fetchFromAPI";
import { addUser, clearUser } from "../../utility/Slice/UserInfoSlice";
import Input from "../../Components/Input";
import LoadingUI from "../../Components/Loading";

const Register = ({ startLoading, stopLoading }) => {
  // All Variables declaration for this components
  const FormRef = useRef(null);
  const [showPassword, setShowPassword] = useState("password");
  const navigate = useNavigate();
  const Dispatch = useDispatch();

  // All function
  const handelSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(FormRef.current);

    const phone = formData.get("number");
    const Terms = formData.get("Terms&condition");

    if (phone.toString().length !== 10) {
      alert("Please enter valid phone number");
      return;
    }

    if (Terms !== "on") {
      alert("Please agree with the terms and conditions");
      return;
    }

    try {
      startLoading();
      const response = await FetchData("user/register", "post", formData);

      console.log(response);

      // Storing the tokens into browser's local storage
      localStorage.clear(); // will clear the all the data from localStorage
      localStorage.setItem(
        "AccessToken",
        response.data.data.tokens.AccessToken
      );
      localStorage.setItem(
        "RefreshToken",
        response.data.data.tokens.RefreshToken
      );
      localStorage.setItem("user", "personal");

      // Storing data inside redux store
      Dispatch(clearUser());
      Dispatch(addUser(response.data.data.user));
      Dispatch(
        addUser({
          driver: false,
          Personal: true,
        })
      );

      // Navigate to home page and show success message
      navigate("/");
      alertSuccess(response.data.message);
    } catch (error) {
      console.log(error);
      // alertError(parseErrorMessage(error.response.data));
    } finally {
      stopLoading();
    }
  };

  return (
    <div className=" flex  justify-center w-full h-fit ">
      <section className="Form_side border-1 rounded-lg m-5 shadow-lg p-2  laptop:h-[60vh] ">
        <h1 className="text-center m-10 text-4xl text-black">Register</h1>

        <form
          ref={FormRef}
          onSubmit={handelSubmit}
          className="Form flex flex-wrap justify-center"
        >
          <div className="Name w-72 m-5">
            <label className="block mb-1 ml-1 text-md font-semibold w-fit text-black  font-Philosopher">
              Full Name
            </label>
            <Input
              type="text"
              placeholder="Please enter your name"
              name="name"
              required
            />
          </div>

          <div className="email w-72 m-5">
            <label className="block mb-2 text-md font-semibold w-fit text-black font-Philosopher">
              Email
            </label>
            <Input
              type="email"
              placeholder="user@gmail.com"
              name="email"
              required
            />
          </div>

          <div className="Number w-72 m-5">
            <label className="block mb-2 text-md font-semibold w-fit text-black  font-Philosopher">
              Phone Number
            </label>
            <Input
              type="number"
              placeholder="9955*****"
              name="number"
              required
            />
          </div>

          <div className="password relative w-72 m-5">
            <label
              htmlFor="password"
              className="block mb-2 text-md font-semibold w-fit text-black font-Philosopher"
            >
              Password
            </label>
            <Input
              type={`${showPassword}`}
              placeholder="****"
              name="password"
              required
            />

            <div className="absolute right-0 top-14">
              {showPassword === "password" ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword("text");
                  }}
                  className="ml-2 text-sm text-red-600"
                >
                  <EyeOff color="red" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword("password");
                  }}
                  className="ml-2 text-sm text-red-600"
                >
                  <Eye color="red" />
                </button>
              )}
            </div>
          </div>

          <div className="Terms&Condition flex flex-col gap-4 justify-center items-center">
            <div>
              <input
                name="Terms&condition"
                type="checkbox"
                id="agree"
                className="m-2"
              />
              <label htmlFor="Terms&condition" className="text-center">
                I agreed to the terms & conditions
              </label>
            </div>
            <ButtonWrapper type="submit">Register</ButtonWrapper>
          </div>
        </form>
      </section>
    </div>
  );
};

export default LoadingUI(Register);
