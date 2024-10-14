import type { HTMLAttributes } from "react";
import React, { Suspense } from "react";
import HomePageRecommended from "./HomePageRecommended";
import HomePageWebTags from "./HomePageWebTags";
import HomePageNews from "./HomePageNews";
import { NewsAPIForTrendsNew } from "@/api/methods/auth";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";

interface HomePageMainSectionProps extends HTMLAttributes<HTMLDivElement> {}

const HomePageMainSection: React.FC<HomePageMainSectionProps> = async ({ ...props }) => {
  try {
    const newsData = await NewsAPIForTrendsNew();
    return (
      <Suspense fallback={<Loading />}>
        <div className="hidden md:grid md:grid-cols-12 gap-3" {...props}>
          <HomePageRecommended recommendedData={newsData.data.recommanded} />
          <HomePageWebTags tagsData={newsData.data.tags} />
          <HomePageNews />
        </div>
      </Suspense>
    );
  } catch (error) {
    return <ServerError />;
  }
};
export default HomePageMainSection;
