const SectionNav = ({ sections, activeSection, onChange }) => (
  <nav className="mb-8 pb-2 overflow-x-auto">
    <div className="flex space-x-4 min-w-max">
      {sections.map(({ key, label }) => (
        <button
          key={key}
          className={`px-3 py-1 font-semibold whitespace-nowrap transition-colors duration-200 ${
            activeSection === key
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-600 hover:text-orange-500"
          }`}
          onClick={() => onChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  </nav>
);

export default SectionNav;
