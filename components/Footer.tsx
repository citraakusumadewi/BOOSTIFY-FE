import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../styles/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer className={`flex flex-col justify-center items-center mt-24 py-4 gap-1 ${isDarkMode ? 'bg-[#5B0A0A]' : 'bg-[#7D0A0A]'}`}>
      <div className="flex items-center justify-center gap-4">
        <Link href="/About" className={`text-${isDarkMode ? '[#D7B66A]' : '[#EAD196]'}`}>
          About
        </Link>
        <Link href="/Team" className={`text-${isDarkMode ? '[#D7B66A]' : '[#EAD196]'}`}>
          Team
        </Link>
        <Link 
          href="https://lin.ee/W8n7V4r" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Image 
            src={isDarkMode ? "/line-dm.png" : "/line-lm.png"} 
            alt="Line Icon" 
            width={27} 
            height={27} 
          />
        </Link>
        <Link 
          href="https://www.instagram.com/cpslaboratory?igsh=MXB0bzFjc3pwZzBpNQ%3D%3D&utm_source=qr" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Image 
            src={isDarkMode ? "/ig-dm.png" : "/ig-lm.png"} 
            alt="Instagram Icon" 
            width={25} 
            height={25} 
          />
        </Link>
      </div>
      <div className="mt-1">
        <Image src="/Boostify-cps.png" alt="Boostify Logo" width={100} height={50} />
      </div>
      <p className={`text-center text-${isDarkMode ? '[#D7B66A]' : '[#EAD196]'} mt-0`}>
        © 2021 All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
