import React from "react";

export type TrendingTrack = {
  title: string;
  artist: string;
  duration: string;
  cover: string;
};

export type PlaylistCard = {
  id: string;
  name: string;
  description: string;
  image: string;
  bg_image: string | null;
  artist_id: string;
  genre_id: string;
  created_at: string;
  artist: {
    name: string;
    image: string;
  };
  genre: {
    name: string;
  };
};

export type Playlist = {
  id: string;
  name: string;
};

export type SidebarItem = {
  icon: React.ReactNode;
  label: string;
  path: string;
};

export type UserAuth = {
  id: string;
  role: "user" | "admin" | "artist" | "";
  image?: string;
  name: string;
};

export type AuthContextType = {
  user: UserAuth | null;
  setUser: React.Dispatch<React.SetStateAction<UserAuth | null>>;
};

export type Track = {
  id: string;
  name: string;
  audio: string;
  genre_id: string;
  album_id: string;
  artist_id: string;
  listen_count: number;
  description: string;
  created_at: string;
  artist: {
    name: string;
    image: string;
  };
  genre: {
    name: string;
  };
  album: {
    name: string;
    image: string;
  };
};

export type TrackContextFormat = {
  playTrack: Track;
  queTracks: Track[];
};
export type TrackContextType = {
  chosenTrack: TrackContextFormat | null;
  setChosenTrack: React.Dispatch<
    React.SetStateAction<TrackContextFormat | null>
  >;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  togglePlay: () => void;
  handleProgressChange: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleVolumeChange: (e: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (time: number) => string;
  handleNextTrack: () => void;
  handlePreviousTrack: () => void;
};

export type Artist4User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  image?: string | null;
  bg_image?: string | null;
  created_at: string;
  updated_at: string;
};
