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
  const [searchValue, setSearchValue] = useState<string>(''); // Search input state
  const [filteredData, setFilteredData] = useState<AttendanceItem[]>([]); // State for filtered data
  const [isSearchApplied, setIsSearchApplied] = useState<boolean>(false); // Check if search is applied
  const { isDarkMode } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value.toUpperCase()); // Convert input to uppercase
  };  

  const handleApplySearch = () => {
    const filtered = attendanceData.filter((item) =>
      item.assisstant_code.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filtered); // Set filtered data based on search
    setIsSearchApplied(true); // Mark that search has been applied
  };

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

  if (error) {
    return <div>Error: {error}</div>;
  }

  const dataToDisplay = isSearchApplied ? filteredData : attendanceData;

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-gray-900'}`}>
      <HomeNav />
      <main className="flex-1 px-4 py-6 text-center sm:px-6 md:px-10 lg:px-16 xl:px-24">
        <h2 className={`text-3xl font-bold mb-16 sm:text-4xl lg:text-5xl xl:my-24 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          ATTENDANCE RECAP
        </h2>

        {/* First page layout */}
        {currentPage === 1 && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {attendanceData.slice(0, 3).map((attendee, index) => {
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
                    <div className={`w-36 h-36 rounded-full flex justify-center items-center text-2xl font-bold relative z-10 ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}>
                      <span>{attendee.assisstant_code}</span>
                    </div>
                    <p className={`text-3xl font-bold mt-2 ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#3F3C38]'}`}>
                      {attendee.totalAttendance}
                    </p>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* Search bar and Apply button */}
        <div className="flex justify-center items-center mb-10">
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange} // Convert input to uppercase here
            placeholder="Search Assistant Code"
            className={`p-2 rounded-lg border-2 ${isDarkMode ? 'bg-[#2C2C2C] text-white' : 'bg-white text-gray-900'}`}
          />
          <button
            onClick={handleApplySearch}
            className={`ml-4 px-6 py-2 font-bold rounded-lg ${isDarkMode ? 'bg-[#5B0A0A] text-[#D7B66A]' : 'bg-[#7D0A0A] text-[#EAD196]'} hover:bg-red-700`}
          >
            Apply
          </button>
        </div>

        {/* Cards */}
        <div className="max-w-3xl mx-auto mt-10 mb-10">
          {dataToDisplay.map((attendee, index) => (
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

        <div className="flex justify-center items-center my-5">
          {currentPage > 1 && (
            <button onClick={handlePreviousPage} className={`p-2 rounded-full mx-2 text-xl transition-colors ${isDarkMode ? 'bg-[#5B0A0A] hover:bg-red-800 text-[#D7B66A]' : 'bg-[#7D0A0A] hover:bg-red-700 text-[#EAD196]'}`}>
              ◀
            </button>
          )}
          <button className={`text-[#EAD196] p-3 rounded-full mx-2 text-xl font-bold ${isDarkMode ? 'bg-[#5B0A0A] hover:bg-red-800 text-[#D7B66A]' : 'bg-[#7D0A0A] hover:bg-red-700 text-[#EAD196]'}`} disabled>
            PAGE {currentPage}
          </button>
          {currentPage < totalPages && (
            <button onClick={handleNextPage} className={`p-2 rounded-full mx-2 text-xl transition-colors ${isDarkMode ? 'bg-[#5B0A0A] hover:bg-red-800 text-[#D7B66A]' : 'bg-[#7D0A0A] hover:bg-red-700 text-[#EAD196]'}`}>
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
