import React, { useEffect, useState } from "react";
import {
  getVendorHotels,
  getBookingAnalytics,
  getUpcomingBookings,
  getRecentReviews,
  getTodayInventory,
  getVendorBuses,
  getBusBookingAnalytics,
  getUpcomingBusBookings,
  getRecentBusReviews,
  getTodayInventoryBus,
} from "../Services/DashboardServices";

import Filters from "../Components/Dashboard/Filters";
import BookingAnalytics from "../Components/Dashboard/BookingAnalytics";
import UpcomingBookingsList from "../Components/Dashboard/UpcomingBookingsList";
import RecentReviewsList from "../Components/Dashboard/RecentReviewsList";
import InventoryTable from "../Components/Dashboard/InventoryTable";
import SummaryCard from "../Components/Dashboard/SummaryCard";
import Top10Entities from "../Components/Admin/Top10Entities";

const ranges = [
  "today",
  "yesterday",
  "thisWeek",
  "lastWeek",
  "last7",
  "last30",
  "last90",
  "thisMonth",
  "lastMonth",
  "thisYear",
  "yearToDate",
  "lastYear",
  "custom",
  "total",
];
const todayStr = () => new Date().toISOString().split("T")[0];

const VendorDashboard = () => {
  const [type, setType] = useState("hotel");
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState("all");
  const [inventoryDate, setInventoryDate] = useState(todayStr());

  const [analyticsData, setAnalyticsData] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [range, setRange] = useState("last7");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [ownerId, setOwnerId] = useState(33);

  useEffect(() => {
    const fetchEntities = async () => {
      setLoading(true);
      try {
        if (type === "hotel") {
          const hotels = (await getVendorHotels()) || [];
          setEntities(hotels);
        } else if (type === "bus") {
          const buses = (await getVendorBuses()) || [];
          setEntities(buses);
        } else if (type === "all") {
          const hotels = (await getVendorHotels()) || [];
          const buses = (await getVendorBuses()) || [];

          // Prefix bus IDs and names to distinguish them
          const busesPrefixed = buses.map((bus) => ({
            ...bus,
            _id: `bus_${bus._id}`,
            name: `[Bus] ${bus.name || bus.operator || "Unnamed Bus"}`,
          }));

          setEntities([...hotels, ...busesPrefixed]);
        }
        setSelectedEntity("all");
      } catch (err) {
        console.error("Error fetching entities:", err);
        setEntities([]);
        setSelectedEntity("all");
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, [type]);

  useEffect(() => {
    if (!selectedEntity) return;

    const fetchData = async () => {
      setLoading(true);
      if (range === "custom" && (!customStartDate || !customEndDate)) {
        setLoading(false);
        setAnalyticsData([]);
        setUpcomingBookings([]);
        setRecentReviews([]);
        setInventory([]);
        return;
      }
      try {
        if (type === "hotel") {
          const analytics = await getBookingAnalytics(
            selectedEntity === "all" ? null : selectedEntity,
            range
          );
          const bookings = await getUpcomingBookings(
            selectedEntity === "all" ? null : selectedEntity,
            ownerId
          );
          const reviews = await getRecentReviews(
            selectedEntity === "all" ? null : selectedEntity,
            ownerId
          );
          const stock = await getTodayInventory(
            selectedEntity === "all" ? null : selectedEntity,
            inventoryDate
          );

          setAnalyticsData(analytics || []);
          setUpcomingBookings(bookings || []);
          setRecentReviews(reviews || []);
          setInventory(stock || []);
        } else if (type === "bus") {
          const busId = selectedEntity === "all" ? null : selectedEntity;

          const analytics = await getBusBookingAnalytics(busId, range);
          const bookings = await getUpcomingBusBookings(busId);
          const reviews = await getRecentBusReviews(busId);
          const stock = await getTodayInventoryBus(busId, inventoryDate);

          setAnalyticsData(analytics || []);
          setUpcomingBookings(bookings || []);
          setRecentReviews(reviews || []);
          setInventory(stock || []);
        } else if (type === "all") {
          if (selectedEntity === "all") {
            const hotelAnalytics = await getBookingAnalytics(null, range);
            const busAnalytics = await getBusBookingAnalytics(null, range);
            const hotelBookings = await getUpcomingBookings(null);
            const busBookings = await getUpcomingBusBookings(null);
            const hotelReviews = await getRecentReviews(null);
            const busReviews = await getRecentBusReviews(null);
            const hotelInventory = await getTodayInventory(null, inventoryDate);
            const busInventory = await getTodayInventoryBus(
              null,
              inventoryDate
            );

            setAnalyticsData([...hotelAnalytics, ...busAnalytics]);
            setUpcomingBookings([...hotelBookings, ...busBookings]);
            setRecentReviews([...hotelReviews, ...busReviews]);
            setInventory([...hotelInventory, ...busInventory]);
          } else if (selectedEntity.startsWith("bus_")) {
            const busId = selectedEntity.replace("bus_", "");

            const analytics = await getBusBookingAnalytics(busId, range);
            const bookings = await getUpcomingBusBookings(busId);
            const reviews = await getRecentBusReviews(busId);
            const stock = await getTodayInventoryBus(busId, inventoryDate);

            setAnalyticsData(analytics || []);
            setUpcomingBookings(bookings || []);
            setRecentReviews(reviews || []);
            setInventory(stock || []);
          } else {
            const analytics = await getBookingAnalytics(selectedEntity, range);
            const bookings = await getUpcomingBookings(selectedEntity);
            const reviews = await getRecentReviews(selectedEntity);
            const stock = await getTodayInventory(
              selectedEntity,
              inventoryDate
            );

            setAnalyticsData(analytics || []);
            setUpcomingBookings(bookings || []);
            setRecentReviews(reviews || []);
            setInventory(stock || []);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setAnalyticsData([]);
        setUpcomingBookings([]);
        setRecentReviews([]);
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedEntity, range, type, inventoryDate, ownerId]);

  const handleCustomSubmit = async () => {
    if (!customStartDate || !customEndDate) {
      alert("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    try {
      if (type === "hotel") {
        const analytics = await getBookingAnalytics(
          selectedEntity === "all" ? null : selectedEntity,
          "custom",
          customStartDate,
          customEndDate
        );
        const bookings = await getUpcomingBookings(
          selectedEntity === "all" ? null : selectedEntity
        );
        const reviews = await getRecentReviews(
          selectedEntity === "all" ? null : selectedEntity
        );
        const stock = await getTodayInventory(
          selectedEntity === "all" ? null : selectedEntity,
          inventoryDate
        );

        setAnalyticsData(analytics || []);
        setUpcomingBookings(bookings || []);
        setRecentReviews(reviews || []);
        setInventory(stock || []);
      } else if (type === "bus") {
        const busId = selectedEntity === "all" ? null : selectedEntity;

        const analytics = await getBusBookingAnalytics(
          busId,
          null,
          customStartDate,
          customEndDate
        );
        const bookings = await getUpcomingBusBookings(busId);
        const reviews = await getRecentBusReviews(busId);
        const stock = await getTodayInventoryBus(busId, inventoryDate);

        setAnalyticsData(analytics || []);
        setUpcomingBookings(bookings || []);
        setRecentReviews(reviews || []);
        setInventory(stock || []);
      } else if (type === "all") {
        if (selectedEntity === "all") {
          const hotelAnalytics = await getBookingAnalytics(
            null,
            null,
            customStartDate,
            customEndDate
          );
          const busAnalytics = await getBusBookingAnalytics(
            null,
            null,
            customStartDate,
            customEndDate
          );
          const hotelBookings = await getUpcomingBookings(null);
          const busBookings = await getUpcomingBusBookings(null);
          const hotelReviews = await getRecentReviews(null);
          const busReviews = await getRecentBusReviews(null);
          const hotelInventory = await getTodayInventory(null, inventoryDate);
          const busInventory = await getTodayInventoryBus(null, inventoryDate);

          setAnalyticsData([...hotelAnalytics, ...busAnalytics]);
          setUpcomingBookings([...hotelBookings, ...busBookings]);
          setRecentReviews([...hotelReviews, ...busReviews]);
          setInventory([...hotelInventory, ...busInventory]);
        } else if (selectedEntity.startsWith("bus_")) {
          const busId = selectedEntity.replace("bus_", "");

          const analytics = await getBusBookingAnalytics(
            busId,
            null,
            customStartDate,
            customEndDate
          );
          const bookings = await getUpcomingBusBookings(busId);
          const reviews = await getRecentBusReviews(busId);
          const stock = await getTodayInventoryBus(busId, inventoryDate);

          setAnalyticsData(analytics || []);
          setUpcomingBookings(bookings || []);
          setRecentReviews(reviews || []);
          setInventory(stock || []);
        } else {
          const analytics = await getBookingAnalytics(
            selectedEntity,
            null,
            customStartDate,
            customEndDate
          );
          const bookings = await getUpcomingBookings(selectedEntity);
          const reviews = await getRecentReviews(selectedEntity);
          const stock = await getTodayInventory(selectedEntity, inventoryDate);

          setAnalyticsData(analytics || []);
          setUpcomingBookings(bookings || []);
          setRecentReviews(reviews || []);
          setInventory(stock || []);
        }
      }
    } catch (err) {
      console.error("Error fetching data for custom range:", err);
      setAnalyticsData([]);
      setUpcomingBookings([]);
      setRecentReviews([]);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const totalBookings =
    analyticsData?.reduce((sum, item) => sum + (item.bookings || 0), 0) ?? 0;

  const totalRevenue =
    analyticsData?.reduce((sum, item) => sum + (item.revenue || 0), 0) ?? 0;

  return (
    <div className="px-6 py-6">
      {" "}
      {/* outer padding */}
      <div className="max-w-7xl mx-auto space-y-8">
        {" "}
        {/* container with max width and centering */}
        <Filters
          type={type}
          setType={setType}
          entities={entities}
          selectedEntity={selectedEntity}
          setSelectedEntity={setSelectedEntity}
          range={range}
          setRange={setRange}
          loading={loading}
          ranges={ranges}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          onCustomSubmit={handleCustomSubmit}
        />
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-6 max-w-md">
          <SummaryCard
            title="Total Bookings"
            value={totalBookings}
            loading={loading}
          />
          <SummaryCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            loading={loading}
          />
        </div>
        <BookingAnalytics analyticsData={analyticsData} loading={loading} />
        <UpcomingBookingsList
          upcomingBookings={upcomingBookings}
          loading={loading}
          ownerId={ownerId}
          setOwnerId={setOwnerId}
        />
        <RecentReviewsList
          recentReviews={recentReviews}
          loading={loading}
          ownerId={ownerId}
          setOwnerId={setOwnerId}
        />
        <InventoryTable
          inventory={inventory}
          loading={loading}
          inventoryDate={inventoryDate}
          setInventoryDate={setInventoryDate}
          todayStr={todayStr}
        />
      </div>
    </div>
  );
};

export default VendorDashboard;
