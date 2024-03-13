"use client";
import React, { useMemo, useRef, useState } from "react";
import TinderCard from "react-tinder-card";
import { Button } from "@/components/ui/button";
import { ingredients } from "./fakeData";

export default function PulsePage() {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Pulse</h1>

        <div>
          <div className="cardContainer">
            {ingredients.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                className="swipe"
                key={character.name}
                onSwipe={(dir) => swiped(dir, character.name, index)}
                onCardLeftScreen={() => outOfFrame(character.name, index)}
              >
                <div
                  style={{ backgroundImage: "url(" + character.url + ")" }}
                  className="card"
                >
                  <h3>{character.name}</h3>
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
      </div>
    </main>
  );
}
