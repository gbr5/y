import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex flex-col space-y-4 justify-center items-center">
      <div className="rounded-full  bg-white">
        <Image
          alt="Logo"
          src="/y_not.png"
          width={300}
          height={300}
          className="p-8"
        />
      </div>
      <h2 className="text-3xl">
        Why not?
      </h2>
    </div>
  )
}
