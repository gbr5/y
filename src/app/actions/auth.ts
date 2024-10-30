'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { sanitizeUsername } from '@/utils/validateUsername'

type AuthResponse = {
  isSuccessful: boolean;
  message: string;
  errorCode?: string;
}

export async function login(formData: FormData): Promise<AuthResponse> {
  try {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    // make a validate e-mail function
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
  
    const { error } = await supabase.auth.signInWithPassword(data)
  
    if (error) {
      console.log("error: ", error)
      if (error.code === "invalid_credentials") {
        return {
          isSuccessful: false,
          message: "Invalid e-mail and/or password.",
          errorCode: error.code
        }
      }
      // The confirmation e-mail is disabled in supabase
      // so this error shouldn't happen
      if (error.code === "email_not_confirmed") {
        return {
          isSuccessful: false,
          message: "You haven't confirmed your e-mail yet.",
          errorCode: error.code
        }
      }
      return {
        isSuccessful: false,
        message: error.message,
        errorCode: error.code
      }
    }
  
    // revalidatePath('/', 'layout')
    // redirect('/')
    return {
      isSuccessful: true,
      message: "Signin successful! Enjoy your experience ♥️ !"
    }
  } catch (error) {
    console.error("Signin error: ", error)

    return {
      isSuccessful: false,
      message: "An unexpected error occured during signin.",
      errorCode: "UNKNOWN_ERROR"
    }
  }
}

export async function signup(formData: FormData): Promise<AuthResponse> {
  try {
    const supabase = await createClient()

    const username = sanitizeUsername(formData.get('username') as string);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;


// Check if required fields are filled
    if (!username || !email || !password) {
      return {
        isSuccessful: false,
        message: "Fields username, email, and password are required.",
        errorCode: "MISSING_FIELDS"
      }
    }
    // esse check pode ser feito pelo yup
// Check if username has more than 3 characters
    if (username.length < 3) {
      return {
        isSuccessful: false,
        message: "Username must be greater than 3!",
        errorCode: "SHORT_USERNAME"
      }
    }
// Check if username is unique
    const isUsernameUnique = await checkIsUsernameUnique(username)
    if (!isUsernameUnique) {
      return {
        isSuccessful: false,
        message: "This username is already registered.",
        errorCode: "USERNAME_EXISTS"
      }
    }
// Additional checks
      const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
          // captchaToken: formData.get('password') as string, // captcha is disabled
          data: {
            username: formData.get('username') as string,
          }
        }
      }
    
      const { error } = await supabase.auth.signUp(data)
      
      if (error) {
        console.log("error: ", error)
        if (error.code === "user_already_exists") {
          return {
            isSuccessful: false,
            message: "This e-mail is already registered.",
            errorCode: error.code
          }
        }
        if (error.code === "weak_password") {
          return {
            isSuccessful: false,
            message: "Password must be at least 8 characters long, with a mix of uppercase and lowercase letters, numbers, and special symbols for better security",
            errorCode: error.code
          }
        }
        return {
          isSuccessful: false,
          message: error.message,
          errorCode: error.code
        }
      }
      
      // revalidatePath('/', 'layout')
      return {
        isSuccessful: true,
        message: "Signup successful! Enjoy your experience ♥️ !"
        // message: "Signup successful! Please check your email to confirm your account."
        // confirmation e-mail is disabled in supabase
      }
  } catch (error) {
    console.error("Signup error: ", error)

    return {
      isSuccessful: false,
      message: "An unexpected error occured during signup.",
      errorCode: "UNKNOWN_ERROR"
    }
  }
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
    redirect('/error')
  }
  redirect('/')
}

export async function checkIsUsernameUnique(username: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select().eq('username', username)
  if (error) {
    console.log(error)
    redirect('/error')
  }
  if (data[0] && data[0].id) {
    return false
  }
  return true
}

