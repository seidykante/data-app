import React from "react";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const generatePageNumbers = ({ totalPages, currentPage }: any) => {
  const pages = [];
  if (totalPages <= 5) {
    // If there are 5 or fewer pages, just show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show first page, then ellipsis, then last few pages
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(currentPage - 1, 2);
    const end = Math.min(currentPage + 1, totalPages - 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }
  return pages;
};

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex items-center justify-center mt-6 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 text-sm bg-white border rounded hover:bg-grey-500"
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {generatePageNumbers({ totalPages, currentPage }).map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-3 py-1 text-sm">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 text-sm rounded ${
                page === currentPage
                  ? "bg-primary text-white"
                  : "bg-white border hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 text-sm bg-white border rounded hover:bg-grey-500"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
