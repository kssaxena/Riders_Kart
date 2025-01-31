import { AlignLeft, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonWrapper from "./Buttons";
import { Logo } from "../Constants/homeConstants";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../utility/Slice/UserInfoSlice";
import { alertInfo } from "../utility/Alert";

const Header = () => {
  // constants
  const [showHamburger, setShowHamburger] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((store) => store.UserInfo.user);
  //console.log(user);
  const Dispatch = useDispatch();

  // //console.log(user);
  const location = useLocation();

  //  UI for Hamburger
  const Hamburger = ({ onClose }) => {
    const modelRef = useRef();

    const closeModel = (e) => {
      if (modelRef.current === e.target) {
        onClose();
      }
    };

    return (
      <div
        ref={modelRef}
        onClick={closeModel}
        className="fixed inset-0 flex  w-[50vw] h-60 z-50  bg-white backdrop-blur-3xl rounded-r-xl overflow-hidden font-Fredoka  "
      >
        <div className="flex flex-col  w-full  ">
          <div className="h-248 flex justify-between p-6 gap-2">
            <div className="">
              <h1 className="text-xl font-serif font-semibold">Menu</h1>
            </div>
            <div>
              <button className="" onClick={onClose}>
                <X size={30} />
              </button>
            </div>
          </div>

          <section className="menu-section flex flex-col font-Fredoka">
            <Link to={"/"} onClick={onClose} className=" font-Exo my-1 mx-2  ">
              For Enterprise/ Personal
            </Link>
            <Link
              to="/delivery-partners"
              onClick={onClose}
              className=" font-Exo my-1 mx-2  "
            >
              For Delivery Partner
            </Link>
            {user ? (
              <Link
                to={"/login"}
                onClick={() => {
                  Dispatch(clearUser());
                  alertInfo("you are logged Out! Please log in");
                  onClose();
                  navigate("/login");
                  localStorage.clear();
                }}
                className=" font-Exo my-1 mx-2  "
              >
                Log out
              </Link>
            ) : (
              <Link
                to={"/login"}
                onClick={onClose}
                className=" font-Exo my-1 mx-2  "
              >
                Login
              </Link>
            )}
            {user ? (
              <Link to={"/all-orders"} className=" font-Exo my-1 mx-2  ">
                all Orders
              </Link>
            ) : null}
            <Link to={"#"} onClick={onClose} className=" font-Exo my-1 mx-2  ">
              Support
            </Link>
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-color-standard Header flex laptop:justify-around items-center sticky top-0 bg-primary z-50 drop-shadow-xl h-20 font-Fredoka ">
      {/* Hamburger for phone and tab view */}
      <div className="Hamburger ml-2 laptop:hidden">
        <button
          className="laptop:hidden mobile:block"
          onClick={() => setShowHamburger(true)}
        >
          <AlignLeft
            size={25}
            className="m-1 group-hover:text-black text-black lg:hidden font-light"
          />
        </button>

        {showHamburger && (
          <Hamburger
            onClose={() => {
              setShowHamburger(false);
            }}
          />
        )}
      </div>

      <div
        onClick={() => navigate("/")}
        className="logo phone:mx-5  laptop:m-0 phone:flex justify-center items-center cursor-pointer"
      >
        <img
          src={Logo}
          alt="Logo"
          title={`Rider's Kart`}
          className="w-16 phone:hidden tablet:block"
        />
        <h1 className="phone:text-lg tablet:text-2xl font-Exo heading-text-gray">
          Rider's Kart
        </h1>
      </div>

      {user && user[1]?.driver === false && user[1]?.personal === true && (
        <div className="navigation hidden laptop:flex gap-12">
          <Link
            className={`font-serif ${
              location.pathname === "/" &&
              "px-4 py-2 rounded-2xl bg-button drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out text-xl"
              // "bg-button underline text-xl heading-text-gray px-5 py-2 rounded-xl"
            }`}
            to={`/`}
          >
            For Enterprise/ Personal
          </Link>
          <Link
            className={`font-serif ${
              location.pathname === "/delivery-partners" &&
              "px-4 py-2 rounded-2xl bg-button drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out text-xl"
              // "bg-button underline text-xl heading-text-gray"
            }`}
            to={"/delivery-partners"}
          >
            For Delivery Partner
          </Link>
        </div>
      )}

      <div className="support hidden laptop:flex laptop:justify-center items-center gap-5">
        <Link className="font-sans" to={`#`}>
          Support
        </Link>

        {user && user.length > 0 ? (
          <div>
            <ButtonWrapper
              onClick={() => {
                Dispatch(clearUser());
                navigate("/login");
                alertInfo("you are logged Out! Please log in");
                localStorage.clear();
              }}
            >
              Log out
            </ButtonWrapper>
          </div>
        ) : (
          <ButtonWrapper
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </ButtonWrapper>
        )}
        {user && user.length > 0 ? (
          user[1].driver === true ? (
            <ButtonWrapper
              onClick={() => {
                navigate("/all-appointments");
              }}
            >
              all appointments
            </ButtonWrapper>
          ) : (
            <div className="flex gap-4">
              <ButtonWrapper
                onClick={() => {
                  navigate("/all-orders");
                }}
              >
                all Orders
              </ButtonWrapper>
              {/* <Link to={`/user-profile/(user?.[0]?._id)`}>Profile</Link>; */}
              <ButtonWrapper
                onClick={() => {
                  navigate(`/user-profile/${user?.[0]?._id}`);
                  // <Link to={`/user-profile/$(user?.[0]?._id)`}></Link>;
                }}
              >
                Profile
              </ButtonWrapper>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Header;
