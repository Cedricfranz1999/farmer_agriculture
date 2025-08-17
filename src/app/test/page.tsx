"use client";
import { ShoppingCart, Bell } from "lucide-react";

export default function FoodLanding() {
  const menu = [
    { id: 1, name: "Special Pasta", price: 20, img: "/pasta.jpg" },
    { id: 2, name: "Special Salad", price: 24, img: "/salad.jpg" },
    { id: 3, name: "Traditional Pasta", price: 42, img: "/trad-pasta.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-red-900 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6">
        <div className="text-2xl font-extrabold text-yellow-400">Frigos</div>

        <div className="hidden gap-6 text-gray-300 md:flex">
          <a href="#" className="hover:text-white">
            Find Food
          </a>
          <a href="#" className="hover:text-white">
            Tracking
          </a>
          <a href="#" className="hover:text-white">
            Find Restaurant
          </a>
          <a href="#" className="hover:text-white">
            Location
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs">
              1
            </span>
          </button>
          <button className="rounded-lg border border-gray-500 px-4 py-2">
            Sign In
          </button>
          <button className="rounded-lg bg-green-500 px-4 py-2 font-semibold text-black">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="grid grid-cols-1 items-center px-10 py-20 md:grid-cols-2">
        {/* Left */}
        <div className="space-y-6">
          <p className="text-sm text-yellow-400">EASY WAY TO ORDER YOUR FOOD</p>
          <h1 className="text-5xl leading-tight font-extrabold">
            Order Tasty & Fresh Food{" "}
            <span className="text-red-500">anytime!</span>
          </h1>
          <p className="text-gray-300">
            Just confirm your order and enjoy our delicious fastest delivery.
          </p>

          <div className="flex gap-6">
            <button className="rounded-full bg-red-600 px-6 py-3 font-semibold hover:bg-red-700">
              Order Now
            </button>
            <button className="font-semibold text-yellow-400 hover:text-yellow-500">
              See Menu
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="relative flex justify-center">
          <img
            src="/lobster.jpg"
            alt="Lobster Dish"
            className="h-[400px] w-[400px] rounded-full object-cover shadow-2xl"
          />

          {/* Happy Customers */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-4 py-2">
            <div className="flex -space-x-2">
              <img src="/avatar1.jpg" className="h-8 w-8 rounded-full border" />
              <img src="/avatar2.jpg" className="h-8 w-8 rounded-full border" />
              <img src="/avatar3.jpg" className="h-8 w-8 rounded-full border" />
            </div>
            <span className="text-sm">+20 Customers</span>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="px-10 pb-20">
        <div className="grid gap-8 md:grid-cols-3">
          {menu.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-black/40 p-6 text-center shadow-lg"
            >
              <img
                src={item.img}
                alt={item.name}
                className="mx-auto h-32 w-32 rounded-full object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
              <p className="mt-2 font-bold text-yellow-400">${item.price}.00</p>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 hover:bg-red-700">
                <ShoppingCart className="h-5 w-5" /> Order Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

