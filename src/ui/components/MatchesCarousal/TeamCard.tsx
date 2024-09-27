import type { HTMLAttributes } from "react";
import React from "react";
import Img from "../Img/Img";

interface TeamCardProps extends HTMLAttributes<HTMLDivElement> {
  team: any;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, ...props }) => {
  return (
    <div className="flex flex-col justify-center p-1">
      <div className="flex justify-between place-items-center">
        <div className="w-fit flex  gap-1">
          <div className="flex  gap-1 relative max-w-8 min-w-8">
            <Img
              src={`https://ws.stage.cricap.com${team?.image}?p=det&d=high`}
              alt={team?.teamName}
              fill
              className="rounded-md border-[1px] object-cover"
            />
          </div>

          <div>{team?.teamSName}</div>
        </div>
        <span>{team?.score.score}</span>
      </div>
    </div>
  );
};
export default TeamCard;
