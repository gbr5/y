import { BsSearch } from "react-icons/bs";

export default function RightSidebar() {
  return (
    <section className="sticky overflow-y-scroll top-0 hidden lg:flex flex-col items-stretch min-w-[275px] h-screen px-2 pt-6">
      <div className=" w-full">
        <div className="relative w-full h-full group">
          <input
            id="searchBox"
            type="text"
            name=""
            placeholder="Search Y"
            className="
              outline-none
              bg-neutral-900/90
              w-full
              h-full
              rounded-full
              p-4
              pl-12
              peer
              focus:border-[0.5px]
              focus:border-yprimary
            "
          />
          <label
            htmlFor="searchBox"
            className="
              absolute
              top-0
              left-0
              h-full
              flex
              items-center
              justify-center
              p-4
              text-slate-500
              peer-focus:text-yprimary
            "
          >
            <BsSearch className="w-5 h-5" />
            {/* <BsSearch className="w-5 h-5 text-gray-500 peer-focus:text-primary" /> */}
          </label>
        </div>
      </div>
      <div className="w-full flex flex-col rounded-xl bg-neutral-900 my-4">
        <h3 className="font-bold text-xl p-2 my-2 px-4">What&apos;s happening</h3>
        <div className="f">
          {Array.from({length:5}).map((_, index) => (
            <div key={index} className="hover:bg-white/10 p-4 last:rounded-b-xl transition duration-200">
              <p className="font-bold text-lg">#trending {index + 1}</p>
              <p className="text-sm text-neutral-500">33.3k</p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex flex-col rounded-xl bg-neutral-900 my-4">
        <h3 className="font-bold text-xl p-2 my-2 px-4">Who to follow</h3>
        <div className="f">
          {Array.from({length:5}).map((_, index) => (
            <div
              key={index}
              className="
                hover:bg-white/10
                p-4
                flex
                items-center
                justify-between
                space-x-4
                last:rounded-b-xl
                transition
                duration-200
              "
            >
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-neutral-600 rounded-full"></div>
                <div className="flex flex-col space-y-2">
                  <p className="font-bold text-white">Some One</p>
                  <p className="text-gray-500 text-xs">@someone289729879</p>
                </div>
              </div>
              <div className="ml-auto">
                <button className="rounded-full px-6 py-2 bg-white text-neutral-950" type="button">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
