"use client"

import { useEffect, useState } from "react";
// import { SupabaseClient } from "@supabase/supabase-js";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
// import { redirect } from "next/navigation";

export default function AuthModel() {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient()
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data?.user) {
        // redirect('/login')
        console.log(error)
        return setIsOpen(true)
      }
    })

  }, [supabase.auth])
  return (
    // {/* {error?.code == '401' && ( */}
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    {/* <Dialog defaultOpen={error?.status === 401}> */}
      <DialogContent className="bg-black p-6">
        <DialogTitle />
          <h3 className="text-lg">Please sign in to continue</h3>
          <form action="" method="post">
            <Input type="text" placeholder="e-mail" />
            <p className="text-sm text-gray-200 my-2">
              you will receive a login magic link here!
            </p>
            <Button className="bg-white text-black">
              Login
            </Button>
          </form>
      </DialogContent>
    </Dialog>
    // {/* )} */}
  )
}
