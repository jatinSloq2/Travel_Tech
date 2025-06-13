import axiosInstance from "../utils/axiosInstance";

export const addHotel = async (hotelData) => {
  try {
    const response = await axiosInstance.post("/dashboard/vendor/addhotel", hotelData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Add hotel failed"
    );
  }
};
export const addRoom = async (roomData, hotelId) => {
  try {
    const payload = {
      ...roomData,
      hotelId,
      amenities: roomData.amenities.split(",").map((a) => a.trim()),
      images: roomData.images.split(",").map((i) => i.trim()),
    };

    const response = await axiosInstance.post(`/dashboard/vendor/addroom`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Failed to add room",
    };
  }
};
export const deleteRoom = async (roomId) => {
  try {
    await axiosInstance.delete(`/dashboard/vendor/room/deleteroom/${roomId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Failed to delete room",
    };
  }
};
export const deleteHotel = async (hotelId) => {
  try {
    await axiosInstance.delete(`/dashboard/vendor/deletehotel/${hotelId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Failed to delete hotel",
    };
  }
};
export const fetchHotelById = async (id) => {
  try {
    const { data } = await axiosInstance.get(`/hotel/hotels/${id}`);
    console.log(data)
    return { success: true, hotel: data.hotel, rooms: data.rooms };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch hotel",
    };
  }
};
export const updateHotelById = async (id, hotelData) => {
  try {
    const { data } = await axiosInstance.put(`/dashboard/vendor/updatehotel/${id}`, hotelData);
    return { success: data.success };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update hotel",
    };
  }
};
export const fetchRoomById = async (roomId) => {
  try {
    const { data } = await axiosInstance.get(`/dashboard/vendor/room/${roomId}`);
    return { success: true, room: data.room };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch room",
    };
  }
};
export const updateRoomById = async (roomId, roomData) => {
  try {
    const { data } = await axiosInstance.put(`/dashboard/vendor/room/update/${roomId}`, roomData);
    return { success: data.success };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update room",
    };
  }
};
//--------------------------------------------------------------------------------------------------


export const getVendorHotels = async () => {
  const response = await axiosInstance.get("/dashboard/vendor/hotels");
  return response.data;
};
export const getBookingAnalytics = async (hotelId, range, startDate, endDate) => {
  const params = { hotelId, range };
  if (range === "custom") {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  const response = await axiosInstance.get("/dashboard/vendor/analytics/bookings", {
    params,
  });

  return response.data;
};
export const getUpcomingBookings = async (hotelId, ownerId = null) => {
  const params = {};
  if (hotelId) params.hotelId = hotelId;
  if (ownerId) params.ownerId = ownerId;
console.log(params)
  const response = await axiosInstance.get("/dashboard/vendor/bookings/upcoming", {
    params,
  });
  return response.data;
};

export const getRecentReviews = async (hotelId, ownerId = null) => {
  const params = {};
  if (hotelId) params.hotelId = hotelId;
  if (ownerId) params.vendorId = ownerId;
console.log(params)

  const response = await axiosInstance.get("/dashboard/vendor/reviews/recent", {
    params,
  });
  return response.data;
};

export const getTodayInventoryBus = async (busId, dateStr) => {
  const date =
    dateStr || new Date().toISOString().split("T")[0];

  // build query params
  const params = { date };
  if (busId) params.busId = busId;

  const { data } = await axiosInstance.get(
    "/dashboard/vendor/inventory/bus",
    { params }
  );

  return data;
};
export const getTodayInventory = async (hotelId, dateStr) => {
  const date =
    dateStr || new Date().toISOString().split("T")[0];

  // build query params
  const params = { date };
  if (hotelId) params.hotelId = hotelId;

  const { data } = await axiosInstance.get(
    "/dashboard/vendor/inventory",
    { params }
  );

  return data;
};
export const getVendorBuses = async () => {
  const response = await axiosInstance.get("/dashboard/vendor/buses");
  return response.data;
}
export const getBusBookingAnalytics = async (busId, range, startDate, endDate) => {
  const params = { busId, range };
  if (range === "custom") {
    params.startDate = startDate;
    params.endDate = endDate;
  }
  const response = await axiosInstance.get("/dashboard/vendor/bus/analytics/bookings", {
    params,
  });
  return response.data;
};
export const getUpcomingBusBookings = async (busId) => {
  const response = await axiosInstance.get("/dashboard/vendor/bus/bookings/upcoming", {
    params: { busId },
  });
  return response.data;
};
export const getRecentBusReviews = async (busId) => {
  const response = await axiosInstance.get("/dashboard/vendor/bus/reviews/recent", {
    params: { busId },
  });
  return response.data;
};