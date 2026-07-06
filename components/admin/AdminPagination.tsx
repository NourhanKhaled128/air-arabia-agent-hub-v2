"use client";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export default function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            onClick={() => onPageChange?.(page)}
            className={`h-10 w-10 rounded-xl font-semibold transition ${
              page === currentPage
                ? "bg-red-700 text-white"
                : "border hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        );
      })}

    </div>
  );
}