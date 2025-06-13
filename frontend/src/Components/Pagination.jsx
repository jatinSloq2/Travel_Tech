const Pagination = ({ total, limit, currentPage, onPageChange }) => {
  const pageCount = Math.ceil(total / limit);

  return (
    <div className="flex justify-center mt-8 space-x-2">
      {Array.from({ length: pageCount }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 border rounded-md transition ${
            currentPage === i + 1
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
