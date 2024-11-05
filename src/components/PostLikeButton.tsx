"use client"

import { dislikePost, getPostLikes, likePost } from "@/app/actions/post"
import { TPostLike } from "@/dtos/PostLike"
import { useOptimistic, useTransition, useState, useMemo } from "react"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import { toast } from "sonner"

type Props = {
  post_id: string
  initialLikes: TPostLike[]
  userId: string
}

export default function PostLikeButton({ initialLikes, post_id, userId }: Props) {
  const [isePending, startTransition] = useTransition()
  const [likes, setLikes] = useState(initialLikes)
  const initialUserLikedPost = useMemo(() => {
    return likes.some(like => like.user_id === userId)
  }, [likes, userId])
  const [userLikedPost, setUserLikedPost] = useState(initialUserLikedPost)

  const [optimisticLikes, updateOptimisticLikes] = useOptimistic(
    { totalLikes: likes.length, userLikedPost: userLikedPost },
    (state, optimisticUpdate: { userLikedPost: boolean; likeDelta: number }) => ({
      totalLikes: state.totalLikes + optimisticUpdate.likeDelta,
      userLikedPost: optimisticUpdate.userLikedPost,
    })
  )

  function togglePostLike() {
    console.log({
      userLikedPost,
      post_id
    })
    startTransition(() => {
      const optimisticUpdate = {
        userLikedPost: !optimisticLikes.userLikedPost,
        likeDelta: optimisticLikes.userLikedPost ? -1 : 1,
      }
      updateOptimisticLikes(optimisticUpdate)
  
      if (userLikedPost) {
        dislikePost(post_id).then(({ isSuccessful, message }) => {
          console.log({ isSuccessful, message })
          if (!isSuccessful) {
            console.log("Something went wrong with dislikePost function")
            updateOptimisticLikes({ userLikedPost: optimisticLikes.userLikedPost, likeDelta: -optimisticUpdate.likeDelta })
            toast.error("Something went wrong, try again later")
            return
          }
          toast.success(" 💔 ")
          setUserLikedPost(false)
        })
      } else {
        likePost(post_id).then(({ isSuccessful, message }) => {
          console.log({ isSuccessful, message })
          if (!isSuccessful) {
            console.log("Something went wrong with likePost server action")
            updateOptimisticLikes({ userLikedPost: optimisticLikes.userLikedPost, likeDelta: -optimisticUpdate.likeDelta })
            toast.error("Something went wrong, try again later")
            return
          }
          toast.success(" ♥️ ")
          setUserLikedPost(true)
        })
      }
      getPostLikes(post_id).then((response) => {
        console.log(response)
        if (response.data) setLikes(response.data)
      })
    })
  }

  return (
    <button
      disabled={isePending}
      onClick={togglePostLike}
      className="flex items-center gap-2 rounded-full hover:bg-white/15 transition duration-200 p-3 cursor-pointer"
    >
      {optimisticLikes.userLikedPost ? (
        <AiFillHeart className="text-red-500" />
      ) : (
        <AiOutlineHeart />
      )}
      <span>{optimisticLikes.totalLikes}</span>
    </button>
  )
}