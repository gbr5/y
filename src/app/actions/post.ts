"use server"

import { createClient } from "@/utils/supabase/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { signOut } from "./auth";
import { TPost } from "@/dtos/Post";
import { TPostLike } from "@/dtos/PostLike";
import { TPostReply } from "@/dtos/PostReply";

enum ErrorCode {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

type ServerResponse<T = void> = {
  isSuccessful: boolean;
  message: string;
  errorCode?: ErrorCode;
  data?: T;
}

// Schemas
const postSchema = z.object({
  post: z.string().max(280, "Make it Short and Sweet S2 ♥️ ! 280 characters max.")
});


// Helper functions
async function validateUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.error("User validation failed:", error);
    await signOut();
    throw new Error("User not authenticated");
  }

  return data.user;
}

async function handleDatabaseError(error: unknown, functionName: string): Promise<ServerResponse> {
  console.error(`Database error in ${functionName}:`, error);
  return {
    isSuccessful: false,
    message: "An unexpected database error occurred",
    errorCode: ErrorCode.INTERNAL_SERVER_ERROR
  }
}

// Main functions
export async function validatePost(formData: FormData): Promise<ServerResponse<string>> {
  try {
    const { post } = postSchema.parse({ post: formData.get("post") });
    return {
      isSuccessful: true,
      message: "Post validated successfully",
      data: post
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.flatten().fieldErrors.post?.[0];
      return {
        isSuccessful: false,
        message: fieldError || "Invalid post data",
        errorCode: ErrorCode.VALIDATION_ERROR
      }
    }
    console.error("Validate Post error:", error);
    return {
      isSuccessful: false,
      message: "An unexpected error occurred during validation",
      errorCode: ErrorCode.UNKNOWN_ERROR
    }
  }
}

export async function submitPost(formData: FormData): Promise<ServerResponse<string | void>> {
  const validation = await validatePost(formData);
  if (!validation.isSuccessful) return validation;

  try {
    const user = await validateUser();
    const supabase = await createClient();

    if (validation.data) {
      const { error } = await supabase.from("tweets").insert({
        id: randomUUID(),
        author_id: user.id,
        text: validation.data ?? "",
      });
      if (error) return handleDatabaseError(error, "submitPost");
    }

    return {
      isSuccessful: true,
      message: "Success, your post is now live 🚀"
    }
  } catch (error) {
    console.error("Unknown error in submitPost:", error);
    return {
      isSuccessful: false,
      message: "An unexpected error occurred when submitting post",
      errorCode: ErrorCode.UNKNOWN_ERROR
    }
  }
}

export async function getAllPosts(): Promise<ServerResponse<TPost[] | void>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tweets")
      .select(`
        *,
        profiles (full_name, username),
        likes (id, user_id, profiles (full_name, username)),
        replies!replies_tweet_id_fkey (
          *,
          user:profiles (username)
        )
      `)
      .order("updated_at", { ascending: false });

    if (error) return handleDatabaseError(error, "getAllPosts");

    return {
      isSuccessful: true,
      message: "Posts fetched successfully",
      data
    }
  } catch (error) {
    console.error("Unknown error in getAllPosts:", error);
    return {
      isSuccessful: false,
      message: "An unexpected error occurred when fetching posts",
      errorCode: ErrorCode.UNKNOWN_ERROR
    }
  }
}

export async function likePost(postId: string): Promise<ServerResponse> {
  try {
    const user = await validateUser()
    const supabase = await createClient()

    const { error } = await supabase.from("likes").insert({
      id: randomUUID(),
      user_id: user.id || "",
      tweet_id: postId,
    })

    if (error) return handleDatabaseError(error, "likePost")

    return {
      isSuccessful: true,
      message: "like"
    }
    
  } catch (error) {
    console.error("Unknown error in likePost: ", error)
    return {
      isSuccessful: false,
      message: "An unexpected error occured when liking a post",
      errorCode: ErrorCode.UNKNOWN_ERROR
    }
  }
}

export async function dislikePost(postId: string): Promise<ServerResponse> {
  try {
    const user = await validateUser()
    const supabase = await createClient()

    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("tweet_id", postId,)
      .eq("user_id", user.id)

    if (error) return handleDatabaseError(error, "dislikePost")

    return {
      isSuccessful: true,
      message: "dislike"
    }
  } catch (error) {
    console.error("Unknown error in dislikePost: ", error)
    return {
      isSuccessful: false,
      message: "An unexpected error occured when disliking a post",
      errorCode: ErrorCode.UNKNOWN_ERROR
    }
  }
}

export async function getPostLikes(postId: string): Promise<ServerResponse<TPostLike[] | void>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("likes")
      .select(`
        *,
        profiles (full_name, username)
      `)
      .eq("tweet_id", postId)
    
    if (error) return handleDatabaseError(error, "getPostLikes")
    
    return {
      isSuccessful: true,
      message: "Post likes fetched successfully",
      data
    }

  } catch (error) {
    console.error("Unknown error in getPostLikes:", error);
    return {
      isSuccessful: false,
      message: "An unexpected error occurred when fetching post likes",
      errorCode: ErrorCode.UNKNOWN_ERROR
    }
  }
}

export async function getPost(postId: string): Promise<ServerResponse<TPost | void>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tweets')
      .select(`
        *,
        profiles (full_name, username),
        likes (id, user_id, profiles (full_name, username)),
        replies!replies_tweet_id_fkey (
          *,
          user:profiles (username)
        )
      `)
      .eq('id', postId)
      .single()

    if (error) return handleDatabaseError(error, "getPost")

    if (!data) {
      return {
        isSuccessful: false,
        message: "Post not found",
        errorCode: ErrorCode.NOT_FOUND
      }
    }

    return {
      isSuccessful: true,
      message: "Post fetched successfully",
      data
    }
  } catch (error) {
    console.error("Unknown error in getPost:", error);
    return {
      isSuccessful: false,
      message: "An unexpected error occurred when fetching the post",
      errorCode: ErrorCode.UNKNOWN_ERROR
    }
  }
}

export async function deletePost(postId: string): Promise<ServerResponse<void>> {
  try {
    const user = await validateUser()
    const supabase = await createClient()

    const { isSuccessful, message, data, errorCode } = await getPost(postId)

    if (!isSuccessful) {
      return {
        isSuccessful,
        message,
        errorCode
      }
    }

    if (user.id !== data?.author_id) {
      return {
        isSuccessful: false,
        message: "User does not have permission to perform this action.",
        errorCode: ErrorCode.UNAUTHORIZED,
      }
    } 

    const { error } = await supabase.from("tweets").delete().eq("id", postId)
    
    if (error) return handleDatabaseError(error, "deletePost")      

    return {
      isSuccessful: true,
      message: "Post deleted successfully",
    }

  } catch (error) {
    console.error("Unknown error in deletePost: ", error)

    return {
      isSuccessful: false,
      message: "An unexpected error occured when deleting the post",
      errorCode: ErrorCode.INTERNAL_SERVER_ERROR
    }
  }
}

export async function submitPostReply(formData: FormData): Promise<ServerResponse<string | void>> {
  const validation = await validatePost(formData)
  if (!validation.isSuccessful) return validation;

  try {
    const user = await validateUser()
    const postId = formData.get("postId")

    if (postId) {
      const postValidation = await getPost(postId.toString())
      if (!postValidation.isSuccessful) {
        return {
          isSuccessful: postValidation.isSuccessful,
          message: postValidation.message,
          errorCode: postValidation.errorCode
        }
      }
    } else {
      return {
        isSuccessful: false,
        message: "Post not found",
        errorCode: ErrorCode.NOT_FOUND
      }
    }

    const supabase = await createClient()

    if (validation.data) {
      const { error } = await supabase.from("replies").insert({
        id: randomUUID(),
        user_id: user.id,
        text: validation.data ?? "",
        tweet_id: postId
      });
      if (error) return handleDatabaseError(error, "submitPostReply");
    }
    return {
      isSuccessful: true,
      message: "Success, your post reply is now live 🚀"
    }
  } catch (error) {
    console.error("Unknown error in submitPostReply:", error);
    return {
      isSuccessful: false,
      message: "An unexpected error occurred when submitting a post reply",
      errorCode: ErrorCode.UNKNOWN_ERROR
    }
  }
}

export async function getPostReplies(postId: string): Promise<ServerResponse<TPostReply[] | void>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("replies")
      .select(`
        *,
        profiles (full_name, username)
      `)
      .eq("tweet_id", postId)
    
    if (error) return handleDatabaseError(error, "getPostReplies")
    
    return {
      isSuccessful: true,
      message: "Post replies fetched successfully",
      data
    }

  } catch (error) {
    console.error("Unknown error in getPostReplies:", error);
    return {
      isSuccessful: false,
      message: "An unexpected error occurred when fetching post replies",
      errorCode: ErrorCode.UNKNOWN_ERROR
    }
  }
}