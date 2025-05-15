import { FC, useState, useEffect } from "react";
import AdminDashboard from "../../layouts/AdminDashboard";
import StackBarChart from "./analytic/StackBarChart";
import { getGenreAnalytics, getAlbumAnalytics, getArtistAnalytics } from "../../services/analyticService";

type DataItem = {
  id: string;
  name: string;
  count: number;
};

type ApiResponse = {
  data: {
    labels: string[];
    data: DataItem[][];
  };
};

const Analysis: FC = () => {
  const [activeTab, setActiveTab] = useState<"genres" | "albums" | "artists">("genres");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  // Generate random colors for datasets
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };

  // Transform API data into chart format
  const transformData = (apiData: ApiResponse) => {
    // Get all unique items across all months
    const allItems = new Set<string>();
    apiData.data.data.forEach(monthData => {
      monthData.forEach(item => {
        allItems.add(item.name);
      });
    });

    // Create datasets for each unique item
    const datasets = Array.from(allItems).map(item => {
      // Get data for each month
      const data = apiData.data.labels.map((_, monthIndex) => {
        const monthData = apiData.data.data[monthIndex];
        const itemData = monthData.find(d => d.name === item);
        return itemData ? itemData.count : 0;
      });

      return {
        label: item,
        data,
        backgroundColor: getRandomColor(),
      };
    });

    return {
      labels: apiData.data.labels,
      datasets,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate) return;
      
      setLoading(true);
      setError(null);

      try {
        const date = startDate.toISOString().split('T')[0];
        let response: any;

        switch (activeTab) {
          case "genres":
            response = await getGenreAnalytics(date);
            break;
          case "albums":
            response = await getAlbumAnalytics(date);
            break;
          case "artists":
            response = await getArtistAnalytics(date);
            break;
          default:
            response = await getGenreAnalytics(date);
        }

        const transformedData = transformData(response);
        setChartData(transformedData);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, startDate]);

  const getActiveData = () => {
    switch (activeTab) {
      case "genres":
        return {
          title: "Genre Performance Metrics",
          yAxisTitle: "Streams",
        };
      case "albums":
        return {
          title: "Album Performance Metrics",
          yAxisTitle: "Sales",
        };
      case "artists":
        return {
          title: "Artist Performance Metrics",
          yAxisTitle: "Streams",
        };
      default:
        return {
          title: "Genre Performance Metrics",
          yAxisTitle: "Streams",
        };
    }
  };

  const activeData = getActiveData();

  return (
    <AdminDashboard>
      <div className='bg-dashboard-primary p-4 md:p-8 rounded-lg shadow-md space-y-6'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>Music Analytics</h1>
          <p className='text-dashboard-primaryDarkText mb-6'>
            Track your music performance metrics
          </p>
        </div>

        <div className='bg-dashboard-primary p-6 rounded-lg'>
          <div className='flex justify-between items-center mb-6'>
            <div className='flex space-x-4'>
              <button
                onClick={() => setActiveTab("genres")}
                className={`px-4 py-2 rounded ${
                  activeTab === "genres"
                    ? "bg-dashboard-secondary text-dashboard-secondaryText"
                    : "text-gray-600"
                }`}
              >
                Genres
              </button>
              <button
                onClick={() => setActiveTab("albums")}
                className={`px-4 py-2 rounded ${
                  activeTab === "albums"
                    ? "bg-dashboard-secondary text-dashboard-secondaryText"
                    : "text-gray-600"
                }`}
              >
                Albums
              </button>
              <button
                onClick={() => setActiveTab("artists")}
                className={`px-4 py-2 rounded ${
                  activeTab === "artists"
                    ? "bg-dashboard-secondary text-dashboard-secondaryText"
                    : "text-gray-600"
                }`}
              >
                Artists
              </button>
            </div>
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

          {error ? (
            <div className='text-red-500 text-center py-8'>{error}</div>
          ) : loading ? (
            <div className='text-center py-8 text-gray-600'>Loading...</div>
          ) : (
            <StackBarChart
              labels={chartData.labels}
              datasets={chartData.datasets}
              title={activeData.title}
              xAxisTitle='Month'
              yAxisTitle={activeData.yAxisTitle}
            />
          )}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default Analysis;
