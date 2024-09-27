"use client";

import Button from "@/ui/atoms/Button/Button";
import type { HTMLAttributes } from "react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Img from "../Img/Img";
import Input from "@/ui/atoms/Input/Input";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProfilePageProps extends HTMLAttributes<HTMLDivElement> {}
type UpdateUserInputs = {
  username: string;
  email: string;
  password: string;
};

const ProfilePage: React.FC<ProfilePageProps> = ({ ...props }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const auth = localStorage.getItem("auth");

    if (!auth) {
      router.push("/");
    }
  }, [router]);

  const auth = typeof window !== "undefined" ? localStorage.getItem("auth") : null;

  const userData = auth ? JSON.parse(auth) : null;

  const { register, handleSubmit } = useForm<UpdateUserInputs>({
    defaultValues: { email: userData?.user?.email, username: userData?.user?.username, password: "" },
  });

  const onSubmit = useCallback(async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <div {...props} className=" flex flex-col gap-3 justify-center place-items-center h-full bg-[#439B45]">
        <Img src={"/assets/imgs/icons/logo.png"} height={230} width={230} alt="" />
        <span className="cric-bg absolute top-[20px] md:top-[0px] right-[0] md:right-[250px]">
          <Img src={"/assets/imgs/bg/cric-bg.png"} height={240} width={240} alt="" />
        </span>
      </div>
      <div className="profile-wrapper relative flex flex-col md:flex-row items-start justify-between bg-white">
        <div className="profile-d flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-2 relative top-[-70px] md:top-[-110px] left-[20px] md:left-[50px] ">
          <div className="profile-image w-[130px] h-[130px] md:w-[200px] md:h-[200px] ">
            <Img src={"/assets/imgs/icons/LoginUser.png"} height={250} width={250} alt="" />
            <div className="font-semibold text-[16px] md:text-[24px] text-black">Cricket Means All </div>
          </div>
          <div className="profile-content-wrapper">
            <div>
              <div className="profile-name font-semibold text-[26px] text-black">Michile dangoy</div>
              <div className="profile-nick-name font-semibold text-[20px] text-[#9E9E9E]">@Michile</div>
            </div>
            <div className="flex items-center gap-2">
              <Img src={"/assets/imgs/icons/celander.svg"} height={20} width={20} alt="" />
              <span className="text-[#9E9E9E] text-[20px]">Joined January 2024 </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[#9E9E9E] text-[18px] ">
                <span className="text-black">5</span> Likes
              </div>
              <div className="text-[#9E9E9E] text-[18px] ">
                <span className="text-black">6</span> Follwers
              </div>
              <div className="text-[#9E9E9E] text-[18px] ">
                <span className="text-black">6</span> Following
              </div>
            </div>
          </div>
        </div>
        <div className="my-4 flex flex-col items-start md:items-end gap-3">
          <Link
            href={"/profile/edit"}
            className=" flex gap-2 mx-3 py-[4px] px-[20px] bg-[#439B45] text-white rounded-[26px] font-medium text-[20px]  "
          >
            <Img src={"/assets/imgs/icons/edit-profile.svg"} height={30} width={30} alt="" />
            Edit Profile
          </Link>
          <Link
            href={"/profile/setting"}
            className=" flex gap-2 py-1 px-4 mx-3 text-center bg-[#439B45] text-white rounded-[26px] font-medium text-[20px]  "
          >
            <Img src={"/assets/imgs/icons/setting.svg"} height={25} width={25} alt="" />
            Settings
          </Link>
        </div>
      </div>
      {/* Tabs Section */}
      <div className="tabs-wrapper bg-white border-t border-t-[#E7E7E7] ">
        <div className="flex justify-start md:space-x-8 py-3">
          <button
            onClick={() => setActiveTab("posts")}
            className={`py-2 px-4 font-semibold text-[20px] ${
              activeTab === "posts" ? "border-b-4 border-[#439B45] text-[#202020]" : "text-[#202020]"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("mentions")}
            className={`py-2 px-4 font-semibold text-[20px] ${
              activeTab === "mentions" ? "border-b-4 border-[#439B45] text-[#202020]" : "text-[#202020]"
            }`}
          >
            Mentions
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`py-2 px-4 font-semibold text-[20px] ${
              activeTab === "comments" ? "border-b-4 border-[#439B45] text-[#202020]" : "text-[#202020]"
            }`}
          >
            Comments
          </button>
        </div>

        {/* Tab Content Section */}
        <div className="tab-content-wrapper p-4">
          {/* post section  */}
          {activeTab === "posts" && (
            <div className="flex items-start gap-2 my-4">
              <div className="tab-profile-image">
                <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
              </div>
              <div className="profile-content-wrapper w-[100%]">
                <div className="flex gap-2 items-center">
                  <div className="profile-name font-semibold text-[22px] text-black">Michile dangoy</div>
                  <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">@Michile</div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <span className="text-[#464646] text-[18px]">Exciting News for All Cricket Fans!</span>
                  <p className="text-[#464646] w-[100%] md:w-[50%]">
                    introducing #CricapApp,your ultimate companion for live crickt scores, thrilling match highlight,
                    and real-time updates whether you,re at home or on the go, never miss a moment of your favorite
                    cricket matches.
                  </p>
                  <div className="flex gap-4 items-center">
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/heart.svg"}
                      height={20}
                      width={20}
                      alt=""
                    />
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/comment.svg"}
                      height={20}
                      width={20}
                      alt=""
                    />
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/repeat.svg"}
                      height={20}
                      width={20}
                      alt=""
                    />
                    <Img
                      className="cursor-pointer"
                      src={"/assets/imgs/icons/share.svg"}
                      height={20}
                      width={20}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* mentions section  */}
          {activeTab === "mentions" && (
            <>
              <div className=" flex items-start gap-2 my-4">
                <div className="tab-profile-image">
                  <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
                </div>
                <div className="profile-content-wrapper w-[100%]">
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-[#464646] w-[100%] md:w-[65%]">
                      <span className="text-[#525252] font-bold text-[18px]">Jon hamm </span>
                      mentioned you in her comment on invoices forecast graph
                    </p>
                    <div className="text-[#9E9E9E] text-[16px] font-normal ">
                      <span>2</span> days ago
                    </div>
                  </div>
                </div>
              </div>
              <div className=" flex items-start gap-2 my-4">
                <div className="tab-profile-image">
                  <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
                </div>
                <div className="profile-content-wrapper w-[100%]">
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-[#464646] w-[100%] md:w-[65%]">
                      <span className="text-[#525252] font-bold text-[18px]">Jon hamm </span>
                      mentioned you in her comment on invoices forecast graph
                    </p>
                    <div className="text-[#9E9E9E] text-[16px] font-normal ">
                      <span>2</span> days ago
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Comments section  */}
          {activeTab === "comments" && (
            <>
              <div className="flex items-start gap-2 my-4">
                <div className="tab-profile-image">
                  <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
                </div>
                <div className="profile-content-wrapper w-[100%]">
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-[#464646] w-[100%] md:w-[65%]">
                      <span className="text-[#525252] font-bold text-[18px]">Jon hamm </span>
                      mentioned you in her comment on invoices forecast graph
                    </p>
                    <div className="text-[#9E9E9E] text-[16px] font-normal ">
                      <span>2</span> days ago
                    </div>
                  </div>
                </div>
              </div>
              <div className=" flex items-start gap-2 my-4">
                <div className="tab-profile-image">
                  <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
                </div>
                <div className="profile-content-wrapper w-[100%]">
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-[#464646] w-[100%] md:w-[65%]">
                      <span className="text-[#525252] font-bold text-[18px]">Jon hamm </span>
                      mentioned you in her comment on invoices forecast graph
                    </p>
                    <div className="text-[#9E9E9E] text-[16px] font-normal ">
                      <span>2</span> days ago
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ProfilePage), {
  ssr: false,
});
