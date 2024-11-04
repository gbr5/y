"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true)
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      setUserId(data.user ? data.user.id : null)
      setIsLoading(false)
    }

    fetchUser()
  }, [])
  return { userId, isLoading }
}