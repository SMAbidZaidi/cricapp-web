"use client";
import useHandleModal from "@/hooks/useHandleModal";
import { ModalNames } from "../Modal/types";
import dynamic from "next/dynamic";
import Img from "../Img/Img";

interface NavigationIconProps {
  src: string;
  title: string;
  modal: ModalNames;
}

const NavigationIcon: React.FC<NavigationIconProps> = ({ src, title, modal }) => {
  const { openModal } = useHandleModal({ modal });

  const handleModal = () => {
    openModal();
  };
  return (
    <button onClick={handleModal}>
      <Img src={src} width={25} height={25} alt={title} title={title} role={title} />
    </button>
  );
};

export default dynamic(() => Promise.resolve(NavigationIcon), {
  ssr: false,
});
