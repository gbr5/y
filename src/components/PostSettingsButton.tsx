"use client"
import { BsThreeDots } from "react-icons/bs";
import { Button } from "./ui/button";
import { TPost } from "@/dtos/Post";
import { useEffect, useRef, useState } from "react";
import { deletePost } from "@/app/actions/post";

type Props = {
  userId: string
  post: TPost
  refreshFeed: () => void
}

export default function PostSettingsButton({ post, userId, refreshFeed }: Props) {
  const popUpRef = useRef<HTMLDivElement>(null)
  const [isSettingsPopUpOpen, setIsSettingsPopUpOpen] = useState(false)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (popUpRef.current && !popUpRef.current.contains(event.target as Node)){
        setIsSettingsPopUpOpen(false)
      }
    }
    if (isSettingsPopUpOpen) {
      document.addEventListener('click', handleClickOutside, true)
      document.addEventListener('touchstart', handleClickOutside, true)
    }
    return () => {
      document.removeEventListener("click", handleClickOutside, true)
      document.removeEventListener("touchstart", handleClickOutside, true)
    }
  }, [isSettingsPopUpOpen])

  function toggleSettingsPopUp() {
    setIsSettingsPopUpOpen(!isSettingsPopUpOpen)
  }

  function handleDeletePost() {
    deletePost(post.id)
    refreshFeed()
    toggleSettingsPopUp()
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="text-gray-500 cursor-pointer"
        onClick={toggleSettingsPopUp}
      >
        <BsThreeDots />
      </button>
      {isSettingsPopUpOpen && (
        <div ref={popUpRef} className="
          absolute
          flex
          flex-col
          space-y-4
          p-8
          border
          border-slate-50
          bg-black
          z-10
          right-0
        ">
          {post.author_id === userId && (
            <Button onClick={handleDeletePost} className="w-full p-4">
              Delete post
            </Button>
          )}
          {post.author_id !== userId && (
            <Button className="w-full p-4">
              Remove from my feed
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
