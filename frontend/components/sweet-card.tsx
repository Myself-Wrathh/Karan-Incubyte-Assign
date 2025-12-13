"use client";

import type { Sweet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  isPurchasing?: boolean;
}

export function SweetCard({
  sweet,
  onPurchase,
  onEdit,
  onDelete,
  isAdmin,
  isPurchasing,
}: SweetCardProps) {
  const isOutOfStock = sweet.quantity === 0;

  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-lg">
      <CardHeader>
        <div className="items-start justify-between gap-2">
          <CardTitle className="text-xl font-serif line-clamp-1">
            {sweet.name}
          </CardTitle>
          <Badge
            variant={isOutOfStock ? "destructive" : "secondary"}
            className="shrink-0 text-bold capitalize"
          >
            {sweet.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="aspect-square bg-linear-to-br from-pink-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
          {sweet.imageUrl ? (
            <img
              src={sweet.imageUrl || "/placeholder.svg"}
              alt={sweet.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-6xl">🍬</span>
          )}
        </div>
        {sweet.description && (
          <p className="text-sm line-clamp-2 mb-4">
            {sweet.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${sweet.price.toFixed(2)}
          </span>
          <span
            className={`text-sm font-medium ${
              isOutOfStock ? "text-destructive" : "text-black"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : `${sweet.quantity} in stock`}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {isAdmin ? (
          <>
            <Button
              variant="outline"
              className="flex-1 bg-transparent cursor-pointer"
              onClick={() => onEdit?.(sweet)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              className="flex-1 cursor-pointer"
              onClick={() => onDelete?.(sweet._id)}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button
            className="w-full cursor-pointer"
            disabled={isOutOfStock || isPurchasing}
            onClick={() => onPurchase(sweet._id)}
          >
            {isPurchasing
              ? "Processing..."
              : isOutOfStock
              ? "Out of Stock"
              : "Purchase"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
