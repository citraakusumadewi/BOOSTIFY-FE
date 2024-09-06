import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import HomeNav from '../components/HomeNav';
import { useTheme } from '../styles/ThemeContext';

const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-[#0D0D0D] text-gray-200' : 'bg-none text-gray-900'}`}>
      <HomeNav />

      <main className="flex flex-col lg:flex-row items-center lg:justify-between mt-8 sm:mt-10 md:mt-12 lg:mt-16 mx-4 sm:mx-5 md:mx-8 lg:mx-10 xl:mx-16">
        {/* Left Section */}
        <div className="lg:w-1/2 text-left mb-8 sm:mb-10 md:mb-12 lg:mb-0">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-5 lg:pl-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Capture Your Smile, Capture Your Presence
          </h1>
          <p className={`text-sm sm:text-base md:text-lg leading-relaxed lg:pl-0 text-justify ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-justify`}>
          This device is an attendance system based on facial recognition technology that requires users to smile as a sign of presence. With just a smile, your attendance is automatically recorded and enhancing the positive atmosphere in the workplace or school. Additionally, this device aims to boost people's enthusiasm and motivation to start their day with a smile, creating a more positive and productive environment.
          </p>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 flex justify-center">
          <Image
            src="/smile-image.png"
            alt="Capture Presence"
            width={300} // Adjust size for better responsiveness
            height={300}
            className="h-50 w-50 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-90 lg:w-90 xl:h-[20rem] xl:w-[20rem]"
          />
        </div>
      </main>

      <section className="flex flex-col items-center py-14 gap-5">
        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          ATTENDANCE
        </h2>
        <Link href="/LiveReport" passHref>
          <button className={`py-3 sm:py-4 px-6 sm:px-8 rounded font-bold transition-colors ${isDarkMode ? 'bg-[#5B0A0A] text-[#D7B66A] hover:bg-red-800' : 'bg-[#7D0A0A] text-[#EAD196] hover:bg-red-700'}`}>
            LIVE REPORT
          </button>
        </Link>
        <Link href="/Recap" passHref>
          <button className={`py-3 sm:py-4 px-6 sm:px-8 rounded font-bold transition-colors ${isDarkMode ? 'bg-[#5B0A0A] text-[#D7B66A] hover:bg-red-800' : 'bg-[#7D0A0A] text-[#EAD196] hover:bg-red-700'}`}>
            RECAP
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
