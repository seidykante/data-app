import React from "react";
import { useNavigation } from "react-router-dom";
interface paginationType {
  currentPage: string;
  hasNextPage: boolean;
  pageSize: string;
  totalItems: number;
  totalPages: number;
}
interface PaginationProps {
  // totalItems: number;
  itemsPerPage: number;
  // totalPages: number;
  currentPage: number;
  pagination: paginationType;
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
  // totalItems,
  itemsPerPage,
  // totalPages,
  pagination,
  currentPage,
  onPageChange,
}) => {
  // const navigate = useNavigation();
  // const totalPages = Math.ceil(totalItems / itemsPerPage);
  const totalPages = Math.ceil(pagination?.totalItems / itemsPerPage);
  // const handlePageChange = async function () {
  //   // const req = await fetch(
  //   //   `https://data-app-be-production.up.railway.app/v1/dashboard/users?page=${currentPage}`
  //   // );
  //   // const res = req.json();
  //   // console.log("res", res);
  //   // console.log("req", req);
  //   onPageChange((s) => s + 1);
  // };
  console.log(
    "total page",
    totalPages,
    "current page",
    currentPage,
    "item perPage",
    itemsPerPage
  );
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
        onClick={() => onPageChange((s) => s + 1)}
        className="px-3 py-1 text-sm bg-white border rounded hover:bg-grey-500"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
