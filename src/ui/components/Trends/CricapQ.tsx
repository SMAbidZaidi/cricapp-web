"use client";
import type { ChangeEvent, HTMLAttributes } from "react";
import React, { useRef, useState } from "react";
import Img from "../Img/Img";
import Input from "@/ui/atoms/Input/Input";
import EmojiPicker from "emoji-picker-react";
import ContentEditable from "react-contenteditable";
import { AnyAaaaRecord } from "dns";
import { Paperclip } from "react-bootstrap-icons";

interface CricapQProps extends HTMLAttributes<HTMLDivElement> {}

const CricapQ: React.FC<CricapQProps> = ({ ...props }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Handle like functionality
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };
  const [message, setMessage] = useState("");
  const handleInputChange: any = (event: AnyAaaaRecord) => {
    // @ts-ignore
    setMessage(event?.target?.value);
  };

  return (
    <div {...props} className="w-full h-full grid grid-cols-1 md:grid-cols-6 gap-2 bg-white">
      <div className="md:col-start-2 col-span-4 mx-[8px]">
        <div className="flex flex-col items-start gap-2 my-[50px]">
          <div className="flex items-start">
            <div className="tab-profile-image">
              <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
            </div>
            <div className="flex flex-col">
              <div className="profile-name font-semibold text-[18px] text-black">Michile dangoy</div>
              <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">@Michile</div>
            </div>
          </div>
          <div className="profile-content-wrapper md:w-full">
            {/* content and img box */}
            <div className="flex flex-col items-start gap-2 py-2 border-b-2 border-[#E7E7E7]">
              <p className="text-[#464646] w-[100%]">
                introducing #CricapApp,your ultimate companion for live crickt scores, thrilling match highlight, and
                real-time updates whether you,re at home or on the go, never miss a moment of your favorite cricket
                matches.
              </p>
              <div className="cricq-post-img border-2 border-[#E7E7E7] rounded-[15px] p-2">
                <Img
                  className="rounded-[15px]"
                  src={"/assets/imgs/icons/postQ.jpg"}
                  height={350}
                  width={700}
                  alt="soon"
                />
              </div>
              <div className="w-[100%] flex gap-4 items-center justify-between ">
                <div className="flex gap-4 items-center">
                  <span
                    className="flex gap-1 items-center text-[16px] text-[#464646] cursor-pointer"
                    onClick={handleLike}
                  >
                    <Img
                      src={isLiked ? "/assets/imgs/icons/heart-filled.svg" : "/assets/imgs/icons/heart.svg"}
                      height={20}
                      width={20}
                      alt="like"
                    />
                    <span>{likesCount}</span>
                  </span>
                  <span className="flex gap-1 items-center">
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/comment.svg"}
                      height={20}
                      width={20}
                      alt=""
                    />
                    <span> 0</span>
                  </span>
                  <Img className="cursor-pointer" src={"/assets/imgs/icons/repeat.svg"} height={20} width={20} alt="" />
                  <Img
                    className="cursor-pointer"
                    src={"/assets/imgs/icons/share-btn.svg"}
                    height={20}
                    width={20}
                    alt=""
                  />
                </div>
                <div className="text-[#9E9E9E]">
                  <span>5</span> Days Ago
                </div>
              </div>
              <p className="text-[#9E9E9E]">Liked by careypolis and 49 others</p>
            </div>

            {/* Comment input box */}
            <div className="border-t border-[#E7E7E7] pt-4 mb-4">
              <div className="flex items-center gap-2">
                <ul className="w-full flex items-center">
                  <li className="flex-1 relative">
                    <ContentEditable
                      className="flex items-center py-2 px-4 rounded-lg border-2 border-[#E7E7E7]"
                      tagName="article"
                      html={message}
                      onChange={handleInputChange}
                    />
                    {/* Placeholder */}
                    {message === "" && (
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
                          onEmojiClick={({ getImageUrl }) =>
                            setMessage(
                              (prevMessage) =>
                                prevMessage + `<img style="height: 20px !important;" src=${getImageUrl()} />`
                            )
                          }
                        />
                      </ul>
                    </div>
                  </li>
                </ul>
                <button className="text-[#007BFF] font-semibold">Post</button>
              </div>
            </div>
            {/* Display comments */}
            <div className="flex gap-2">
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
                <div>
                  <div className="flex gap-2 justify-between items-center">
                    <span className="font-semibold text-black text-[16px]">Meda Jackson</span>
                    <span className="text-[#9E9E9E] text-sm">3h</span>
                  </div>
                  <p className="text-[#464646] text-[14px] mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam.
                  </p>
                  <div className="mt-2 flex gap-4 text-sm text-[#9E9E9E]">
                    <span className="cursor-pointer">Likes</span>
                    <span className="cursor-pointer">Reply</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CricapQ;
