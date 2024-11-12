import { submitPostReply } from "@/app/actions/post"
import { TPost } from "@/dtos/Post"
import { timePassed } from "@/utils/timePassed"
import { GiftIcon, ImageIcon, List, X } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { BsDot } from "react-icons/bs"
import { GrSchedule } from "react-icons/gr"
import { IoHappyOutline, IoLocationOutline } from "react-icons/io5"
import { toast } from "sonner"

type Props = {
  post: TPost
  closeComponent: () => void
  onPostSuccess: () => void
}

export default function ReplyPostPopUp({ post, closeComponent, onPostSuccess }: Props) {
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState("")
  const replyComponentRef = useRef<HTMLDivElement>(null)

  const postTime = () => {
    if (post.created_at !== post.updated_at) {
      return `${timePassed(new Date(post.created_at))} edited ${timePassed(new Date(post.updated_at))}`
    }
    return timePassed(new Date(post.created_at))
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (replyComponentRef.current && !replyComponentRef.current.contains(event.target as Node)){
        closeComponent()
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    document.addEventListener('touchstart', handleClickOutside, true)

    return () => {
      document.removeEventListener("click", handleClickOutside, true)
      document.removeEventListener("touchstart", handleClickOutside, true)
    }
  }, [closeComponent])

  async function handleSubmit(formData: FormData) {
    if (isPending) return
    startTransition(async () => {
      setErrorMessage("")
      try {
        formData.append("postId", post.id)
        const { isSuccessful, message, errorCode } = await submitPostReply(formData)
  
        if (!isSuccessful) {
          if (errorCode === "VALIDATION_ERROR") {
            toast.error(message)
            setErrorMessage(message)
            return 
          }
          // improve error handling
          redirect("/error")
        }
        toast.success(message)
        onPostSuccess()
        closeComponent()
      } catch {
        redirect("/error")
      }
    })
  }

  return (
    <div
      className="
        fixed
        z-10
        top-0
        left-0
        flex
        w-screen
        h-screen
        bg-white/15
      "
    >
      <div ref={replyComponentRef} className="
        fixed
        z-50
        flex
        flex-col
        w-screen
        h-screen
        md:w-[600px]
        md:h-auto
        md:top-[10vh]
        md:left-[30vw]
        p-2
        bg-black
        spay-4
        rounded-xl
      ">
        <div className="flex w-full justify-between mb-2">
          <button onClick={closeComponent} className="" type="button"><X/></button>
          <button className="text-yprimary" type="button">Drafts</button>
        </div>
        <div className="flex w-full mb-4 space-x-2">
          <div className="flex flex-col items-center">
            <div className="flex min-w-10 min-h-10 bg-slate-200 rounded-full pr-6" />
            <div className="w-[0.5px] h-full bg-slate-200 rounded-full " />
          </div>
          <div className="flex flex-col w-full space-y-2">
            <div className="flex items-center space-x-1">
              <div className="flex font-bold">{post.profiles?.full_name ?? ""}</div>
              <div className="text-gray-500">@{post.profiles?.username}</div>
              <div className="text-gray-500"><BsDot /></div>
              <div className="text-gray-500">{postTime()}</div>
            </div>
            <p className="w-full text-left text-sm text-white leading-5 my-4">{post.text}</p>
            <p className="w-full text-left text-gray-500">Replying to <span className="text-yprimary">{post.profiles?.username}</span></p>
          </div>
        </div>

        <form action={handleSubmit} className="flex flex-col space-y-2">
          <div className="flex space-x-4">
            <div className="flex min-w-10 h-10 bg-slate-200 rounded-full pr-6" />
            <div className="flex flex-col w-full">
              <input
                name="post"
                type="text"
                placeholder="Post your reply"
                className="
                  w-full
                  placeholder-text-gray-500
                  bg-black
                  appearance-none
                  border-none
                  bg-transparent
                  p-0
                  focus:outline-none
                "
              />
              <p id="posterror" className="text-red-500">{errorMessage}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <button type="button" className="text-yprimary"><ImageIcon /></button>
              <button type="button" className="text-yprimary"><GiftIcon /></button>
              <button type="button" className="text-yprimary"><List /></button>
              <button type="button" className="text-yprimary"><IoHappyOutline /></button>
              <button type="button" className="text-yprimary"><GrSchedule /></button>
              <button type="button" className="text-yprimary"><IoLocationOutline /></button>
            </div>
            <button
              disabled={isPending}
              type="submit"
              className="rounded-full bg-yprimary py-2 px-4"
            >
              {isPending ? 'Replying...' : 'Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
