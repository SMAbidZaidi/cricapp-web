"use client";
import React, { useState } from "react";
import Img from "../Img/Img";

const SettingPage = () => {
  const [activeTab, setActiveTab] = useState("Accounts");
  return (
    <div>
      <div className=" flex flex-col gap-3 justify-center place-items-center h-full bg-[#439B45]">
        <Img src={"/assets/imgs/icons/logo.png"} height={230} width={230} alt="" />
        <span className="cric-bg absolute top-[20px] md:top-[0px] right-[0] md:right-[250px]">
          <Img src={"/assets/imgs/bg/cric-bg.png"} height={240} width={240} alt="" />
        </span>
      </div>
      <div className="profile-wrapper relative flex flex-col md:flex-row items-start justify-between bg-white">
        <div className="profile-d flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-2 relative top-[-50px] md:top-[-110px] left-[20px] md:left-[50px] ">
          <div className="profile-image w-[130px] h-[130px] md:w-[200px] md:h-[200px] ">
            <Img src={"/assets/imgs/icons/setting-black.svg"} height={250} width={250} alt="" />
            <div className="font-semibold text-[26px] text-center text-black">Settings</div>
          </div>
        </div>
      </div>
      <div className="setting-wrapper bg-white">
        <div className="setting-box-card">
          <div className={`flex gap-2 items-center py-2 px-4 font-semibold text-[20px] border-b border-b-[#E7E7E7] `}>
            <Img src={"/assets/imgs/icons/account.svg"} height={25} width={25} alt="" />
            Accounts
          </div>
          <div className="flex flex-col md:flex-row gap-0 md:gap-2 profile-content-wrapper py-[15px] md:py-[40px] px-[10px]">
            <div className="w-[100%] md:w-[50%] flex gap-2 items-center justify-between border-2 border-[#E7E7E7] rounded-md my-[8px] md:my-[15px] py-1 px-2 cursor-pointer">
              <div className="profile-name font-semibold text-[20px] text-[#9E9E9E] ">Edit Profile</div>
              <Img src={"/assets/imgs/icons/arrow.svg"} height={30} width={30} alt="" />
            </div>
            <div className="w-[100%] md:w-[50%] flex gap-2 items-center justify-between border-2 border-[#E7E7E7] rounded-md my-[8px] md:my-[15px] py-1 px-2 cursor-pointer">
              <div className="profile-name font-semibold text-[20px] text-[#9E9E9E] ">Change Password</div>
              <Img src={"/assets/imgs/icons/arrow.svg"} height={30} width={30} alt="" />
            </div>
          </div>
        </div>
        <div className="setting-box-card">
          <div className={`flex gap-2 items-center py-2 px-4 font-semibold text-[20px] border-b border-b-[#E7E7E7] `}>
            <Img src={"/assets/imgs/icons/notification.svg"} height={25} width={25} alt="" />
            Notifications
          </div>
          <div className="flex flex-col md:flex-row gap-0 md:gap-2 profile-content-wrapper py-[15px] md:py-[40px] px-[10px]">
            <div className="w-[100%] md:w-[50%] flex gap-2 items-center justify-between border-2 border-[#E7E7E7] rounded-md my-[8px] md:my-[15px] py-1 px-2 cursor-pointer">
              <div className="profile-name font-semibold text-[20px] text-[#9E9E9E] ">Notification</div>
              <label htmlFor="toogleA" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input id="toogleA" type="checkbox" className="sr-only" />
                  <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                  <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="setting-box-card">
          <div className={`flex gap-2 items-center py-2 px-4 font-semibold text-[20px] border-b border-b-[#E7E7E7] `}>
            <Img src={"/assets/imgs/icons/more-options.svg"} height={25} width={25} alt="" />
            More
          </div>
          <div className="flex flex-col md:flex-row gap-0 md:gap-2 profile-content-wrapper py-[15px] md:py-[40px] px-[10px]">
            <div className="w-[100%] md:w-[50%] flex gap-2 items-center justify-between border-2 border-[#E7E7E7] rounded-md my-[8px] md:my-[15px] py-1 px-2 cursor-pointer">
              <div className="profile-name font-semibold text-[20px] text-[#9E9E9E] ">Language</div>
              <Img src={"/assets/imgs/icons/arrow.svg"} height={30} width={30} alt="" />
            </div>
            <div className="w-[100%] md:w-[50%] flex gap-2 items-center justify-between border-2 border-[#E7E7E7] rounded-md my-[8px] md:my-[15px] py-1 px-2 cursor-pointer">
              <div className="profile-name font-semibold text-[20px] text-[#9E9E9E] ">Country</div>
              <Img src={"/assets/imgs/icons/arrow.svg"} height={30} width={30} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
