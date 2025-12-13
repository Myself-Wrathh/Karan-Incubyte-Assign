"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface SearchFilterProps {
  onSearch: (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
}

const categories = [
  "chocolate",
  "candy",
  "gummy",
  "lollipop",
  "hard-candy",
  "caramel",
  "other",
];

export function SearchFilter({ onSearch }: SearchFilterProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    onSearch({
      name: name || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleClear = () => {
    setName("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    onSearch({});
  };

  const hasFilters = name || category || minPrice || maxPrice;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search sweets by name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Min Price</label>
            <Input
              type="number"
              placeholder="$0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Max Price</label>
            <Input
              type="number"
              placeholder="$100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button onClick={handleSearch} className="flex-1 md:flex-none">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          {hasFilters && (
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1 md:flex-none bg-transparent"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
