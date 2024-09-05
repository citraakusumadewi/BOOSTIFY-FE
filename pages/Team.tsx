import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import { useTheme } from '../styles/ThemeContext';

const OurTeam: React.FC = () => {
  const { data: session, status } = useSession();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    console.log('Session Data:', session);
    console.log('Session Status:', status);
  }, [session, status]);

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-[#0D0D0D] text-gray-300' : 'bg-white text-gray-900'}`}>
      {status === 'authenticated' ? <HomeNav /> : <Navbar />}

      <main className={`p-4 md:p-8 lg:p-12 text-center ${isDarkMode ? 'bg-[#0D0D0D]' : 'bg-white'}`}>
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mt-1 mb-8 md:mb-16 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
          RESEARCH DIVISION 22
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-center flex-wrap">
          <div className={`${isDarkMode ? 'bg-[#5B0A0A]' : 'bg-[#7D0A0A]'} p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md lg:max-w-lg xl:max-w-2xl`}>
            <h2 className={`text-xl sm:text-2xl mb-4 md:mb-6 font-bold text-left ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'}`}>
              Backend
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                  <Image src="/Mitch.jpg" alt="MMA" width={80} height={80} className="object-cover" />
                </div>
                <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>MMA</p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                  <Image src="/sayyid.jpg" alt="SZN" width={80} height={80} className="object-cover" />
                </div>
                <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>SZN</p>
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[#5B0A0A] text-yellow-100' : 'bg-[#7D0A0A] text-[#EAD196]'} p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md lg:max-w-lg xl:max-w-2xl`}>
            <h2 className={`text-xl sm:text-2xl mb-4 md:mb-6 font-bold text-left ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'}`}>
              Frontend
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                  <Image src="/citra.jpg" alt="CIT" width={80} height={80} className="object-cover" />
                </div>
                <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>CIT</p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                  <Image src="/lily.jpg" alt="LIA" width={80} height={80} className="object-cover" />
                </div>
                <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>LIA</p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                  <Image src="/kharisma.jpg" alt="ATX" width={80} height={80} className="object-cover" />
                </div>
                <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>ATX</p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                  <Image src="/Nabil.jpg" alt="AFN" width={80} height={80} className="object-cover" />
                </div>
                <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>AFN</p>
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[#5B0A0A] text-yellow-100' : 'bg-[#7D0A0A] text-[#EAD196]'} p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md lg:max-w-lg xl:max-w-2xl`}>
            <h2 className={`text-xl sm:text-2xl mb-4 md:mb-6 font-bold text-left ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'}`}>
              Machine Learning & IoT
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                  <Image src="/Kinep.jpg" alt="KNP" width={80} height={80} className="object-cover" />
                </div>
                <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>KNP</p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                  <Image src="/alika.jpg" alt="AKA" width={80} height={80} className="object-cover" />
                </div>
                <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>AKA</p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                  <Image src="/Fatur.jpg" alt="MFT" width={80} height={80} className="object-cover" />
                </div>
                <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>MFT</p>
              </div>
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2">
                  <Image src="/Kaasyiful.jpg" alt="KSF" width={80} height={80} className="object-cover" />
                </div>
                <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>KSF</p>
              </div>
              <div className="col-span-2 flex justify-center">
                <div className="flex flex-col justify-center items-center">
                  <div className="rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20 mb-2">
                    <Image src="/juna.jpeg" alt="JIN" width={80} height={80} className="object-cover" />
                  </div>
                  <p className={`${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'} text-base sm:text-lg`}>JIN</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OurTeam;
