import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AdminDashboard from "../../../layouts/AdminDashboard";
import { createPackage } from "../../../services/packageService";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  num_of_days: Yup.number()
    .required("Number of days is required")
    .positive("Must be a positive number"),
  price: Yup.number()
    .required("Price is required")
    .positive("Must be a positive number"),
});

const CreatePackage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      num_of_days: "",
      price: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      try {
        await createPackage({
          ...values,
          num_of_days: Number(values.num_of_days),
          price: Number(values.price),
        });
        setSuccessMessage("Package created successfully!");
        setTimeout(() => {
          navigate("/admin/packages");
        }, 1500);
      } catch (error) {
        console.error("Error creating package:", error);
        setError("Failed to create package. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <AdminDashboard>
      <div className='bg-dashboard-primaryDark p-10 rounded-lg shadow-lg w-full'>
        <h2 className='text-dashboard-primaryText text-2xl font-bold mb-6 text-center'>
          Create New Package
        </h2>

        <form onSubmit={formik.handleSubmit} className='space-y-6'>
          {/* Package Name Field */}
          <div>
            <label
              htmlFor='name'
              className='block text-dashboard-primaryText mb-2'
            >
              Package Name *
            </label>
            <input
              id='name'
              name='name'
              type='text'
              placeholder='Enter package name'
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
              placeholder='Enter package description'
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

          {/* Number of Days Field */}
          <div>
            <label
              htmlFor='num_of_days'
              className='block text-dashboard-primaryText mb-2'
            >
              Number of Days *
            </label>
            <input
              id='num_of_days'
              name='num_of_days'
              type='number'
              placeholder='Enter number of days'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.num_of_days}
              className='w-full px-4 py-2 rounded bg-dashboard-primary text-dashboard-primaryText border border-dashboard-primaryDarkText focus:outline-none focus:ring-2 focus:ring-dashboard-secondary'
            />
            {formik.touched.num_of_days && formik.errors.num_of_days ? (
              <div className='text-red-500 mt-1 text-sm'>
                {formik.errors.num_of_days}
              </div>
            ) : null}
          </div>

          {/* Price Field */}
          <div>
            <label
              htmlFor='price'
              className='block text-dashboard-primaryText mb-2'
            >
              Price *
            </label>
            <input
              id='price'
              name='price'
              type='number'
              placeholder='Enter price'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.price}
              className='w-full px-4 py-2 rounded bg-dashboard-primary text-dashboard-primaryText border border-dashboard-primaryDarkText focus:outline-none focus:ring-2 focus:ring-dashboard-secondary'
            />
            {formik.touched.price && formik.errors.price ? (
              <div className='text-red-500 mt-1 text-sm'>
                {formik.errors.price}
              </div>
            ) : null}
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
            <div className="flex space-x-4">
              <button
                type='button'
                onClick={() => navigate("/admin/packages")}
                className='w-1/2 bg-gray-600 hover:bg-gray-700 text-dashboard-primaryText font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isLoading}
                className='w-1/2 bg-dashboard-secondary hover:bg-opacity-90 text-dashboard-primaryText font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dashboard-secondary transition duration-150 ease-in-out disabled:opacity-50'
              >
                {isLoading ? "Creating Package..." : "Create Package"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminDashboard>
  );
};

export default CreatePackage;
