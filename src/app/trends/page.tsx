"use client";
import TrendsPage from "@/ui/components/Trends/TrendsPage";
import React from "react";
import useSWR from "swr";
import Loading from "../loading";
import ServerError from "@/ui/components/Error/ServerError";
import { HomeAPI } from "@/api/methods/auth";

const Page: React.FC = ({ ...props }) => {
  const { data: homePageData, error, isLoading } = useSWR("home-index", HomeAPI);
  return (
    <div className="h-full w-full">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <ServerError />
      ) : (
        <TrendsPage bannerData={homePageData?.data?.banners} tagsData={homePageData?.data?.tags} />
      )}
    </div>
  );
};
export default Page;
