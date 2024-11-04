import Link from "next/link"

import { BiHomeCircle, BiUser } from "react-icons/bi"
import { BsBell, BsBookmark, BsThreeDots, BsTwitter } from "react-icons/bs"
import { FaFeatherPointed } from "react-icons/fa6"
import { HiOutlineHashtag } from "react-icons/hi"
import { HiOutlineEnvelope } from "react-icons/hi2"

import { signOut } from "@/app/actions/auth"

const NAVIGATION_ITEMS = [
  {
    title: "Twitter",
    icon: BsTwitter
  },
  {
    title: "Home",
    icon: BiHomeCircle
  },
  {
    title: "Explore",
    icon: HiOutlineHashtag
  },
  {
    title: "Notifications",
    icon: BsBell
  },
  {
    title: "Messages",
    icon: HiOutlineEnvelope
  },
  {
    title: "Bookmarks",
    icon: BsBookmark
  },
  {
    title: "Profile",
    icon: BiUser
  },
]

export default function LeftSidebar() {
  return (
    <section className="
      sticky
      top-0
      
      flex
      flex-col
      w-14
      lg:w-[275px]
      
      items-stretch
      h-[100vh]
    ">
      <div className="flex flex-col items-stretch h-full space-y-4 my-4">
        {NAVIGATION_ITEMS.map((item, index) => (
          <Link
            key={index}
            href={`/${item.title.toLowerCase()}`}
            className={`
              ${index !== 0 && "hover:bg-white/10"}
              transition
              duration-200
              rounded-3xl
              py-2
              px-4
              flex
              items-center
              justify-center
              lg:justify-start
              min-w-full
              w-fit
              space-x-2
              text-2xl
            `}
          >
            <div className="">
              <item.icon />
            </div>
            {index !== 0 && <div className="hidden lg:flex">{item.title}</div>}
          </Link>
        ))}
        {/* make a search button */}
        <button
          type="button"
          className="
            flex
            rounded-full
            bg-yprimary
            py-2
            m-2
            lg:py-4
            lg:m-4
            text-center
            items-center
            justify-center
            text-2xl
            hover:opacity-70
            transition
            duration-200
            min-w-6
            lg:min-w-[240px]
          "
        >
          <p className="hidden lg:flex items-center justify-center text-center w-full mx-auto">
            Post
          </p>
          <FaFeatherPointed className="flex lg:hidden text-slate-300" />
        </button>
      </div>
      <button
        type="button"
        onClick={signOut}
        className="
          flex
          items-center
          space-x-0
          lg:space-x-2

          justify-between
          rounded-full
          bg-transparent
          p-2
          lg:p-4
          m-2
          lg:m-4
          text-center
          hover:bg-white/30
          transition
          duration-200
        "
      >
        <div className="flex items-center space-x-0 lg:space-x-2">
          <div className="rounded-full bg-slate-400 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"></div>
          <div className="hidden lg:flex flex-col justify-start items-start text-sm">
            <div className="font-semibold">DIFOs</div>
            <div className="">@difos21797298</div>
          </div>
        </div>
        <div className="hidden lg:flex">
          <BsThreeDots />
        </div>
      </button>
      {/* </div> */}
    </section>
  )
}

// Parei no minuto 1:38:30