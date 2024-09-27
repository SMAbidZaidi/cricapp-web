"use client";
import Heading from "@/ui/atoms/heading/Heading";
import type { HTMLAttributes } from "react";
import React from "react";
import Banner from "../Banner/Banner";
import Img from "../Img/Img";
import MakeTabs, { TabsData } from "../Navigation/MakeTabs";
import HashTagCarousal from "./HashTagCarousal";
import { TrendsPageTags } from "./TrendsPageTags";
import { useQueryState } from "nuqs";
import CricapQ from "./CricapQ";

interface TrendsPageProps extends HTMLAttributes<HTMLDivElement> {
  bannerData: any;
  tagsData: any;
}
const trendsTabData: TabsData[] = [
  {
    title: "News",
    query: "news",
  },
  { title: "CricapQ", query: "cricapq" },
];

const TrendsPage: React.FC<TrendsPageProps> = ({ bannerData, tagsData, ...props }) => {
  const tabName = "trends-tab";
  const [currentTabName] = useQueryState(tabName);
  return (
    <div className="w-full h-full my-2">
      <MakeTabs tabName={tabName} tabsData={trendsTabData} tabsType="primary" />
      {currentTabName == "news" ? <TrendsPageNewsTab bannerData={bannerData} tagsData={tagsData} /> : <CricapQ />}
    </div>
  );
};
export default TrendsPage;

interface TrendsPageNewsTabProps {
  bannerData: any;
  tagsData: any;
}

export const TrendsPageNewsTab: React.FC<TrendsPageNewsTabProps> = ({ bannerData, tagsData }) => {
  return (
    <>
      <div className="px-2 md:px-3 py-2">
        <Heading title="Recommended" />
        <Banner bannerData={bannerData} />
      </div>
      <div className="h-full flex flex-col gap-2">
        <div className="flex place-items-center bg-white px-2">
          <Img src={"/assets/imgs/icons/hashtag.svg"} alt="hashtag" height={20} width={20} className="mr-2" />
          <HashTagCarousal tagsData={tagsData} />
        </div>

        <TrendsPageTags />
      </div>
    </>
  );
};
