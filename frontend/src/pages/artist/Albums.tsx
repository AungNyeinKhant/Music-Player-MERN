import React, { useState, useEffect } from "react";
import { artistAlbumList, deleteAlbum } from "../../services/albumService";
import Dashboard from "../../layouts/Dashboard";
import { Plus, Trash2, Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import DEFAULT_ALBUM_IMAGE from "../../assets/image/no-album-image.svg";

export type Album = {
  id: string;
  name: string;
  image: string | null;
  description: string;
  genre_id: string;
  created_at: string;
  genre: { name: string };
};

const Albums: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response: any = await artistAlbumList();
        console.log("fetchAlbums", response);
        if (response.data.success) {
          setAlbums(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  // Removed dummy data

  const handleRowClick = (id: string) => {
    alert(`Album ID: ${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, album: Album) => {
    e.stopPropagation(); // Prevent event bubbling
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the album "${album.name}"?`
    );

    if (isConfirmed) {
      try {
        const response: any = await deleteAlbum(album.id);
        if (response.data.success) {
          setAlbums(albums.filter((a) => a.id !== album.id));
        }
      } catch (error) {
        console.error("Failed to delete album:", error);
        alert("Failed to delete the album. Please try again.");
      }
    }
  };

  return (
    <Dashboard>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-dashboard-primaryText'>
            Your Albums
          </h1>
          <Link
            to='/artist/albums/create'
            className='flex items-center gap-2 bg-dashboard-secondary text-dashboard-primaryText px-4 py-2 rounded-md hover:bg-opacity-90 transition-all'
          >
            <Plus className='w-5 h-5' />
            Create Album
          </Link>
        </div>

        {/* Display Albums */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {albums.map((album) => (
            <div
              key={album.id}
              className='bg-dashboard-primary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow'
            >
              <img
                src={album.image || DEFAULT_ALBUM_IMAGE}
                alt={album.name}
                className='w-full h-48 object-cover'
              />
              <div className='p-4'>
                <h3 className='text-lg font-semibold text-dashboard-primaryText mb-2'>
                  {album.name}
                </h3>
                <p className='text-dashboard-primaryDarkText text-sm mb-3'>
                  {album.description.length > 100
                    ? album.description.slice(0, 100) + "..."
                    : album.description}
                </p>
                <div className='flex justify-between items-center'>
                  <span className='text-dashboard-primaryDarkText text-sm'>
                    Genre: {album.genre.name}
                  </span>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() =>
                        navigate(`/artist/albums/update/${album.id}`)
                      }
                      className='p-2 bg-dashboard-secondary text-dashboard-primaryText rounded-full hover:bg-opacity-90 transition-colors'
                    >
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, album)}
                      className='p-2 bg-red-500 text-dashboard-primaryText rounded-full hover:bg-opacity-90 transition-colors'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dashboard>
  );
};

export default Albums;
