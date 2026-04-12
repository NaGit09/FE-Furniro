"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { setPageable, setProducts } from "@/stores/slices/product.store";
import { Menu, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProductFilter() {
  const dispatch = useDispatch();

  const { totalElements, pageable, products } = useSelector(
    (state: RootState) => state.productSlice,
  );

  const [sortLabel, setSortLabel] = useState("Default");

  const handleSort = (type: string, label: string) => {
    let sorted = [...products];

    switch (type) {
      case "price_desc":
        sorted.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "price_asc":
        sorted.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "name_asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setSortLabel(label);
    dispatch(setProducts(sorted));
  };

  return (
    <div className="w-full bg-amber-50 px-6 py-3 min-h-[100px] flex flex-wrap items-center justify-between gap-4 rounded-xl">
      {/* LEFT */}
      <div className="flex items-center gap-4 text-sm text-gray-700">
        <button className="flex items-center gap-2 hover:text-black transition">
          <Menu size={18} />
          <span className="text-xl">Filter</span>
        </button>

        <div className="w-px h-5 bg-gray-300" />

        <span className="text-xl">
          Showing 1–{pageable.pageSize} of {totalElements} results
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4 text-sm">
        {/* Show */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xl">Show</span>
          <select
            value={pageable.pageSize}
            onChange={(e) =>
              dispatch(setPageable({ pageSize: Number(e.target.value) }))
            }
            className="px-3 py-1.5 text-lg border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={32}>32</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xl">Sort by</span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-gray-300 shadow-sm hover:bg-gray-100"
              >
                <span className="text-lg">{sortLabel}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl shadow-lg border border-gray-200 p-1"
            >
              <DropdownMenuLabel className="text-gray-500 text-xs px-2 py-1">
                Sắp xếp
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleSort("price_desc", "Giá cao → thấp")}
                className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                Giá cao → thấp
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleSort("price_asc", "Giá thấp → cao")}
                className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                Giá thấp → cao
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleSort("name_asc", "Tên A → Z")}
                className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                Tên A → Z
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleSort("name_desc", "Tên Z → A")}
                className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-100"
              >
                Tên Z → A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
