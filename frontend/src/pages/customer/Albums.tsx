import { FC, useState, useEffect } from "react";
import Template from "../../layouts/Template";
import PlaylistCard from "../../components/cards/PlaylistCard";
import { PlaylistCard as PlaylistCardType } from "../../types";
import { userAlbumList } from "../../services/albumService";
import { useNavigate } from "react-router-dom";

const Albums: FC = () => {
  const [albums, setAlbums] = useState<PlaylistCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response: any = await userAlbumList();
        setAlbums(response.data.data);
      } catch (err) {
        setError("Failed to load albums");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const handleSearchClick = async () => {
    console.log(searchQuery);
    const response: any = await userAlbumList({search:searchQuery})
    setAlbums(response.data.data);
  };

  return (
    <Template>
      <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 overflow-auto pb-28'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
          <h2 className='text-2xl font-bold text-primaryText mb-4 md:mb-0'>
            Albums
          </h2>
          <div className='md:w-1/3 relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search albums...'
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
        {loading ? (
          <div className='text-center py-8 text-gray-400'>
            Loading albums...
          </div>
        ) : error ? (
          <div className='text-center py-8 text-red-500'>{error}</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {albums.map((album) => (
              <PlaylistCard
                key={album.id}
                playlist={album}
                onClick={() => {
                  navigate(`/app/album-detail/${album.id}`);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Template>
  );
};

export default Albums;
