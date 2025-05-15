import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createTrack } from "../../../services/trackService";
import { artistGenre } from "../../../services/albumService";

interface CreateTrackFormValues {
  name: string;
  audio: File | null;
  genre: string;
  albumId: string;
  description?: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  audio: Yup.mixed()
    .required("Audio file is required")
    .test("fileFormat", "Unsupported file format", (value) => {
      if (!value) return false;
      const supportedFormats = ["audio/mpeg", "audio/wav", "audio/ogg"];
      return supportedFormats.includes((value as File).type);
    }),
  genre: Yup.string().required("Genre is required"),
  albumId: Yup.string().required("Album is required"),
  description: Yup.string(),
});

interface Genre {
  id: string;
  name: string;
}

interface Album {
  id: string;
  name: string;
  genre_id: string;
}

interface CreateTrackProps {
  selectedAlbum?: string;
  albums: { id: string; name: string; genre_id: string }[];
}

const CreateTrack: React.FC<CreateTrackProps> = ({ selectedAlbum, albums }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");

  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoadingGenres(true);
      try {
        const response: any = await artistGenre();
        if (response.data.success) {
          setGenres(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to fetch genres");
      } finally {
        setIsLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    if (selectedAlbum && albums.length > 0) {
      const album = albums.find((a) => a.id === selectedAlbum);
      if (album && album.genre_id) {
        setSelectedGenre(album.genre_id);
      }
    }
  }, [selectedAlbum, albums]);

  const initialValues: CreateTrackFormValues = {
    name: "",
    audio: null,
    genre: selectedGenre,
    albumId: selectedAlbum || "",
    description: "",
  };

  const handleSubmit = async (values: CreateTrackFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!values.audio) {
        throw new Error("Audio file is required");
      }

      const trackData = {
        name: values.name,
        audio: values.audio,
        genre_id: values.genre,
        album_id: values.albumId,
        description: values.description || undefined,
      };

      const response = await createTrack(trackData);

      setSuccessMessage("Track created successfully!");
    } catch (err) {
      console.error("Track creation failed:", err);
      setError("Failed to create track. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ setFieldValue }) => (
        <Form className='space-y-6'>
          <div className='space-y-1.5'>
            <label
              htmlFor='name'
              className='block text-dashboard-primaryText font-medium'
            >
              Name *
            </label>
            <Field
              type='text'
              id='name'
              name='name'
              disabled={isLoading || isLoadingGenres}
              className='w-full bg-dashboard-primaryDark text-dashboard-primaryText px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-dashboard-secondary border border-dashboard-accent border-opacity-20'
              placeholder='Enter track name'
            />
            <ErrorMessage
              name='name'
              component='div'
              className='text-red-500 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='audio'
              className='block text-dashboard-primaryText font-medium'
            >
              Audio File *
            </label>
            <input
              type='file'
              id='audio'
              accept='audio/*'
              disabled={isLoading || isLoadingGenres}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                setFieldValue("audio", file);
              }}
              className='w-full bg-dashboard-primaryDark text-dashboard-primaryText px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-dashboard-secondary border border-dashboard-accent border-opacity-20 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-dashboard-secondary file:text-white hover:file:bg-opacity-90'
            />
            <ErrorMessage
              name='audio'
              component='div'
              className='text-red-500 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='genre'
              className='block text-dashboard-primaryText font-medium'
            >
              Genre *
            </label>
            <Field
              as='select'
              id='genre'
              name='genre'
              disabled={isLoading || isLoadingGenres}
              className='w-full bg-dashboard-primaryDark text-dashboard-primaryText px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-dashboard-secondary border border-dashboard-accent border-opacity-20'
            >
              <option value=''>Select genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name='genre'
              component='div'
              className='text-red-500 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='albumId'
              className='block text-dashboard-primaryText font-medium'
            >
              Album *
            </label>
            <Field
              as='select'
              id='albumId'
              name='albumId'
              disabled={isLoading || isLoadingGenres}
              className='w-full bg-dashboard-primaryDark text-dashboard-primaryText px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-dashboard-secondary border border-dashboard-accent border-opacity-20'
            >
              <option value=''>Select album</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.name}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name='albumId'
              component='div'
              className='text-red-500 text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label
              htmlFor='description'
              className='block text-dashboard-primaryText font-medium'
            >
              Description
            </label>
            <Field
              as='textarea'
              id='description'
              name='description'
              rows={4}
              disabled={isLoading || isLoadingGenres}
              className='w-full bg-dashboard-primaryDark text-dashboard-primaryText px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-dashboard-secondary border border-dashboard-accent border-opacity-20 resize-none'
              placeholder='Enter track description'
            />
          </div>

          {error && (
            <div className='text-red-500 text-center mb-4'>{error}</div>
          )}
          {successMessage && (
            <div className='text-green-500 text-center mb-4'>
              {successMessage}
            </div>
          )}
          <button
            type='submit'
            disabled={isLoading}
            className='w-full bg-dashboard-secondary text-white px-4 py-3 rounded-md hover:bg-opacity-90 transition-colors font-semibold mt-8 disabled:opacity-50'
          >
            {isLoading ? "Creating Track..." : "Create Track"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateTrack;
