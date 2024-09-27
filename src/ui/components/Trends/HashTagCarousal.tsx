"use client";
import type { HTMLAttributes } from "react";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/global/store";
import { TagMatch, setCurrentTag } from "@/global/reducers/tagsSlice";

interface HashTagCarousalProps extends HTMLAttributes<HTMLDivElement> {
  tagsData: any[];
}

interface Tag {
  id: number;
  name: string;
  posts: TagMatch[];
}
const HashTagCarousal: React.FC<HashTagCarousalProps> = ({ tagsData, ...props }) => {
  const state = useSelector((state: RootState) => state.tagsReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setCurrentTag({
        currentTag: tagsData[0].name,
        matches: tagsData[0].posts,
      })
    );
  }, [dispatch, tagsData]);

  const [emblaRef] = useEmblaCarousel({ dragFree: true });

  const handleTagSelection = (tag: Tag) => {
    dispatch(
      setCurrentTag({
        currentTag: tag.name,
        matches: tag.posts,
      })
    );
  };
  const currentTag = state.currentTag;
  return (
    <div className="overflow-hidden py-4 md:mx-2 w-full select-none" ref={emblaRef}>
      <div className="flex place-items-center justify-between md:justify-normal w-full gap-2">
        {tagsData?.map((tag: any) => {
          return (
            <button
              onClick={() => handleTagSelection(tag)}
              className={`${
                currentTag == tag.name ? "text-mainGreen" : "text-opacity-50 text-gray-600"
              } text-nowrap italic`}
              key={tag.id}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default HashTagCarousal;
