import React, { useMemo, useRef, useState } from "react";
import TinderCard from "react-tinder-card";
import { Button } from "@/components/ui/button";
import { ingredients } from "../fakeData";
import { QueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function IngredientTinder() {
  const [currentIndex, setCurrentIndex] = useState(ingredients.length - 1);
  const [lastDirection, setLastDirection] = useState("");
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(ingredients.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < ingredients.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < ingredients.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  const queryClient = new QueryClient();

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["getIngredients"],
    queryFn: () =>
      axios.get("http://localhost:3000/ingredient").then((res) => res.data),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

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
      <div className="buttons">
        <Button disabled={!canSwipe} onClick={() => swipe("left")}>
          Swipe left!
        </Button>

        <Button disabled={!canGoBack} onClick={() => goBack()}>
          Undo
        </Button>

        <Button disabled={!canSwipe} onClick={() => swipe("right")}>
          Swipe right!
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
