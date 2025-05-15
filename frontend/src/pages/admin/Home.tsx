import { FC, useState, useEffect } from "react";
import AdminDashboard from "../../layouts/AdminDashboard";
import LineChart from "./analytic/LineChart";
import {
  getPlayAnalytics,
  getPurchaseAnalytics,
  getMonthlyTotalAnalytics,
} from "../../services/analyticService";

const Home: FC = () => {
  const [activeTab, setActiveTab] = useState<"streams" | "purchases">(
    "streams"
  );
  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [monthlyTotals, setMonthlyTotals] = useState<{
    totalPlayCount: number;
    totalPurchaseAmount: number;
  }>({ totalPlayCount: 0, totalPurchaseAmount: 0 });
  const [streamsData, setStreamsData] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });
  const [purchasesData, setPurchasesData] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!startDate) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch monthly totals
        const totalsResponse: any = await getMonthlyTotalAnalytics();
        setMonthlyTotals(totalsResponse.data.data);

        const dateString = startDate.toISOString().split("T")[0];

        if (activeTab === "streams") {
          const response: any = await getPlayAnalytics(
            dateString,
            selectedPeriod
          );
          setStreamsData({
            labels: response.data.labels || [],
            data: response.data.data || [],
          });
        } else {
          const response: any = await getPurchaseAnalytics(
            dateString,
            selectedPeriod
          );
          setPurchasesData({
            labels: response.data.labels || [],
            data: response.data.data || [],
          });
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [activeTab, selectedPeriod, startDate]);

  return (
    <AdminDashboard>
      <div className='space-y-6'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='bg-dashboard-secondary p-6 rounded-lg shadow-md text-dashboard-secondaryText hover:bg-dashboard-secondaryDark transition-colors'>
            <h3 className='text-lg font-semibold mb-2'>This Month's Streams</h3>
            <p className='text-3xl font-bold'>
              {loading ? "Loading..." : monthlyTotals.totalPlayCount}
            </p>
          </div>
          <div className='bg-dashboard-secondary p-6 rounded-lg shadow-md text-dashboard-secondaryText hover:bg-dashboard-secondaryDark transition-colors'>
            <h3 className='text-lg font-semibold mb-2'>
              Revenue of this month
            </h3>
            <p className='text-3xl font-bold'>
              {loading
                ? "Loading..."
                : `${monthlyTotals.totalPurchaseAmount} MMK`}
            </p>
          </div>
        </div>

        {/* Tabs and Time Period Selection */}
        <div className='bg-dashboard-primary p-4 rounded-lg shadow-md'>
          <div className='flex justify-between items-center mb-4 relative'>
            <div className='flex space-x-4'>
              <button
                onClick={() => setActiveTab("streams")}
                className={`px-4 py-2 rounded ${
                  activeTab === "streams"
                    ? "bg-dashboard-secondary text-dashboard-secondaryText"
                    : "text-gray-600"
                }`}
              >
                Streams
              </button>
              <button
                onClick={() => setActiveTab("purchases")}
                className={`px-4 py-2 rounded ${
                  activeTab === "purchases"
                    ? "bg-dashboard-secondary text-dashboard-secondaryText"
                    : "text-gray-600"
                }`}
              >
                Purchases
              </button>
            </div>
            <div className='absolute right-0 top-0 flex items-center gap-4 z-10'>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className='bg-dashboard-secondary text-dashboard-primaryText px-3 py-1 rounded-md border border-dashboard-border focus:outline-none focus:border-blue-500'
              >
                <option value='monthly'>Monthly</option>
                <option value='yearly'>Yearly</option>
              </select>

              <div className='flex items-center gap-2'>
                <input
                  type='date'
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                  className='bg-gray-700 text-gray-200 px-3 py-1 rounded-md border border-gray-600 focus:outline-none focus:border-gray-500'
                />
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className='h-[400px]'>
            {error ? (
              <div className='text-red-500 text-center py-8'>{error}</div>
            ) : loading ? (
              <div className='text-center py-8 text-gray-600'>Loading...</div>
            ) : activeTab === "streams" ? (
              <LineChart
                labels={streamsData.labels}
                data={streamsData.data}
                title='Monthly Active Listeners'
                xAxisTitle='Month'
                yAxisTitle='Number of Listeners'
              />
            ) : (
              <LineChart
                labels={purchasesData.labels}
                data={purchasesData.data}
                title='Monthly Purchases'
                xAxisTitle='Month'
                yAxisTitle='Revenue ($)'
              />
            )}
          </div>
        </div>
      </div>
    </AdminDashboard>
  );
};

export default Home;
