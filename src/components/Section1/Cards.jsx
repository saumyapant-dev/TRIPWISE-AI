import React from "react";

const Cards = ({ title, description, imgSrc }) => {
    const Icon = imgSrc;

    return (
        <div className="bg-white p-8 rounded-3xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-105 cursor-pointer">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl w-fit ">
                <Icon size={22} color="white" />
            </div>

            <h3 className="text-2xl font-semibold mt-6">
                {title}
            </h3>

            <p className="text-gray-500 mt-4">
                {description}
            </p>
        </div>
    );
};

export default Cards;