import { FC, useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Calendar } from "lucide-react";
import Dashboard from "../../../layouts/Dashboard";
import {
  updateArtist,
  getArtistProfile,
} from "../../../services/profileService";
import { useAuth } from "../../../context/AuthContext";

const UpdateProfile: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentBgImage, setCurrentBgImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const dobInputRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

  const updateSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(
        /^\+66[0-9]{6,15}$/,
        "Phone number must start with +66 and be 8-17 digits in total"
      )
      .required("Phone number is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
    dob: Yup.date().required("Date of birth is required"),
    image: Yup.mixed()
      .nullable()
      .test(
        "fileFormat",
        "Unsupported file format. Only jpg, jpeg, png, and gif are allowed",
        (value) => {
          if (!value) return true; // Optional field
          return (
            value instanceof File && SUPPORTED_FORMATS.includes(value.type)
          );
        }
      )
      .test("fileSize", "File too large. Max size is 5MB", (value) => {
        if (!value) return true; // Optional field
        return value instanceof File && value.size <= FILE_SIZE;
      }),
    bg_image: Yup.mixed()
      .nullable()
      .test(
        "fileFormat",
        "Unsupported file format. Only jpg, jpeg, png, and gif are allowed",
        (value) => {
          if (!value) return true; // Optional field
          return (
            value instanceof File && SUPPORTED_FORMATS.includes(value.type)
          );
        }
      )
      .test("fileSize", "File too large. Max size is 5MB", (value) => {
        if (!value) return true; // Optional field
        return value instanceof File && value.size <= FILE_SIZE;
      }),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "+66",
      password: "",
      dob: "",
      image: null,
      bg_image: null,
    },
    validationSchema: updateSchema,
    onSubmit: async (values) => {
      setError(null);
      setIsLoading(true);
      try {
        const formData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password || undefined,
          dob: values.dob,
          image: values.image || undefined,
          bg_image: values.bg_image || undefined,
        };

        const response: any = await updateArtist(formData);

        if (response.status === 400) {
          const errorMessage =
            response?.data?.data?.error ?? "Something went wrong";
          alert(errorMessage);
          return;
        }

        // Update the user context with new data
        if (auth?.user) {
          auth.setUser({
            ...auth.user,
            image: response.data.data.image || auth.user.image,
            name: response.data.data.name,
          });
        }

        alert("Profile updated successfully");
      } catch (err) {
        console.error("Update failed:", err);
        setError("Update failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Fetch artist details on component mount
  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const response: any = await getArtistProfile();
        const artistData = response.data.data;

        formik.setValues({
          name: artistData.name || "",
          email: artistData.email || "",
          phone: artistData.phone || "+66",
          password: "",
          dob: artistData.dob || "",
          image: null,
          bg_image: null,
        });

        // Store current image URLs in state
        if (artistData.image) setCurrentImage(artistData.image);
        if (artistData.bg_image) setCurrentBgImage(artistData.bg_image);
      } catch (error) {
        console.error("Error fetching artist details:", error);
        setError("Failed to load artist details");
      }
    };

    fetchArtistDetails();
  }, []);

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
      <div className='min-h-screen py-16 px-8'>
        <div className='bg-primaryDark p-10 rounded-lg shadow-lg w-full max-w-2xl mx-auto'>
          <h2 className='text-2xl font-bold mb-6 text-primaryText text-center'>
            Update Profile
          </h2>

          <form onSubmit={formik.handleSubmit} className='space-y-6'>
            {/* Name Field */}
            <div>
              <label htmlFor='name' className='block text-primaryText mb-2'>
                Full Name
              </label>
              <input
                id='name'
                name='name'
                type='text'
                placeholder='Enter your full name'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-dashboard-secondary'
              />
              {formik.touched.name && formik.errors.name ? (
                <div className='text-red-500 mt-1 text-sm'>
                  {formik.errors.name}
                </div>
              ) : null}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor='email' className='block text-primaryText mb-2'>
                Email Address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-dashboard-secondary'
              />
              {formik.touched.email && formik.errors.email ? (
                <div className='text-red-500 mt-1 text-sm'>
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor='phone' className='block text-primaryText mb-2'>
                Phone Number
              </label>
              <input
                id='phone'
                name='phone'
                type='text'
                placeholder='+66xxxxxxxxx'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-dashboard-secondary'
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className='text-red-500 mt-1 text-sm'>
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor='password' className='block text-primaryText mb-2'>
                Password (Leave empty to keep current password)
              </label>
              <div className='relative'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? "text" : "password"}
                  placeholder='Enter new password'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-dashboard-secondary'
                />
                <button
                  type='button'
                  onClick={togglePasswordVisibility}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-primaryDarkText hover:text-primaryText focus:outline-none'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className='text-red-500 mt-1 text-sm'>
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            {/* Date of Birth Field */}
            <div>
              <label htmlFor='dob' className='block text-primaryText mb-2'>
                Date of Birth
              </label>
              <div className='relative'>
                <input
                  id='dob'
                  name='dob'
                  type='date'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dob}
                  ref={dobInputRef}
                  className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 cursor-pointer'
                />
                <Calendar
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-primaryDarkText hover:text-primaryText cursor-pointer'
                  size={20}
                  onClick={() => dobInputRef.current?.showPicker()}
                />
              </div>
              {formik.touched.dob && formik.errors.dob ? (
                <div className='text-red-500 mt-1 text-sm'>
                  {formik.errors.dob}
                </div>
              ) : null}
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Profile Image Upload */}
              <div>
                <label htmlFor='image' className='block text-primaryText mb-2'>
                  Profile Image (Optional)
                </label>
                {currentImage && (
                  <div className='mb-3'>
                    <img
                      src={currentImage}
                      alt='Current profile'
                      className='w-32 h-32 object-cover rounded-lg mx-auto'
                    />
                  </div>
                )}
                <div className='relative'>
                  <input
                    id='image'
                    name='image'
                    type='file'
                    accept='image/*'
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e, "image")}
                    className='hidden'
                  />
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary text-left'
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

              {/* Background Image Upload */}
              <div>
                <label
                  htmlFor='bg_image'
                  className='block text-primaryText mb-2'
                >
                  Background Image (Optional)
                </label>
                {currentBgImage && (
                  <div className='mb-3'>
                    <img
                      src={currentBgImage}
                      alt='Current background'
                      className='w-full h-32 object-cover rounded-lg'
                    />
                  </div>
                )}
                <div className='relative'>
                  <input
                    id='bg_image'
                    name='bg_image'
                    type='file'
                    accept='image/*'
                    ref={bgFileInputRef}
                    onChange={(e) => handleFileChange(e, "bg_image")}
                    className='hidden'
                  />
                  <button
                    type='button'
                    onClick={() => bgFileInputRef.current?.click()}
                    className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary text-left'
                  >
                    {formik.values.bg_image
                      ? (formik.values.bg_image as File).name
                      : "Choose file"}
                  </button>
                </div>
                {formik.touched.bg_image && formik.errors.bg_image ? (
                  <div className='text-red-500 mt-1 text-sm'>
                    {formik.errors.bg_image as string}
                  </div>
                ) : null}
              </div>
            </div>

            {error && <div className='text-red-500 text-center'>{error}</div>}

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-dashboard-secondary hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dashboard-secondary transition duration-150 ease-in-out disabled:opacity-50'
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dashboard>
  );
};

export default UpdateProfile;
