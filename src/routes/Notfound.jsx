import { TbXboxXFilled } from "react-icons/tb";
import { Link } from "react-router-dom";

function Notfound() {
  return (
    <div className="relative w-full h-[110vh] overflow-hidden">

      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 text-white">
        <TbXboxXFilled className="text-6xl mb-6 text-red-500 animate-pulse" />

        <h1 className="text-7xl font-bold tracking-widest mb-4">404</h1>

        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>

        <p className="max-w-md text-gray-300 mb-8">
          Sorry, the page you were searching for either moved, changed, or never
          existed.
        </p>

        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 hover:bg-gray-200 transition"
        >
          Take Me Home
        </Link>
      </div>
    </div>
  );
}

export default Notfound;
