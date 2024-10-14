"use client";
import type { HTMLAttributes } from "react";
import React, { useEffect, useState } from "react";
import Img from "../Img/Img";
import Input from "@/ui/atoms/Input/Input";
import EmojiPicker from "emoji-picker-react";
import ContentEditable from "react-contenteditable";
import { Paperclip } from "react-bootstrap-icons";
import {
  addPostComment,
  commentPost,
  deletePost,
  deletePostComment,
  getPosts,
  getUpdatePost,
  likePost,
} from "@/api/methods/auth";
import { FeedPost } from "@/@types/feed";
import Loading from "@/app/loading";
import ServerError from "../Error/ServerError";
import { parseContent } from "@/utils/ParseContent";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { AddModel } from "./Models";
import UpdatePost from "./UpdatePost";
import axios from "axios";
import PostComments from "./PostComments";
import DisplayComment from "./DisplayComment";

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
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
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
  const [commentsData, setCommentsData] = useState<{ [key: number]: any[] }>({});
  const [editMode, setEditMode] = useState<{ [key: number]: number | null }>({});
  const [commentOpenDropdownId, setCommentOpenDropdownId] = useState<number | null>(null);
  // const toggleDropdownComment = (commentId: number) => {
  //   setCommentOpenDropdownId((prevId) => (prevId === commentId ? null : commentId));
  // };
  const handlePostComment = async (postId: number) => {
    const commentText = messages[postId]?.replace(/&nbsp;/g, " ").trim();
    const auth = localStorage.getItem("auth");
    const userData = auth ? JSON.parse(auth) : null;
    const userId = userData?.user?.id;
    const token = userData?.jwt;

    // Check if user is logged in
    if (!userId) {
      console.log("Missing user");
      return;
    }

    try {
      const commentPayload = {
        commentText,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        post: postId,
        updatedAt: new Date().toISOString(),
      };

      if (editMode[postId] != null) {
        // Update existing comment
        const commentId = editMode[postId];
        console.log("Updating comment with ID: ", commentId);
        commentPayload.updatedAt = new Date().toISOString();

        const response = await axios.put(
          `https://ws.stage.cricap.com/api/comments/${commentId}`,
          { data: commentPayload },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          // Ensure the response structure matches your local state
          const updatedComment = {
            ...response.data.attributes,
            id: commentId, // Make sure to keep the comment ID
          };

          // Update local comments state
          setCommentsData((prevComments) => {
            const updatedComments = prevComments[postId].map((comment) =>
              comment.id === commentId ? updatedComment : comment
            );
            return {
              ...prevComments,
              [postId]: updatedComments,
            };
          });

          // Clear the message field and exit edit mode
          setMessages((prevMessages) => ({
            ...prevMessages,
            [postId]: "",
          }));
          setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [postId]: null,
          }));
        }
      } else {
        // Check if commentText is empty for new comment
        if (commentText) {
          // Create a new comment
          const response = await axios.post(
            "https://ws.stage.cricap.com/api/comments",
            { data: commentPayload },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data) {
            const newComment = {
              ...response.data.attributes,
              id: response.data.id, // Ensure new comment has its ID
            };

            setCommentsData((prevComments) => {
              const updatedComments = [...(prevComments[postId] || []), newComment];
              return {
                ...prevComments,
                [postId]: updatedComments,
              };
            });

            // Clear the message field after posting a new comment
            setMessages((prevMessages) => ({
              ...prevMessages,
              [postId]: "",
            }));
          }
        } else {
          console.log("Cannot post empty comment");
        }
      }
    } catch (error) {
      console.error("Failed to post/update comment:", error);
    }
  };
  // Function to handle editing a comment
  const handleEditComment = (postId: number, commentId: number, commentText: string) => {
    // Populate the input field with the comment content
    setMessages((prevMessages) => ({
      ...prevMessages,
      [postId]: commentText,
    }));

    // Set edit mode with the comment ID
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [postId]: commentId,
    }));
  };

  // Toggle dropdown for each comment
  const toggleDropdownComment = (commentId: number) => {
    setCommentOpenDropdownId(commentOpenDropdownId === commentId ? null : commentId);
  };
  // Handle delete comment API
  const handleDeleteComment = async (commentId: number, postId: number) => {
    try {
      await deletePostComment(commentId);

      setCommentsData((prevComments) => {
        const updatedComments = prevComments[postId]?.filter((c) => c.id !== commentId);
        return { ...prevComments, [postId]: updatedComments };
      });

      toast.success("Comment deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to delete comment");
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
  // Handle get Update post  API
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previousData, setPreviousData] = useState(null);
  const prevDataGet = async (postId: number) => {
    try {
      const response = await getUpdatePost(postId);
      setPreviousData(response.data);
    } catch (error) {
      console.error("Error fetching previous data:", error);
    }
  };
  const handleUpdateModal = (postId: number) => {
    if (isModalOpen) {
      setModalPost(null);
    } else if (openDropdownId) {
      setModalPost(openDropdownId?.toString());
      prevDataGet(postId);
    }
    setIsModalOpen((prev) => !prev);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
                    className="text-black dark:hover:bg-[#E7E7E7] rounded-lg font-medium  text-lg px-2 pb-2 text-center inline-flex items-center h-[25px]"
                  >
                    ...
                  </button>
                  {openDropdownId === post.id && (
                    <div className="z-10 divide-y divide-gray-100  rounded-lg shadow-lg w-44 bg-white text-end absolute top-[30px]">
                      <ul className="py-2 text-sm dark:text-gray-200">
                        <li className="cursor-pointer" onClick={() => handleUpdateModal(post.id)}>
                          <a className="block px-4 py-2 text-[#9E9E9E] hover:bg-gray-100 dark:hover:text-[#439B45]">
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
                  <p className="text-[#464646] w-[100%]">{post.message}</p>
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
                <div key={index} className="flex flex-col items-start gap-2 my-[30px]">
                  {/* Other post-related code */}
                  <PostComments
                    post={post}
                    messages={messages}
                    handleInputChange={handleInputChange}
                    handlePostComment={handlePostComment}
                    setMessages={setMessages}
                    editMode={editMode}
                  />
                  <DisplayComment
                    postId={post.id}
                    postComments={postComments}
                    toggleDropdownComment={toggleDropdownComment}
                    commentOpenDropdownId={commentOpenDropdownId}
                    handleEditComment={handleEditComment}
                    handleDeleteComment={handleDeleteComment}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <AddModel />
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
                <button
                  className="absolute top-[15px] right-[15px]"
                  title="close"
                  onClick={() => handleUpdateModal(openDropdownId as any)}
                >
                  <Img src={"/assets/imgs/icons/close.png"} height={20} width={20} alt="X" />
                </button>
                <UpdatePost
                  previousData={previousData}
                  onClose={() => {
                    toggleModal();
                  }}
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
