"use client"
import { checkIsUsernameUnique, signup } from '@/app/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { sanitizeUsername, isUsernameValid } from '@/utils/validateUsername'
import { toast, Toaster } from 'sonner'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { validateEmail } from '@/utils/validateEmail'
// import HCaptcha from '@hcaptcha/react-hcaptcha'

export default function SignUpPage() {
  const supabase = createClient()
  // const captcha = useRef(null)

  const [username, setUsername] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [serverError, setServerError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // const [captchaToken, setCaptchaToken] = useState("")

  // const hcaptchaSiteKey = process.env.HCAPTCHA_SITE_KEY!
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

  // 4. if error chanhe input border color

  // https://chatgpt.com/c/67212351-d610-8011-b8b4-76144dd51c53 yup implementation
  // https://v0.dev/chat/H9EM2MxbJnv handle form useFormStatus from react-dom

  async function handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setIsLoading(true)
    const sanitizedUsername = sanitizeUsername(e.target.value)
    if (username === sanitizedUsername) return
    setUsername(sanitizedUsername)
    setUsernameError('')
    setServerError('')

    // Check if there username is unique
    const uniqueUsername = await checkIsUsernameUnique(sanitizedUsername)

    // raise error 
    if (!uniqueUsername && (!uniqueUsername && sanitizedUsername !== username)) {
      setUsernameError(`This username ( ${sanitizedUsername} ) is already in use, please choose another one!`)
      toast.error(`This username ( ${sanitizedUsername} ) is already in use, please choose another one!`)
    }
    setIsLoading(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (usernameError) return
    setIsLoading(true)
    setUsernameError('')
    setEmailError('')
    setPasswordError('')
    setServerError('')
    const formData = new FormData(e.currentTarget)
    const uniqueUsername = await checkIsUsernameUnique(formData.get("username") as string)

    if (!uniqueUsername) {
      setIsLoading(false)
      return setUsernameError("This username is already in use, please choose another one")
    }
    const validUsername = isUsernameValid(formData.get("username") as string)
    const validEmail = validateEmail(formData.get("email") as string)
    
    if (!validUsername) {
      setIsLoading(false)
      return setUsernameError("Username must be an alphanumeric sequence between 3 and 20 characters")
    }
    if (!validEmail) {
      setIsLoading(false)
      return setEmailError("Enter a valid e-mail")
    }
    // formData.append("captchaToken", captchaToken)
    const { isSuccessful, message, errorCode} = await signup(formData)

    if (!isSuccessful) {
      if (errorCode == "user_already_exists") {
        setIsLoading(false)
        setEmailError(message)
        return toast.error(message)
      }
      if (errorCode == "weak_password") {
        setIsLoading(false)
        setPasswordError(message)
        return toast.error(message)
      }
      setIsLoading(false)
      setServerError("An unexpected error occurred, try again in a few moments")
      return toast.error("An unexpected error occurred, try again in a few moments")
    }
    // if (captcha.current) captcha.current.resetCaptcha()
    toast.success(message)
    setTimeout(() => {
      redirect("/")
    }, 2000)
    setIsLoading(false)
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
      <Toaster
        className="
          lg:absolute
          lg:top-0
          lg:my-12
          shadow-2xl
        "
        dir="ltr"
        position="top-right"
      />
      <form
        onSubmit={handleSubmit}
        className='flex flex-col space-y-8 max-w-[600px] w-[94vw]'
      >
        <p className="text-lg">{serverError}</p>
        <div className="flex flex-col justify-center items-start w-full">
          <label htmlFor="username">Username</label>
          <Input
            className='text-black'
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={handleUsernameChange}
          />
          <p className="text-xs pt-2 text-red-500">{usernameError}</p>
        </div>
       
        <div className="flex flex-col justify-center items-start w-full">
          <label htmlFor="email">Email:</label>
          <Input className='text-black' id="email" name="email" type="email" required />
          <p className="text-xs pt-2 text-red-500">{emailError}</p>
        </div>
        <div className="flex flex-col justify-center items-start w-full">
          <label htmlFor="password">Password:</label>
          <Input className='text-black' id="password" name="password" type="password" required />
          <p className="text-xs pt-2 text-red-500">{passwordError}</p>
        </div>
        {/* <HCaptcha
          ref={captcha}
          sitekey="a5261c74-5d90-4f8e-b5ec-1e22c484cb56"
          onVerify={(token) => {
            setCaptchaToken(token)
          }}
        /> */}

        {/* <Button formAction={handleSubmit}>Sign up</Button> */}
        <Button disabled={isLoading}>Sign up</Button>
      </form>
    </div>
  )
}
