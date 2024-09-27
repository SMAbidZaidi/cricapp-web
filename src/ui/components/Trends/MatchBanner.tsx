import type { HTMLAttributes } from "react";
import React from "react";
import Img from "../Img/Img";
import Link from "next/link";

interface NewsBanner extends HTMLAttributes<HTMLAnchorElement> {
  match: any;
}

const NewsBanner: React.FC<NewsBanner> = ({ match, ...props }) => {
  return (
    <Link
      href={`/post/${match?.id}`}
      className="w-full min-h-36 flex gap-2 px-2 pb-2 col-span-12 lg:col-span-6 2xl:col-span-6"
      {...props}
    >
      <div className="flex-1 aspect-video relative">
        <Img src={match.media[0].url} fill alt="" className="rounded-xl object-cover" />
      </div>
      <div className="flex-1 md:flex md:flex-col md:justify-between">
        <p className="font-bold lg:text-base md:text-xl line-clamp-4">{match.message}</p>
        <span className="text-gray-600">{new Date(match.date).toDateString() || "no date"}</span>
      </div>
    </Link>
  );
};
export default NewsBanner;
