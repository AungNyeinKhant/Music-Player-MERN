import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Artist4User } from "../../types";
import NoImage from "../../assets/image/no-album-image.svg";

type ArtistCardProps = {
  artist: Artist4User;
  size?: "small" | "medium" | "large";
  onClick: () => void;
};

const ArtistCard: FC<ArtistCardProps> = ({
  artist,
  onClick,
  size = "medium",
}) => {
  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64",
  };

  const navigate = useNavigate();

  const formatListenCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M listeners`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K listeners`;
    }
    return `${count} listeners`;
  };

  return (
    <div
      onClick={onClick}
      className='group relative cursor-pointer w-[180px] sm:w-[220px] md:w-[240px] lg:w-[240px] mx-2'
    >
      <div
        className={`${sizeClasses[size]} rounded-lg overflow-hidden mx-auto relative`}
      >
        <img
          src={artist.image || NoImage}
          alt={artist.name}
          className='w-full h-full object-cover transform transition-transform group-hover:scale-105'
        />
      </div>
      <div className='mt-3 text-center'>
        <h3 className='text-primaryText font-semibold truncate'>
          {artist.name}
        </h3>
        {/* {artist.listen_count && (
          <p className='text-gray-400 text-sm truncate'>
            {formatListenCount(artist.listen_count)} listeners
          </p>
        )} */}
      </div>
    </div>
  );
};

export default ArtistCard;
