import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-black text-white  select-none z-50">
      <section className="Upper-part pt-10 flex justify-around phone:gap-10 flex-wrap z-50">
        <div className="Logo-and-slogan ">
          <h1 className="text-[2rem] font-serif">Rider's Kart</h1>
          <h3 className="text-lg text-gray-300 font-Exo">Send anything,</h3>
          <h3 className="text-lg text-gray-300 font-Exo">Anywhere,</h3>
          <h3 className="text-lg text-gray-300 font-Exo">Anytime</h3>
        </div>
        <div className="Company">
          <h1 className="text-xl">Company</h1>
          <ul>
            <li className="small-footer-text">
              <Link>About Us</Link>
            </li>
            <li className="small-footer-text">
              <Link>Careers</Link>
            </li>
          </ul>
        </div>

        <div className="Quick link max-w-40">
          <h1 className="text-xl">Quick Links </h1>
          <ul>
            <li className="small-footer-text">
              <Link> Services</Link>
            </li>

            <li className="small-footer-text">
              <Link> API Integrations</Link>
            </li>
            <li className="small-footer-text">
              <Link> Courier</Link>
            </li>
            <li className="small-footer-text">
              <Link> Packers & Movers</Link>
            </li>
            <li className="small-footer-text">
              <Link> Two Wheelers</Link>
            </li>
            <li className="small-footer-text">
              <Link> Trucks </Link>
            </li>
          </ul>
        </div>
        <div className="Support max-w-40 ">
          <h1 className="text-xl">Support</h1>
          <ul>
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
      </section>
      <section className="Lower-part ">
        <h1 className="m-5 mb-0">We are here</h1>
        <ul className="grid laptop:grid-cols-5 phone:grid-cols-3 p-5">
          <li className="small-footer-text ">
            <Link>Delhi NCR</Link>
          </li>
          <li className="small-footer-text">
            <Link>Chandigarh</Link>
          </li>
          <li className="small-footer-text">
            <Link>Ahmedabad</Link>
          </li>
          <li className="small-footer-text">
            <Link>Coimbatore</Link>
          </li>
          <li className="small-footer-text">
            <Link>Hyderabad</Link>
          </li>
          <li className="small-footer-text">
            <Link>Jaipur</Link>
          </li>
          <li className="small-footer-text">
            <Link>Surat</Link>
          </li>
          <li className="small-footer-text">
            <Link>Ludhiana</Link>
          </li>
          <li className="small-footer-text">
            <Link>Bangalore</Link>
          </li>
          <li className="small-footer-text">
            <Link>Chennai</Link>
          </li>
          <li className="small-footer-text">
            <Link>Nagpur</Link>
          </li>
          <li className="small-footer-text">
            <Link>Kochi</Link>
          </li>
          <li className="small-footer-text">
            <Link>Mumbai</Link>
          </li>
          <li className="small-footer-text">
            <Link>Kolkata</Link>
          </li>
          <li className="small-footer-text">
            <Link>Lucknow</Link>
          </li>
          <li className="small-footer-text">
            <Link>Nashik</Link>
          </li>
          <li className="small-footer-text">
            <Link>Vadodara</Link>
          </li>
          <li className="small-footer-text">
            <Link>Indore</Link>
          </li>
          <li className="small-footer-text">
            <Link>Pune</Link>
          </li>
          <li className="small-footer-text">
            <Link>Kanpur</Link>
          </li>
        </ul>
      </section>

      <section className="Social flex gap-5 p-5">
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
