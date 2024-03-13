"use client";
import React from "react";
import IngredientTinder from "@/components/app/tinder";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function PulsePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>
          <h1>Pulse</h1>
          <IngredientTinder />
        </div>
      </main>
    </QueryClientProvider>
  );
}
