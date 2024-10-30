"use client"
import { login } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
// import ConnectedToast from '@/components/ConnectedToast'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { toast, Toaster } from 'sonner'
import { createClient } from '@/utils/supabase/client'
import { validateEmail } from '@/utils/validateEmail'

const errorCodes = [
  "invalid_credentials",
  "email_not_confirmed",
  "invalid_email"
]

export default function LoginPage() {
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
    // supabase.auth.getUser().then(({ data, error }) => {
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
    })
  }, [supabase.auth])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const isEmailValid = validateEmail(formData.get("email") as string)

    if (!isEmailValid) {
      setIsLoading(false)
      setErrorMessage("Enter a valid e-mail!")
      return toast.error("Enter a valid e-mail!")
    }

    const { isSuccessful, message, errorCode } = await login(formData)

    if (!isSuccessful) {
      if (errorCode && errorCodes.includes(errorCode)) {
      // if (errorCode == "invalid_credentials" || errorCode == "email_not_confirmed" || errorCode == "invalid_email") {
        setIsLoading(false)
        setErrorMessage(message)
        return toast.error(message)
      }
      setIsLoading(false)
      setErrorMessage("An unexpected error occurred, try again in a few moments.")
      return toast.error("An unexpected error occurred, try again in a few moments.")
    }
    toast.success(message)
    setTimeout(() => {
      redirect("/")
    }, 5000)
  }
  return (
    <div className="
      relative
      bg-black
      text-white
      flex
      justify-center
      items-center
      w-screen
      h-screen
    ">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className='flex flex-col space-y-8 max-w-[600px] w-[94vw]'
      >
        <p className="text-red">{errorMessage}</p>
        <div className="flex flex-col justify-center items-start w-full">
          <label className='text-left' htmlFor="email">Email:</label>
          <Input className='text-black' id="email" name="email" type="email" required />
        </div>
        <div className="flex flex-col justify-center items-start w-full">
          <label className='text-left' htmlFor="password">Password:</label>
          <Input className='text-black' id="password" name="password" type="password" required />
        </div>
        <Button disabled={isLoading}>Log in</Button>
      </form>
    </div>
  )
}
