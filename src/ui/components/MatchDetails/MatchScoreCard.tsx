import Loading from "@/app/loading";
import { match } from "assert";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface MatchScoreCardProps {
  matchScoreData: any;
}

export const MatchScoreCard: React.FC<MatchScoreCardProps> = ({ matchScoreData }) => {
  const currentInning = useSearchParams().get("inning");
  switch (currentInning) {
    case "first_inning":
      return (
        <ScoreInning battingInnings={matchScoreData?.scoreCard[0]} bowlingInnings={matchScoreData?.scoreCard[0]} />
      );

    case "second_inning":
      return (
        <ScoreInning battingInnings={matchScoreData?.scoreCard[1]} bowlingInnings={matchScoreData?.scoreCard[1]} />
      );
    default:
      break;
  }
};

interface ScoreInningProps {
  battingInnings: any;
  bowlingInnings: any;
}

export const ScoreInning: React.FC<ScoreInningProps> = ({ battingInnings, bowlingInnings }) => {
  const battingData = battingInnings?.batTeamDetails?.batsmenData || {};
  const bowlingData = bowlingInnings?.bowlTeamDetails?.bowlersData || {};

  return (
    <Suspense fallback={<Loading />}>
      <div className="my-3 px-2">
        <div className="flex flex-col w-full h-full rounded-xl overflow-hidden">
          <div className="bg-mainGreen text-white rounded-t-xl p-2 flex place-items-center">
            <Image src={"/assets/imgs/icons/bat.svg"} height={30} width={30} alt="bat" />
            <h3 className="font-bold">{battingInnings?.innings} Batting</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full h-full rounded-b-xl overflow-hidden">
              <thead>
                <th title="batter">Batter</th>
                <th title="Runs">R</th>
                <th className="Balls">B</th>
                <th title="fours">4s</th>
                <th title="sixes">6s</th>
                <th title="Strike Rate">SR</th>
              </thead>
              <tbody>
                {Object?.keys(battingData).map((key) => {
                  const data = battingData[key];
                  return (
                    <>
                      <tr key={""}>
                        <td className="text-nowrap line-clamp-1">{data?.batName}</td>
                        <td>{data?.runs}</td>
                        <td>{data?.balls}</td>
                        <td>{data?.fours}</td>
                        <td>{data?.sixes}</td>
                        <td>{data?.strikeRate}</td>
                      </tr>
                      <tr>
                        <td colSpan={6} className="text-right not-td px-4 bg-mainBg tracking-wide">
                          {data?.outDesc}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* bowling innings */}

      <div className="my-3 px-2">
        <div className="flex flex-col w-full h-full rounded-xl">
          <div className="bg-mainGreen text-white rounded-t-xl p-2 flex place-items-center">
            <Image src={"/assets/imgs/icons/bowl.svg"} height={27} width={27} alt="bat" />
            <h3 className="font-bold">{bowlingInnings?.bowlTeamDetails?.bowlTeamName} Bowling</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full h-full rounded-b-xl overflow-hidden">
              <thead>
                <th title="Bowler">Bowler</th>
                <th title="Overs">O</th>
                <th className="Maidens">M</th>
                <th title="Runs">R</th>
                <th title="No Balls">NB</th>
                <th title="Wides">WD</th>
                <th title="Economy">EC</th>
              </thead>
              <tbody>
                {Object?.keys(bowlingData).map((key) => {
                  const data = bowlingData[key];
                  return (
                    <>
                      <tr key={""}>
                        <td className="text-nowrap line-clamp-1">{data?.bowlName}</td>
                        <td>{data?.overs}</td>
                        <td>{data?.maidens}</td>
                        <td>{data?.runs}</td>
                        <td>{data?.no_balls}</td>
                        <td>{data?.wides}</td>
                        <td>{data?.economy}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
