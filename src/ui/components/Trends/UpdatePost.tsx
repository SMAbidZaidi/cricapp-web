import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Img from "../Img/Img";
import Input from "@/ui/atoms/Input/Input";
import { FeedPost } from "@/@types/feed";
import { updatePost } from "@/api/methods/auth";
import { useQueryState } from "nuqs";

interface UpdatePostProps {
  initialContent: string;
  onClose: () => void;
  onUpdate: (updatedPost: FeedPost) => void;
}

interface UserDataState {
  username: string | undefined;
}

const UpdatePost: React.FC<UpdatePostProps> = ({ initialContent, onClose, onUpdate }) => {
  const [content, setContent] = useState(initialContent);
  const [modalPostId] = useQueryState("modal_post_id");
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserDataState>({ username: "" });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const decodeToken = () => {
    const auth = localStorage.getItem("auth");
    const userData = auth ? JSON.parse(auth) : null;
    if (userData?.user) {
      setUserData({ username: userData.user.username });
      console.log("userData", userData.user);
    }
  };
  useEffect(() => {
    decodeToken();
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    if (!data.message) {
      toast.error("Post content is empty");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("message", data.message);
      if (data.media && data.media.length > 0) {
        Array.from(data.media).forEach((file: any) => {
          formData.append("media", file);
        });
      }

      console.log("Updating post with formData:", formData);

      const response = await updatePost(modalPostId, formData);

      if (response?.data) {
        toast.success("Post updated successfully!");
        onUpdate(response.data);
        reset();
        onClose();
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-start my-3">
        <div className="tab-profile-image">
          <Img src={"/assets/imgs/icons/LoginUser.png"} height={50} width={50} alt="User" />
        </div>
        <div className="flex flex-col">
          <div className="profile-name font-semibold text-[18px] text-black">{userData?.username}</div>
          <div className="profile-nick-name font-semibold text-[16px] text-[#9E9E9E]">@{userData?.username}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block mb-1">Update Text</label>
            <textarea
              placeholder="Write the post..."
              className={`w-full border-2 my-1 border-[#9E9E9E] px-2 py-2 rounded-lg ${
                errors.message ? "border-red-500" : ""
              }`}
              {...register("message", { required: "This field is required" })}
            />
          </div>
          <div className="col-span-1">
            <label className="block mb-1">Update Media</label>
            <Input
              type="file"
              className="w-full border-2 my-1 border-[#9E9E9E] px-2 py-2 rounded-lg"
              {...register("media")}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="py-1 px-4 my-3 bg-[#439B45] text-white rounded-[26px] font-medium text-[20px]"
        >
          {isLoading ? "Loading..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
