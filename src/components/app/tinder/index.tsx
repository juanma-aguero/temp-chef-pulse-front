import React, { useMemo, useRef, useState } from "react";
import TinderCard from "react-tinder-card";
import { Button } from "@/components/ui/button";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useTinderFeats from "./useTinder";
import { DrawerInput } from "../drawer";
import { useDrawer } from "../drawer/useDrawer";
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

export default function IngredientTinder() {
  const queryClient = new QueryClient();

  const ingredientsEndpoint = `${process.env.NEXT_PUBLIC_BACK_HOST}/ingredients`;
  const reviewsEndpoint = `${process.env.NEXT_PUBLIC_BACK_HOST}/reviews`;
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["getIngredients"],
    queryFn: () => axios.get(ingredientsEndpoint).then((res) => res.data),
  });
  const [currentReview, setCurrentReview] = useState({
    prompt: "Muy rico todo",
    ingredientId: "",
    chefId: 1,
    kitchenDate: "2024/03/14",
    score: 0,
  });

  const reviewMutation = useMutation({
    mutationFn: (review: Review) => {
      return axios.post(reviewsEndpoint, review);
    },
  });

  const {
    currentIndex,
    lastDirection,
    childRefs,
    swiped,
    outOfFrame,
    swipe,
    canSwipe,
    canGoBack,
    goBack,
  } = useTinderFeats(data);

  const { goal, isOpen, onClick, onOpen, onClose } = useDrawer();

  const onDislike = () => {
    console.log("Dislike");
    onOpen();
  };
  const onSubmit = () => {
    console.log("Submit", data[currentIndex]);
    reviewMutation.mutate({
      ingredientId: data[currentIndex].id,
      chefId: 1,
      kitchenDate: "2024/03/14",
      score: 0,
      prompt: data[currentIndex].name,
    });
    onClose();
    swipe("right");
  };
  const onCancel = () => {
    onClose();
  };

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
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={ingredient.name}
            onSwipe={(dir) => swiped(dir, ingredient.name, index)}
            onCardLeftScreen={() => outOfFrame(ingredient.name, index)}
          >
            <div className="card border-2 border-slate-400	bg-slate-200">
              <Avatar className="w-40 h-40 mx-auto">
                <AvatarImage src={ingredient.image_link} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <h3>{ingredient.name}</h3>
            </div>
          </TinderCard>
        ))}
        <div className="card bg-slate-50 -z-50">
          <h3 className="text-gray-300">All set, thank you!</h3>
        </div>
      </div>

      <div className="flex mt-5 justify-between">
        <Button
          variant="outline"
          size="lg"
          disabled={!canSwipe}
          onClick={() => swipe("left")}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          disabled={!canSwipe}
          onClick={() => onDislike()}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 mt-12 pt-5 text-center">
        <Button variant="link" disabled={!canGoBack} onClick={() => goBack()}>
          Undo
        </Button>
      </div>
      <DrawerInput
        isOpen={isOpen}
        onClick={onClick}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onClose={onClose}
      />
    </div>
  );
}
