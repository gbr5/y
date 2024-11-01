"use client"
import { toast, Toaster } from "sonner"
import { submitPost } from "@/app/actions/post"
import { useState } from "react"
import { redirect } from "next/navigation"

type Props = {
  onPostSuccess: () => void
}

export default function ComposePost({ onPostSuccess }: Props) {
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmitPost(formData: FormData) {
    setErrorMessage("")
    try {
      const { isSuccessful, message, errorCode } = await submitPost(formData)

      if (!isSuccessful) {
        if (errorCode === "validation_error") {
          toast.error(message)
          setErrorMessage(message)
          return 
        }
        // improve error handling
        redirect("/error")
      }
      toast.success(message)
      onPostSuccess()
    } catch {
      redirect("/error")
    }
  }
  return (
    <form action={handleSubmitPost} className="flex flex-col w-full h-full relative">
      <Toaster className="
          lg:my-12
          shadow-2xl
        " />
      <input
        type="text"
        name="post"
        id="post"
        placeholder="What&apos;s happening?"
        className="
          w-auto
          h-full
          bg-transparent
          outline-none
          border-none
          border-b-[0.5px]
          border-gray-600
          p-4
        "
      />
      <p id="posterror" className="text-red-500">{errorMessage}</p>
      <div className="flex w-full justify-between items-center">
        <div className="flex"></div>
        <div className="w-full max-w-[100px]">
          <button
            type="submit"
            className="
              rounded-full
              bg-yprimary
              px-6
              py-2
              text-center
              text-lg
              placeholder:text-gray-600
              hover:opacity-70
              transition
              duration-200
              font-bold
            "
          >
            Post
          </button>
        </div>
      </div>
    </form>
  )
}
