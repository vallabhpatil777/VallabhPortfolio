import React, { useState } from "react";
import { Link } from "react-scroll";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#090917] top-0 left-0 fixed w-full h-[80px] shadow-md flex justify-between items-center px-4 sm:px-6 lg:px-44 z-50">
      {/* Logo */}
      <div className="text-white text-lg font-semibold font-sans">PORTFOLIO</div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex space-x-6 lg:space-x-8">
        <Link
          to="about"
          smooth={true}
          duration={500}
          className="text-white text-sm lg:text-md font-semibold hover:text-[#8C2EDB] transition duration-300 cursor-pointer"
        >
          About
        </Link>
        <Link
          to="skills"
          smooth={true}
          duration={500}
          className="text-white text-sm lg:text-md font-semibold hover:text-[#8C2EDB] transition duration-300 cursor-pointer"
        >
          Skills
        </Link>
        <Link
          to="experience"
          smooth={true}
          duration={500}
          className="text-white text-sm lg:text-md font-semibold hover:text-[#8C2EDB] transition duration-300 cursor-pointer"
        >
          Experience
        </Link>
        <Link
          to="projects"
          smooth={true}
          duration={500}
          className="text-white text-sm lg:text-md font-semibold hover:text-[#8C2EDB] transition duration-300 cursor-pointer"
        >
          Projects
        </Link>
        <Link
          to="education"
          smooth={true}
          duration={500}
          className="text-white text-sm lg:text-md font-semibold hover:text-[#8C2EDB] transition duration-300 cursor-pointer"
        >
          Education
        </Link>
      </div>

      {/* Desktop Github Button */}
      <div className="hidden sm:block">
        <a
          href="https://github.com/vallabhpatil777"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="rounded-[20px] bg-transparent border-[1px] border-[#854CE6] py-[8px] px-[16px] lg:py-[10px] lg:px-[20px] text-sm lg:text-md text-[#854CE6] hover:bg-[#8C2EDB] hover:text-white transition duration-300">
            Github Profile
          </button>
        </a>
      </div>

      {/* Mobile Menu Button */}
      <div className="sm:hidden ">
        <button
          onClick={toggleMenu}
          className="text-white text-3xl focus:outline-none"
        >
          &#9776;
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="sm:hidden fixed top-20 left-0 w-full bg-[#D4D4D43B] backdrop-blur-md shadow-md rounded-b-[20px]">
          <div className="flex flex-col items-center space-y-4 py-6">
            <Link
              to="about"
              smooth={true}
              duration={500}
              className="text-white text-md font-semibold hover:text-[#8C2EDB] transition duration-300 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="skills"
              smooth={true}
              duration={500}
              className="text-white text-md font-semibold hover:text-[#8C2EDB] transition duration-300 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Skills
            </Link>
            <Link
              to="experience"
              smooth={true}
              duration={500}
              className="text-white text-md font-semibold hover:text-[#8C2EDB] transition duration-300 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Experience
            </Link>
            <Link
              to="projects"
              smooth={true}
              duration={500}
              className="text-white text-md font-semibold hover:text-[#8C2EDB] transition duration-300 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="education"
              smooth={true}
              duration={500}
              className="text-white text-md font-semibold hover:text-[#8C2EDB] transition duration-300 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Education
            </Link>
            <a
              href="https://github.com/vallabhpatil777"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              <button className="rounded-[20px] bg-[#8C2EDB] text-white border-[1px] border-[#6F10BF] py-[8px] px-[16px] hover:bg-[#854CE6] hover:text-black transition duration-300">
                Github Profile
              </button>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
