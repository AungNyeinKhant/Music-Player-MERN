import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateTrack, getTrackDetail } from "../../../services/trackService";
import { artistAlbumList, artistGenre } from "../../../services/albumService";
import { useNavigate, useParams } from "react-router-dom";
import Dashboard from "../../../layouts/Dashboard";

interface UpdateTrackFormValues {
  name: string;
  audio: File | null;
  genre: string;
  albumId: string;
  description?: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  audio: Yup.mixed()
    .nullable()
    .test("fileFormat", "Unsupported file format", (value) => {
      if (!value) return true;
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

const UpdateTrack: React.FC = () => {
  const { id } = useParams() as { id?: string };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [fetchingTrack, setFetchingTrack] = useState(true);
  const [trackData, setTrackData] = useState<any>(null);

  useEffect(() => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    Promise.all([fetchTrackDetails(), fetchAlbums(), fetchGenres()])
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load required data. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      // Cleanup function to prevent state updates on unmounted component
      setIsLoading(false);
      setError(null);
    };
  }, []);

  const fetchAlbums = async () => {
    try {
      const response: any = await artistAlbumList();
      if (response.data.success) {
        setAlbums(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      setError("Failed to fetch albums");
    }
  };

  const fetchTrackDetails = async () => {
    if (!id) {
      setError("Track ID is missing");
      setFetchingTrack(false);
      return;
    }

    try {
      setFetchingTrack(true);
      const response: any = await getTrackDetail(id);

      if (response.data.success) {
        setTrackData(response.data.data);
      } else {
        setError("Failed to load track details");
      }
    } catch (error) {
      console.error("Error fetching track details:", error);
      setError("Failed to fetch track details");
    } finally {
      setFetchingTrack(false);
    }
  };
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

  if (fetchingTrack) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-dashboard-primaryText text-xl'>
          Loading track details...
        </div>
      </div>
    );
  }

  return (
    <Dashboard>
      <div className='bg-dashboard-primaryDark p-10 rounded-lg shadow-lg w-full'>
        <h2 className='text-dashboard-primaryText text-2xl font-bold mb-6 text-center'>
          Update Track
        </h2>

        {error && (
          <div className='text-red-500 text-center mb-6 p-3 bg-red-100 bg-opacity-10 rounded'>
            {error}
          </div>
        )}

        <Formik
          initialValues={{
            name: trackData?.name || "",
            audio: null,
            genre: trackData?.genre_id || "",
            albumId: trackData?.album_id || "",
            description: trackData?.description || "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            if (!id) {
              setError("Track ID is missing");
              return;
            }

            setIsLoading(true);
            setError(null);
            setSuccessMessage(null);

            try {
              const trackUpdateData: {
                name?: string;
                description?: string;
                genre_id?: string;
                album_id?: string;
                audio?: File;
              } = {};

              if (values.name !== trackData?.name)
                trackUpdateData.name = values.name;
              if (values.description !== trackData?.description)
                trackUpdateData.description = values.description;
              if (values.genre !== trackData?.genre_id)
                trackUpdateData.genre_id = values.genre;
              if (values.albumId !== trackData?.album_id)
                trackUpdateData.album_id = values.albumId;
              if (values.audio) trackUpdateData.audio = values.audio;

              await updateTrack(id, trackUpdateData);

              setSuccessMessage("Track updated successfully!");
              setTimeout(() => {
                navigate("/artist/tracks");
              }, 1500);
            } catch (err) {
              console.error("Track update failed:", err);
              setError("Failed to update track. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }}
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
                  disabled={isLoading}
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
                  Audio File
                </label>
                <input
                  type='file'
                  id='audio'
                  accept='audio/*'
                  disabled={isLoading}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    setFieldValue("audio", file);
                  }}
                  className='w-full bg-dashboard-primaryDark text-dashboard-primaryText px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-dashboard-secondary border border-dashboard-accent border-opacity-20 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-dashboard-secondary file:text-white hover:file:bg-opacity-90'
                />
                <p className='text-sm text-gray-400 mt-1'>
                  Leave empty to keep current audio
                </p>
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                  className='w-full bg-dashboard-primaryDark text-dashboard-primaryText px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-dashboard-secondary border border-dashboard-accent border-opacity-20 resize-none'
                  placeholder='Enter track description'
                />
              </div>

              {successMessage && (
                <div className='text-green-500 text-center mb-4 p-3 bg-green-100 bg-opacity-10 rounded'>
                  {successMessage}
                </div>
              )}

              <div className='flex space-x-4'>
                <button
                  type='button'
                  onClick={() => navigate("/artist/tracks")}
                  className='w-1/2 bg-gray-600 hover:bg-gray-700 text-dashboard-primaryText font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-1/2 bg-dashboard-secondary hover:bg-opacity-90 text-dashboard-primaryText font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dashboard-secondary transition duration-150 ease-in-out disabled:opacity-50'
                >
                  {isLoading ? "Updating..." : "Update Track"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Dashboard>
  );
};

export default UpdateTrack;
