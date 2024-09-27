"use client";
import { RootState } from "@/global/store";
import type { HTMLAttributes } from "react";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import NewsBanner from "./MatchBanner";
import BannerCard from "../Banner/BannerCard";
import useEmblaCarousel from "embla-carousel-react";
import Loading from "@/app/loading";

interface TagMatchesProps extends HTMLAttributes<HTMLDivElement> {}

const TagMatches: React.FC<TagMatchesProps> = ({ ...props }) => {
  const [emblaRef] = useEmblaCarousel();
  const state = useSelector((state: RootState) => state.tagsReducer);

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col h-full">
        <div className="md:grid md:grid-cols-12 gap-2 flex-col hidden">
          {state.matches?.map((match: any) => {
            return <NewsBanner key={match.id} match={match} />;
          })}
        </div>
        <div className="overflow-hidden py-4 md:mx-2 md:hidden" ref={emblaRef}>
          <div className="flex place-items-center gap-2">
            {state.matches?.map((match: any) => {
              return <BannerCard key={match.matchId} banner={match} />;
            })}
          </div>
        </div>
      </div>
    </Suspense>
  );
};
export default TagMatches;
