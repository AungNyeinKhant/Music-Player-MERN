import { FC } from "react";
import { PlaylistCard as PlaylistCardType } from "../../types";


type PlaylistCardProps = {
  playlist: PlaylistCardType;
  onClick: () => void;
};

const PlaylistCard: FC<PlaylistCardProps> = ({ playlist,onClick }) => {
  

  return (
    <div 
      onClick={onClick}
      className='bg-primaryDark rounded-lg p-4 hover:bg-gray-800 transition-colors'
    >
      <div className='relative aspect-square mb-4'>
        <img
          src={playlist.image}
          alt={playlist.name}
          className='w-full h-full object-cover rounded-md'
        />
      </div>
      <h3 className='text-primaryText font-semibold truncate'>
        {playlist.name}
      </h3>
      <p className='text-gray-400 text-sm mt-1'>
        {/* {playlist.songCount} songs • {playlist.duration} */}
        {playlist.artist.name}
      </p>
    </div>
  );
};

export default PlaylistCard;
