import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [shrink, setShrink] = useState(false);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      const fullHeight = document.body.scrollHeight;

      // ----- Top me ho -----
      if (scrollTop <= 50) {
        setShrink(false);
        return;
      }

      // ----- Scroll direction detect -----
      if (scrollTop > lastScrollTop.current) {
        // niche ja rahe ho → shrink
        setShrink(true);
        console.log(scrollTop, lastScrollTop.current);
      } else {
        // upar ja rahe ho → shrink tab tak rahe jab tak top na aa jaye
        setShrink(true);
      }

      lastScrollTop.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-all duration-300">
      <div
        className={`flex flex-col items-center justify-between px-4 py-3 transition-all duration-300 ${
          shrink ? "translate-y-[-40px]" : "translate-y-0"
        }`}
      >
        {/* Logo */}
        <div
          className={`transition-all duration-300 ${
            shrink ? "opacity-0 scale-0" : "opacity-100 scale-100"
          }`}
        >
          <img src="/logo.png" alt="Logo" className="h-8" />
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none"
          />
        </div>
      </div>
    </nav>
  );
}
