import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation, Autoplay } from "swiper/modules";
import { useRef } from "react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const destinations = [
  {
    country: "JAPAN",
    properties:
      "YAZAKI, is a global automotive parts supplier with a focus on wire harnesses, instruments and components such as connectors and terminals.",
    image: "./yazaki.png",
  },
  {
    country: "JAPAN",
    properties:
      "AISIN, Corporation (株式会社アイシン, Kabushiki gaisha Aishin) is a Japanese corporation that develops and produces components and systems for the automotive industry.",
    image: "./AISIN.jpg",
  },
  {
    country: "INDIA",
    properties:
      "SUBROS, Limited is an Indian leader in automotive thermal solutions, specializing in air conditioning and engine cooling systems",
    image: "./Subros.avif",
  },
  {
    country: "JAPAN",
    properties:
      "FUTABA,Corporation is a Japanese company founded in 1948, originally producing vacuum tubes.",
    image: "./FUTABA.jpg",
  },
  {
    country: "USA",
    properties:
      "TENNECO, Inc. (formerly Tenneco Automotive and originally Tennessee Gas Transmission Company) is an American automotive components original equipment manufacturer. ",
    image: "./TENECO.jpg",
  },
  {
    country: "JAPAN",
    properties:
      "TOPRE,Corporation is a Japanese engineering company founded in 1935, known for manufacturing automobile components, refrigeration units",
    image: "./topre.png",
  },
  {
    country: "SPAIN",
    properties:
      "GESTAMP,Gestamp is a Spanish multinational company specializing in the design, development, and manufacture of metal automotive components.",
    image: "./gestamp.jpg",
  },
];

export default function TravelCarousel() {
  const [activeIndex, setActiveIndex] = useState(1);

  const swiperRef = useRef(null);
  const activeCountry = destinations[activeIndex]?.country || "Japan";

  const countryImages = {
    JAPAN: "./japan.jpg",
    INDIA: "./india.jpg",
    USA: "./usa.avif",
    SPAIN: "./spain.jpg",
  };
  // const countryRotation = {
  //   Japan: 0,
  //   India: -120,
  //   USA: -240,
  //   Spain: -360,
  // };
  const globeAnimationStyle = {
    animation: "globeZoom 0.8s ease",
    bgColor: "#1e293b",
  };

  return (
    <div className="relative h-auto overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      <h1 className="text-[#E5E7EB] text-3xl font-bold text-center mb-4 tracking-wide">
        OUR WORLD WIDE COSTUMERS
      </h1>
      {/* Globe Section */}
      {/* Globe Section */}
      <div className="pt-8 pb-8 flex justify-center">
        <h1 className="text-[#fbbf24] text-3xl font-bold mb-4 tracking-wide">
          {activeCountry}
        </h1>
        {/* <div className="relative flex flex-col items-center">

  

    <img
      key={activeCountry}
      src={countryImages[activeCountry]}
      alt={activeCountry}
      className="w-[50px] md:w-[60px]"
      style={globeAnimationStyle}
    />
  </div> */}
      </div>
      {/* Carousel */}
      <div className="-mt-8 px-4 pb-20">
        {/* <Swiper
          modules={[EffectCoverflow, Navigation]}
          effect="coverflow"
          centeredSlides
          loop
          navigation
          slidesPerView={3}
          spaceBetween={30}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 150,
            modifier: 2,
            scale: 1,
          }}
          onSlideChange={(swiper) =>
            setActiveIndex(swiper.realIndex)
          }
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {destinations.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="overflow-hidden rounded-3xl shadow-2xl bg-white">

                <div className="relative h-[380px]">
                  <img
                    src={item.image}
                    alt={item.country}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/30" />

                  <div className="absolute bottom-6 left-6 text-white">
                    <h2 className="text-4xl font-bold">
                      {item.country}
                    </h2>

                    <p className="text-lg">
                      {item.properties}
                    </p>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper> */}
        <Swiper
          modules={[EffectCoverflow, Navigation, Autoplay]}
          effect="coverflow"
          centeredSlides
          loop={true}
          navigation
          grabCursor={true}
          autoplay={{
            delay: 800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          initialSlide={0}
          slidesPerView={3}
          spaceBetween={30}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 250,
            modifier: 1.5,
            scale: 0.9,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {destinations.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() => {
                  swiperRef.current?.slideToLoop(index);
                }}
                className="overflow-hidden rounded-3xl shadow-2xl bg-white cursor-pointer transition-all duration-500 hover:scale-105"
              >
                <div className="relative h-[380px]">
                  <img
                    src={item.image}
                    alt={item.country}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/30" />

                  <div className="absolute bottom-6 left-6 text-white">
                    <h2 className="text-4xl font-bold">{item.country}</h2>

                    <p className="text-lg">{item.properties}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <style>
          {`
    @keyframes globeZoom {
      0% {
        opacity: 0;
        transform: scale(0.85);
      }

      50% {
        opacity: 0.7;
        transform: scale(0.93);
      }

      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
  `}
        </style>
      </div>
    </div>
  );
}
