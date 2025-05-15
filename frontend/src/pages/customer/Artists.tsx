import { FC, useEffect, useState } from "react";
import Template from "../../layouts/Template";
import ArtistCard from "../../components/cards/ArtistCard";
import { useNavigate } from "react-router-dom";
import { userArtistList } from "../../services/artistService";
import { Artist4User } from "../../types";

const Artists: FC = () => {
  const navigate = useNavigate();
  const [artists, setArtists] = useState<Artist4User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response: any = await userArtistList();
        setArtists(response.data.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, []);

  const handleSearchClick = async () => {
    const response: any =  await userArtistList({ search: searchQuery });
    setArtists(response.data.data);
  };

  return (
    <Template>
      <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 overflow-auto pb-28'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
          <h2 className='text-2xl font-bold text-primaryText mb-4 md:mb-0'>
            {" "}
            Artists
          </h2>
          <div className='md:w-1/3 relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search artists...'
              className='w-full p-2 pr-10 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary'
            />
            <button
              onClick={handleSearchClick}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </button>
          </div>
        </div>
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-6'>
          {artists.map((artist) => (
            <div key={artist.id} className='flex flex-col items-center'>
              <ArtistCard
                onClick={() => {
                  navigate(`/app/artist-detail/${artist.id}`);
                }}
                artist={artist}
              />
            </div>
          ))}
        </div>
      </div>
    </Template>
  );
};

export default Artists;
