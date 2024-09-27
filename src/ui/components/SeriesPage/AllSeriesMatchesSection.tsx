import { SeriesListAPI } from "@/api/methods/auth";
import { getCurrentTimeWithTimezone } from "@/utils/getCurrentTimeWithZone";
import { useQueryState } from "nuqs";
import type { HTMLAttributes } from "react";
import React from "react";
import useSWR from "swr";
import Img from "../Img/Img";
import Link from "next/link";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";

interface AllSeriesMatchesSectionProps extends HTMLAttributes<HTMLDivElement> {
  tabName: string;
}

const AllSeriesMatchesSection: React.FC<AllSeriesMatchesSectionProps> = ({ tabName, ...props }) => {
  const [currentCategory] = useQueryState(tabName);
  const { data, isLoading, error } = useSWR(currentCategory, SeriesListAPI);

  return (
    <div className="bg-white h-fit flex flex-col gap-1" {...props}>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <ServerError />
      ) : (
        data?.data?.map((seriesData: any) => {
          return <SeriesCard key={seriesData?.date} seriesData={seriesData} />;
        })
      )}
    </div>
  );
};
export default AllSeriesMatchesSection;

interface SeriesCardProps {
  seriesData: any;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({ seriesData }) => {
  return (
    <div className="w-full min-h-28">
      <p className="bg-mainBgLight w-full px-3 py-2 font-bold text-gray-600">{seriesData?.date}</p>
      {seriesData?.series?.map((series: any) => {
        return (
          <Link
            href={`/series-matches/${series?.id}`}
            key={series?.id}
            className="px-3 py-2 flex flex-col md:flex-row justify-between md:place-items-center shadow-md gap-2"
          >
            <div className=" flex flex-col gap-2">
              <p className="font-bold text-base md:text-xl line-clamp-1">{series?.name}</p>
              <p className="text-gray-600 text-xs md:text-sm line-clamp-1">
                {getCurrentTimeWithTimezone(series?.startDt / 1000)}
              </p>
            </div>
            <button className="font-semibold flex place-items-center place-self-end md:place-self-auto">
              <span>view</span> <Img src={"/assets/imgs/icons/right.png"} width={20} height={20} alt="arrow" />
            </button>
          </Link>
        );
      })}
    </div>
  );
};
