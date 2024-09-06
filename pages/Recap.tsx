import React, { useState, useRef, useEffect } from 'react';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme } from '../styles/ThemeContext'; // Import useTheme
import Image from 'next/image'; // Import Image from next/image

interface AttendanceItem {
  assisstant_code: string; // Assistant Code
  name: string;
  totalAttendance: number;
}

const Recap: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Default to page 1
  const [totalPages, setTotalPages] = useState<number>(8);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();


  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setFilterOpen(false);
    }
  };

  useEffect(() => {
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOpen]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const authDataString = localStorage.getItem('authData');
      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);
          const token = authData.token.token;

          const response = await fetch(`https://boostify-back-end.vercel.app/api/recap?page=${currentPage}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch attendance data');
          }

          const data = await response.json();
          console.log('Fetched data:', data);

          setAttendanceData(data.payload);
          setTotalPages(data.pagination.totalPages); // Update total pages from the response
          setLoading(false);
        } catch (error: any) {
          setError(error.message);
          setLoading(false);
        }
      } else {
        setError('No authentication token found');
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Data for first page's rank section
  const rankedData = attendanceData.slice(0, 3);

  // Data for cards (showing a maximum of 5 cards per page)
  const cardData = attendanceData.slice(3);

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    toggleFilter(); // Close dropdown after selecting date
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-gray-900'}`}>
      <HomeNav />
      <main className="flex-1 px-4 py-6 text-center sm:px-6 md:px-10 lg:px-16 xl:px-24">
        <h2 className={`text-3xl font-bold mb-16 sm:text-4xl lg:text-5xl xl:my-24 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          ATTENDANCE RECAP
        </h2>

        {currentPage === 1 ? (
          // First page layout
          <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {rankedData.map((attendee, index) => {
              const rankClasses = index === 0 
                ? 'col-span-2 flex justify-center' // Full width in mobile
                : 'flex justify-center'; // Default for others

              const medalIcon = index === 0 
                ? '/gold-medal.png'
                : index === 1
                ? '/silver-medal.png'
                : '/bronze-medal.png';

              return (
                <div key={index} className={`${rankClasses} text-center`}>
                  <div className="relative">
                    <Image 
                      src={medalIcon} 
                      alt="medal" 
                      className="absolute top-[-10px] left-[-15px] w-20 h-20 object-contain z-20" 
                      width={80}
                      height={80}
                    />
                    <div className={`w-36 h-36 rounded-full flex justify-center items-center text-2xl font-bold relative z-10 ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-gray-900'}`}>
                      <span>{attendee.assisstant_code}</span>
                    </div>
                    <p className={`text-3xl font-bold text-gray-800 mt-2  ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{attendee.totalAttendance}</p>
                  </div>
                </div>
              );
            })}
          </div>

            <div className="relative inline-block text-right mt-10 sm:mt-20">
              <button onClick={toggleFilter} className={`text-[#3F3C38] text-base flex items-center ${isDarkMode ? 'text-white' : 'text-[#3F3C38]'}`}>
                Filter
              </button>
              {filterOpen && (
                <div ref={dropdownRef} className={`absolute right-0 shadow-lg rounded-lg p-4 mt-2 ${isDarkMode ? 'bg-[#D7B66A]' : 'bg-[#EAD196]'}`}>
                  <p className={`font-bold mb-2 ${isDarkMode ? 'text-[#3F3C38]' : 'text-gray-900'}`}>Sort By:</p>
                  <ul>
                    <li className={`text-sm cursor-pointer py-1 hover:underline ${isDarkMode ? 'text-[#3F3C38]' : 'text-[#3F3C38]'}`}>
                      <DatePicker selected={startDate} onChange={handleDateChange} placeholderText="Select Date" />
                    </li>
                    <li onClick={toggleFilter} className={`text-sm cursor-pointer py-1 hover:underline ${isDarkMode ? 'text-[#3F3C38]' : 'text-[#3F3C38]'}`}>
                      Assistant Code
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Cards */}
            <div className="max-w-3xl mx-auto mt-10 mb-10">
              {attendanceData.map((attendee, index) => (
                <div key={index} className={`flex justify-between items-center p-5 my-4 rounded-lg shadow-lg w-full ${isDarkMode ? 'bg-[#D7B66A] text-[#3F3C38]' : 'bg-[#EAD196] text-[#3F3C38]'}`}>
                  <div className="text-left">
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-[#3F3C38]' : 'text-[#4A4A4A]'}`}>{attendee.assisstant_code}</h3>
                    <p className={`text-lg ${isDarkMode ? 'text-[#3F3C38]' : 'text-[#4A4A4A]'}`}>{attendee.name}</p>
                  </div>
                  <div className={`rounded-lg p-4 flex items-center justify-center shadow-lg w-[75px] h-[60px] text-2xl text-center font-bold ${isDarkMode ? 'bg-[#5B0A0A] text-[#D7B66A]' : 'bg-[#7D0A0A] text-[#EAD196]'}`}>
                    {attendee.totalAttendance}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Layout for other pages
          <div className="mx-auto max-w-md sm:max-w-xl lg:max-w-2xl">
            {attendanceData.map((attendee, index) => (
              <div key={index} className={`flex justify-between p-5 mb-5 rounded-lg shadow-md ${isDarkMode ? 'bg-[#D7B66A] text-[#3F3C38]' : 'bg-[#EAD196] text-[#3F3C38]'}`}>
                <div className="text-left">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-[#3F3C38]' : 'text-gray-800'}`}>{attendee.assisstant_code}</h3>
                  <p className={`text-lg ${isDarkMode ? 'text-[#3F3C38]' : 'text-gray-600'}`}>{attendee.name}</p>
                </div>
                <div className={`rounded-lg p-2 flex items-center justify-center shadow-md w-20 h-15 text-xl text-center font-bold ${isDarkMode ? 'bg-[#5B0A0A] text-[#D7B66A]' : 'bg-[#7D0A0A] text-[#EAD196]'}`}>
                  {attendee.totalAttendance}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center my-5">
          {currentPage > 1 && (
            <button onClick={handlePreviousPage} className={`p-2 rounded-full mx-2 text-xl transition-colors ${isDarkMode ? 'bg-[#5B0A0A] hover:bg-gray-500 text-[#D7B66A]' : 'bg-[#7D0A0A] hover:bg-red-700 text-[#EAD196]'}`}>
              ◀
            </button>
          )}
          <button className={`text-[#EAD196] p-3 rounded-full mx-2 text-xl font-bold ${isDarkMode ? 'bg-[#5B0A0A] hover:bg-gray-500 text-[#D7B66A]' : 'bg-[#7D0A0A] hover:bg-red-700 text-[#EAD196]'}`} disabled>
            PAGE {currentPage}
          </button>
          {currentPage < totalPages && (
            <button onClick={handleNextPage} className={`p-2 rounded-full mx-2 text-xl transition-colors ${isDarkMode ? 'bg-[#5B0A0A] hover:bg-gray-500 text-[#D7B66A]' : 'bg-[#7D0A0A] hover:bg-red-700 text-[#EAD196]'}`}>
              ▶
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recap;
