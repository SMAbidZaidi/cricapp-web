import { getPost } from "@/api/methods/auth";
import ServerError from "@/ui/components/Error/ServerError";
import Img from "@/ui/components/Img/Img";
import Navigation from "@/ui/components/MainHeader/Navigation";
import RecommendedPosts from "@/ui/components/PostPage/RecommendedPosts";
import { getFirstThreeParagraphsText, parseContent } from "@/utils/ParseContent";
import dayjs from "dayjs";
import { Metadata } from "next";
import React from "react";

interface PageProps {
  params: {
    id: number;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const response = await getPost(params.id);
  const description = getFirstThreeParagraphsText(response.data);

  return {
    openGraph: {
      url: response.data?.media[0]?.url,
      title: response.data?.message,
      publishedTime: response.data?.publishedAt,
      siteName: "CriCap",
      type: "article",
      images: [{ url: response.data?.media[0]?.url }],
      description,
    },
    category: "sports",
    description,
    title: response.data?.message,
    robots: { index: true, follow: true },
  };
}

export default async function Page(props: PageProps) {
  try {
    const response = await getPost(props.params.id);


    return (
      <div className="container bg-mainBgLight py-5">
        <div className="2xl:max-w-[70%] mx-auto ">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{response.data.message}</h1>

          <div className="relative  aspect-video overflow-hidden">
            <Img
              src={response.data.media[0].url}
              fill
              alt=""
              className="object-cover hover:scale-125 transition-all duration-500"
            />
          </div>
          <div className="flex justify-between place-items-center py-2">
            <span className="font-semibold">{dayjs(response.data.publishedAt).format("dddd D YYYY")}</span>
            <Navigation invertedIcons={false} hiddenOnSm={false} postTitle={response.data?.message} />
          </div>
          {parseContent(response.data.content)}
          <RecommendedPosts />
        </div>
      </div>
    );
  } catch (error) {
    return <ServerError />;
  }
}
