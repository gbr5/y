// import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
// import AuthModel from "@/components/AuthModel";
import LeftSidebar from "@/components/LeftSidebar";
import MainFeed from "@/components/MainFeed";
import RightSidebar from "@/components/RightSidebar";

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  // const supabase = await createClient()

  // const { data, error } = await supabase.auth.getUser()
  // if (error || !data?.user) {
  //   redirect('/login')
  // }
  return (
    <div className="
      max-w-full
      h-full
      text-white
      overflow-hidden
      flex
      justify-center
      items-center
      relative
      bg-black
    ">
      <div className="max-w-screen-xl w-full h-full flex ">
        <LeftSidebar />
        <MainFeed userId={(data && data.user) ? data.user.id : ""} />
        <RightSidebar />
      </div>
    </div>
  )
}


// stopped at 