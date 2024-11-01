"use server"

import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { signOut } from "./auth";

type ServerResponse = {
  isSuccessful: boolean;
  message: string;
  errorCode?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleNoUser(data: any, error: any) {
  if (error) {
    console.log("An unexpected error has occured - submitPost function: ", error)
    await signOut()
  }
  if (!data || !data.user) {
    console.log("No user found in authenticated call - submitPost function: ", data)
    await signOut()
  }
}

export async function validatePost(formData: FormData): Promise<ServerResponse> {
  const schema = z.object({
    post: z.string().max(280, "Make it Short and Sweet S2 ♥️ ! 280 characters max.")
  })
  try {
    const { post } = schema.parse({ post: formData.get("post") as string })
    return {
      isSuccessful: true,
      message: post,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zError = error.flatten().fieldErrors;
      if (zError["post"]) {
        return {
          isSuccessful: false,
          message: zError.post[0],
          errorCode: "validation_error"
        }
      }
      return {
        isSuccessful: false,
        message: String(zError),
        errorCode: "unkmo_error"
      }
    }
    console.log("Validate Post error: ", error)
    return {
      isSuccessful: false,
      message: error as string,
      errorCode: "unknown_error"
    }
  }
}

export async function submitPost(formData: FormData): Promise<ServerResponse> {
  const { isSuccessful, message, errorCode } = await validatePost(formData)

  if (!isSuccessful) {
    return {
      isSuccessful,
      message,
      errorCode,
    }
  }
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()

    if (!data || !data.user || error) await handleNoUser(data, error)

    const response = await supabase.from("tweets").insert({
      id: randomUUID(),
      author_id: data.user?.id || "",
      text: message,
    })

    if (response.error) {
      console.log("Post Insertion error - submitPost function: ", response.error)
      return {
        isSuccessful: false,
        message: "An unexpected error occured",
        errorCode: "UNKNOWN_ERROR"
      }
    }
    return {
      isSuccessful: true,
      message: "Success, your post is now live 🚀"
    }
    
  } catch (error) {
    console.error("Unknown error - submitPost function: ", error)

    return {
      isSuccessful: false,
      message: "An unexpected error occured when submiting post",
      errorCode: "UNKNOWN_ERROR"
    }
  }

}

type TProfile = {
  username: string
  full_name: string | null
}

export type TPost = {
  id: string
  text: string
  author_id: string
  created_at: string
  updated_at: string
  profiles: TProfile | null
}

// export async function getAllPosts() {
export async function getAllPosts(): Promise<TPost[] | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("tweets").select(`
      *,
      profiles (
        full_name,
        username
      )
    `).order("updated_at", { ascending: false })
    if (error) {
      console.log("Unknown fetching posts error - getAllPosts function: ", error)
      return null
    }
    if (!data) {
      console.log("No data returned while fetching posts - getAllPosts function: ", data)
      return null
    }

    return data

  } catch (error) {
    console.error("Unknown error - submitPost function: ", error)
    return null
    // return {
    //   isSuccessful: false,
    //   message: "An unexpected error occured when getting posts",
    //   errorCode: "UNKNOWN_ERROR"
    // }
  }
}
