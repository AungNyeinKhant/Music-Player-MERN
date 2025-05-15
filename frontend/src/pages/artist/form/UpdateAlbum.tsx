import { FC, useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Dashboard from "../../../layouts/Dashboard";
import { updateAlbum, artistGenre, getAlbumDetail4Artist } from "../../../services/albumService";
import { useNavigate, useParams } from "react-router-dom";
import { Album } from "../Albums";
import DEFAULT_ALBUM_IMAGE from "../../../assets/image/no-album-image.svg";

// Define supported image formats
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/avif",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/jfif",
];
const FILE_SIZE = 5 * 1024 * 1024; // 5MB

type Genre = {
  id: string;
  name: string;
};

const UpdateAlbum: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fetchingAlbum, setFetchingAlbum] = useState(true);
  const [albumData, setAlbumData] = useState<Album | null>(null);

  const albumSchema = Yup.object().shape({
    name: Yup.string().required("Album name is required"),
    description: Yup.string(),
    genre: Yup.string().required("Genre is required"),
    image: Yup.mixed()
      .nullable()
      .test(
        "fileFormat",
        "Unsupported file format. Only jpg, jpeg, png, and gif are allowed",
        (value) => {
          if (!value) return true;
          return (
            value instanceof File && SUPPORTED_FORMATS.includes(value.type)
          );
        }
      )
      .test("fileSize", "File too large. Max size is 5MB", (value) => {
        if (!value) return true;
        return value instanceof File && value.size <= FILE_SIZE;
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      genre: "",
      image: null,
    },
    validationSchema: albumSchema,
    onSubmit: async (values) => {
      if (!id) {
        setError("Album ID is missing");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const albumUpdateData: {
          name?: string;
          description?: string;
          genre_id?: string;
          image?: File;
        } = {};
        
        // Only include changed values
        if (values.name !== (albumData?.name || "")) albumUpdateData.name = values.name;
        if (values.description !== (albumData?.description || "")) albumUpdateData.description = values.description;
        if (values.genre !== (albumData?.genre_id || "")) albumUpdateData.genre_id = values.genre;
        if (values.image) albumUpdateData.image = values.image;

        await updateAlbum(id, albumUpdateData);

        setSuccessMessage("Album updated successfully!");
        setTimeout(() => {
          navigate("/artist/albums");
        }, 1500);
      } catch (err) {
        console.error("Album update failed:", err);
        setError("Failed to update album. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Fetch album details
  useEffect(() => {
    const fetchAlbumDetails = async () => {
      if (!id) {
        setError("Album ID is missing");
        setFetchingAlbum(false);
        return;
      }

      try {
        setFetchingAlbum(true);
        const response: any = await getAlbumDetail4Artist(id);
        
        if (response.data.success) {
          const album = response.data.data;
          setAlbumData(album);
          
          // Set form values
          formik.setValues({
            name: album.name || "",
            description: album.description || "",
            genre: album.genre_id || "",
            image: null,
          });
          
          setCurrentImage(album.image);
        } else {
          setError("Failed to load album details");
        }
      } catch (error) {
        console.error("Error fetching album details:", error);
        setError("Failed to fetch album details");
      } finally {
        setFetchingAlbum(false);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response: any = await artistGenre();
        if (response.data.success) {
          setGenres(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to fetch genres");
      }
    };

    fetchGenres();
  }, []);

  // Handle file input changes
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue(fieldName, file);
  };

  if (fetchingAlbum) {
    return (
      <Dashboard>
        <div className="flex justify-center items-center h-64">
          <div className="text-dashboard-primaryText text-xl">Loading album details...</div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className='bg-dashboard-primaryDark p-10 rounded-lg shadow-lg w-full'>
        <h2 className='text-dashboard-primaryText text-2xl font-bold mb-6 text-center'>
          Update Album
        </h2>

        {error && !formik.errors.image && (
          <div className='text-red-500 text-center mb-6 p-3 bg-red-100 bg-opacity-10 rounded'>
            {error}
          </div>
        )}

        <form
          onSubmit={formik.handleSubmit}
          className='space-y-6'
          encType='multipart/form-data'
        >
          {/* Album Name Field */}
          <div>
            <label
              htmlFor='name'
              className='block text-dashboard-primaryText mb-2'
            >
              Album Name *
            </label>
            <input
              id='name'
              name='name'
              type='text'
              placeholder='Enter album name'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className='w-full px-4 py-2 rounded bg-dashboard-primary text-dashboard-primaryText border border-dashboard-primaryDarkText focus:outline-none focus:ring-2 focus:ring-dashboard-secondary'
            />
            {formik.touched.name && formik.errors.name ? (
              <div className='text-red-500 mt-1 text-sm'>
                {formik.errors.name}
              </div>
            ) : null}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor='description'
              className='block text-dashboard-primaryText mb-2'
            >
              Description (Optional)
            </label>
            <textarea
              id='description'
              name='description'
              placeholder='Enter album description'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              rows={4}
              className='w-full px-4 py-2 rounded bg-dashboard-primary text-dashboard-primaryText border border-dashboard-primaryDarkText focus:outline-none focus:ring-2 focus:ring-dashboard-secondary'
            />
            {formik.touched.description && formik.errors.description ? (
              <div className='text-red-500 mt-1 text-sm'>
                {formik.errors.description}
              </div>
            ) : null}
          </div>

          {/* Genre Field */}
          <div>
            <label
              htmlFor='genre'
              className='block text-dashboard-primaryText mb-2'
            >
              Genre *
            </label>
            <select
              id='genre'
              name='genre'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.genre}
              className='w-full px-4 py-2 rounded bg-dashboard-primary text-dashboard-primaryText border border-dashboard-primaryDarkText focus:outline-none focus:ring-2 focus:ring-dashboard-secondary'
            >
              <option value=''>Select a genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            {formik.touched.genre && formik.errors.genre ? (
              <div className='text-red-500 mt-1 text-sm'>
                {formik.errors.genre}
              </div>
            ) : null}
          </div>

          <div className='grid grid-cols-1 gap-6'>
            {/* Album Cover Image Upload */}
            <div>
              <label
                htmlFor='image'
                className='block text-dashboard-primaryText mb-2'
              >
                Album Cover Image
              </label>
              
              {/* Show current image if available */}
              <div className="mb-4">
                <p className="text-sm text-dashboard-primaryText mb-2">Current Image:</p>
                <img 
                  src={currentImage || DEFAULT_ALBUM_IMAGE} 
                  alt="Current album cover" 
                  className="w-32 h-32 object-cover rounded-md border border-dashboard-border"
                />
              </div>
              
              <div className='relative'>
                <input
                  id='image'
                  name='image'
                  type='file'
                  accept='image/*'
                  ref={imageInputRef}
                  onChange={(e) => handleFileChange(e, "image")}
                  className='hidden'
                />
                <button
                  type='button'
                  onClick={() => imageInputRef.current?.click()}
                  className='w-full px-4 py-2 rounded bg-dashboard-primary text-dashboard-primaryText border border-dashboard-primaryDarkText focus:outline-none focus:ring-2 focus:ring-dashboard-secondary text-left'
                >
                  {formik.values.image
                    ? (formik.values.image as File).name
                    : "Choose new image"}
                </button>
                <p className="text-sm text-gray-400 mt-1">
                  Leave empty to keep current image
                </p>
              </div>
              {formik.touched.image && formik.errors.image ? (
                <div className='text-red-500 mt-1 text-sm'>
                  {formik.errors.image as string}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            {successMessage && (
              <div className='text-green-500 text-center mb-4 p-3 bg-green-100 bg-opacity-10 rounded'>
                {successMessage}
              </div>
            )}
            <div className="flex space-x-4">
              <button
                type='button'
                onClick={() => navigate("/artist/albums")}
                className='w-1/2 bg-gray-600 hover:bg-gray-700 text-dashboard-primaryText font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isLoading}
                className='w-1/2 bg-dashboard-secondary hover:bg-opacity-90 text-dashboard-primaryText font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dashboard-secondary transition duration-150 ease-in-out disabled:opacity-50'
              >
                {isLoading ? "Updating..." : "Update Album"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export default UpdateAlbum; 