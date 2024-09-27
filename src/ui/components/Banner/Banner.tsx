"use client";
import type { HTMLAttributes } from "react";
import React from "react";
import BannerCard from "./BannerCard";
import useEmblaCarousel from "embla-carousel-react";

interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  bannerData: any[];
}

const Banner: React.FC<BannerProps> = ({ bannerData, ...props }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  return (
    <div className="flex flex-col">
      <div className="flex place-items-center relative" {...props}>
        <div className="overflow-hidden py-4 md:mx-2" ref={emblaRef}>
          <div className="flex place-items-center gap-2">
            {bannerData?.map((banner: any) => {
              return <BannerCard key={banner.id} banner={banner} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Banner;
