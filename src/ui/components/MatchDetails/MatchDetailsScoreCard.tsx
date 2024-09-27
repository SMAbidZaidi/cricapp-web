"use client";
import { getMatchScorecardAPI } from "@/api/methods/auth";
import { useQueryState } from "nuqs";
import { useSearchParams } from "next/navigation";
import { MatchScoreCard } from "./MatchScoreCard";
import Loading from "@/app/loading";
import useSWR from "swr";

interface MatchDetailsScoreCardTabProps {
  matchId: number;
}

export const MatchDetailsScoreCardTab: React.FC<MatchDetailsScoreCardTabProps> = (props) => {
  const { data: matchScoreData, error, isLoading } = useSWR(props.matchId?.toString(), getMatchScorecardAPI);
  return (
    <div>
      <ScoreCardTab />
      {isLoading ? <Loading /> : <MatchScoreCard matchScoreData={matchScoreData?.data} />}
    </div>
  );
};

interface ScoreCardTabProps {}

export const ScoreCardTab: React.FC<ScoreCardTabProps> = () => {
  const [_tabQuery, setTabQuery] = useQueryState("inning", { scroll: false });
  const currentInning = useSearchParams().get("inning");
  const handleTabActivation = (tab: string) => {
    setTabQuery(tab);
  };
  return (
    <div className="w-full justify-center">
      <div className="flex justify-evenly">
        <button
          className={`py-1 px-3 rounded-2xl ${
            "first_inning" === currentInning ? "bg-mainGreen text-white" : "bg-white text-mainGreen"
          }`}
          onClick={() => handleTabActivation("first_inning")}
        >
          1st Inning
        </button>
        <button
          className={`py-1 px-3 rounded-2xl ${
            "second_inning" === currentInning ? "bg-mainGreen text-white" : "bg-white text-mainGreen"
          }`}
          onClick={() => handleTabActivation("second_inning")}
        >
          2nd Inning
        </button>
      </div>
    </div>
  );
};
