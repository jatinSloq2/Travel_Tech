const FilterSidebar = ({ filters = [], onSearch }) => {
  return (
    <aside className="p-4 bg-white rounded-xl shadow-md border border-orange-100 space-y-4">
      {filters.map((filter, index) => {
          if (!filter) return null; 
        const { label, type, value, onChange, options, placeholder } = filter;

        return (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>

            {/* Dropdown */}
            {type === "select" && (
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-orange-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                {options.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {/* Input field */}
            {type === "number" && (
              <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full border border-orange-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            )}

            {/* Text field */}
            {type === "text" && (
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full border border-orange-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            )}
          </div>
        );
      })}

      <button
        onClick={onSearch}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition"
      >
        Apply Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
