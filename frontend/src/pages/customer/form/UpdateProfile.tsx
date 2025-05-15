import React, { useState, useRef, useEffect } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Template from '../../../layouts/Template';
import { getProfileUser, updateUser } from "../../../services/profileService";
import { useAuth } from "../../../context/AuthContext";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  dob: string;
  image: File | string | undefined;
};

const UpdateProfile: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dobInputRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const FILE_SIZE = 5 * 1024 * 1024; // 5MB
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

  const updateProfileSchema = Yup.object().shape({
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
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .optional(), // Password is optional for profile update
    dob: Yup.date().required("Date of birth is required"),
    image: Yup.mixed()
      .nullable()
      .test(
        "fileFormat",
        "Unsupported file format. Only jpg, jpeg, png, and gif are allowed",
        (value) => {
          if (!value || typeof value === 'string') return true; // Optional field or existing URL
          return (
            value instanceof File && SUPPORTED_FORMATS.includes(value.type)
          );
        }
      )
      .test("fileSize", "File too large. Max size is 5MB", (value) => {
        if (!value || typeof value === 'string') return true; // Optional field or existing URL
        return value instanceof File && value.size <= FILE_SIZE;
      }),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      email: "",
      phone: "+66",
      password: "",
      dob: "",
      image: undefined,
    },
    validationSchema: updateProfileSchema,
    onSubmit: async (values) => {
      setError(null);
      setIsLoading(true);
      try {
        // Only include password if it was provided
        const updateData = {
          ...values,
          password: values.password || undefined,
          image: values.image instanceof File ? values.image : undefined,
          dob: values.dob.toString()
        };

        const response: any = await updateUser(updateData);

        if (response.status === 400) {
          const errorMessage =
            response?.data?.data?.error ?? "Something went wrong";
          alert(errorMessage);
          return;
        }

        // Update auth context with new user data if available
        if (auth?.user && response?.data?.data?.user) {
          auth.setUser({
            ...auth.user,
            name: response.data.data.user.name,
            image: response.data.data.user.image,
          });
        }

        alert("Profile updated successfully!");
        navigate("/app");
      } catch (err) {
        console.error("Profile update failed:", err);
        setError("Profile update failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response: any = await getProfileUser();
        if (response?.data?.success) {
          const userData = response.data.data;
          formik.setValues({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "+66",
            password: "", // Always empty for security
            dob: userData.dob ? userData.dob.split('T')[0] : "", // Format date correctly
            image: userData.image || undefined,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setError("Failed to load your profile data. Please try again.");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue("image", file);
  };

  if (isLoadingProfile) {
    return (
      <Template>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-primaryText text-xl">Loading your profile...</div>
        </div>
      </Template>
    );
  }

  return (
    <Template>
      <div className='overflow-x-scroll'>
        <div className='flex items-center justify-center py-10'>
            <div className='w-full max-w-md'>
            <div className='bg-primaryDark p-8 rounded-lg shadow-lg'>
                <h2 className='text-2xl font-bold mb-6 text-center text-primaryText'>
                Update Your Profile
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
                    className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary'
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
                    className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary'
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
                    className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary'
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                    <div className='text-red-500 mt-1 text-sm'>
                        {formik.errors.phone}
                    </div>
                    ) : null}
                </div>

                {/* Password Field (Optional) */}
                <div>
                    <label
                    htmlFor='password'
                    className='block text-primaryText mb-2'
                    >
                    Password (Leave blank to keep current password)
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
                        className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary'
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

                {/* Profile Image Upload */}
                <div>
                    <label htmlFor='image' className='block text-primaryText mb-2'>
                    Profile Image
                    </label>
                    <div className='relative'>
                    <input
                        id='image'
                        name='image'
                        type='file'
                        accept='image/*'
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className='hidden'
                    />
                    <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        className='w-full px-4 py-2 rounded bg-primary text-primaryText border border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary text-left'
                    >
                        {formik.values.image instanceof File
                        ? (formik.values.image as File).name
                        : formik.values.image
                        ? "Current profile image"
                        : "Choose file"}
                    </button>
                    </div>
                    {formik.touched.image && formik.errors.image ? (
                    <div className='text-red-500 mt-1 text-sm'>
                        {formik.errors.image as string}
                    </div>
                    ) : null}
                    
                    {/* Preview current profile image if exists */}
                    {typeof formik.values.image === 'string' && formik.values.image && (
                    <div className="mt-2 flex justify-center">
                        <img 
                        src={formik.values.image} 
                        alt="Current profile" 
                        className="h-20 w-20 rounded-full object-cover"
                        />
                    </div>
                    )}
                </div>

                <div>
                    <button
                    type='submit'
                    disabled={isLoading}
                    className='w-full bg-secondary hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-150 ease-in-out disabled:opacity-50'
                    >
                    {isLoading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
                {error && (
                    <div className='text-red-500 text-sm text-center'>{error}</div>
                )}
                </form>
            </div>
            </div>
        </div>
      </div>
    </Template>
  );
};

export default UpdateProfile;