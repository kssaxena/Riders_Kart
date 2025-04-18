import { AlignLeft, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonWrapper from "./Buttons";
import { Logo } from "../Constants/homeConstants";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../utility/Slice/UserInfoSlice";
import { alertInfo } from "../utility/Alert";
import { motion } from "framer-motion";
import socket from "../socket";

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
  const menuVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: "0%",
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const Hamburger = ({ onClose, user }) => {
    const modelRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const closeModel = (e) => {
      if (modelRef.current === e.target) {
        onClose();
      }
    };

    return (
      <div
        ref={modelRef}
        onClick={closeModel}
        className="fixed inset-0 flex w-full h-screen z-50 backdrop-blur-3xl"
      >
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col w-3/4 bg-[#D5D5D7] rounded-r-xl shadow-lg"
        >
          <div className="h-16 flex justify-between items-center p-6">
            <h1 className="text-xl font-serif font-semibold">Menu</h1>
            <button onClick={onClose}>
              <X size={30} />
            </button>
          </div>

          <section className="menu-section flex flex-col font-Fredoka">
            <Link className="ml-2" to="/" onClick={onClose}>
              Home
            </Link>
            <hr className="border-gray-600 mr-10 my-2" />

            <Link
              to="/booking"
              onClick={onClose}
              className="font-Exo my-1 mx-2"
            >
              Book your Parcel
            </Link>
            <hr className="border-gray-600 mr-10 my-2" />

            <Link
              to="/register-driver"
              onClick={onClose}
              className="font-Exo my-1 mx-2"
            >
              Register as Driver
            </Link>
            <hr className="border-gray-600 mr-10 my-2" />

            {user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => {
                    dispatch(clearUser());
                    alert("You are logged out! Please log in");
                    socket.disconnect();
                    onClose();
                    navigate("/login");
                    localStorage.clear();
                  }}
                  className="font-Exo my-1 mx-2"
                >
                  Log out
                </Link>
                <hr className="border-gray-600 mr-10 my-2" />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="font-Exo my-1 mx-2"
                >
                  Login
                </Link>
                <hr className="border-gray-600 mr-10 my-2" />
              </>
            )}

            {user && (
              <>
                <Link to="/all-orders" className="font-Exo my-1 mx-2">
                  All Orders
                </Link>
                <hr className="border-gray-600 mr-10 my-2" />
              </>
            )}

            <Link to="#" onClick={onClose} className="font-Exo my-1 mx-2">
              Support
            </Link>
          </section>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="bg-[#D5D5D7] Header flex laptop:justify-around items-center sticky top-0 bg-primary z-50 drop-shadow-xl h-20 font-Fredoka ">
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
          className="w-16 tablet:block"
        />
        <h1 className="phone:text-lg tablet:text-2xl laptop:block font-Exo heading-text-gray phone:hidden">
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
        <ButtonWrapper
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </ButtonWrapper>

        {user && user.length > 0 ? (
          <div>
            <ButtonWrapper
              onClick={() => {
                Dispatch(clearUser());
                socket.disconnect();
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
            <div>
              <ButtonWrapper
                onClick={() => {
                  navigate("/all-appointments");
                }}
              >
                all appointments
              </ButtonWrapper>
              <ButtonWrapper
                onClick={() => {
                  navigate(`/delivery-partner-profile/${user?.[0]?._id}`);
                }}
              >
                Profile
              </ButtonWrapper>
            </div>
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
        <Link className="font-sans" to={`#`}>
          Support
        </Link>
      </div>
    </div>
  );
};

export default Header;
