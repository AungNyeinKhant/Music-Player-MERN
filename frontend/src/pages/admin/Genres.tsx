import { FC, useState, useEffect } from "react";
import AdminDashboard from "../../layouts/AdminDashboard";
import { Genre, createGenre, updateGenre } from "../../services/genreService";
import { artistGenre } from "../../services/albumService";
import { Edit } from "lucide-react";

const Genres: FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response: any = await artistGenre();
      setGenres(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch genres");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGenre = async () => {
    const name = prompt("Enter genre name:");
    if (!name) return;

    try {
      const newGenre = await createGenre(name);
      fetchGenres();
    } catch (err) {
      setError("Failed to create genre");
    }
  };

  return (
    <AdminDashboard>
      <div className='bg-dashboard-primary p-4 md:p-8 rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Genres</h1>
          <button
            onClick={handleCreateGenre}
            className='bg-dashboard-secondary text-dashboard-secondaryText px-4 py-2 rounded hover:bg-dashboard-secondaryDark transition-colors'
          >
            Create Genre
          </button>
        </div>

        {error && <div className='text-red-500 mb-4'>{error}</div>}

        {loading ? (
          <div className='text-center py-4'>Loading...</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-dashboard-secondary text-dashboard-secondaryText'>
                  <th className='px-4 py-2 text-left'>#</th>
                  <th className='px-4 py-2 text-left'>Name</th>
                  <th className='px-4 py-2 text-left'>Created At</th>
                  <th className='px-4 py-2 text-left'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {genres.map((genre, index) => (
                  <tr
                    key={genre.id}
                    className='border-b border-dashboard-border hover:bg-dashboard-secondary/10'
                  >
                    <td className='px-4 py-2'>{index + 1}</td>
                    <td className='px-4 py-2'>{genre.name}</td>
                    <td className='px-4 py-2'>
                      {new Date(genre.created_at).toLocaleDateString()}
                    </td>
                    <td className='px-4 py-2'>
                      <button
                        onClick={async () => {
                          const newName = prompt(
                            "Enter new genre name:",
                            genre.name
                          );
                          if (newName && newName !== genre.name) {
                            const response = await updateGenre(
                              genre.id,
                              newName
                            );
                            fetchGenres();
                          }
                        }}
                        className='p-2 hover:bg-dashboard-secondary/20 rounded-full transition-colors'
                      >
                        <Edit className='w-5 h-5 text-dashboard-secondary' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
};

export default Genres;
