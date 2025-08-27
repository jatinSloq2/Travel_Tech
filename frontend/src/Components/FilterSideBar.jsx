import { FaChevronDown, FaFilter, FaSearch } from 'react-icons/fa';

const FilterSidebar = ({ filters = [], onSearch, title = "Filters" }) => {
  return (
    <aside className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <FaFilter className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">Refine your search results</p>
      </div>

      {/* Filter Content */}
      <div className="p-6 space-y-6">
        {filters.map((filter, index) => {
          if (!filter) return null;
          const { label, type, value, onChange, options, placeholder } = filter;

          return (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {label}
              </label>

              {/* Dropdown */}
              {type === "select" && (
                <div className="relative">
                  <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 px-4 py-3 pr-10 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 font-medium"
                  >
                    {options?.map((opt, i) => (
                      <option key={i} value={opt.value} className="py-2">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <FaChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Number Input */}
              {type === "number" && (
                <div className="relative">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    // placeholder={placeholder}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 font-medium placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <span className="text-gray-400 text-sm">₹</span>
                  </div>
                </div>
              )}

              {/* Text Input */}
              {type === "text" && (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 font-medium placeholder-gray-400"
                />
              )}

              {/* Date Input */}
              {type === "date" && (
                <input
                  type="date"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 font-medium"
                />
              )}

              {/* Range Input */}
              {type === "range" && (
                <div className="space-y-3">
                  <input
                    type="range"
                    min={filter.min || 0}
                    max={filter.max || 100}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #fb923c 0%, #fb923c ${((value - (filter.min || 0)) / ((filter.max || 100) - (filter.min || 0))) * 100}%, #e5e7eb ${((value - (filter.min || 0)) / ((filter.max || 100) - (filter.min || 0))) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filter.min || 0}</span>
                    <span className="font-medium text-orange-600">{value}</span>
                    <span>{filter.max || 100}</span>
                  </div>
                </div>
              )}

              {/* Checkbox Group */}
              {type === "checkbox" && (
                <div className="space-y-3">
                  {options?.map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={Array.isArray(value) ? value.includes(opt.value) : false}
                          onChange={(e) => {
                            const currentValues = Array.isArray(value) ? value : [];
                            if (e.target.checked) {
                              onChange([...currentValues, opt.value]);
                            } else {
                              onChange(currentValues.filter(v => v !== opt.value));
                            }
                          }}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                          Array.isArray(value) && value.includes(opt.value)
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-gray-300 group-hover:border-orange-400'
                        }`}>
                          {Array.isArray(value) && value.includes(opt.value) && (
                            <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Radio Group */}
              {type === "radio" && (
                <div className="space-y-3">
                  {options?.map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="radio"
                          name={`radio-${index}`}
                          checked={value === opt.value}
                          onChange={() => onChange(opt.value)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded-full transition-all duration-200 ${
                          value === opt.value
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-gray-300 group-hover:border-orange-400'
                        }`}>
                          {value === opt.value && (
                            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with Apply Button */}
      <div className="p-6 pt-0">
        <button
          onClick={onSearch}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white py-2 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3 group"
        >
          <FaSearch className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Apply
        </button>

        {/* Reset Option */}
        <button
          onClick={() => {
            filters.forEach(filter => {
              if (filter && filter.onChange) {
                if (filter.type === 'checkbox') {
                  filter.onChange([]);
                } else if (filter.type === 'select' && filter.options?.[0]) {
                  filter.onChange(filter.options[0].value);
                } else {
                  filter.onChange('');
                }
              }
            });
          }}
          className="w-full mt-3 text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
        >
          Clear All Filters
        </button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #fb923c;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fb923c;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </aside>
  );
};

export default FilterSidebar;