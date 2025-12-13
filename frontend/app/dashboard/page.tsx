"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useAuth } from "@/lib/auth-context";
import { sweetsAPI, type Sweet, type ApiError } from "@/lib/api";
import { Navbar } from "@/components/navbar";
import { SweetCard } from "@/components/sweet-card";
import { SearchFilter } from "@/components/search-filter";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useState<any>({});
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch sweets data
  const {
    data: sweetsData,
    error,
    mutate,
  } = useSWR(
    isAuthenticated ? ["sweets", searchParams] : null,
    async () => {
      if (Object.keys(searchParams).length > 0) {
        return await sweetsAPI.search(searchParams);
      }
      return await sweetsAPI.getAll();
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
    }
  );

  const handleSearch = (params: any) => {
    setSearchParams(params);
  };

  const handlePurchase = async (id: string) => {
    setPurchasingId(id);
    setMessage(null);

    try {
      await sweetsAPI.purchase(id, 1);
      setMessage({ type: "success", text: "Purchase successful!" });
      mutate();
    } catch (err) {
      const apiError = err as ApiError;
      setMessage({
        type: "error",
        text: apiError.message || "Purchase failed",
      });
    } finally {
      setPurchasingId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const sweets = sweetsData?.data || [];
  const isLoading = !sweetsData && !error;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold">Sweet Collection</h2>
            <p className="text-gray-700 mt-1">
              Browse and purchase delicious sweets
            </p>
          </div>
          {isAdmin && (
            <Button
              className="cursor-pointer"
              onClick={() => router.push("/dashboard/admin")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Only For Admin → Add Sweet
            </Button>
          )}
        </div>

        {message && (
          <Alert
            variant={message.type === "error" ? "destructive" : "default"}
            className="mb-6"
          >
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <SearchFilter onSearch={handleSearch} />
        </div>

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
            <h3 className="text-xl font-semibold mb-2">No sweets found</h3>
            <p className="text-muted-foreground">
              {Object.keys(searchParams).length > 0
                ? "Try adjusting your search filters"
                : isAdmin
                ? "Add your first sweet to get started"
                : "Check back later for new sweets"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sweets.map((sweet: Sweet) => (
                <SweetCard
                  key={sweet._id}
                  sweet={sweet}
                  onPurchase={handlePurchase}
                  isPurchasing={purchasingId === sweet._id}
                  isAdmin={false}
                />
              ))}
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Showing {sweets.length} {sweets.length === 1 ? "sweet" : "sweets"}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
