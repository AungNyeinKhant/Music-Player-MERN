import { FC, useState, useEffect } from "react";
import AdminDashboard from "../../layouts/AdminDashboard";
import { getPurchases } from "../../services/packageService";
import { handleStatus } from "../../services/packageService";

type Purchase = {
  id: string;
  package_id: string;
  num_of_days: number;
  price: number;
  status: "REJECTED" | "APPROVED" | "PENDING";
  transition: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  package: {
    name: string;
  };
};

const getStatusColor = (status: Purchase["status"]) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Purchases: FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await getPurchases();
        setPurchases(response.data.data);
      } catch (err) {
        setError("Failed to fetch purchases.");
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const handleDropdownClick = (purchaseId: string) => {
    setActiveDropdown(activeDropdown === purchaseId ? null : purchaseId);
  };

  return (
    <AdminDashboard>
      <div className='bg-dashboard-primary p-4 md:p-8 rounded-lg shadow-md'>
        <h1 className='text-3xl font-bold mb-6 text-dashboard-primaryText'>
          Purchase History
        </h1>

        <div className='overflow-x-auto'>
          <table className='min-w-full bg-dashboard-primary rounded-lg pb-6 border border-dashboard-secondary/20'>
            <thead className='bg-dashboard-primaryDark'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-dashboard-primaryText uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-dashboard-primaryText uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-dashboard-primaryText uppercase tracking-wider'>
                  Package
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-dashboard-primaryText uppercase tracking-wider'>
                  Days
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-dashboard-primaryText uppercase tracking-wider'>
                  Price
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-dashboard-primaryText uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-dashboard-primaryText uppercase tracking-wider'>
                  Transaction
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-dashboard-secondary/20'>
              {purchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className='hover:bg-dashboard-primaryDark/50 transition-colors'
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-dashboard-primaryText'>
                    {purchase.user.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-dashboard-primaryText/80'>
                    {purchase.user.email}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-dashboard-primaryText/80'>
                    {purchase.package.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-dashboard-primaryText/80'>
                    {purchase.num_of_days}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-dashboard-primaryText/80'>
                    {purchase.price} MMK
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {purchase.status === "PENDING" ? (
                      <div className='relative'>
                        <button
                          className='px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-dashboard-secondary/20 text-dashboard-secondary hover:bg-dashboard-secondary/30 transition-colors'
                          onClick={() => handleDropdownClick(purchase.id)}
                        >
                          {purchase.status}
                        </button>
                        {activeDropdown === purchase.id && (
                          <div className='absolute mt-2 w-32 bg-dashboard-primary border border-dashboard-secondary/20 rounded-md shadow-lg z-50 flex flex-col'>
                            <button
                              className='w-full px-4 py-2 text-sm text-green-800 hover:bg-dashboard-secondary/20 transition-colors text-left'
                              onClick={async () => {
                                const response = await handleStatus(
                                  purchase.id
                                );
                                if (response.status === 200) {
                                  purchase.status = "APPROVED";
                                  setActiveDropdown(null);
                                }
                              }}
                            >
                              APPROVED
                            </button>
                            <button
                              className='w-full px-4 py-2 text-sm text-red-800 hover:bg-dashboard-secondary/20 transition-colors text-left'
                              onClick={async () => {
                                const response = await handleStatus(
                                  purchase.id,
                                  true
                                );
                                if (response.status === 200) {
                                  purchase.status = "REJECTED";
                                  setActiveDropdown(null);
                                }
                              }}
                            >
                              REJECTED
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          purchase.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {purchase.status}
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-dashboard-primaryText/80'>
                    <img
                      src={purchase.transition}
                      alt='Transaction'
                      className='h-10 w-10 rounded cursor-pointer object-cover hover:opacity-80 transition-opacity'
                      onClick={() => setSelectedImage(purchase.transition)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className='text-dashboard-primaryText mt-4'>Loading...</div>
          )}
          {error && <div className='text-red-500 mt-4'>{error}</div>}
        </div>

        {selectedImage && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
            onClick={() => setSelectedImage(null)}
          >
            <div className='max-w-4xl max-h-[90vh] p-2'>
              <img
                src={selectedImage}
                alt='Transaction'
                className='max-w-full max-h-full object-contain'
              />
            </div>
          </div>
        )}
      </div>
    </AdminDashboard>
  );
};

export default Purchases;
