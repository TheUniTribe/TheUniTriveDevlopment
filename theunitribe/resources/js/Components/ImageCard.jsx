import React from "react";

const ImageCard = ({ src, alt }) => {
  return (
    <div className="rounded overflow-hidden shadow-lg">
      <img className="w-full object-cover" src={src} alt={alt} />
    </div>
  );
};

export default ImageCard;
