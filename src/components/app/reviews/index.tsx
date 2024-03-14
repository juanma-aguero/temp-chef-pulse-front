import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Review = {
  prompt: "Muy rico todo";
  ingredientId: string;
  chefId: number;
  kitchenDate: "2024/03/14";
  score: number;
};

export default function ReviewsList() {
  const queryClient = new QueryClient();

  const reviewsEndpoint = `${process.env.NEXT_PUBLIC_BACK_HOST}/reviews/20`;
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["getReviews"],
    queryFn: () => axios.get(reviewsEndpoint).then((res) => res.data),
  });
  
  if (isPending) {
    return (
      <div className="mt-8">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-400" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-400" />
            <Skeleton className="h-4 w-[200px] bg-gray-400" />
          </div>
          Loading...
        </div>
      </div>
    );
  }

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex flex-col mt-10">
      <div className="cardContainer">
        {data.map((ingredient: any, index: any) => (
          <div key={ingredient.id} className="">
            <div className="flex justify-between">
              <h3 className="text-gray-300">{ingredient.prompt}</h3>
              <Avatar>
                <AvatarFallback>
                  <AvatarImage src="/avatar.png" alt="avatar" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
