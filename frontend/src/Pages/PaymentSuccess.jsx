import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [message, setMessage] = useState("Processing your booking...");
  const [status, setStatus] = useState("loading");
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const navigate = useNavigate();

  const confirmBooking = async () => {
    try {
      const typeRes = await axiosInstance.get(
        `/payment/get-booking-type?session_id=${sessionId}`
      );
      const bookingType = typeRes.data.bookingType;
      let endpoint = "";
      switch (bookingType) {
        case "bus":
          endpoint = `/bus/booking?session_id=${sessionId}`;
          break;
        case "flight":
          endpoint = `/flight/booking?session_id=${sessionId}`;
          break;
        case "train":
          endpoint = `/train/booking?session_id=${sessionId}`;
          break;
        case "hotel":
          endpoint = `/hotel/book?session_id=${sessionId}`;
          break;
        default:
          throw new Error("Unknown booking type");
      }

      await axiosInstance.post(endpoint);

      setStatus("success");
      setMessage(
        "Your booking has been confirmed. Check your email for details."
      );
      setRedirecting(true);

      const intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            navigate("/", { replace: true });
          }
          return prev - 1;
        });
      }, 1000);
      navigate("/payment-success?session_id=" + sessionId, { replace: true });
    } catch (err) {
      console.error("❌ Booking confirmation failed:", err);
      setStatus("error");
      setMessage(
        "There was an issue confirming your booking. Please contact support."
      );
    }
  };

  useEffect(() => {
    if (sessionId) {
      confirmBooking();

      const handlePopState = () => {
        navigate("/", { replace: true });
      };

      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [sessionId]);

  return (
    <div className="text-center mt-16 px-4">
      <h2
        className={`text-2xl font-bold ${
          status === "success"
            ? "text-emerald-600"
            : status === "error"
            ? "text-red-600"
            : "text-gray-800"
        }`}
      >
        {status === "success"
          ? "Payment Successful!"
          : status === "error"
          ? "Booking Failed"
          : "Please wait..."}
      </h2>
      <p className="mt-4 text-gray-600">{message}</p>

      {redirecting && status === "success" && (
        <div className="mt-6">
          <p className="text-blue-500">
            {" "}
            Redirecting to home in {countdown} second{countdown !== 1 && "s"}...
          </p>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Home Now
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
