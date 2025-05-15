import { FC, useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Dashboard from "../../../layouts/Dashboard";
import { createAlbum, artistGenre } from "../../../services/albumService";

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

const CreateAlbum: FC = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [genres, setGenres] = useState<Genre[]>([]);

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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      genre: "",
      image: null,
    },
    validationSchema: albumSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const albumData = {
          name: values.name,
          description: values.description || "",
          genre_id: values.genre,
          image: values.image || undefined,
        };

         await createAlbum(albumData);

        setSuccessMessage("Album created successfully!");
        formik.resetForm();
      } catch (err) {
        console.error("Album creation failed:", err);
        setError("Failed to create album. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Handle file input changes
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue(fieldName, file);
  };

  return (
    <Dashboard>
      <div className='bg-dashboard-primaryDark p-10 rounded-lg shadow-lg w-full'>
        <h2 className='text-dashboard-primaryText text-2xl font-bold mb-6 text-center'>
          Create New Album
        </h2>

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

          <div className='grid grid-cols-1  gap-6'>
            {/* Album Cover Image Upload */}
            <div>
              <label
                htmlFor='image'
                className='block text-dashboard-primaryText mb-2'
              >
                Album Cover Image (Optional)
              </label>
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
                    : "Choose file"}
                </button>
              </div>
              {formik.touched.image && formik.errors.image ? (
                <div className='text-red-500 mt-1 text-sm'>
                  {formik.errors.image as string}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            {error && (
              <div className='text-red-500 text-center mb-4'>{error}</div>
            )}
            {successMessage && (
              <div className='text-green-500 text-center mb-4'>
                {successMessage}
              </div>
            )}
            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-dashboard-secondary hover:bg-opacity-90 text-dashboard-primaryText font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dashboard-secondary transition duration-150 ease-in-out disabled:opacity-50'
              >
                {isLoading ? "Creating Album..." : "Create Album"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Dashboard>
  );
};

export default CreateAlbum;
