"use client"; // Ensure this is a client component
import Link from "next/link";

function Navbar({ name, userId }) {
  return (
    <nav className="bg-transparent">
      <div className="flex items-center justify-between py-5">
        <div className="flex flex-shrink-0 items-center">
          <div className="text-[#16f2b3] text-3xl font-bold">
            {name || "User Name"} {/* Fallback for name */}
          </div>
        </div>

        <ul
          className="mt-4 flex h-screen max-h-0 flex-col items-start text-sm opacity-0 md:mt-0 md:h-auto md:max-h-screen md:flex-row md:space-x-1 md:border-0 md:opacity-100"
          id="navbar-default"
        >
          <li>
            <Link
              className="block px-4 py-2 no-underline outline-none hover:no-underline"
              href={`/profile/${userId}`}
            >
              <div className="text-sm text-white transition-colors duration-300 hover:text-pink-600">
                ABOUT
              </div>
            </Link>
          </li>

          <li>
            <Link
              className="block px-4 py-2 no-underline outline-none hover:no-underline"
              href={`/profile/${userId}/blog`}
            >
              <div className="text-sm text-white transition-colors duration-300 hover:text-pink-600">
                POSTS
              </div>
            </Link>
          </li>

          <li>
            <Link
              className="block px-4 py-2 no-underline outline-none hover:no-underline"
              href={`/profile/${userId}/projects`}
            >
              <div className="text-sm text-white transition-colors duration-300 hover:text-pink-600">
                PROJECTS
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
