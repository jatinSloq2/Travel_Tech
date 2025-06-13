import React from "react";
import { Clock } from "lucide-react";
import BusCard from "./BusCard";

const BusList = ({ buses, searching, onSelect, searched }) => {
  // 'searched' is a boolean to indicate if user has performed a search

  if (searching) {
    return (
      <div className="flex items-center justify-center py-10 text-orange-500">
        <Clock className="w-5 h-5 animate-spin mr-2" />
        <span className="text-md font-medium">Searching for buses…</span>
      </div>
    );
  }

  // If user has not searched yet
  if (!searched) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-14 w-14 mb-4 text-orange-400 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          role="img"
          aria-label="Bus icon"
        >
          <rect
            x="3"
            y="7"
            width="18"
            height="10"
            rx="2"
            ry="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 17v2M17 17v2M3 11h18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="19.5" r="1.5" />
          <circle cx="16.5" cy="19.5" r="1.5" />
          <path
            d="M9 7V5a3 3 0 016 0v2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-xl font-semibold text-orange-500 animate-fade-in-up">
          Start your search to find available buses
        </p>
      </div>
    );
  }

  // If user searched but no buses found
  if (buses.length === 0) {
    return (
      <section
        role="region"
        aria-live="polite"
        className="w-full py-24 px-6  text-center text-gray-700"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center space-y-6">
            <svg
              fill="#fb923c"
              height="150px"
              width="150px"
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512.003 512.003"
              xml:space="preserve"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0" />

              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <g id="SVGRepo_iconCarrier">
                {" "}
                <g>
                  {" "}
                  <g>
                    {" "}
                    <g>
                      {" "}
                      <path d="M401.064,234.67c-61.167,0-110.933,49.766-110.933,110.933s49.766,110.933,110.933,110.933 c61.176,0,110.933-49.766,110.933-110.933S462.24,234.67,401.064,234.67z M443.304,375.769c3.336,3.337,3.336,8.73,0,12.066 c-1.664,1.664-3.849,2.5-6.033,2.5c-2.185,0-4.369-0.836-6.033-2.5l-30.174-30.165l-30.165,30.165 c-1.673,1.664-3.857,2.5-6.033,2.5c-2.185,0-4.369-0.836-6.033-2.5c-3.337-3.337-3.337-8.73,0-12.066l30.165-30.165 l-30.165-30.165c-3.337-3.337-3.337-8.738,0-12.066c3.328-3.337,8.73-3.337,12.066,0l30.165,30.165l30.174-30.165 c3.336-3.337,8.73-3.337,12.066,0c3.336,3.328,3.336,8.73,0,12.066l-30.174,30.165L443.304,375.769z" />{" "}
                      <path d="M102.4,337.068c-9.429,0-17.067,7.637-17.067,17.067c0,9.421,7.637,17.067,17.067,17.067s17.067-7.646,17.067-17.067 C119.467,344.706,111.829,337.068,102.4,337.068z" />{" "}
                      <path d="M504.554,146.385l-36.105-39.714h-75.913v85.333h119.467v-26.385C512.003,158.485,509.358,151.65,504.554,146.385z" />{" "}
                      <path d="M76.8,190.402v-82.133c0-0.887-0.717-1.604-1.604-1.604H0v85.333h75.196C76.083,191.997,76.8,191.289,76.8,190.402z" />{" "}
                      <path d="M201.333,106.668h-61.329c-1.92,0-3.473,1.562-3.473,3.465v78.404c0,1.903,1.553,3.465,3.473,3.465h61.329 c1.911,0,3.465-1.562,3.465-3.465v-78.404C204.797,108.23,203.244,106.668,201.333,106.668z" />{" "}
                      <path d="M329.333,106.668h-61.329c-1.92,0-3.473,1.562-3.473,3.465v78.404c0,1.903,1.553,3.465,3.473,3.465h61.329 c1.911,0,3.464-1.562,3.464-3.465v-78.404C332.797,108.23,331.244,106.668,329.333,106.668z" />{" "}
                      <path d="M375.467,194.398v-90.129c0-8.081,6.579-14.669,14.669-14.669h62.805l-22.528-24.772 c-5.402-5.948-13.116-9.361-21.154-9.361h-383.3C11.639,55.467,0,67.115,0,81.425V89.6h75.196c10.3,0,18.671,8.38,18.671,18.671 v82.133c0,10.291-8.371,18.662-18.671,18.662H0v17.067h238.933c4.71,0,8.533,3.823,8.533,8.533c0,4.719-3.823,8.533-8.533,8.533 H0v17.067h273.067c4.71,0,8.533,3.823,8.533,8.533c0,4.719-3.823,8.533-8.533,8.533H0v59.375 c0,14.319,11.639,25.958,25.958,25.958h17.391c4.164,28.894,29.022,51.2,59.051,51.2s54.886-22.306,59.051-51.2h112.887 c-0.751-5.598-1.271-11.264-1.271-17.067c0-70.579,57.421-128,128-128c47.428,0,88.823,25.993,110.933,64.418v-72.951H390.135 C382.046,209.067,375.467,202.488,375.467,194.398z M221.867,188.535c0,11.324-9.216,20.531-20.531,20.531h-61.338 c-11.315,0-20.531-9.207-20.531-20.531v-78.404c0-11.324,9.216-20.531,20.531-20.531h61.338c11.315,0,20.531,9.208,20.531,20.531 V188.535z M102.4,396.8c-23.526,0-42.667-19.14-42.667-42.667c0-23.526,19.14-42.667,42.667-42.667 c23.526,0,42.667,19.14,42.667,42.667C145.067,377.66,125.926,396.8,102.4,396.8z M349.867,188.535 c0,11.324-9.216,20.531-20.531,20.531h-61.338c-11.315,0-20.531-9.207-20.531-20.531v-78.404 c0-11.324,9.216-20.531,20.531-20.531h61.338c11.315,0,20.531,9.208,20.531,20.531V188.535z" />{" "}
                    </g>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
            <h2 className="text-2xl font-bold">No buses found</h2>
            <p className="text-base text-gray-500">
              We couldn’t find any matching train results. Try adjusting your
              filters or search criteria.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // If buses found, show the list
  return (
    <div className="space-y-5">
      {buses.map((bus) => (
        <BusCard key={bus._id} bus={bus} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default BusList;
