import { createContext, useContext, useReducer } from "react";
import axiosInstance from "../utils/axiosInstance";

export const HotelContext = createContext();

const initialState = {
  hotels: [],
  loading: false,
  error: null,
  city: "",
  maxPrice: "",
  checkIn: "",      
  checkOut: "",    
  totalRooms: "",   
  totalGuests: "",
  page: 1,
  limit: 10,
  total: 0,
  listings: [],
};

const hotelReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true, error: null };
    case "SET_HOTELS":
      return {
        ...state,
        loading: false,
        hotels: action.payload.hotels,
        total: action.payload.total,
      };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_FILTER":
  return { ...state, ...action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "FETCH_LISTINGS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_LISTINGS_SUCCESS":
      return { ...state, loading: false, listings: action.payload };
    case "FETCH_LISTINGS_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_HOTEL":
      return {
        ...state,
        listings: state.listings.filter(
          (hotel) => hotel._id !== action.payload
        ),
      };
    case "DELETE_ROOM":
      return {
        ...state,
        listings: state.listings.map((hotel) =>
          hotel._id === action.payload.hotelId
            ? {
                ...hotel,
                rooms: hotel.rooms.filter(
                  (room) => room._id !== action.payload.roomId
                ),
              }
            : hotel
        ),
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const HotelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(hotelReducer, initialState);

  const fetchHotels = async () => {
  dispatch({ type: "SET_LOADING" });
  try {
    const {
      city,
      maxPrice,
      page,
      limit,
      checkIn,
      checkOut,
      totalRooms,
      totalGuests,
    } = state;

    const params = new URLSearchParams();

    if (city) params.append("city", city);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (totalRooms) params.append("totalRooms", totalRooms);
    if (totalGuests) params.append("totalGuests", totalGuests);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    const res = await axiosInstance.get(`/hotel/hotels?${params.toString()}`);
    console.log(res);

    dispatch({
      type: "SET_HOTELS",
      payload: {
        hotels: res.data.hotels,
        total: res.data.total,
      },
    });
  } catch (error) {
    dispatch({ type: "SET_ERROR", payload: error.message });
  }
};


  const fetchListings = async () => {
    dispatch({ type: "FETCH_LISTINGS_START" });
    try {
      const res = await axiosInstance.get("/dashboard/vendor/my-listings");
      console.log("LISTINGS from response:", res.data.listings);
      if (res.data.success) {
        dispatch({
          type: "FETCH_LISTINGS_SUCCESS",
          payload: res.data.listings,
        });
      } else {
        dispatch({
          type: "FETCH_LISTINGS_ERROR",
          payload: "Failed to fetch listings",
        });
      }
    } catch (err) {
      dispatch({
        type: "FETCH_LISTINGS_ERROR",
        payload: "Error fetching listings",
      });
    }
  };

  const clearError = () => dispatch({ type: "CLEAR_ERROR" });

  return (
    <HotelContext.Provider
      value={{
        state,
        dispatch,
        fetchHotels,
        fetchListings,
        clearError,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => useContext(HotelContext);
