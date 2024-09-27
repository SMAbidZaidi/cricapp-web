import MatchesCarousal from "@/ui/components/MatchesCarousal/MatchesCarousal";
import { HomeAPI } from "@/api/methods/auth.js";
import React, { Suspense, useState } from "react";
import Banner from "@/ui/components/Banner/Banner";
import Trends from "@/ui/components/Trends/Trends";
import HomePageSeries from "@/ui/components/HomePageSeries/HomePageSeries";
import HomePageMainSection from "@/ui/components/HomePageMainSection/HomePageMainSection";
import ServerError from "@/ui/components/Error/ServerError";
import Loading from "./loading";

const fetchHomePage = async () => {
  const data = await HomeAPI();
  return data;
};

const page: React.FC = async ({ ...props }) => {
  const homePageData = await fetchHomePage();

  if (homePageData.status === 200) {
    return (
      <div className="p-2 md:p-0" {...props}>
        <Suspense>
          <Banner bannerData={homePageData.data.banners || []} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <MatchesCarousal matchesData={homePageData?.data?.matches} />
        </Suspense>
        <Suspense>
          <Trends tagsData={homePageData.data.tags} />
        </Suspense>
        <Suspense>
          <HomePageSeries seriesData={homePageData.data.series} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <HomePageMainSection />
        </Suspense>
      </div>
    );
  } else if (homePageData.status === 500) {
    return <ServerError />;
  } else {
    return <ServerError />;
  }
};
export default page;
