"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl">🍬</span>
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-primary">
                Sweet Shop
              </h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex text-right">
                <div>
                  {isAdmin && (
                  <Badge variant="outline" className="text-md border-green-500 m-1">
                    Admin
                  </Badge>
                )}
                </div>
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              </div>
            </div>
            <Button
              className="cursor-pointer"
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
