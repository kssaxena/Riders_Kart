import React, { useEffect, useRef } from "react";
import ButtonWrapper from "../../../Components/Buttons";
import {
  AdditionalBenefits1,
  AdditionalBenefits2,
  AdditionalBenefits3,
  AdditionalBenefits4,
  Advantage1,
  Advantage2,
  Advantage3,
  Animation,
  Banner,
  MultipleVehicleImg,
} from "../../../Constants/Driver'sConstant";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

function DeliveryPartners() {
  // Variables
  const navigate = useNavigate();

  // UI Components
  const AdvantageCard = ({ img, Title, Description }) => {
    return (
      <div className="flex flex-col items-center justify-center  m-6 w-72  h-80 p-4 rounded-lg shadow-sm  ">
        <section>
          <img
            src={img}
            alt=""
            className="h-40 w-40 rounded-full mb-5 drop-shadow-2xl"
          />
        </section>
        <h1 className="text-md tracking-tighter font-bold subtitle-text-gray">
          {Title}
        </h1>
        <p className="text-center text-sm  para-text-gray">{Description}</p>
      </div>
    );
  };

  const AdvantageConstants = () => {
    return (
      <div>
        <div className="flex phone:flex phone:flex-wrap items-center justify-center ">
          <AdvantageCard
            img={Advantage1}
            Title={"Better Earning"}
            Description={
              "Earn more by partnering with the best! Regular trips and efficient service can grow your earnings!"
            }
          />

          <AdvantageCard
            img={Advantage2}
            Title={"Regular Trips"}
            Description={
              "With our growing presence across multiple cities, we always have our hands full! This means you will never run out of trips."
            }
          />

          <AdvantageCard
            img={Advantage3}
            Title={"On-Time Payment"}
            Description={
              "Be assured to receive all payments on time & get the best in class support, when you attach mini truck with Rider's Kart."
            }
          />
        </div>
      </div>
    );
  };

  const AdditionalBenefitsCard = ({ img, Title, Description }) => {
    return (
      <div className="flex flex-col items-center justify-center  m-6 w-60  h-80 p-4 rounded-lg shadow-sm  ">
        <section>
          <img
            src={img}
            alt=""
            className="h-40 w-40 rounded-full mb-5 drop-shadow-2xl"
          />
        </section>
        <h1 className="text-md tracking-tighter font-bold subtitle-text-gray">
          {Title}
        </h1>
        <p className="text-center text-sm  para-text-gray">{Description}</p>
      </div>
    );
  };
  const AdditionalBenefitsConstants = () => {
    return (
      <div>
        <div className="flex  phone:flex phone:flex-wrap items-center justify-center  gap-4">
          <AdditionalBenefitsCard
            img={AdditionalBenefits1}
            Title={"Discount on Vehicle Purchase"}
            Description={
              "Get major discounts on purchase of new vehicles. Add to your fleet and grow your business!"
            }
          />

          <AdditionalBenefitsCard
            img={AdditionalBenefits2}
            Title={"Health Card Assistance"}
            Description={
              "Get healthcare benefits for you and your family with mini truck attachment."
            }
          />

          <AdditionalBenefitsCard
            img={AdditionalBenefits3}
            Title={"Fuel Card For Savings"}
            Description={
              "Save big on fuel costs with our smart fuel card and increase your profit margins!"
            }
          />
          <AdditionalBenefitsCard
            img={AdditionalBenefits4}
            Title={"Insurance"}
            Description={
              "Save money with reduced annual maintenance and insurance costs on your vehicle."
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className="Delivery-Partners pl-4 pr-4 bg-color-standard">
      <div>
        <section className="Rider's Kart-Life-Easy bg-white border-b-8 text-justify text-opacity-75">
          <div className="Title">
            <h2 className="text-center font-medium tracking-wider uppercase pt-7 text-3xl heading-text-gray">
              Rider's Kart Delivery Partner
            </h2>
          </div>

          <div className="laptop:flex items-center justify-center gap-10">
            <img src={Banner} alt="" className=" laptop:h-[60vh]" />
            <div className="description-button laptop:w-[40vw] flex flex-col gap-5 phone:mx-4 ">
              <h2 className="font-semibold text-lg subtitle-text-gray">
                Join Rider's Kart as a Delivery Partner – Drive Your Future
                Forward!
              </h2>
              <p className="text-sm font-light para-text-gray">
                Become a part of Rider's Kart, a fast-growing logistics and
                delivery platform that connects individuals and businesses with
                reliable delivery partners. As a delivery partner, you get the
                flexibility to choose your working hours, earn competitive
                payouts, and be your own boss. Whether you own a bike,
                mini-truck, or van, there's a place for you in our network. Join
                us today and start earning on your terms!
              </p>
              <div className="mb-4">
                <ButtonWrapper onClick={() => navigate("/register-driver")}>
                  Register With us
                </ButtonWrapper>
              </div>
            </div>
          </div>
        </section>
        {/* <div className=" w-full">
          <img
            src={Banner}
            alt=""
            className="laptop:h-[100vh] h-[40vh] w-full "
            las
          />
        </div> */}
        {/* <div>
          <nav className="py-10 w-full items-center justify-center flex flex-col gap-5">
            <h1 className="font-Fredoka flex flex-col justify-center items-center">
              Visit Your Order Details here{" "}
              <span>
                <ChevronDown />
              </span>{" "}
            </h1>
            <Link
              to={"/drivers-home"}
              className="px-4 py-2 rounded-2xl bg-button drop-shadow-xl hover:scale-105 hover:drop-shadow-2xl transition duration-150 ease-in-out"
            >
              Home
            </Link>
          </nav>
        </div> */}
        {/* Rider's Kart Advantage */}
        <section className="Rider's Kart-Advantage bg-white ">
          {/* Title */}
          <div className="Title">
            <h2 className="text-center font-bold pt-8 text-3xl heading-text-gray">
              Rider's Kart Advantage
            </h2>
          </div>
          {/* Rider's Kart Advantage card */}
          <AdvantageConstants />
        </section>

        {/* Rider's Kart-life-easy */}

        <section className="Rider's Kart-Life-Easy bg-secondary-color text-white text-justify text-opacity-75">
          <div className="Title">
            <h2 className="text-center font-bold py-8 text-3xl">
              making your Life easy
            </h2>
          </div>

          <div className="laptop:flex items-center justify-center gap-10   laptop:p-14 p-4 ">
            <img src={Animation} alt="" className=" laptop:h-72" />
            <div className="laptop:w-[30vw] phone:mt-4">
              <p>
                Attach your two wheeler or commercial vehicle. If you got a 2
                wheeler, or a tata ace commercial vehicle, you are good to go!
                With Rider's Kart, get a delivery job and deliver goods,
                packages, and courier. No more waiting on the stand - Attach
                tata ace with Rider's Kart to have a steady stream of trips with
                minimum assured income and added incentives, so that there is no
                waiting and idle time at the stand! No more bargaining. Standard
                Rates - The rates and calculation methods are standardized and
                completely transparent. No more wasting time in fixing the rates
                for every trip. Hassle Free Navigation with our GPS-based
                navigation you can drive anywhere across your city without
                worrying about the directions. Get real-time navigation
                assistance on the go!
              </p>
            </div>
          </div>
        </section>

        {/* Additional Benefits */}
        <section className="Additional-Benefits bg-white text-justify text-opacity-75">
          +
          <div className="Title">
            <h2 className="text-center font-bold pt-8 text-3xl heading-text-gray">
              Additional Benefits
            </h2>
          </div>
          <AdditionalBenefitsConstants />
        </section>

        {/* Multiple Vehicle */}
        <section className="Rider's Kart-Life-Easy bg-white  text-justify text-opacity-75">
          <div className="Title">
            <h2 className="text-center font-bold pt-7 text-3xl heading-text-gray">
              Multiple Vehicle
            </h2>
          </div>

          <div className="laptop:flex items-center justify-center gap-10">
            <img src={MultipleVehicleImg} alt="" className=" laptop:h-[60vh]" />
            <div className="description-button laptop:w-[40vw] flex flex-col gap-5 phone:mx-4 ">
              <h2 className="font-semibold text-lg subtitle-text-gray">
                If you are a fleet owner and own multiple vehicles.
              </h2>
              <p className="text-sm font-light para-text-gray">
                Keeping track of your vehicle fleet and optimising their
                efficiency can be a huge challenge. Partner with Rider's Kart to
                boost your earnings and manage your vehicles easily.
              </p>
              <div className="mb-4">
                <ButtonWrapper onClick={() => navigate("/register-driver")}>
                  Register With us
                </ButtonWrapper>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DeliveryPartners;
