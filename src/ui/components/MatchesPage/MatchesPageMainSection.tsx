"use client";
import { MatchesListAPIForMatches } from "@/api/methods/auth";
import { useQueryState } from "nuqs";
import type { HTMLAttributes } from "react";
import React, { useEffect, useState } from "react";
import { match } from "assert";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";
import Img from "../Img/Img";
import Link from "next/link";
import NoData from "../Error/NoData";
import useSWR from "swr";

interface MatchesPageMainSectionProps extends HTMLAttributes<HTMLDivElement> {}

interface MatchesDataState {
  matchesData: any;
  isError: boolean;
  isLoading: boolean;
}
const MatchesPageMainSection: React.FC<MatchesPageMainSectionProps> = ({ ...props }) => {
  const [matchTypeQuery] = useQueryState("type");
  const [matchCategoryQUery, setMatchCategoryQuery] = useQueryState("category");
  const { data: matchesData, error, isLoading } = useSWR(matchTypeQuery, MatchesListAPIForMatches);

  useEffect(() => {
    // setMatchCategoryQuery(response.data?.[0]?.type?.toLowerCase());
    const firstCategory = matchesData?.data?.[0]?.type?.toLowerCase();
    if (firstCategory) {
      if (!matchCategoryQUery) {
        setMatchCategoryQuery(firstCategory);
      } else if (matchCategoryQUery) {
        // if there is match category query already in there then check if it matches the
        // currently available matches category type
        const isAvailableInCurrentType = matchesData?.data?.find(
          (match: any) => match.type?.toLowerCase() === matchCategoryQUery?.toLocaleLowerCase()
        );
        if (!isAvailableInCurrentType) {
          setMatchCategoryQuery(firstCategory);
        } else {
          return;
        }
      }
    }
  }, [matchCategoryQUery, matchesData?.data, setMatchCategoryQuery]);

  const currentTimeLineMatches = matchesData?.data?.find(
    (match: any) => match?.type?.toLowerCase() == matchCategoryQUery?.toLocaleLowerCase()
  )?.timeline;

  if (isLoading) {
    return <Loading />;
  } else {
    if (error) {
      return <ServerError />;
    } else {
      return (
        <div>
          {/* category tab */}
          <div className="bg-mainGreen p-4 flex place-items-center gap-3">
            {matchesData?.data?.map((matchItem: any) => {
              return (
                <button
                  className={`${
                    matchCategoryQUery === matchItem?.type.toLowerCase()
                      ? "bg-white text-black rounded-full"
                      : "text-white"
                  } py-1 px-2 font-bold `}
                  key={matchItem?.type}
                  onClick={() => setMatchCategoryQuery(matchItem?.type?.toLowerCase())}
                >
                  {matchItem?.type}
                </button>
              );
            })}
          </div>

          {/* matches */}
          {currentTimeLineMatches && currentTimeLineMatches?.length > 0 ? (
            currentTimeLineMatches?.map((matchesData: any) => {
              return <MatchPageMatchCard key={matchesData?.date} matchesData={matchesData} />;
            })
          ) : (
            <NoData />
          )}
        </div>
      );
    }
  }
};
export default MatchesPageMainSection;

interface MatchPageMatchCardProps {
  matchesData: any;
}

export const MatchPageMatchCard: React.FC<MatchPageMatchCardProps> = ({ matchesData }) => {
  return (
    <div>
      <div className="bg-mainBg flex place-items-center justify-center p-3 font-semibold text-sm">
        {matchesData?.date}
      </div>
      {matchesData?.matches?.map((match: any) => {
        return (
          <Link
            href={`/match/${match?.matchId}?tab=info`}
            key={match?.matchId}
            className="bg-white p-3 flex flex-col gap-3 border-b border-gray-300"
          >
            <div className="flex justify-between place-items-center ">
              <div>
                <p className="font-bold">{match?.matchDesc}</p>
                <p className="text-xs line-clamp-1 text-gray-700">{match?.seriesName}</p>
              </div>
              <div
                className={`${
                  match?.state?.toLowerCase() == "upcoming"
                    ? "bg-red-600 text-white"
                    : match?.state?.toLowerCase() == "complete"
                    ? "bg-mainGreen text-white"
                    : "bg-sky-700 text-white"
                } px-2 py-1 rounded-full text-xs md:text-sm line-clamp-1 text-nowrap`}
              >
                {match?.state}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="w-full  flex justify-between place-items-center">
                <div className="relative max-w-10 min-w-10 h-8  border rounded-md border-gray-300 overflow-hidden">
                  <Img src={`https://ws.stage.cricap.com${match?.team1?.image}`} fill alt="" className="object-cover" />
                </div>
                <div>
                  <p className="font-bold">
                    {match?.team1?.score?.inngs1?.runs || 0}/{match?.team1?.score?.inngs1?.wickets || 0} (
                    {match?.team1?.score?.inngs1?.overs || 0})
                  </p>
                </div>
              </div>

              <div className="w-full  flex justify-between place-items-center">
                <div className="relative max-w-10 min-w-10 h-8 border rounded-md border-gray-300 overflow-hidden">
                  <Img src={`https://ws.stage.cricap.com${match?.team2?.image}`} fill alt="" className="object-cover" />
                </div>
                <div>
                  <p className="font-bold">
                    {match?.team2?.score?.inngs1?.runs || 0}/{match?.team2?.score?.inngs1?.wickets || 0} (
                    {match?.team2?.score?.inngs1?.overs || 0})
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between place-items-center">
              <p className="text-sm text-mainGreen">
                <span className="font-bold">Location: </span>
                {match?.city}
              </p>

              <span className="text-xs text-gray-400">{match?.status}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
