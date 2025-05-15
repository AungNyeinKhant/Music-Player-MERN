import { FC } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
} from "lucide-react";
import { useTrack } from "../../context/TrackContext";
import NoImage from "../../assets/image/no-album-image.svg";

const Player: FC = () => {
  const {
    chosenTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    handleProgressChange,
    handleVolumeChange,
    formatTime,
    handleNextTrack,
    handlePreviousTrack,
  } = useTrack()!;
  return (
    <div className='fixed bottom-0 left-0 right-0 bg-primary border-t border-[#282828] p-4 z-50'>
      <div className='flex justify-between items-center max-w-screen-xl mx-auto'>
        <div className='flex items-center w-[30%]'>
          <img
            src={chosenTrack?.playTrack?.album?.image || NoImage}
            alt='Current track'
            className='w-14 h-14 rounded-lg'
          />
          <div className='ml-4'>
            <h4 className='text-primaryText text-sm'>
              {chosenTrack?.playTrack?.name || "No track selected"}
            </h4>
            <p className='text-gray-400 text-xs'>
              {chosenTrack?.playTrack?.artist?.name || "Unknown artist"}
            </p>
          </div>
        </div>

        <div className='flex flex-col items-center w-[40%]'>
          <div className='flex items-center gap-4'>
            {/* <Shuffle className='w-5 h-5 text-gray-400 hover:text-primaryText cursor-pointer' /> */}
            <SkipBack
              className='w-5 h-5 text-gray-400 hover:text-primaryText cursor-pointer'
              onClick={handlePreviousTrack}
            />
            <div
              className='w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer'
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className='w-5 h-5 text-black' />
              ) : (
                <Play className='w-5 h-5 text-black' />
              )}
            </div>
            <SkipForward
              className='w-5 h-5 text-gray-400 hover:text-primaryText cursor-pointer'
              onClick={handleNextTrack}
            />
            {/* <Repeat className='w-5 h-5 text-gray-400 hover:text-primaryText cursor-pointer' /> */}
          </div>
          <div className='flex items-center gap-2 w-full mt-2'>
            <span className='text-xs text-gray-400'>
              {formatTime(currentTime)}
            </span>
            <div
              className='h-1 flex-grow rounded-full bg-[#4d4d4d] cursor-pointer'
              onClick={handleProgressChange}
            >
              <div
                className='h-full bg-white rounded-full'
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <span className='text-xs text-gray-400'>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className='flex items-center gap-2 w-[30%] justify-end'>
          <Volume2 className='w-5 h-5 text-gray-400' />
          <div
            className='h-1 w-24 rounded-full bg-[#4d4d4d] cursor-pointer'
            onClick={handleVolumeChange}
          >
            <div
              className='h-full bg-white rounded-full'
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
