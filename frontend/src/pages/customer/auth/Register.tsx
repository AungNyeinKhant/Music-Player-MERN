import { FC, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../../../services/AuthService";
import { storeRefreshToken } from "../../../utils/crypto";
import { useAuth } from "../../../context/AuthContext";
import Logo from "../../../assets/image/music-player-logo.svg";

const Register: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const registerSchema = Yup.object().shape({
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
      .required("Password is required"),
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
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "+66",
      password: "",
      dob: "",
      image: undefined,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      setError(null);
      setIsLoading(true);
      try {
        const response: any = await userRegister({
          ...values,
          image: values.image || undefined,
        });

        if (response.status === 400) {
          const errorMessage =
            response?.data?.data?.error ?? "Something went wrong";
          alert(errorMessage);
          return;
        }

        storeRefreshToken("user", response?.data?.data?.refreshToken);

        auth?.setUser({
          id: response?.data?.data?.user.id,
          image: response.data.data.user.image,
          role: "user",
          name: response.data.data.user.name,
        });

        navigate("/app");
      } catch (err) {
        console.error("Registration failed:", err);
        setError("Registration failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue("image", file);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-primary'>
      <div className='container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-8 my-10'>
        {/* Left side - Promo Image */}
        <div className='w-full lg:w-1/2 flex justify-center items-center p-8'>
          <img src={Logo} alt='Music Player Logo' className='w-full h-full' />
        </div>

        {/* Right side - Registration Form */}
        <div className='w-full lg:w-1/2 max-w-md'>
          <div className='bg-primaryDark p-8 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-bold mb-6 text-center'>
              <span className='text-secondary'>Legacy</span>
              <span className='text-primaryText'> Register</span>
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

              {/* Password Field */}
              <div>
                <label
                  htmlFor='password'
                  className='block text-primaryText mb-2'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    id='password'
                    name='password'
                    type={showPassword ? "text" : "password"}
                    placeholder='Enter your password'
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
                  Profile Image (Optional)
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

              <div>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-secondary hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-150 ease-in-out disabled:opacity-50'
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
              {error && (
                <div className='text-red-500 text-sm text-center'>{error}</div>
              )}
            </form>

            <div className='mt-4 text-center'>
              <span className='text-primaryDarkText'>
                Already have an account?{" "}
              </span>
              <a
                href='/login'
                className='text-secondary hover:text-opacity-90'
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
