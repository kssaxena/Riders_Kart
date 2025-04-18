import React, { useState } from "react";
import Card from "../../Components/Card";
import ButtonWrapper from "../../Components/Buttons";
import { FetchData } from "../../utility/fetchFromAPI";
import { alertError, alertSuccess } from "../../utility/Alert";

const Wallet = () => {
  const [wallet, setWallet] = useState({
    userName: "Kshitij Saxena",
    balance: 1000000,
    transactionHistory: [
      { id: 1, type: "credit", amount: 100, date: "2024-11-12" },
      { id: 2, type: "debit", amount: 50, date: "2024-11-13" },
    ],
  });

  const [addAmount, setAddAmount] = useState("");

  const handleAddFunds = async () => {
    const order = await FetchData("payment/create-new-paymentId", "post", {
      options: {
        amount: addAmount,
        currency: "INR",
        receipt: "qwerty1234",
      },
    });

    console.log(order);

    var options = {
      key: process.env.razorpay_key_id,
      subscription_id: order.id,
      name: "Acme Corp.",
      description: "Monthly Test Plan",
      image: "/Logo.png",
      handler: async function (response) {
        // alert(response.razorpay_payment_id),
        //   alert(response.razorpay_subscription_id),
        //   alert(response.razorpay_signature);

        console.log(response);
        const body = {
          ...response,
          amount: addAmount,
          paymentMethod: "UPI",
        };

        const isValidated = await FetchData(
          "payment/validate-payment",
          "post",
          body
        );

        if (isValidated.status === 450) {
          alertError("Payment Failed");
          alertError("False Payment");
        } else if (isValidated.status === 201) {
          alertSuccess("Payment Successful");
        }
      },
      prefill: {
        name: "Vivek",
        email: "Dev@gmail.com",
        contact: "6202089501",
      },
      notes: {
        note_key_1: "Tea. Earl Grey. Hot",
        note_key_2: "Make it so.",
      },
      theme: {
        color: "#F37254",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.open();
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary flex-col gap-10 py-10">
      <Card className="shadow-lg rounded-lg w-[75%] flex justify-start items-center">
        <div className="w-[75%]">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Wallet</h2>

          {/* User Info */}
          <div className="mb-6">
            <p className="text-3xl text-gray-600">
              User: <span className="font-bold">{wallet.userName}</span>
            </p>
            <p className="text-3xl text-gray-600">
              Available Balance:{" "}
              <span className="font-bold text-green-600">
                ₹ {wallet.balance}
              </span>
            </p>
          </div>
        </div>
        {/* Add Funds Section */}
        <div className="mb-6 w-fit">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Add Funds</h3>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md outline-none"
              placeholder="Enter amount"
            />
            <ButtonWrapper onClick={handleAddFunds}>Add</ButtonWrapper>
          </div>
        </div>
      </Card>
      <Card className="w-[75%] h-96 overflow-y-scroll">
        {/* Transaction History */}
        <div className="mb-6">
          <h3 className="text-3xl font-medium text-gray-700 mb-2">
            Transaction History
          </h3>
          <ul className="divide-y divide-gray-200">
            {wallet.transactionHistory.map((transaction) => (
              <li
                key={transaction.id}
                className="py-2 flex justify-between items-center"
              >
                <span
                  className={`text-xl font-medium ${
                    transaction.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "credit" ? "Credited" : "Debited"}
                </span>
                <span className="text-2xl text-gray-600">
                  ₹ {transaction.amount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400">
                  {transaction.date}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Wallet;
