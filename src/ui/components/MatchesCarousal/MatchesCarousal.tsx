"use client";
import type { HTMLAttributes } from "react";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import MatchCard from "./MatchCard";
import CarousalButton from "./CarousalButton";
import Heading from "@/ui/atoms/heading/Heading";

interface MatchesCarousalProps extends HTMLAttributes<HTMLDivElement> {
  matchesData: any;
}

const MatchesCarousal: React.FC<MatchesCarousalProps> = ({ matchesData, ...props }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  return (
    <div className="flex flex-col">
      <Heading title="matches" />
      <div className="flex place-items-center relative" {...props}>
        <CarousalButton emblaApi={emblaApi} type="prev" />
        <div className="overflow-hidden py-4 md:mx-2" ref={emblaRef}>
          <div className="flex place-items-center gap-2">
            {matchesData?.map((match: any) => {
              return <MatchCard key={match.matchId} match={match} />;
            })}
          </div>
        </div>
        <CarousalButton emblaApi={emblaApi} type="next" />
      </div>
    </div>
  );
};
export default MatchesCarousal;
