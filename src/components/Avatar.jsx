import { useState } from "react";

const FALLBACK_BG = "FF8A00";
const FALLBACK_COLOR = "1a1a00";

function getFallbackUrl(name) {
  const encoded = encodeURIComponent(name || "?");
  return `https://ui-avatars.com/api/?name=${encoded}&background=${FALLBACK_BG}&color=${FALLBACK_COLOR}&size=200&bold=true&format=png`;
}

const Avatar = ({ src, name = "User", alt, className = "", size = "w-10 h-10" }) => {
  const [imgSrc, setImgSrc] = useState(src || getFallbackUrl(name));
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (!failed) {
      setFailed(true);
      setImgSrc(getFallbackUrl(name));
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || name}
      onError={handleError}
      className={`${size} rounded-full object-cover bg-surface ${className}`}
      loading="lazy"
    />
  );
};

export default Avatar;
