import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const user = useSelector((store) => store.UserInfo.user);

  const handleNavigate = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div className="bg-black text-white  select-none z-50">
      <section className="Upper-part pt-10 flex justify-around phone:gap-5 flex-col laptop:flex-row px-5 z-50">
        <div className="Logo-and-slogan border-b laptop:mb-5">
          <h1 className="text-[2rem] font-serif underline-offset-4 underline">
            Rider's Kart
          </h1>
          <h3 className="lg:text-lg text-gray-300">Purchase anything,</h3>
          <h3 className="lg:text-lg text-gray-300">Anywhere,</h3>
          <h3 className="lg:text-lg text-gray-300">Anytime</h3>
        </div>
        <div className="Quick link   border-b mb-5">
          <h1 className="text-xl underline-offset-4 underline">Quick Links </h1>
          <ul>
            <li className="small-footer-text">
              <Link to={"#services"} onClick={handleNavigate}>
                {" "}
                Services
              </Link>
            </li>

            <li className="small-footer-text">
              <h1> API Integrations</h1>
              {/* <Link to={`/api-requests/${user?.[0]?._id}`}>
                {" "}
                API Integrations
              </Link> */}
            </li>
            <li className="small-footer-text">
              <Link to={`https://riderskart.in/`} target="_blank">
                {" "}
                Rider's Kart
              </Link>
            </li>
          </ul>
        </div>
        <div className="Support  border-b laptop:mb-5 ">
          <h1 className="text-xl underline-offset-4 underline">Support</h1>
          <ul>
            <li className="small-footer-text">
              <Link>Privacy Policy</Link>
            </li>
            <li className="small-footer-text">
              <Link>Terms of Services</Link>
            </li>

            <li className="small-footer-text">
              <Link>Driver Partner Terms & Conditions</Link>
            </li>
          </ul>
        </div>
        {/* <div className="Company">
          <h1 className="text-xl">Company</h1>
          <ul>
            <li className="small-footer-text">
              <Link>About Us</Link>
            </li>
            <li className="small-footer-text">
              <Link>Careers</Link>
            </li>
          </ul>
        </div> */}
      </section>
      {/* <section className="Lower-part p-5 ">
        <h1 className="mb-0">We are here</h1>
        <ul className="flex flex-wrap justify-start items-center  lg:gap-2 gap-1">
          <li className="small-footer-text hover:underline ">
            <Link>Delhi NCR</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Chandigarh</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Ahmedabad</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Coimbatore</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Hyderabad</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Jaipur</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Surat</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Ludhiana</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Bangalore</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Chennai</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Nagpur</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Kochi</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Mumbai</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Kolkata</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Lucknow</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Nashik</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Vadodara</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Indore</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Pune</Link>
          </li>
          <li className="small-footer-text hover:underline">
            <Link>Kanpur</Link>
          </li>
        </ul>
      </section> */}

      <section className="Social flex gap-5 p-5 justify-center items-center">
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
