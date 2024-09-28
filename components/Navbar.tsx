import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../styles/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleMode } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    }
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log('Menu Toggled:', isMenuOpen);
  };

  return (
    <header className={`flex justify-between items-center p-4 h-20 ${isDarkMode ? 'bg-[#0D0D0D] text-[#D7B66A]' : 'bg-white text-black'}`}>
      <div className="flex-1 pl-2">
      <Link href="/" passHref>
        <Image
          src="/Boostifylogo.png"
          alt="Boostify Logo"
          className="h-24 w-auto sm:h-24 md:h-28 lg:h-32 xl:h-36 2xl:h-40" // Ukuran h ditingkatkan
          width={180}
          height={180}
        />
      </Link>
      </div>
      <nav className="flex items-center gap-4">
        <button onClick={toggleMode} className="cursor-pointer">
          <Image
            src={isDarkMode ? "/light-mode-icon.png" : "/moon.png"}
            alt={isDarkMode ? "Light Mode Icon" : "Dark Mode Icon"}
            width={35}
            height={24}
            className="transition-transform duration-300 hover:rotate-20"
          />
        </button>

        {/* Hamburger Menu for small screens */}
        <button className="flex flex-col justify-center items-center space-y-1 md:hidden" onClick={handleMenuToggle}>
          <span className="block w-6 h-0.5 bg-gray-400"></span>
          <span className="block w-6 h-0.5 bg-gray-400"></span>
          <span className="block w-6 h-0.5 bg-gray-400"></span>
        </button>

        {/* Navbar Links */}
        <ul className={`md:flex items-center gap-6 ml-0 ${isMenuOpen ? 'flex flex-col mt-4 md:mt-0' : 'hidden'} absolute md:static top-20 left-0 right-0 ${isDarkMode ? 'bg-[#0D0D0D]' : 'bg-white'} md:bg-transparent shadow-md md:shadow-none rounded-md md:rounded-none p-4 md:p-0 z-50`}>
          <li><Link href="/About" className={`${isDarkMode ? 'text-[#D7B66A] hover:text-[#7D0A0A]' : 'text-[#7D0A0A] hover:text-[#D7B66A]'} font-medium`}>About</Link></li>
          <li><Link href="/Team" className={`${isDarkMode ? 'text-[#D7B66A] hover:text-[#7D0A0A]' : 'text-[#7D0A0A] hover:text-[#D7B66A]'} font-medium`}>Our Team</Link></li>
          <li><Link href="/SignIn" className={`${isDarkMode ? 'text-[#EAD196] hover:text-[#7D0A0A]' : 'text-[#b91c1c] hover:text-[#D7B66A]'} font-bold`}>Sign In</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
