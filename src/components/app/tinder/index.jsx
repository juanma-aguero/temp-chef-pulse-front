import React, { useMemo, useRef, useState } from "react";
import TinderCard from "react-tinder-card";
import { Button } from "@/components/ui/button";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useTinderFeats from "./useTinder";
import { DrawerInput } from "../drawer";
import { useDrawer } from "../drawer/useDrawer";

export default function IngredientTinder() {
  const queryClient = new QueryClient();

  const ingredientEndpoint = `${process.env.NEXT_PUBLIC_BACK_HOST}/ingredient`;
  console.log(ingredientEndpoint);
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["getIngredients"],
    queryFn: () => axios.get(ingredientEndpoint).then((res) => res.data),
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

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const onDislike = () => {
    console.log("Dislike");
    onOpen();
  };
  const onSubmit = () => {
    onClose();
    swipe("right");
  };

  return (
    <div>
      <div className="cardContainer">
        {data.map((ingredient, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={ingredient.name}
            onSwipe={(dir) => swiped(dir, ingredient.name, index)}
            onCardLeftScreen={() => outOfFrame(ingredient.name, index)}
          >
            <div
              style={{ backgroundImage: "url(" + ingredient.image_link + ")" }}
              className="card"
            >
              <h3>{ingredient.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <DrawerInput
        goal={goal}
        isOpen={isOpen}
        onClick={onClick}
        onSubmit={onSubmit}
        onClose={onClose}
      />
      <div className="buttons">
        <Button disabled={!canSwipe} onClick={() => swipe("left")}>
          Like
        </Button>

        <Button disabled={!canGoBack} onClick={() => goBack()}>
          Undo
        </Button>

        <Button disabled={!canSwipe} onClick={() => onDislike()}>
          Dislike
        </Button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  );
}
