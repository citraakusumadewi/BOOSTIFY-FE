import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import HomeNav from '../components/HomeNav'; // Import HomeNav component
import Footer from '../components/Footer';
import { useTheme } from '../styles/ThemeContext';
import Link from 'next/link'; // Import Link from next/link
import Image from 'next/image'; // Import Image from next/image

const LandingPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get the session data
  const [loading, setIsLoading] = useState(true); // State to handle loading
  const { isDarkMode } = useTheme(); // Get the theme (dark/light mode)

  useEffect(() => {
    if (status === 'loading') {
      // Wait for session loading to finish
      return;
    }

    if (session) {
      // Redirect to HomePage if the user is already logged in
      router.push('/HomePage');
    } else {
      // If not logged in, set loading to false
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (loading) {
    return (
      <div className={`loaderContainer flex justify-center items-center h-screen ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-gray-900'}`}>
        <div className="loader relative w-12 aspect-[1/1] rounded-full border-[8px] border-transparent border-r-[#ffa50097] animate-spin">
          <div className="absolute inset-[-8px] rounded-full border-[inherit] animate-[spin_2s_linear_infinite]"></div>
          <div className="absolute inset-[-8px] rounded-full border-[inherit] animate-[spin_4s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#0D0D0D] text-gray-100' : 'bg-white text-gray-900'}`}>
      {session ? <HomeNav /> : <Navbar />}

      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row items-center lg:justify-between mt-8 sm:mt-10 md:mt-12 lg:mt-16 mx-4 sm:mx-5 md:mx-8 lg:mx-10 xl:mx-16">
        {/* Text Section */}
        <div className="lg:w-1/2 text-left mb-8 sm:mb-10 md:mb-12 lg:mb-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 lg:pl-0">
            Capture Your Smile, Capture Your Presence
          </h1>
          <p className="text-sm sm:text-base md:text-lg leading-relaxed lg:pl-0 text-justify">
            This device is an attendance system based on facial recognition technology that requires users to smile as a sign of presence. With just a smile, your attendance is automatically recorded, enhancing the positive atmosphere in the workplace or school. Additionally, this device aims to boost people's enthusiasm and motivation to start their day with a smile, creating a more positive and productive environment.
          </p>
          <div className="mt-6 sm:mt-8 ml-0 md:ml-0">
            <Link href="/SignIn" passHref>
              <button className={`py-2 sm:py-3 px-5 sm:px-6 rounded-lg font-semibold shadow-lg transform transition-transform duration-300 ${isDarkMode ? 'bg-[#5B0A0A] text-[#D7B66A] hover:bg-red-800' : 'bg-[#7D0A0A] text-[#EAD196] hover:bg-red-700'}`}>
                See Your Attendance
              </button>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center">
          <Image 
            src="/smile-image.png" 
            alt="Smiling Face" 
            className="h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-90 lg:w-90 xl:h-[23rem] xl:w-[23rem]" 
            width={320} // Adjust width
            height={320} // Adjust height
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
