import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-between select-none
    bg-red-500 px-10 py-2 fixed top-0 w-full z-50 shadow-md"
    >
      <h2
        onClick={() => router.push("/")}
        className="font-medium text-white text-lg cursor-pointer
        hover:text-red-900 transition-all ease-in-out"
      >
        Quest Community Server
      </h2>
      <div className="flex items-center gap-x-2">
        <img
          className="h-10 object-contain rounded-full border-2 border-white"
          src="https://avatars.githubusercontent.com/u/64089619?v=4"
          alt="profile"
        />
        <div className="flex flex-col">
          <span className="font-medium text-white">Menura Adithya</span>
          <span className="font-light text-sm hover:underline cursor-pointer text-white">
            Logout
          </span>
        </div>
        {/* <button className="btn bg-red-400">Login</button> */}
      </div>
    </div>
  );
};

export default Header;
