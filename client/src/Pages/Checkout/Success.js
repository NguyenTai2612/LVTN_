import React from "react";
import SUCCESSIMAGE from "../../assets/success.gif";
import { Link } from "react-router-dom";

const Success = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
                <img src={SUCCESSIMAGE} alt="Success" className="mx-auto mb-4" width={150} height={150} />
                <p className="text-green-500 text-2xl font-semibold mb-4">Payment Successful!</p>
                <Link
                  to="/orders"
                  className="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
                >
                  View Order
                </Link>
                <p className="text-gray-600 mt-5">Thank you for your purchase. Your payment was processed successfully.</p>

            </div>
        </div>
    );
};

export default Success;
