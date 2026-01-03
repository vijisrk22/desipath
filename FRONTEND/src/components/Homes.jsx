import HomeCard from "./HomeCard";
import SectionHeadings from "./SectionHeadings";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import api from "../utils/api";

function Homes() {
  const homes = [
    {
      imageSrc: "/homesSmpl.png",
      price: "12,000",
      location: "Grand Par, New York",
      type: "Single Family",
    },
    {
      imageSrc: "/homesSmpl.png",
      price: "15,000",
      location: "Lakeside, California",
      type: "Condo",
    },
    {
      imageSrc: "/homesSmpl.png",
      price: "15,000",
      location: "Lakeside, California",
      type: "Condo",
    },
    {
      imageSrc: "/homesSmpl.png",
      price: "15,000",
      location: "Lakeside, California",
      type: "Condo",
    },
  ];
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  // Uncomment this block of code to fetch homes from the
  // backend API endpoint /api/homes

  // // State for events
  // const [homes, setHomes] = useState([]);

  // // Set homes on mount
  // useEffect(() => {
  //   api
  //     .get("/api/homes")
  //     .then((res) => {
  //       setEvents(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div className="flex flex-col justify-start items-center gap-[24px]">
      <SectionHeadings heading="Homes for Sale" link="/services/houses" />
      <div className="w-full">
        <Slider {...settings}>
          {homes.map((home, index) => {
            return <HomeCard key={index} home={home} />;
          })}
        </Slider>
      </div>
    </div>
  );
}

export default Homes;
