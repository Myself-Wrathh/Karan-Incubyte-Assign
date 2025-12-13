"use client";

import type React from "react";

import { useState } from "react";
import type { Sweet } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestock: (quantity: number) => Promise<void>;
  sweet: Sweet | null;
}

export function RestockDialog({
  open,
  onOpenChange,
  onRestock,
  sweet,
}: RestockDialogProps) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const qty = Number(quantity);
    if (qty <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      await onRestock(qty);
      setQuantity("");
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Restock failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Restock Sweet</DialogTitle>
          <DialogDescription>
            Add more quantity to {sweet?.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <p className="text-2xl font-bold">{sweet?.quantity || 0}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Add Quantity *</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity to add"
                min="1"
                required
              />
            </div>

            {quantity && Number(quantity) > 0 && (
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground">New Stock</p>
                <p className="text-2xl font-bold text-primary">
                  {(sweet?.quantity || 0) + Number(quantity)}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Restocking..." : "Restock"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
