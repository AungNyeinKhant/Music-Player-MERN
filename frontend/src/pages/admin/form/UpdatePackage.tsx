import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import AdminDashboard from "../../../layouts/AdminDashboard";
import { getPackages4Admin, updatePackage } from "../../../services/packageService";

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

interface Package {
  id: string;
  name: string;
  description: string;
  num_of_days: number;
  price: number;
}

const UpdatePackage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
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
      if (!id) {
        setError("Package ID is missing");
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      try {
        await updatePackage(id, {
          name: values.name,
          description: values.description,
          num_of_days: Number(values.num_of_days),
          price: Number(values.price),
        });
        
        setSuccessMessage("Package updated successfully!");
        setTimeout(() => {
          navigate("/admin/packages");
        }, 1500);
      } catch (error) {
        console.error("Error updating package:", error);
        setError("Failed to update package. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) {
        setError("Package ID is missing");
        setIsFetching(false);
        return;
      }

      try {
        setIsFetching(true);
        const response: any = await getPackages4Admin();
        
        if (response?.data?.data) {
          const packageData = response.data.data.find((pkg: Package) => pkg.id === id);
          
          if (packageData) {
            formik.setValues({
              name: packageData.name || "",
              description: packageData.description || "",
              num_of_days: String(packageData.num_of_days) || "",
              price: String(packageData.price) || "",
            });
          } else {
            setError("Package not found");
          }
        } else {
          setError("Failed to load packages");
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        setError("Failed to load package details");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPackage();
  }, [id]);

  if (isFetching) {
    return (
      <AdminDashboard>
        <div className="flex justify-center items-center h-64">
          <div className="text-dashboard-primaryText text-xl">Loading package details...</div>
        </div>
      </AdminDashboard>
    );
  }

  return (
    <AdminDashboard>
      <div className='bg-dashboard-primaryDark p-10 rounded-lg shadow-lg w-full'>
        <h2 className='text-dashboard-primaryText text-2xl font-bold mb-6 text-center'>
          Update Package
        </h2>

        {error && !formik.isSubmitting && (
          <div className='text-red-500 text-center mb-6 p-3 bg-red-100 bg-opacity-10 rounded'>
            {error}
          </div>
        )}

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
            {successMessage && (
              <div className='text-green-500 text-center mb-4 p-3 bg-green-100 bg-opacity-10 rounded'>
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
                {isLoading ? "Updating Package..." : "Update Package"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminDashboard>
  );
};

export default UpdatePackage;
