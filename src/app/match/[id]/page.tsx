// @ts-ignore
import { getMatchDetailsAPI } from "@/api/methods/auth";
import ServerError from "@/ui/components/Error/ServerError";
import Img from "@/ui/components/Img/Img";
import MatchDetails from "@/ui/components/MatchDetails/MatchDetails";
import React from "react";

const page: React.FC<{ params: any }> = async ({ ...props }: { params: any }) => {
  const matchDetails = await getMatchDetailsAPI(props.params.id);
  if (matchDetails.status === 200) {
    return (
      <div className="bg-mainBgLight w-full flex flex-col place-items-center min-h-screen h-fit relative">
        <span className="bg-mainGreen absolute top-0 w-full h-[150px] rounded-b-[50px] md:hidden"></span>
        <div className="relative md:w-[80%] xl:w-[60%] w-[90%] md:h-[400px] h-56 rounded-xl m-2 bg-matchCardBg bg-cover">
          <p className="z-20 absolute top-3 w-full text-center text-white">
            {matchDetails.data.matchInfo?.complete ? "Match Completed" : matchDetails?.data?.matchInfo?.time}
          </p>
          <span className="bg-gradient-to-b from-[#2121218c]  to-transparent h-full w-full absolute z-10 rounded-xl"></span>
          <div className="absolute flex justify-center place-items-center z-50 h-full w-full flex-col">
            <div className="w-full flex justify-evenly">
              <div className="flex flex-col gap-1 text-white justify-center place-items-center">
                <Img
                  src={`https://ws.stage.cricap.com/api/cricbuzz/team-flag/${matchDetails.data.matchInfo?.team1?.id}?p=det&d=high`}
                  width={60}
                  height={55}
                  alt=""
                />
                <p className="ext-white ">{matchDetails.data.matchInfo?.team1.name}</p>
              </div>

              <div className="flex flex-col gap-1 text-white justify-center place-items-center">
                <Img
                  src={`https://ws.stage.cricap.com/api/cricbuzz/team-flag/${matchDetails.data.matchInfo?.team2?.id}?p=det&d=high`}
                  width={60}
                  height={55}
                  alt=""
                />
                <p className="ext-white ">{matchDetails.data.matchInfo?.team2.name}</p>
              </div>
            </div>
            <p className="absolute bottom-3 text-white flex place-items-center">
              <span className="font-bold">
                <Img src={"/assets/imgs/icons/location.svg"} height={20} width={20} alt="" />
              </span>
              <span>{matchDetails.data.venueInfo?.ground}</span>
            </p>
          </div>
        </div>
        <MatchDetails matchDetails={matchDetails.data} />
      </div>
    );
  } else {
    return <ServerError />;
  }
};
export default page;