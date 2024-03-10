import React from "react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateAccount: React.FC = () => {
  return (
    <>
      <div className="grid gap-4 py-4">
        {/* Form fields here */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" placeholder="Username" className="col-span-3" />
          {/* Repeat for other fields */}
        </div>
        {/* More fields can be added here */}
      </div>
      <SheetClose asChild>
        <Button type="submit">Save changes</Button>
      </SheetClose>
    </>
  );
};

export default CreateAccount;
