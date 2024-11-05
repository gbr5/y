import { createClient } from "@/utils/supabase/server";
import LeftSidebar from "@/components/LeftSidebar";
import MainFeed from "@/components/MainFeed";
import RightSidebar from "@/components/RightSidebar";

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return (
    <div className="
      max-w-full
      h-full
      text-white
      overflow-hidden
      flex
      justify-center
      items-center
      bg-black
    ">
      <div className="max-w-screen-xl w-full h-full flex relative">
        <LeftSidebar />
        <MainFeed userId={(data && data.user) ? data.user.id : ""} />
        <RightSidebar />
      </div>
    </div>
  )
}


// stopped at 