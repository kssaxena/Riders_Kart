import React, { useState } from "react";
import { FAQ_List } from "../../Constants/homeConstants";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

const FAQs = () => {
  // Constants
  const [isOpened, setIsOpened] = useState(null);
  // UI for questions
  const Question_Answer = ({ item, index }) => {
    return (
      <motion.div
        
        className="my-10 hover:border border-[#949597] laptop:px-10 laptop:py-5 phone:px-5 phone:py-2 rounded-xl bg-primary"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isOpened === index ? (
          <button
            className="laptop:mx-5 w-full flex justify-between items-center"
            onClick={() => setIsOpened(null)}
          >
            <h1 className="laptop:text-xl phone:text-sm font-Fredoka text-start heading-text-gray">
              {item?.question}
            </h1>
            <span>
              <ChevronUp />
            </span>
          </button>
        ) : (
          <button
            className="mx-5 w-full flex justify-between"
            onClick={() => setIsOpened(index)}
          >
            <h1 className="laptop:text-xl phone:text-sm font-Fredoka text-start heading-text-gray">
              {item?.question}
            </h1>
            <span>
              <ChevronDown />
            </span>
          </button>
        )}

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={
            isOpened === index
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {isOpened === index && (
            <h1 className="laptop:mx-7 phone:mx-2 phone:text-xs laptop:text-base font-Fredoka para-text-gray laptop:p-4 phone:p-2">
              {item?.answer}
            </h1>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div
      id="FAQ"
      className="flex flex-col justify-center items-center bg-[#D5D5D7]"
    >
      {/* Heading */}
      <div className="Heading flex flex-col justify-center items-center">
        <h1 className="text-[3rem] font-semibold phone:text-[1.5rem] heading-text-gray font-Fredoka ">
          Frequently Asked Questions
        </h1>
        <h3 className="text-lg phone:text-sm subtitle-text-gray">
          In case you have more Questions
        </h3>
      </div>

      {/* Questions */}
      <div className="All-Questions mt-20 phone:mt-2 w-3/5 phone:w-4/5">
        {FAQ_List.map((item, index) => {
          return <Question_Answer key={index} item={item} index={index} />;
        })}
      </div>
    </div>
  );
};

export default FAQs;
