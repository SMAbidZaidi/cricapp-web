import React, { useEffect, useState } from "react";
import Img from "../Img/Img";
import { getPosts, likePost } from "@/api/methods/auth";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";
import { FeedPost } from "@/@types/feed";
import { parseContent } from "@/utils/ParseContent";

interface postsDataState {
  isError: boolean;
  isLoading: boolean;
  data: FeedPost[] | undefined;
}

const Post = () => {
  const [postsData, setPostsData] = useState<postsDataState>({
    isError: false,
    isLoading: true,
    data: undefined,
  });
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPostsData((prev) => {
          return { ...prev, data: data.data?.feed?.data };
        });
      } catch (error) {
        setPostsData((prev) => {
          return { ...prev, isError: true };
        });
      } finally {
        setPostsData((prev) => {
          return { ...prev, isLoading: false };
        });
      }
    };
    fetchPosts();
  }, []);

  // const handleLikePost = async (postId: number) => {
  //   try {
  //     await likePost(postId);

  //     setPostsData((prev) => {
  //       if (!prev.data) return prev;

  //       const updatedData = prev.data.map((post) => {
  //         const auth = localStorage.getItem("auth");
  //         const userData = auth ? JSON.parse(auth) : null;

  //         const userId = userData?.user?.id;
  //         if (post.id === postId && userId) {
  //           return {
  //             ...post,
  //             likesCount: post.likedByUser ? (post.likesCount ?? 0) - 1 : (post.likesCount ?? 0) + 1,
  //             likedByUser: !post.likedByUser,
  //           };
  //         }
  //         return post;
  //       });
  //       return { ...prev, data: updatedData };
  //     });
  //   } catch (error) {
  //     console.error("Failed to like the post", error);
  //   }
  // };

  console.log(postsData);

  if (postsData.isLoading) {
    return <Loading />;
  }

  if (postsData.isError) {
    return <ServerError />;
  }

  return (
    <div>
      {postsData.data?.map((post, index) => {
        return (
          <div key={index} className="flex items-start gap-2 my-4">
            <div className="tab-profile-image">
              <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
            </div>
            <div className="profile-content-wrapper w-[100%]">
              <div className="flex gap-2 items-center">
                <div className="profile-name font-semibold text-[22px] text-black">Michile dangoy</div>
                <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">@{post.user.username}</div>
              </div>
              <div className="flex flex-col items-start gap-2">
                <span className="text-[#464646] text-[18px]">{post.message}</span>
                <p className="text-[#464646] w-[100%] md:w-[50%]">
                  {post.content && post.content?.length > 0 ? parseContent(post.content) : null}
                </p>
                <div className="flex gap-4 items-center">
                  {/* Likes Section */}
                  <div className="flex items-center gap-1">
                    <Img
                      className="cursor-pointer"
                      src={post.likedByUser ? "/assets/imgs/icons/heart-filled.svg" : "/assets/imgs/icons/heart.svg"} // Change icon based on likedByUser
                      height={20}
                      width={20}
                      alt="Like"
                    />
                    <span>{post.likesCount ?? 0}</span>
                  </div>
                  {/* Comments Section */}
                  <div className="flex items-center gap-1">
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/comment.svg"}
                      height={20}
                      width={20}
                      alt="Comment"
                    />
                    <span>{post.commentsCount ?? null}</span>
                  </div>
                  {/* Repost Section */}
                  <div className="flex items-center gap-1">
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/repeat.svg"}
                      height={20}
                      width={20}
                      alt="Repost"
                    />
                    <span>{post.repost?.likesCount ?? null}</span> {/* Adjust based on your API data structure */}
                  </div>
                  {/* Share Section */}
                  <div className="flex items-center gap-1">
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/share.svg"}
                      height={20}
                      width={20}
                      alt="Share"
                    />
                    <span>{post.ownPost ?? null}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Post;
