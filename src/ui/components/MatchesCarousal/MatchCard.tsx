import type { HTMLAttributes } from "react";
import React from "react";
import TeamCard from "./TeamCard";
import Link from "next/link";

interface MatchCardProps extends HTMLAttributes<HTMLAnchorElement> {
  match: any;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, ...props }) => {
  return (
    <Link
      href={`/match/${match.matchId}?tab=info`}
      key={match.matchId}
      className="min-h-36 bg-white rounded-xl flex-grow-0 flex-shrink-0 flex basis-auto w-72 md:w-80 uu flex-col p-2 gap-2 select-none"
      {...props}
    >
      <div className="flex flex-col h-fit w-full p-1 border-b-[1px] border-gray-600">
        <div className="flex place-items-center justify-between">
          <p className="font-bold line-clamp-1">{match.matchDesc}</p>
          <span className="text-xs bg-stateCompleted px-1 py-[2px] text-white rounded-xl line-clamp-1">
            {match.state}
          </span>
        </div>
        <p className="text-xs line-clamp-1">{match.seriesName}</p>
      </div>
      <TeamCard team={match.team1} />
      <TeamCard team={match.team2} />
      <div className="flex flex-col justify-center">
        <span className="text-xs">Location: {match.city}</span>
        <span className="text-green-600 text-xs">{match.status}</span>{" "}
      </div>
    </Link>
  );
};
export default MatchCard;
