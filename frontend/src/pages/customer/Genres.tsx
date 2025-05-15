import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Template from "../../layouts/Template";
import { artistGenre } from "../../services/albumService";

interface Genre {
  id: string;
  name: string;
  gradient: string;
}

const gradientCombinations = [
  "from-pink-500 to-purple-500",
  "from-blue-500 to-teal-500",
  "from-yellow-400 to-pink-500",
  "from-red-600 to-orange-500",
  "from-green-400 to-blue-500",
  "from-indigo-500 to-purple-500",
  "from-red-500 to-black",
  "from-pink-400 to-red-500",
  "from-violet-500 to-purple-500",
  "from-cyan-500 to-blue-500",
];

const Genres: FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response: any = await artistGenre();
        const genresWithGradients = response.data.data.map(
          (genre: { id: string; name: string }) => ({
            ...genre,
            gradient:
              gradientCombinations[
                Math.floor(Math.random() * gradientCombinations.length)
              ],
          })
        );
        setGenres(genresWithGradients);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Template>
      <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 overflow-auto pb-28'>
        <h2 className='text-2xl font-bold text-primaryText mb-6'>Genres</h2>

        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {filteredGenres.map((genre) => (
            <div
              key={genre.id}
              onClick={() => navigate(`/app/genre/${genre.id}`)}
              className={`relative h-48 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 bg-gradient-to-br ${genre.gradient} hover:shadow-lg`}
            >
              <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center'>
                <h2 className='text-white text-xl font-bold'>{genre.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Template>
  );
};

export default Genres;
