import { FC, useState, useEffect } from "react";
import Dashboard from "../../layouts/Dashboard";
import { getArtistPlayAnalytics,  } from "../../services/analyticService";
import LineChart from "../admin/analytic/LineChart";

const Home: FC = () => {
  const [activeTab, setActiveTab] = useState<"plays" | "revenue" | "tracks">("plays");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [playsData, setPlaysData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });
  const [revenueData, setRevenueData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });
  const [tracksData, setTracksData] = useState<{ labels: string[]; data: number[] }>({
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
        const dateString = startDate.toISOString().split('T')[0];
        
        
          const response:any = await getArtistPlayAnalytics(dateString, selectedPeriod);
          setPlaysData({
            labels: response.data.data.labels || [],
            data: response.data.data.data || [],
          });
        
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [activeTab, selectedPeriod, startDate]);

  const getCurrentMonthTotal = () => {
    if (activeTab === "plays" && playsData.data.length > 0) {
      return playsData.data[playsData.data.length - 1];
    } else if (activeTab === "revenue" && revenueData.data.length > 0) {
      return revenueData.data[revenueData.data.length - 1];
    } else if (activeTab === "tracks" && tracksData.data.length > 0) {
      return tracksData.data[tracksData.data.length - 1];
    }
    return 0;
  };

  return (
    <Dashboard>
      <div className='space-y-6'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div 
            className={`bg-dashboard-secondary p-6 rounded-lg shadow-md text-dashboard-secondaryText hover:bg-dashboard-secondaryDark transition-colors ${activeTab === 'plays' ? 'ring-2 ring-dashboard-secondary' : ''}`}
            onClick={() => setActiveTab('plays')}
          >
            <h3 className='text-lg font-semibold mb-2'>Total Plays</h3>
            <p className='text-3xl font-bold'>
              {loading && activeTab === 'plays' ? "Loading..." : playsData.data.reduce((sum, val) => sum + val, 0).toLocaleString()}
            </p>
            <p className='text-sm mt-2'>
              This Month: {loading && activeTab === 'plays' ? "Loading..." : playsData.data.reduce((sum, val) => sum + val, 0).toLocaleString()}
              {/*loading && activeTab === 'plays' ? "..." : (getCurrentMonthTotal() || 0).toLocaleString()*/}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className='bg-dashboard-primary p-4 rounded-lg shadow-md'>
          <div className='flex justify-between items-center mb-4 relative'>
            
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

          {/* Chart Content */}
          <div className='h-[400px]'>
            {error ? (
              <div className='text-red-500 text-center py-8'>{error}</div>
            ) : loading ? (
              <div className='text-center py-8 text-gray-600'>Loading...</div>
            ) : activeTab === "plays" ? (
              <LineChart
                labels={playsData.labels}
                data={playsData.data}
                title='Plays Over Time'
                xAxisTitle='Time Period'
                yAxisTitle='Number of Plays'
              />
            ) : activeTab === "revenue" ? (
              <LineChart
                labels={revenueData.labels}
                data={revenueData.data}
                title='Revenue Over Time'
                xAxisTitle='Time Period'
                yAxisTitle='Revenue ($)'
              />
            ) : (
              <LineChart
                labels={tracksData.labels}
                data={tracksData.data}
                title='Track Performance'
                xAxisTitle='Time Period'
                yAxisTitle='Number of Active Tracks'
              />
            )}
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Home;
