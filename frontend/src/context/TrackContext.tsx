import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { Track, TrackContextFormat, TrackContextType } from "../types";
import { playTrack } from "../services/trackService";

export const TrackContext = createContext<TrackContextType | null>(null);

const findTrackIndex = (tracks: Track[], targetTrack: Track): number => {
  return tracks.findIndex((track) => track.id === targetTrack.id);
};

export default function TrackProvider({ children }: { children: ReactNode }) {
  const [chosenTrack, setChosenTrack] = useState<TrackContextFormat | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleVisibilityChange = () => {
      if (!document.hidden && isPlaying) {
        audio.play();
      }
    };

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (chosenTrack?.queTracks && chosenTrack.playTrack) {
        const currentIndex = findTrackIndex(
          chosenTrack.queTracks,
          chosenTrack.playTrack
        );
        const nextIndex = (currentIndex + 1) % chosenTrack.queTracks.length;
        setChosenTrack({
          playTrack: chosenTrack.queTracks[nextIndex],
          queTracks: chosenTrack.queTracks,
        });
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPlaying, chosenTrack]);

  useEffect(() => {
    if (chosenTrack && audioRef.current) {
      audioRef.current.src = chosenTrack.playTrack?.audio || "";
      audioRef.current.play();
      setIsPlaying(true);

      // Call playTrack service to update play count
      if (chosenTrack.playTrack?.id) {
        playTrack(chosenTrack.playTrack.id).catch((error) => {
          console.error("Error updating play count:", error);
        });
      }
    }
  }, [chosenTrack]);

  const togglePlay = () => {
    if (!audioRef.current || !chosenTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const percentageClicked = clickPosition / progressBar.offsetWidth;
    const newTime = percentageClicked * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const volumeBar = e.currentTarget;
    const clickPosition = e.clientX - volumeBar.getBoundingClientRect().left;
    const newVolume = Math.max(
      0,
      Math.min(1, clickPosition / volumeBar.offsetWidth)
    );
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleNextTrack = () => {
    if (!chosenTrack?.queTracks || !chosenTrack.playTrack) return;

    const currentIndex = findTrackIndex(
      chosenTrack.queTracks,
      chosenTrack.playTrack
    );
    const nextIndex = (currentIndex + 1) % chosenTrack.queTracks.length;

    setChosenTrack({
      playTrack: chosenTrack.queTracks[nextIndex],
      queTracks: chosenTrack.queTracks,
    });
  };

  const handlePreviousTrack = () => {
    if (!chosenTrack?.queTracks || !chosenTrack.playTrack) return;

    const currentIndex = findTrackIndex(
      chosenTrack.queTracks,
      chosenTrack.playTrack
    );
    const previousIndex =
      currentIndex === 0 ? chosenTrack.queTracks.length - 1 : currentIndex - 1;

    setChosenTrack({
      playTrack: chosenTrack.queTracks[previousIndex],
      queTracks: chosenTrack.queTracks,
    });
  };

  const value: TrackContextType = {
    chosenTrack,
    setChosenTrack,
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
  };

  return (
    <TrackContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload='metadata' />
    </TrackContext.Provider>
  );
}

export const useTrack = () => {
  const context = useContext(TrackContext);

  if (context === undefined) {
    throw new Error("useTrack must be used within an TrackProvider");
  }

  return context;
};
