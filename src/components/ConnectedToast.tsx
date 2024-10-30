"use client"
import { createClient } from "@/utils/supabase/client"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { toast, Toaster } from "sonner"

// type Props = {
//   signedIn: boolean;
//   usernameExists: boolean;
// }

export default function ConnectedToast() {
  const supabase = createClient()
  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (data && data.user) {
        toast.success("Yay, you are already signed in!")
        setTimeout(() => {
          toast.success("We will redirect you ...")
        }, 2000)
        setTimeout(() => {
          toast.success("Have a great day ♥️")
        }, 4000)

        setTimeout(() => {
          redirect('/')
        }, 6000)
      }
      console.log(error)
    })
  }, [supabase.auth])

  return (
    <Toaster
      className="
        absolute
        top-0
        my-12
        shadow-2xl
      "
      dir="ltr"
      position="top-right"
    />
  )
}
