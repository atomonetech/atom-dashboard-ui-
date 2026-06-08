import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { useRef } from "react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const destinations = [
  {
    country: "Japan",
    properties: "YAZAKI",
    image: "https://images.unsplash.com/photo-1513326738677-b964603b136d",
  },
  {
    country: "Japan",
    properties: "AISIN",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a",
  },
  {
    country: "India",
    properties: "SUBROS",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da",
  },
  {
    country: "Japan",
    properties: "FUTABA",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
  {
    country: "USA",
    properties: "TENNECO",
    image: "https://images.unsplash.com/photo-1513326738677-b964603b136d",
  },
  {
    country: "Japan",
    properties: "TOPRE",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },
];

export default function TravelCarousel() {
  const [activeIndex, setActiveIndex] = useState(1);
  
  const swiperRef = useRef(null);
  const activeCountry =
  destinations[activeIndex]?.country || "Japan";

const countryImages = {
  Japan: "/globes/globe-japan.png",
  India: "/globes/globe-india.png",
  USA: "/globes/globe-usa.png",
};
  const countryRotation = {
    Japan: 0,
    India: -120,
    USA: -240,
  };
  const globeAnimationStyle = {
  animation: "globeZoom 0.8s ease",
};

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a]">
      {/* Globe Section */}
    {/* Globe Section */}
<div className="pt-8 pb-8 flex justify-center">
  <div className="relative flex flex-col items-center">

    <h1 className="text-white text-5xl font-bold mb-4 tracking-wide">
      {activeCountry}
    </h1>

    <img
      key={activeCountry}
      src={countryImages[activeCountry]}
      alt={activeCountry}
      className="w-[500px] md:w-[650px]"
      style={globeAnimationStyle}
    />
  </div>
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
          modules={[EffectCoverflow, Navigation]}
          effect="coverflow"
          centeredSlides
          loop={true}
          navigation
          grabCursor={true}
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
