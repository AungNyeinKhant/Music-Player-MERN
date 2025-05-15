import { FC, useState } from "react";
import { Track } from "../../types";
import { MoreVertical } from "lucide-react";
import NoImage from "../../assets/image/no-album-image.svg";
import AddToPlaylist from "../../pages/customer/AddToPlaylist";

type MusicCardProps = {
  track: Track;
  size?: "small" | "medium" | "large";
  onFavoriteClick?: (id: string) => void;
  onMenuClick?: (id: string) => void;
  onClick?: (track: Track) => void;
};

const MusicCard: FC<MusicCardProps> = ({
  track,
  size = "medium",
  onFavoriteClick,
  onMenuClick,
  onClick,
}) => {
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);

  const sizeClasses = {
    small: "w-32 h-32",
    medium: "w-48 h-48",
    large: "w-64 h-64",
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddToPlaylistOpen(true);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(track);
    }
  };

  return (
    <>
      <div 
        className='group relative cursor-pointer w-[180px] sm:w-[220px] md:w-[240px] lg:w-[240px] mx-2'
        
      >
        <div
          className={`${sizeClasses[size]} rounded-lg overflow-hidden mx-auto relative`}
        >
          <img
          onClick={handleClick}
            src={track.album.image ? track.album.image : NoImage}
            alt={track.name}
            className='w-full h-full object-cover transform transition-transform group-hover:scale-105'
          />
          <div className='absolute top-2 right-2 flex gap-2'>
            <div
              onClick={handleMenuClick}
              className='p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all'
            >
              <MoreVertical size={16} />
            </div>
          </div>
        </div>
        <div className='mt-3 text-center'>
          <h3 className='text-primaryText font-semibold truncate'>
            {track.name}
          </h3>
          <p className='text-gray-400 text-sm truncate'>{track.artist.name}</p>
          <p className='text-gray-400 text-sm truncate pb-2'>{track.listen_count} <span className="text-secondary text-xs">streams</span></p>
        </div>
      </div>
      <AddToPlaylist
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
        track={track}
      />
    </>
  );
};

export default MusicCard;
