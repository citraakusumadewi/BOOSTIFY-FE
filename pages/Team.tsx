import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import { useTheme } from '../styles/ThemeContext';

const OurTeam: React.FC = () => {
  const { data: session, status } = useSession();
  const { isDarkMode } = useTheme();
  const [openModal, setOpenModal] = useState<string | null>(null);

  useEffect(() => {
    console.log('Session Data:', session);
    console.log('Session Status:', status);
  }, [session, status]);

  const teamMembers = [
    {
      name: 'MMA',
      imgSrc: '/Mitch.jpg',
      role: 'Backend',
      socials: {
        linkedin: 'https://www.linkedin.com/in/mitchaff/',
        Instagram: 'https://www.instagram.com/mtchffnd?igsh=YmNmMzM4NjVheHB0&utm_source=qr',
        GitHub: 'https://github.com/mitcheltastic',
      },
    },
    {
      name: 'SZN',
      imgSrc: '/sayyid.jpg',
      role: 'Backend',
      socials: {
        linkedin: 'https://www.linkedin.com/in/sayyidiz22/',
        Instagram: 'https://www.instagram.com/sayyidizzuddin?igsh=MTN1NHkzZjRqcnN3dA==',
        GitHub: 'https://github.com/sayyidz',
      },
    },
    {
      name: 'LIA',
      imgSrc: '/lily.jpg',
      role: 'Frontend',
      socials: {
        linkedin: 'https://www.linkedin.com/in/aulia-ramadhani-54b8272a2/',
        Instagram: 'https://www.instagram.com/lily.elui?igsh=MWVqNWp0OHo3ZzFkaA==',
        GitHub: 'https://github.com/lilyelui',
      },
    },
    {
      name: 'CIT',
      imgSrc: '/citra.jpg',
      role: 'Frontend',
      socials: {
        linkedin: 'https://www.linkedin.com/in/citrasribawono/',
        Instagram: 'https://www.instagram.com/citraakusumadewi?igsh=MTd6ajdkZDMxajY5bg==',
        GitHub: 'https://github.com/citraakusumadewi',
      },
    
    },
    {
      name: 'KNP',
      imgSrc: '/Kinep.jpg',
      role: 'Machine Learning',
      socials: {
        linkedin: 'https://www.linkedin.com/in/rizki-nugroho-firdaus-509666265/',
        Instagram: 'https://www.instagram.com/kinep2rizki?igsh=d3R1Znl1YTRwN24x',
        GitHub: 'https://github.com/kinep2rizki',
      },
    
    },
    {
      name: 'MFT',
      imgSrc: '/Fatur.jpg',
      role: 'Machine Learning',
      socials: {
        linkedin: 'https://www.linkedin.com/in/muhammad-faturohman-tohiri-b6b0491b8/',
        Instagram: 'https://www.instagram.com/fat.tohir?igsh=czU0czgxZGc0b2Nx',
        GitHub: 'https://github.com/Faturthir',
      },
    
    },
    {
      name: 'AKA',
      imgSrc: '/alika.jpg',
      role: 'Machine Learning',
      socials: {
        linkedin: 'https://www.linkedin.com/in/alikawidurikartika/',
        Instagram: 'https://www.instagram.com/alikaartka_?igsh=cHNzajZmbzU0c2pi',
        GitHub: 'https://github.com/alikawiduri',
      },
    
    },
    {
      name: 'KSF',
      imgSrc: '/Kaasyiful.jpg',
      role: 'Machine Learning',
      socials: {
        linkedin: 'https://www.linkedin.com/in/husain-kaasyiful/',
        Instagram: 'https://www.instagram.com/h5n_ksye?igsh=MXZ6djAxaWw2cmZuNQ==',
        GitHub: 'https://github.com/Kaasyiful',
      },
    
    },
    {
      name: 'JIN',
      imgSrc: '/juna.jpeg',
      role: 'Machine Learning',
      socials: {
        linkedin: 'https://www.linkedin.com/in/junaidi-rahmat-eunola/',
        Instagram: 'https://www.instagram.com/junaidirah_4?igsh=MWxxazF2cjhhdWFlNg==',
        GitHub: 'https://github.com/junaidirah',
      },
    
    },
    // Add other team members in similar fashion
  
    // Add the rest of your team members similarly
  ];

  const groupedMembers = {
    Backend: teamMembers.filter((member) => member.role === 'Backend'),
    Frontend: teamMembers.filter((member) => member.role === 'Frontend'),
    'Machine Learning & IoT': teamMembers.filter((member) => member.role === 'Machine Learning'),
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-[#0D0D0D] text-gray-300' : 'bg-white text-gray-900'}`}>
      {status === 'authenticated' ? <HomeNav /> : <Navbar />}

      <main className={`p-4 md:p-8 lg:p-12 text-center ${isDarkMode ? 'bg-[#0D0D0D] text-gray-300' : 'bg-white text-gray-900'}`}>
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mt-1 mb-8 md:mb-16 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          RESEARCH DIVISION 22
        </h1>

        <div className="grid grid-cols-1 gap-12 items-start justify-center">
          {Object.entries(groupedMembers).map(([role, members], index) => (
            <div
              key={index}
              className={`p-6 md:p-8 rounded-lg shadow-lg w-full max-w-lg mx-auto lg:max-w-3xl ${
                isDarkMode ? 'bg-[#5B0A0A] text-[#d7b66a]' : 'bg-[#7D0A0A] text-[#ead196]'
              }`}
            >
              <h2 className={`text-2xl md:text-3xl font-bold mb-6 text-left ${isDarkMode ? 'text-[D7B66A]' : 'text-[ead196]'}`}>
                {role}
              </h2>
              <div className="grid grid-cols-2 gap-6 justify-center">
                {members.map((member, idx) => (
                  <div key={idx} className="text-center mx-auto">
                    <div className="rounded-full overflow-hidden w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-2">
                      <Image src={member.imgSrc} alt={member.name} width={96} height={96} className="object-cover" />
                    </div>
                    <p className={`text-lg font-semibold ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'}`}>{member.name}</p>
                    <button
                      onClick={() => setOpenModal(member.name)}
                      className={`mt-2 px-4 py-2 rounded-full text-sm ${
                        isDarkMode ? 'bg-yellow-600 text-gray-800' : 'bg-yellow-500 text-[#7D0A0A]'
                      }`}
                    >
                      Social Media
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {openModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-lg shadow-lg w-full max-w-md ${
                isDarkMode ? 'bg-[#d7b66a] text-[#0D0D0D]' : 'bg-[#7D0A0A] text-[#ead196]'
              }`}
            >
               <h2 className="text-lg font-bold mb-4 text-center">
        {openModal}'s Social Media
      </h2>
              {teamMembers
                .filter((member) => member.name === openModal)
                .map((member, index) => (
                  <div key={index} className="text-center">
                    <p className="text-lg font-semibold mb-2"></p>
                    <p className="mb-2">
                      <a
                        href={member.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${
                          isDarkMode ? 'text-[#0D0D0D] hover:text-[#5B0A0A]' : 'text-[#ead196] hover:text-[#5B0A0A]'
                        }`}
                      >
                        LinkedIn
                      </a>
                    </p>
                    <p className="mb-2">
                      <a
                        href={member.socials.Instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${
                          isDarkMode ? 'text-[#0D0D0D] hover:text-[#5B0A0A]' : 'text-[#ead196] hover:text-[#5B0A0A]'
                        }`}
                      >
                        Instagram
                      </a>
                    </p>
                    <p className="mb-2">
                      <a
                        href={member.socials.GitHub}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${
                          isDarkMode ? 'text-[#0D0D0D] hover:text-[#5B0A0A]' : 'text-[#ead196] hover:text-[#5B0A0A]'
                        }`}
                      >
                        Github
                      </a>
                    </p>
                    <button
                      onClick={() => setOpenModal(null)}
                      className={`mt-4 px-4 py-2 rounded-full ${
                        isDarkMode ? 'bg-[#5B0A0A] hover:bg-[#0D0D0D] text-[#5B0A0A]' : 'bg-[#ead196] hover:bg-[#5B0A0A] text-[#7D0A0A]'
                      }`}
                    >
                      Close 
                    
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OurTeam;