import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import { motion } from "framer-motion";
import { Code, Database, Palette, Smartphone, Globe, BarChart } from "lucide-react";

const category = [
  { name: "Frontend Developer", icon: Code },
  { name: "Backend Developer", icon: Database },
  { name: "Data Scientist", icon: BarChart },
  { name: "Graphic Designer", icon: Palette },
  { name: "Full Stack Developer", icon: Code },
  { name: "UI/UX Designer", icon: Palette },
  { name: "App Developer", icon: Smartphone },
  { name: "Product Designer", icon: Globe },
  { name: "Digital Marketing", icon: BarChart },
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery({ keyword: query }));
    navigate("/jobs");
  };

  return (
    <div className="py-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Browse by <span className="text-purple-600">Category</span>
      </h2>
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent className="-ml-4">
          {category.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 pl-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => searchJobHandler(cat.name)}
                    variant="outline"
                    className="w-full h-24 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gradient-to-br hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 transition-all duration-300"
                  >
                    <Icon className="w-6 h-6 text-purple-600" />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </Button>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselNext className="hidden md:flex" />
        <CarouselPrevious className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
