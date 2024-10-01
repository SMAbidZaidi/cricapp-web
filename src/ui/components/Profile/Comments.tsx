import React from "react";
import Img from "../Img/Img";

const Comments = () => {
  return (
    <div>
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
    </div>
  );
};

export default Comments;
