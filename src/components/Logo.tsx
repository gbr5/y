import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-col space-y-4 justify-center items-center">
      <div className="rounded-full  bg-slate-600">
        <Image
          alt="Logo"
          src="/y_logo.png"
          width={300}
          height={300}
          className="py-8 px-7"
        />
      </div>
      <h2 className="text-3xl">
        Y - Why not?
      </h2>
    </div>
  )
}
