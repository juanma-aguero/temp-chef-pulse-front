"use client";
import React from "react";
import IngredientTinder from "@/components/app/tinder";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";

const queryClient = new QueryClient();

export default function PulsePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-col items-center h-screen overflow-hidden relative">
        <div className="h-16 bg-slate-900 w-full text-yellow-300 text-center">
          <h1 className="text-lg tracking-wide	font-bold	mt-4">Pulse</h1>
        </div>

        <IngredientTinder />
        <Link href="/" className="mt-20">
          Home
        </Link>
      </main>
    </QueryClientProvider>
  );
}
