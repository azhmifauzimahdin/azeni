"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  function createPageRange(start: number, end: number) {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => start + idx);
  }

  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalPageNumbers) {
      return createPageRange(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = createPageRange(1, leftItemCount);

      return [...leftRange, "...", totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = createPageRange(
        totalPages - rightItemCount + 1,
        totalPages
      );

      return [firstPageIndex, "...", ...rightRange];
    }

    if (showLeftDots && showRightDots) {
      const middleRange = createPageRange(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    return [];
  }, [totalPages, currentPage, siblingCount]);

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination Navigation"
      className="inline-flex items-center space-x-2"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {paginationRange.map((page, idx) => {
        if (page === "...") {
          return (
            <span
              key={`dots-${idx}`}
              className="select-none px-2 text-gray-500"
            >
              &#8230;
            </span>
          );
        }

        return (
          <Button
            key={page}
            variant={page === currentPage ? "primary" : "ghost"}
            size="sm"
            onClick={() => onPageChange(Number(page))}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
