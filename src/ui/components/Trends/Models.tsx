import React, { useEffect, useState } from "react";
import Img from "../Img/Img";
import AddPost from "./AddPost";
import UpdatePost from "./UpdatePost";
import { useQueryState } from "nuqs";
import { getUpdatePost } from "@/api/methods/auth";

export const AddModel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div>
      <div className="relative my-4 flex flex-col items-start md:items-end gap-3">
        <button
          onClick={toggleModal} // Toggle the modal when clicked
          className="py-1 px-4 mx-3 bg-[#439B45] text-white rounded-[26px] font-medium text-[20px]"
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
                <AddPost
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
