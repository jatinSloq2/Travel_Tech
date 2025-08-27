import { parseISO } from "date-fns";
import { CalendarDays, Clock, Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AirportAutocomplete from "./AirportAutocomplete";

const FlightSearchForm = ({
  airports,
  fromQuery,
  toQuery,
  setFromQuery,
  setToQuery,
  date,
  setDate,
  onSearch,
  searching = false,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl border border-orange-100 rounded-xl p-8 mb-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
    >
      {/* From */}
      <div className="col-span-12 md:col-span-4">
        <AirportAutocomplete
          label="From"
          query={fromQuery}
          setQuery={setFromQuery}
          airports={airports}
          type="from"
        />
      </div>

      {/* To */}
      <div className="col-span-12 md:col-span-4">
        <AirportAutocomplete
          label="To"
          query={toQuery}
          setQuery={setToQuery}
          airports={airports}
          type="to"
        />
      </div>

      {/* Journey Date */}
      <div className="col-span-12 md:col-span-2">
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 pointer-events-none" />
          <DatePicker
            selected={date ? parseISO(date) : null}
            onChange={(date) => {
              const formatted = date.toLocaleDateString("en-CA");
              setDate(formatted);
            }}
            minDate={new Date()}
            placeholderText="Journey Date"
            className="w-full pl-10 pr-3 py-2 border border-orange-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="col-span-12 md:col-span-2">
        <button
          type="submit"
          disabled={searching}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-60"
        >
          {searching ? (
            <>
              <Clock className="w-4 h-4 animate-spin" /> Searching…
            </>
          ) : (
            <>
              <Search className="w-4 h-4" /> Search
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FlightSearchForm;
