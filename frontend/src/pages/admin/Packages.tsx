import { FC, useEffect, useState } from "react";
import AdminDashboard from "../../layouts/AdminDashboard";
import { getPackages4Admin } from "../../services/packageService";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Package {
  id: string;
  name: string;
  num_of_days: number;
  description: string;
  price: number;
  created_at: string;
}

const Packages: FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackages4Admin();
        setPackages(response.data.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchPackages();
  }, []);

  const handleCreatePackage = () => {
    navigate("/admin/packages/create");
  };

  const handleEditPackage = (id: string) => {
    
    navigate(`/admin/packages/update/${id}`)
  };

  return (
    <AdminDashboard>
      <div className='bg-dashboard-primary p-4 md:p-8 rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Packages</h1>
          <button
            onClick={handleCreatePackage}
            className='bg-dashboard-secondary text-dashboard-secondaryText px-4 py-2 rounded hover:bg-dashboard-secondaryDark transition-colors'
          >
            Create Package
          </button>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='bg-dashboard-secondary text-dashboard-secondaryText'>
                <th className='px-4 py-2 text-left'>#</th>
                <th className='px-4 py-2 text-left'>Name</th>
                <th className='px-4 py-2 text-left'>Days</th>
                <th className='px-4 py-2 text-left'>Description</th>
                <th className='px-4 py-2 text-left'>Price</th>
                <th className='px-4 py-2 text-left'>Created At</th>
                <th className='px-4 py-2 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, index) => (
                <tr
                  key={pkg.id}
                  className='border-b border-dashboard-border hover:bg-dashboard-secondary/10'
                >
                  <td className='px-4 py-2'>{index + 1}</td>
                  <td className='px-4 py-2'>{pkg.name}</td>
                  <td className='px-4 py-2'>{pkg.num_of_days}</td>
                  <td className='px-4 py-2'>{pkg.description}</td>
                  <td className='px-4 py-2'>{pkg.price} MMK</td>
                  <td className='px-4 py-2'>
                    {new Date(pkg.created_at).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-2'>
                    <button
                      onClick={() => handleEditPackage(pkg.id)}
                      className='p-2 hover:bg-dashboard-secondary/20 rounded-full transition-colors'
                    >
                      <Edit className='w-5 h-5 text-dashboard-secondary' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminDashboard>
  );
};

export default Packages;
