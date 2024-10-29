"use client";
import Image, { ImageProps } from "next/image";
import type { HTMLAttributes } from "react";
import React from "react";
import { useState } from "react";

type ImageWithStateProps = ImageProps;

interface ImgProps extends ImageWithStateProps {}

const Img: React.FC<ImgProps> = ({ alt, src, ...props }) => {
  const [error, setError] = useState(false);

  return !error ? (
    <Image src={src} alt={alt} onError={() => setError(true)} {...props} />
  ) : (
    <Image src={"/assets/imgs/icons/error-placeholder.jpg"} alt={"img"} {...props} />
  );
};
export default Img;
