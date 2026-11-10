"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  containerClassName?: string;
}

const DEFAULT_FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='100%25' height='100%25' fill='%231F242F'/%3E%3Ctext x='50%25' y='50%25' fill='%238B1D2C' font-family='sans-serif' font-size='24' font-weight='bold' text-anchor='middle' dy='.3em'%3EDataWithLy%3C/text%3E%3Ctext x='50%25' y='60%25' fill='%239CA3AF' font-family='sans-serif' font-size='14' text-anchor='middle'%3E(H%C3%ACnh %E1%BA%A3nh %C4%91ang %C4%91%C6%B0%E1%BB%A3c c%E1%BA%ADp nh%E1%BA%ADt)%3C/text%3E%3C/svg%3E";

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  className = "",
  containerClassName = "",
  fill,
  ...rest
}) => {
  const [prevSrc, setPrevSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
    setIsLoading(true);
  }

  const effectiveSrc = hasError ? fallbackSrc : src;

  return (
    <div
      className={`relative overflow-hidden ${
        fill ? "w-full h-full" : ""
      } ${containerClassName}`}
    >
      <Image
        {...rest}
        fill={fill}
        src={effectiveSrc}
        alt={alt || "DataWithLy Image"}
        className={`transition-all duration-300 ${
          isLoading ? "scale-105 blur-sm grayscale" : "scale-100 blur-0 grayscale-0"
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default SafeImage;

