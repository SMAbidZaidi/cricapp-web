import type { HTMLAttributes } from "react";
import React from "react";
import SeriesSectionWrapper from "./SeriesSectionWrapper";
import MakeTabs from "../Navigation/MakeTabs";
import { allSeriesTabsData } from "./allSeriesTabs.data";
import ServerError from "../Error/ServerError";
import { TeamsListAPI } from "@/api/methods/auth";
import useSWR from "swr";
import { useQueryState } from "nuqs";
import Img from "../Img/Img";
import Loading from "@/app/loading";

interface SeriesRankingSectionProps extends HTMLAttributes<HTMLDivElement> {}

const SeriesRankingSection: React.FC<SeriesRankingSectionProps> = () => {
  const tabName = "ranking-type";
  const [currentCategory] = useQueryState(tabName);

  const { data, isLoading, error } = useSWR(currentCategory, TeamsListAPI);

  return (
    <SeriesSectionWrapper>
      <MakeTabs tabName={tabName} tabsData={allSeriesTabsData} tabsType="secondary" />
      {isLoading ? (
        <Loading />
      ) : error ? (
        <ServerError />
      ) : (
        <div className="bg-white w-full">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Team</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((rank: any, index: number) => {
                return (
                  <tr key={rank?.teamId}>
                    <td>{index + 1}</td>
                    <td className="flex place-items-center gap-2">
                      <Img
                        src={`https://ws.stage.cricap.com/api/cricbuzz/get-image/${rank?.imageId}?p=det&d=high`}
                        height={25}
                        width={30}
                        className="min-h-[25px] min-w-[30px] rounded-sm border border-gray-300"
                        alt=""
                      />
                      <span>{rank?.teamName}</span>
                    </td>
                    <td className="">
                      <div className="flex">
                        <span className="hidden xl:block">more</span>{" "}
                        <Img src={"/assets/imgs/icons/right.png"} height={25} width={25} alt="" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SeriesSectionWrapper>
  );
};
export default SeriesRankingSection;
