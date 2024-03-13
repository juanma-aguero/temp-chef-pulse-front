import React from "react";

export function useDrawer() {
  const [goal, setGoal] = React.useState(350);
  const [isOpen, setOpen] = React.useState(false);

  function onClick(adjustment: number) {
    setGoal(goal + adjustment);
  }

  function onOpen() {
    setOpen(true);
  }

  function onClose() {
    setOpen(false);
  }

  return {
    goal,
    isOpen,
    onClick,
    onOpen,
    onClose,
  };
}
