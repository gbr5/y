import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {

      // redirect user to specified redirect URL or root of app
      redirect(next)
    }
    // error 403: Emaill link is invalid or has expired
    // console.error("confirm error: ", error)
    
    // This isn't been applied as the confirmation e-mail is not enabled on supabase
    if (error.code === "otp_expired") {
      // send user a new otp to user e-mail
      // send user to login page with params - otp expired
      // login page should show message that a new otp has been sent
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/error')
}