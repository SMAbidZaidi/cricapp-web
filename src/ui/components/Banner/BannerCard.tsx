import type { HTMLAttributes } from "react";
import React from "react";
import Img from "../Img/Img";
import Link from "next/link";

interface BannerCardProps extends HTMLAttributes<HTMLAnchorElement> {
  banner: any;
}

const BannerCard: React.FC<BannerCardProps> = ({ banner, ...props }) => {
  return (
    <Link
      className="relative min-w-72 w-72 rounded-xl border-2 min-h-40 flex justify-center px-2 select-none"
      href={`post/${banner?.id}`}
      {...props}
    >
      <span className="bg-gradient-to-b from-[#2121218c] via-transparent to-[#1a661b] h-full w-full absolute z-10 rounded-xl"></span>
      <Img src={banner.media[0].url} fill className="w-full h-full object-cover rounded-xl" alt="banner" />
      <div className="flex justify-center place-items-center w-full">
        <p className="text-white z-20 bottom-2 font-bold text-sm mx-auto self-end mb-2">{banner.message}</p>
      </div>
    </Link>
  );
};
export default BannerCard;
