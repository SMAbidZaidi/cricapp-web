import { MatchData } from "@/@types";
import { match } from "assert";
import Image from "next/image";
import Img from "../Img/Img";

interface MatchDetailsInfoTabProps {
  matchInfo: MatchData["matchInfo"];
}

export const MatchDetailsInfoTab: React.FC<MatchDetailsInfoTabProps> = ({ matchInfo }) => {
  return (
    <div className="my-2 flex flex-col gap-3">
      <div className="bg-white w-full flex place-items-center justify-center p-4 rounded-xl">
        <div className="flex place-items-center justify-between gap-2">
          <Img src={"/assets/imgs/icons/calendar.svg"} width={30} height={30} alt="match" />
          <p className="line-clamp-1">{matchInfo?.series.name || "N/A"}</p>
        </div>
      </div>
      <div className="bg-white flex-col md:flex-row w-full flex place-items-center justify-between md:justify-between p-4 rounded-xl">
        <div className="flex place-items-center justify-between gap-2">
          <Img src={"/assets/imgs/icons/trohpy.svg"} width={30} height={30} alt="match" />
          <p className="line-clamp-1">{matchInfo?.matchDescription || "N/A"}</p>
        </div>
        <div className="flex place-items-center justify-between gap-2">
          <Img src={"/assets/imgs/icons/location.svg"} width={30} height={30} alt="match" />
          <p>{matchInfo?.venue.city || "N/A"}</p>
        </div>
      </div>
      <div className="bg-white w-full flex place-items-center justify-between p-4 rounded-xl">
        <div className="flex place-items-center justify-between gap-2">
          <p className="line-clamp-1">{matchInfo?.date || "N/A"}</p>
        </div>
        <div className="flex place-items-center justify-between gap-2">
          <p>{matchInfo?.time || "N/A"}</p>
        </div>
      </div>
      <div className="bg-white w-full flex place-items-center justify-between p-4 rounded-xl">
        <div className="flex flex-col justify-between gap-2">
          <p className="line-clamp-1">Umpire 1</p>
          <p className="line-clamp-1">Umpire 2</p>
          <p className="line-clamp-1">Umpire 3</p>
        </div>
        <div className="flex place-items-center justify-between gap-2">
          <div className="flex flex-col justify-between gap-2">
            <p className="line-clamp-1">{matchInfo?.umpire1.name || "N/A"}</p>
            <p className="line-clamp-1">{matchInfo?.umpire2.name || "N/A"}</p>
            <p className="line-clamp-1">{matchInfo?.umpire3.name || "N/A"}</p>
          </div>
        </div>
      </div>
      <div className="bg-white flex-col md:flex-row w-full flex place-items-center justify-between md:justify-between p-4 rounded-xl">
        <div className="flex place-items-center justify-between gap-2">
          <Img src={"/assets/imgs/icons/dice.svg"} width={30} height={30} alt="match" />
          <p className="line-clamp-1">{matchInfo?.tossResults.tossWinnerName || "N/A"}</p>
        </div>
        <div className="flex place-items-center justify-between gap-2">
          <Img src={"/assets/imgs/icons/refree.png"} title="refree" width={30} height={30} alt="match" />
          <p>{matchInfo?.referee.name || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

interface MatchDetailsLiveTabProps {}

export const MatchDetailsLiveTab: React.FC<MatchDetailsLiveTabProps> = () => {
  return (
    <div className="w-full h-full flex justify-center place-items-center">
      <Image src={"/assets/imgs/bg/soon.png"} height={500} width={500} alt="coming soon" />
    </div>
  );
};

import React from "react";
import ServerError from "../Error/ServerError";
import { getMatchTeamDetailsAPI } from "@/api/methods/auth";

interface MatchDetailsHighlightTabProps {}

export const MatchDetailsHighlightTab: React.FC<MatchDetailsHighlightTabProps> = () => {
  return (
    <div className="w-full h-full flex justify-center place-items-center">
      <Image src={"/assets/imgs/bg/soon.png"} height={500} width={500} alt="coming soon" />
    </div>
  );
};

interface MatchTeamSquadsProps {
  matchDetails: MatchData;
}

export const MatchTeamsSquads: React.FC<MatchTeamSquadsProps> = async ({ matchDetails }) => {
  try {
    const team1SquadData = await getMatchTeamDetailsAPI(
      matchDetails.matchInfo.matchId,
      matchDetails.matchInfo.team1.id
    );
    const team2SquadData = await getMatchTeamDetailsAPI(
      matchDetails.matchInfo.matchId,
      matchDetails.matchInfo.team2.id
    );

    return (
      <div className="h-full bg-white m-2 rounded-xl">
        <div className="flex place-items-center bg-mainGreen text-white rounded-t-xl justify-between p-3">
          <Img
            src={`https://ws.stage.cricap.com/api/cricbuzz/team-flag/${matchDetails?.matchInfo?.team1?.id}?p=det&d=high`}
            width={60}
            height={55}
            alt=""
          />
          <Img
            src={`https://ws.stage.cricap.com/api/cricbuzz/team-flag/${matchDetails?.matchInfo.team2.id}?p=det&d=high`}
            width={60}
            height={55}
            alt=""
          />
        </div>
        <div className="flex justify-between p-3 gap-1">
          <div className="flex flex-col gap-2">
            {team1SquadData.data.players.map((player: any) => {
              return (
                <div className="flex place-items-center gap-2" key={player?.id}>
                  <div className="relative min-h-10 min-w-10 md:h-16 md:w-16 border border-gray-400 rounded-full">
                    <Img
                      src={`https://ws.stage.cricap.com/api/cricbuzz/get-image/${player?.faceImageId}?p=det&d=high`}
                      fill
                      alt=""
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm md:text-base line-clamp-1">{player?.name}</p>
                    <p className="line-clamp-1 text-xs md:text-sm">{player?.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            {team2SquadData?.data.players.map((player: any) => {
              return (
                <div className="flex place-items-center gap-2 justify-between" key={player?.id}>
                  <div>
                    <p className="font-semibold text-sm md:text-base line-clamp-1">{player?.name}</p>
                    <p className="line-clamp-1 text-xs md:text-sm">{player?.role}</p>
                  </div>

                  <div className="relative min-h-10 min-w-10 md:h-16 md:w-16 border border-gray-400 rounded-full">
                    <Img
                      src={`https://ws.stage.cricap.com/api/cricbuzz/get-image/${player?.faceImageId}?p=det&d=high`}
                      fill
                      alt=""
                      className="rounded-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <ServerError />;
  }
};

