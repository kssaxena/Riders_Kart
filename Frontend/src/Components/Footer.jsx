import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Footer = () => {
  const user = useSelector((store) => store.UserInfo.user);
  // const Dispatch = useDispatch();
  // console.log(user);

  // const { userId } = useParams();
  const cities = [
    "Delhi NCR",
    "Chandigarh",
    "Ahmedabad",
    "Coimbatore",
    "Hyderabad",
    "Jaipur",
    "Surat",
    "Ludhiana",
    "Bangalore",
    "Chennai",
    "Nagpur",
    "Kochi",
    "Mumbai",
    "Kolkata",
    "Lucknow",
    "Nashik",
    "Vadodara",
    "Indore",
    "Pune",
    "Kanpur",
  ];

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div className="bg-gray-900 text-white  select-none flex flex-col px-10 gap-5">
      <section className="Upper-part py-5 flex justify-around items-center phone:gap-10 flex-wrap">
        <div className="Logo-and-slogan ">
          <h1 className="text-[2rem] font-serif ">Rider's Kart</h1>
        </div>
        <section className="We_are_here">
          <h1
            className="m-5 mb-0 cursor-pointer text-xl font-semibold hover:text-blue-600"
            onClick={togglePopup}
          >
            We are here
          </h1>

          {/* Popup Modal */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
              onClick={togglePopup}
            >
              <div
                className="bg-white p-5 rounded-lg w-full max-w-lg overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-semibold mb-4">Our Locations</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {cities.map((city, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-700 hover:text-blue-600"
                    >
                      <Link>{city}</Link>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-5 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={togglePopup}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
      </section>
      <div className="company">
        <h1 className="text-xl">Company</h1>
        <ul className="flex gap-5 ">
          <li className="small-footer-text hover:underline">
            <Link to={"#FAQ"} onClick={handleNavigate}>
              About Us
            </Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Careers</Link>
          </li>
        </ul>
      </div>
      <div className="Quick link">
        <h1 className="text-xl">Quick Links </h1>
        <ul className="flex flex-wrap w-full gap-5 ">
          <li className="small-footer-text">
            <Link to={"#services"} onClick={handleNavigate}>
              {" "}
              Services
            </Link>
          </li>

          <li className="small-footer-text">
            <Link to={`/api-requests/${user?.[0]?._id}`}>
              {" "}
              API Integrations
            </Link>
          </li>
          <li className="small-footer-text">
            <Link> Courier</Link>
          </li>
          <li className="small-footer-text">
            <Link> Packers & Movers</Link>
          </li>
          <li className="small-footer-text">
            <Link to={"#Booking_Input"} onClick={handleNavigate}>
              {" "}
              Two Wheelers
            </Link>
          </li>
          <li className="small-footer-text">
            <Link to={"#Booking_Input"} onClick={handleNavigate}>
              {" "}
              Trucks{" "}
            </Link>
          </li>
        </ul>
      </div>
      <div className="Support ">
        <h1 className="text-xl">Support</h1>
        <ul className="flex gap-5 flex-wrap w-full">
          <li className="small-footer-text">
            <Link>Contact Us</Link>
          </li>
          <li className="small-footer-text">
            <Link>Privacy Policy</Link>
          </li>
          <li className="small-footer-text">
            <Link>Terms of Services</Link>
          </li>
          <li className="small-footer-text">
            <Link>Insurance FAQS</Link>
          </li>
          <li className="small-footer-text">
            <Link>Driver Partner Terms & Conditions</Link>
          </li>
          <li className="small-footer-text">
            <Link>Zero Tolerance Policy</Link>
          </li>
        </ul>
      </div>
      <section className="Social flex gap-5 p-5 w-full justify-center items-center">
        <Link
          className="Instagram hover:scale-110 transition "
          title="Instagram"
        >
          <Instagram />
        </Link>
        <Link className="Fb hover:scale-110 transition " title="Facebook">
          <Facebook />
        </Link>
        <Link className="linkedIn hover:scale-110 transition " title="Linkedin">
          <Linkedin />
        </Link>
        <Link className="Youtube hover:scale-110 transition " title="Youtube">
          <Youtube />
        </Link>
        <Link className="Twitter hover:scale-110 transition " title="Twitter">
          <Twitter />
        </Link>
      </section>
    </div>
  );
};

export default Footer;
