import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const CreateAccount: React.FC = () => {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Create profile</SheetTitle>
        <SheetDescription>Click save when you're done.</SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 py-4">
        {/* Form fields here */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Username
          </Label>
          <Input id="name" placeholder="Username" className="col-span-3" />
          {/* Include other fields here, such as content for bio */}
        </div>
        {/* More fields can be added here, such as image and email */}
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="submit">Save changes</Button>
        </SheetClose>
      </SheetFooter>
    </>
  );
};

export default CreateAccount;
