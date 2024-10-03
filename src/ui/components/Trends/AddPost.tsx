import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AuthModalWrapper from "../auth/AuthModalWrapper";
import Img from "../Img/Img";
import Input from "@/ui/atoms/Input/Input";
import { getAddPost, getAddPostMedia } from "@/api/methods/auth";
import useHandleModal from "@/hooks/useHandleModal";

const AddPost = () => {
  const { closeModal } = useHandleModal({ modal: "add_post" });
  const handleClose = () => {
    closeModal();
  };
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      let mediaUrl = null;
      if (data.media && data.media.length > 0) {
        const formData = new FormData();
        formData.append("files", data.media[0]);
        const responseMedia = await getAddPostMedia(formData);

        if (responseMedia?.data && responseMedia.data.length > 0) {
          mediaUrl = responseMedia.data[0].url;
        } else {
          console.error("Media upload failed:", responseMedia);
        }
      }
      const postData = {
        data: {
          message: data.message,
          media: mediaUrl ? [mediaUrl] : null,
        },
      };
      console.log("data before send API", postData);

      const response = await getAddPost(postData);

      if (response?.data) {
        console.log("Post created successfully:", response.data);
      } else {
        console.error("Error: No data in API response", response);
      }
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AuthModalWrapper className="relative flex flex-col gap-3 justify-between">
        <button title="close" onClick={handleClose} className="absolute right-[15px] top-[15px] text-end">
          <Img src={"/assets/imgs/icons/close.png"} height={20} width={20} alt="X" />
        </button>
        <div className="flex items-start">
          <div className="tab-profile-image">
            <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="" />
          </div>
          <div className="flex flex-col">
            <div className="profile-name font-semibold text-[18px] text-black">userName</div>
            <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">@userName</div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-1">
              <span>Add Text</span>
              <textarea
                placeholder="Write the post..."
                className="w-full border-2 my-1 border-[#9E9E9E] px-2 py-2 h-[48px] rounded-lg"
                {...register("message", { required: "This field is required" })}
              />
              {errors.text && <p className="text-red-500 text-sm">This field is required</p>}
            </div>
            <div className="col-span-1 sm:col-span-1">
              <span>Add Media</span>
              <Input
                type="file"
                className="w-full border-2 my-1 border-[#9E9E9E] px-2 py-2 h-[48px] rounded-lg"
                {...register("media")}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="py-1 px-4 my-3 bg-[#439B45] text-white rounded-[26px] font-medium text-[20px] text-end"
          >
            {isLoading ? "Adding..." : "Submit"}
          </button>
        </form>
      </AuthModalWrapper>
    </div>
  );
};

export default AddPost;
