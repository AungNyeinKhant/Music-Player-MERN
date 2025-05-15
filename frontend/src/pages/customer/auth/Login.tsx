import { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { userLogin } from "../../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { storeRefreshToken } from "../../../utils/crypto";
import Logo from "../../../assets/image/music-player-logo.svg";
import { useTokenRefresh } from "../../../hooks/useTokenRefresh";

const Login: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  // Check for existing refresh token and attempt to refresh
  useTokenRefresh("user");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setError(null);
      setIsLoading(true);

      try {
        const response: any = await userLogin(values.email, values.password);

        if (response.status === 400) {
          const errorMessage =
            response?.data?.data?.error ?? "Something went wrong";
          alert(errorMessage);
          return;
        }

        storeRefreshToken("user", response?.data?.data?.refreshToken);

        auth?.setUser({
          id: response?.data?.data?.user.id,
          image: response.data.data.image,
          role: "user",
          name: response.data.data.user.name,
        });

        navigate("/app");
      } catch (err) {
        console.error("Login failed:", err);
        setError("Invalid email or password");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className='min-h-screen flex items-center justify-center bg-primary '>
      <div className='container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center gap-8 my-10'>
        {/* Left side - Promo Image */}
        <div className='w-full lg:w-1/2 flex justify-center items-center p-8'>
          <img src={Logo} alt='Music Player Logo' className='w-full h-full' />
        </div>

        {/* Right side - Login Form */}
        <div className='w-full lg:w-1/2 max-w-md'>
          <div className='bg-primaryDark p-8 rounded-lg shadow-lg'>
            <h2 className='text-2xl font-bold mb-6 text-center'>
              <span className='text-secondary'>Legacy</span>
              <span className='text-primaryText'> Login</span>
            </h2>

            <form onSubmit={formik.handleSubmit} className='space-y-6'>
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

              <div>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-secondary hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition duration-150 ease-in-out disabled:opacity-50'
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </div>
              {error && (
                <div className='text-red-500 text-sm text-center'>{error}</div>
              )}
            </form>
            <div className='mt-4 text-center'>
              <span className='text-primaryDarkText'>
                Don't have an account?{" "}
              </span>
              <a
                href='/register'
                className='text-secondary hover:text-opacity-90'
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
