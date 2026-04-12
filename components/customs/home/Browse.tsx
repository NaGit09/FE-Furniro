import Image from "next/image";
import React from "react";

const categories = [
  {
    id: 1,
    src: "/images/LivingRoom.png",
    title: "Living Room",
    description: "Explore our wide range of products",
  },
  {
    id: 2,
    src: "/images/BedRoom.png",
    title: "Bed Room",
    description: "Explore our wide range of products",
  },
  {
    id: 3,
    src: "/images/DinningRoom.png",
    title: "Dinner Room",
    description: "Explore our wide range of products",
  },
];

const Browse = () => {
  return (
    <div className="flex flex-col gap-10 items-center justify-center mt-2 w-full bg-white">
      <div className="flex flex-col gap-2 items-center justify-center p-4">
        <h2 className="text-4xl font-bold">Browse Categories</h2>
        <p className="text-gray-600">Explore our wide range of products</p>
      </div>
      <div className="flex items-center gap-2 w-[calc(100%-100px)] justify-center">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col gap-2 items-center justify-center w-[400px]"
          >
            <Image
              src={category.src}
              alt={category.title}
              width={380}
              height={480}
              className="w-[380px] h-[480px] object-cover"
            />
            <h3 className="text-2xl font-bold">{category.title}</h3>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Browse;
