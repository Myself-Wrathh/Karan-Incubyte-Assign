import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Candy, ShoppingBag, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-rose-50">
      <div className="container mx-auto px-4 py-12 md:py-8">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center gap-2 text-pink-600">
            <Candy className="w-12 h-12" />
            <Sparkles className="w-8 h-8" />
            <ShoppingBag className="w-10 h-10" />
          </div>

          <div className="space-y-4 max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-balance bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent p-3">
              Welcome to Sweet Shop Management
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 text-pretty">
              Your one-stop solution for managing sweet inventory, tracking
              purchases, and delighting customers with delicious treats
            </p>
            <p className="rounded-full text-xl md:text-2xl text-white text-pretty bg-pink-500">
              For Admin Use Below Credentials & For normal Create New User :)
            </p>
          </div>

         <div className="flex gap-2">
           <Card className="p-8 max-w-md w-full bg-white/80 backdrop-blur border-pink-100 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-pink-600 mb-4">
                <div className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Test Admin Credentials
                </p>
                <div className="w-2 h-2 rounded-full bg-pink-600 animate-pulse" />
              </div>

              <div className="space-y-2 text-left border-t border-pink-100 pt-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email (Copy ts)</p>
                  <p className="text-lg font-semibold text-gray-900">
                    karan@admin.com
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Password</p>
                  <p className="text-lg font-semibold text-gray-900">
                    password123
                  </p>
                </div>
              </div>
            </div>
          </Card>
         </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg"
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-6 text-lg bg-transparent"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-rose-600 text-rose-600 hover:bg-rose-50 px-8 py-6 text-lg bg-transparent"
            >
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12 max-w-4xl w-full">
            <Card className="p-6 bg-white/60 backdrop-blur border-pink-100 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Candy className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Browse Sweets
                </h3>
                <p className="text-sm text-gray-600">
                  Explore a wide variety of delicious sweets with detailed
                  information
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/60 backdrop-blur border-pink-100 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Easy Purchasing
                </h3>
                <p className="text-sm text-gray-600">
                  Quick and simple purchase process with real-time inventory
                  tracking
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/60 backdrop-blur border-pink-100 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Admin Control
                </h3>
                <p className="text-sm text-gray-600">
                  Powerful admin panel to manage inventory and add new products
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
