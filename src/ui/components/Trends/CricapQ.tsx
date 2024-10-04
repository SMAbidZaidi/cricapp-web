"use client";
import type { HTMLAttributes } from "react";
import React, { useEffect, useState } from "react";
import Img from "../Img/Img";
import Input from "@/ui/atoms/Input/Input";
import EmojiPicker from "emoji-picker-react";
import ContentEditable from "react-contenteditable";
import { Paperclip } from "react-bootstrap-icons";
import { addPostComment, commentPost, deletePost, getPosts, likePost } from "@/api/methods/auth";
import { FeedPost } from "@/@types/feed";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";
import { parseContent } from "@/utils/ParseContent";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AddPost from "./AddPost";
import { toast } from "sonner";
import UpdatePost from "./UpdatePost";
import { useQueryState } from "nuqs";

dayjs.extend(relativeTime);

interface CricapQProps extends HTMLAttributes<HTMLDivElement> {}
interface postsDataState {
  isError: boolean;
  isLoading: boolean;
  data: FeedPost[] | undefined;
}
const CricapQ: React.FC<CricapQProps> = ({ ...props }) => {
  const [_, setModalPost] = useQueryState("modal_post_id");
  const [messages, setMessages] = useState<{ [key: number]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const toggleDropdown = (postId: number) => {
    setOpenDropdownId((prevId) => (prevId === postId ? null : postId));
  };

  const handleInputChange = (event: any, postId: number) => {
    const value = event?.target?.value;
    setMessages((prevMessages) => ({
      ...prevMessages,
      [postId]: value,
    }));
  };

  const [postsData, setPostsData] = useState<postsDataState>({
    isError: false,
    isLoading: true,
    data: undefined,
  });

  // State for comments
  const [commentsData, setCommentsData] = useState<{ [key: number]: any[] }>({});
  const fetchPosts = async () => {
    try {
      const data = await getPosts();

      setPostsData((prev) => {
        return { ...prev, data: data.data?.feed?.data };
      });

      // Fetch comments for each post
      const commentsPromises = data.data?.feed?.data.map(async (post: FeedPost) => {
        const commentData = await commentPost(post.id); // Modify this based on your API structure
        return { postId: post.id, comments: commentData.data?.results }; // Store comments by postId
      });

      const commentsResults = await Promise.all(commentsPromises);
      const commentsMap = commentsResults.reduce((acc, { postId, comments }) => {
        acc[postId] = comments;
        return acc;
      }, {} as { [key: number]: any[] });

      setCommentsData(commentsMap);
      return commentsResults;
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
  useEffect(() => {
    fetchPosts();
  }, []);
  const handleLikePost = async (postId: number) => {
    try {
      await likePost(postId);

      setPostsData((prev) => {
        if (!prev.data) return prev;

        const updatedData = prev.data.map((post) => {
          const auth = localStorage.getItem("auth");
          const userData = auth ? JSON.parse(auth) : null;

          const userId = userData?.user?.id;
          if (post.id === postId && userId) {
            return {
              ...post,
              likesCount: post.likedByUser ? (post.likesCount ?? 0) - 1 : (post.likesCount ?? 0) + 1,
              likedByUser: !post.likedByUser,
            };
          }
          return post;
        });
        return { ...prev, data: updatedData };
      });
    } catch (error) {
      console.error("Failed to like the post", error);
    }
  };
  // Handle post comment API
  const handlePostComment = async (postId: number) => {
    const commentText = messages[postId];
    const auth = localStorage.getItem("auth");
    const userData = auth ? JSON.parse(auth) : null;
    const userId = userData?.user?.id;

    // console.log("Comment text:", commentText);
    // console.log("User  ID:", userId);

    if (!commentText || !userId) {
      console.log("Empty comment or missing user");
      return;
    }

    try {
      console.log("Sending comment:", { userId, commentText, postId });
      const response = await addPostComment(
        postId,
        userId,
        commentText,
        0,
        "2024-5-02T08:28:02.139Z",
        "2024-10-02T08:18:02.139Z"
      );

      console.log("Response from API:", response);
      // ...
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };
  // Handle delete post  API
  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId);
      setPostsData((prev) => {
        if (!prev.data) return prev;

        const updatedData = prev.data.filter((post) => post.id !== postId);
        console.log("deleted post", updatedData);
        toast.success("Post deleted successfully");
        return { ...prev, data: updatedData };
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to Login", {
        position: "top-right",
        closeButton: true,
      });
    }
  };
  // Handle Update post  API
  const [currentPost, setCurrentPost] = useState<{ id: number; content: any } | null>(null);
  const toggleUpdateModal = () => {
    if (isUpdateModalOpen) {
      setModalPost(null);
    } else if (openDropdownId) {
      setModalPost(openDropdownId?.toString());
    }
    setIsUpdateModalOpen((prev) => !prev);
  };
  const handleUpdateModal = (post: FeedPost) => {
    setCurrentPost({ id: post.id, content: post.content }); // Set the current post for updating
    toggleUpdateModal();
  };

  const handlePostUpdate = (updatedPost: FeedPost) => {
    setPostsData((prev) => {
      if (!prev.data) return prev;

      const updatedData = prev.data.map((post) => (post.id === updatedPost?.id ? updatedPost : post));
      return { ...prev, data: updatedData };
    });
  };

  if (postsData.isLoading) {
    return <Loading />;
  }

  if (postsData.isError) {
    return <ServerError />;
  }
  return (
    <div {...props} className="w-full h-full grid grid-cols-1 md:grid-cols-6 gap-2 bg-white">
      <div className="md:col-start-2 col-span-4 mx-[8px]">
        {postsData?.data?.map((post, index) => {
          const getDate = post.createdAt;
          const formattedDate = dayjs(getDate).fromNow();
          const postComments = commentsData[post.id] || [];

          return (
            <div key={index} className="flex flex-col items-start gap-2 my-[50px]">
              <div className="w-full flex items-start justify-between">
                <div className="flex items-start">
                  <div className="tab-profile-image">
                    <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
                  </div>
                  <div className="flex flex-col">
                    <div className="profile-name font-semibold text-[18px] text-black">{post?.user?.username}</div>
                    <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">
                      @{post?.user?.username}
                    </div>
                  </div>
                </div>
                <div className="w-full text-end flex flex-col items-end relative">
                  <button
                    onClick={() => toggleDropdown(post?.id)}
                    className="text-black bg-[#E7E7E7] border-2 font-medium rounded-md text-lg px-2 pb-2 text-center inline-flex items-center h-[25px]"
                  >
                    ...
                  </button>
                  {openDropdownId === post.id && (
                    <div className="z-10 divide-y divide-gray-100 rounded-lg shadow-lg w-44 bg-white text-end absolute top-[30px]">
                      <ul className="py-2 text-sm dark:text-gray-200">
                        <li className="cursor-pointer" onClick={() => handleUpdateModal(post)}>
                          <a className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-black">
                            Update
                          </a>
                        </li>
                        <li className="cursor-pointer" onClick={() => handleDeletePost(post.id)}>
                          <a className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-[red]">
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-content-wrapper w-full md:w-full lg:w-[100%] xl:w-[80%]">
                {/* content and img box */}
                <div className="flex flex-col items-start gap-2 py-2 border-b-2 border-[#E7E7E7]">
                  <p className="text-[#464646] w-[100%]">
                    {post.content && post.content?.length > 0 ? parseContent(post.content) : null}
                  </p>
                  <div
                    className={`cricq-post-img p-2 ${
                      post.media ? "border-2 border-[#E7E7E7] rounded-[15px]" : "hidden"
                    }`}
                  >
                    <Img className="rounded-[15px]" src={post.media} height={350} width={700} alt="soon" />
                  </div>
                  <div className="w-[100%] flex gap-4 items-center justify-between ">
                    <div className="flex gap-4 items-center">
                      <span className="flex gap-1 items-center text-[16px] text-[#464646] cursor-pointer">
                        <Img
                          src={
                            post.likedByUser ? "/assets/imgs/icons/heart-filled.svg" : "/assets/imgs/icons/heart.svg"
                          }
                          height={20}
                          width={20}
                          alt="like"
                          onClick={() => handleLikePost(post.id)}
                        />
                        <span>{post.likesCount || 0}</span>
                      </span>
                      <span className="flex gap-1 items-center">
                        <Img
                          className="cursor-pointer"
                          src={"/assets/imgs/icons/comment.svg"}
                          height={20}
                          width={20}
                          alt=""
                        />
                        <span>{post?.commentsCount || 0}</span>
                      </span>
                      <span className="flex gap-1 items-center">
                        <Img
                          className="cursor-pointer"
                          src={"/assets/imgs/icons/repeat.svg"}
                          height={20}
                          width={20}
                          alt=""
                        />
                        <span>0</span>
                      </span>
                      <span className="flex gap-1 items-center">
                        <Img
                          className="cursor-pointer"
                          src={"/assets/imgs/icons/share-btn.svg"}
                          height={20}
                          width={20}
                          alt=""
                        />
                        <span>{post?.commentsCount || 0}</span>
                      </span>
                    </div>
                    <div className="text-[#9E9E9E]">
                      <span>{formattedDate}</span>
                    </div>
                  </div>

                  <p className="text-[#9E9E9E]">
                    Like by <span>{post?.mentions?.map((mention) => mention.username).join(", ")}</span>, and Others
                    <span> {post.likes}</span>
                  </p>
                </div>

                {/* Comment input box */}
                <div className="border-t border-[#E7E7E7] pt-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ul className="w-full flex items-center">
                      <li className="flex-1 relative">
                        <ContentEditable
                          className="flex items-center py-2 px-4 rounded-lg border-2 border-[#E7E7E7]"
                          tagName="article"
                          html={messages[post.id] || ""}
                          onChange={(event) => handleInputChange(event, post.id)}
                        />
                        {/* Placeholder */}
                        {(!messages[post.id] || messages[post.id] === "") && (
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                            Write the Comments...
                          </span>
                        )}
                      </li>
                      <li className="px-1">
                        <label className="cursor-pointer">
                          <Paperclip size={20} className="text-[#464646]" />
                          <input className="hidden" type="file" />
                        </label>
                      </li>
                      <li>
                        <div className="group relative inline-block">
                          <button className="w-[40px] h-[40px] p-1 text-[16px] text-white focus:outline-none">
                            <Img src={"/assets/imgs/icons/mood.svg"} height={50} width={50} alt="User" />
                          </button>
                          <ul className="hidden group-focus-within:block list-none absolute z-1 shadow-lg animate-slideIn">
                            <EmojiPicker
                              lazyLoadEmojis
                              height={400}
                              previewConfig={{
                                showPreview: false,
                              }}
                              onEmojiClick={(emojiData) => {
                                const emoji = emojiData.emoji;
                                setMessages((prevMessages) => ({
                                  ...prevMessages,
                                  [post.id]: (prevMessages[post.id] || "") + emoji,
                                }));
                              }}
                            />
                          </ul>
                        </div>
                      </li>
                    </ul>
                    <button
                      className="text-[#464646] px-4 py-2 rounded-lg bg-[#E7E7E7] cursor-pointer"
                      onClick={() => handlePostComment(post.id)}
                    >
                      Post
                    </button>
                  </div>
                </div>

                {/* Display comments */}
                {postComments?.map((comment, index) => (
                  <div key={index} className="flex gap-2 my-3">
                    <div className="comment-content flex gap-2 bg-[#F5F5F5] p-3 rounded-lg w-full">
                      <div>
                        <Img
                          src={"/assets/imgs/icons/LoginUser.png"}
                          height={50}
                          width={50}
                          alt="User"
                          className="rounded-full"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex gap-2 items-center justify-between w-full">
                          <span className="font-semibold text-black text-[16px]">{comment?.user?.username}</span>
                          <span className="text-[#9E9E9E] text-sm ">{dayjs(comment.createdAt).fromNow()}</span>
                        </div>
                        <p className="text-[#464646] text-[14px] mt-2">{comment.commentText}</p>
                        <div className="mt-2 flex gap-4 text-sm text-[#9E9E9E]">
                          <span className="cursor-pointer">Likes</span>
                          <span className="cursor-pointer">Reply</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative my-4 flex flex-col items-start md:items-end gap-3">
        <button
          onClick={toggleModal}
          className="py-1 px-4 mx-3 bg-[#439B45] text-white rounded-[26px] font-medium text-[20px]  "
        >
          Add Post
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed z-10 overflow-y-auto top-0 w-full left-0">
          <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-900 opacity-75" />
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div
              className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white shadow-md px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                <button className="absolute top-[15px] right-[15px]" title="close" onClick={toggleModal}>
                  <Img src={"/assets/imgs/icons/close.png"} height={20} width={20} alt="X" />
                </button>
                <AddPost />
              </div>
            </div>
          </div>
        </div>
      )}
      {isUpdateModalOpen && currentPost && (
        <div className="fixed z-10 overflow-y-auto top-0 w-full left-0">
          <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-900 opacity-75" />
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div
              className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white shadow-md px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                <button className="absolute top-[15px] right-[15px]" title="close" onClick={toggleUpdateModal}>
                  <Img src={"/assets/imgs/icons/close.png"} height={20} width={20} alt="X" />
                </button>
                <UpdatePost
                  // postId={currentPost.id}
                  initialContent={currentPost.content}
                  onClose={() => {
                    setModalPost(null);
                    setCurrentPost(null); // Clear current post
                    toggleUpdateModal(); // Close modal
                  }}
                  onUpdate={handlePostUpdate} // Pass callback for updating the post
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CricapQ;
