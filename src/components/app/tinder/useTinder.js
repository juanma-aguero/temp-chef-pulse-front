import React, { useMemo, useRef, useState } from "react";

export default function useTinderFeats(ingredients = []) {
  const [currentIndex, setCurrentIndex] = useState(
    ingredients.length > 0 ? ingredients.length - 1 : 0
  );
  const [lastDirection, setLastDirection] = useState("");
  const currentIndexRef = useRef(currentIndex);
  
  useMemo(() => {
    setCurrentIndex(ingredients.length - 1);
  }, [ingredients.length]);

  const childRefs = useMemo(
    () =>
      Array(ingredients.length)
        .fill(0)
        .map((i) => React.createRef()),
    [ingredients.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < ingredients.length - 1;

  const canSwipe = currentIndex >= 0;

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    console.log(`swipe ${dir}`, currentIndex);
    if (canSwipe && currentIndex < ingredients.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  return {
    currentIndex,
    lastDirection,
    childRefs,
    swiped,
    outOfFrame,
    swipe,
    goBack,
    canSwipe,
    canGoBack,
  };
}
