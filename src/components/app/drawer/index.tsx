import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function DrawerInput({
  isOpen,
  onSubmit,
  onCancel,
  onClick,
  onClose,
}: {
  isOpen: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onClick: (adjustment: number) => void;
  onClose: () => void;
}) {
  return (
    <Drawer open={isOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Can you be more specific?</DrawerTitle>
            <DrawerDescription>
              We use this information to improve.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="mt-1 h-[120px]">
              <Textarea placeholder="What can we improve on this ingredient?" />
            </div>
          </div>
          <DrawerFooter>
            <Button size="lg" onClick={() => onSubmit()}>
              Submit
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={() => onCancel()}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
