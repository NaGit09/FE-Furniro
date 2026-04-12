"use client";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap mb-6">
      {/* Prev */}
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50 bg-amber-100 text-black hover:bg-gray-100"
      >
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 border rounded ${
            currentPage === p
              ? "bg-yellow-700 text-white"
              : "hover:bg-gray-100 bg-amber-100 text-black"
          }`}
        >
          {p + 1}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50 bg-amber-100 text-black hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
}
