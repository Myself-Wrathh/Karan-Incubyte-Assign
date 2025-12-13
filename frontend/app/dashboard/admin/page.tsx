"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useAuth } from "@/lib/auth-context";
import { sweetsAPI, type Sweet, type ApiError } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { SweetCard } from "@/components/sweet-card";
import { SweetFormDialog } from "@/components/sweet-form-dialog";
import { RestockDialog } from "@/components/restock-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Plus, Loader2, PackagePlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isAdmin, router]);

  // Fetch sweets data
  const {
    data: sweetsData,
    error,
    mutate,
  } = useSWR(
    isAuthenticated && isAdmin ? "admin-sweets" : null,
    () => sweetsAPI.getAll(),
    {
      revalidateOnFocus: false,
    }
  );

  const handleCreate = async (data: any) => {
    try {
      await sweetsAPI.create(data);
      setMessage({ type: "success", text: "Sweet created successfully!" });
      mutate();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      const apiError = err as ApiError;
      throw new Error(apiError.message || "Failed to create sweet");
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedSweet) return;

    try {
      await sweetsAPI.update(selectedSweet._id, data);
      setMessage({ type: "success", text: "Sweet updated successfully!" });
      mutate();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      const apiError = err as ApiError;
      throw new Error(apiError.message || "Failed to update sweet");
    }
  };

  const handleDelete = async () => {
    if (!selectedSweet) return;

    try {
      await sweetsAPI.delete(selectedSweet._id);
      setMessage({ type: "success", text: "Sweet deleted successfully!" });
      setDeleteDialogOpen(false);
      setSelectedSweet(null);
      mutate();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      const apiError = err as ApiError;
      setMessage({
        type: "error",
        text: apiError.message || "Failed to delete sweet",
      });
    }
  };

  const handleRestock = async (quantity: number) => {
    if (!selectedSweet) return;

    try {
      await sweetsAPI.restock(selectedSweet._id, quantity);
      setMessage({ type: "success", text: "Sweet restocked successfully!" });
      mutate();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      const apiError = err as ApiError;
      throw new Error(apiError.message || "Failed to restock sweet");
    }
  };

  const openEditDialog = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    const sweet = sweetsData?.data.find((s: Sweet) => s._id === id);
    if (sweet) {
      setSelectedSweet(sweet);
      setDeleteDialogOpen(true);
    }
  };

  const openRestockDialog = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setRestockDialogOpen(true);
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const sweets = sweetsData?.data || [];
  const isLoading = !sweetsData && !error;

  return (
    <div className="min-h-screen bg-background p-5">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-3xl font-serif font-bold">Admin Panel</h2>
            <p className="text-muted-foreground mt-1">
              Manage your sweet inventory
            </p>
          </div>
          <Button
            className="cursor-pointer"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Sweet
          </Button>
        </div>

        {message && (
          <Alert
            variant={message.type === "error" ? "destructive" : "default"}
            className="mb-6"
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load sweets. Please try again later.
            </AlertDescription>
          </Alert>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-xl font-semibold mb-2">No sweets yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your first sweet to get started
            </p>
            <Button
              className="cursor-pointer"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sweet
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5">
              {sweets.map((sweet: Sweet) => (
                <div key={sweet._id} className="relative group">
                  <SweetCard
                    sweet={sweet}
                    onPurchase={() => {}}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    isAdmin={true}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 transition-opacity cursor-pointer border border-black"
                    onClick={() => openRestockDialog(sweet)}
                  >
                    <PackagePlus className="w-4 h-4 mr-1" />
                    Click to Restock
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Managing {sweets.length}{" "}
              {sweets.length === 1 ? "sweet" : "sweets"}
            </div>
          </>
        )}
      </main>

      <SweetFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
        title="Add New Sweet"
        description="Fill in the details to add a new sweet to your inventory"
      />

      <SweetFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEdit}
        sweet={selectedSweet}
        title="Edit Sweet"
        description="Update the details of this sweet"
      />

      <RestockDialog
        open={restockDialogOpen}
        onOpenChange={setRestockDialogOpen}
        onRestock={handleRestock}
        sweet={selectedSweet}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sweet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedSweet?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
