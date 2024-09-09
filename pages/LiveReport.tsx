import React, { useEffect, useState } from 'react';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import { useTheme } from '../styles/ThemeContext';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
interface AttendanceItem {
  id: number;
  assisstant_code: string;
  name: string;
  time: string; // Assume time is in ISO 8601 format (UTC)
}

interface ApiResponse {
  assistances: AttendanceItem[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const LiveReport: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { isDarkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const authDataString = localStorage.getItem('authData');
      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);
          const token = authData.token.token;

          const dateQuery = selectedDate ? `&date=${selectedDate.toISOString().split('T')[0]}` : '';
          const response = await fetch(`https://boostify-back-end.vercel.app/api/attendances?page=${currentPage}${dateQuery}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data: ApiResponse = await response.json();
          setAttendanceData(data.assistances);
          setFilteredData(data.assistances);
          setTotalPages(data.totalPages);
        } catch (error: any) {
          console.error('Failed to fetch attendance data:', error.message);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAttendanceData();
  }, [currentPage, selectedDate]);

  // Format tanggal ke "Hari, Tanggal, Tahun" dalam UTC
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[date.getUTCDay()];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthsOfYear[date.getUTCMonth()];
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${dayName}, ${day} ${monthName} ${year}`;
  };

  // Format waktu ke "Jam:Menit:Detik" dalam UTC
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

 


  const filterByDate = () => {
    if (selectedDate) {
      const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
      console.log('Selected date (formatted):', selectedDateStr);
  
      const filtered = attendanceData.filter(item => {
        const itemDateStr = new Date(item.time).toISOString().split('T')[0];
        console.log('Item date (formatted):', itemDateStr);
        return itemDateStr === selectedDateStr;
      });
      console.log('Filtered data:', filtered);
      setFilteredData(filtered);
    } else {
      setFilteredData(attendanceData);
    }
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
  
  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#0D0D0D] text-[#BDBDBD]' : 'bg-white text-[#515151]'}`}>
      <HomeNav />
      <div className="flex-grow"> {/* Membungkus seluruh konten utama */}
        <h1 className={`text-4xl sm:text-5xl font-bold text-center my-12 sm:my-24 ${isDarkMode ? 'text-[#BDBDBD]' : 'text-gray-600'}`}>
          ATTENDANCE
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 text-center sm:text-left">
          <label htmlFor="date-picker" className={`text-lg sm:text-xl ${isDarkMode ? 'text-[#BDBDBD]' : 'text-gray-700'}`}>
            Select Date:
          </label>
          <div className="flex items-center gap-4">
            <DatePicker
              id="date-picker"
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              className={`p-2 text-base sm:text-lg border rounded-lg flex-shrink-0 ${isDarkMode ? 'border-gray-600 bg-gray-800 text-gray-300' : 'border-gray-300 bg-white text-black'}`}
              dateFormat="yyyy-MM-dd"
              placeholderText="Click to select a date"
            />
            <button
              onClick={filterByDate}
              className={`p-2 rounded-lg text-base sm:text-lg font-bold ${isDarkMode ? 'bg-[#5B0A0A] text-[#EAD196] hover:bg-red-800' : 'bg-[#7D0A0A] text-[#EAD196] hover:bg-red-700'}`}
            >
              Apply
            </button>
          </div>
        </div>
        <div className="p-5 flex flex-col items-center gap-5 mb-8">
          {filteredData.length > 0 ? (
            filteredData.map((item: AttendanceItem, index: number) => (
              <div 
                key={index} 
                className={`flex p-5 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-full xl:w-full max-w-2xl shadow-md 
                ${isDarkMode ? 'bg-[#D7B66A] text-[#3F3C38]' : 'bg-[#EAD196] text-black'} 
                px-12 mx-4 sm:mx-4`}>
                <div className="flex-1 mr-5 text-left">
                  <div className="text-2xl font-bold mb-1">{item.assisstant_code}</div>
                  <div className={`text-lg ${isDarkMode ? 'text-[#3F3C38]' : 'text-gray-800'}`}>{item.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{formatDate(item.time)}</div>
                  <div className="text-md font-bold">{formatTime(item.time)}</div>
                </div>
              </div>
            ))
          ) : (
            <div className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No data found</div>
          )}
        </div>
        <div className="flex justify-center items-center my-5">
          {currentPage > 1 && (
            <button
              onClick={handlePreviousPage}
              className={`p-2 rounded-full mx-2 text-lg sm:text-xl transition-colors ${isDarkMode ? 'bg-[#5B0A0A] text-[#EAD196] hover:bg-red-800' : 'bg-[#7D0A0A] text-[#EAD196] hover:bg-red-700'}`}
            >
              ◀
            </button>
          )}
          <button className={`p-3 rounded-full mx-2 text-lg sm:text-xl font-bold ${isDarkMode ? 'bg-[#5B0A0A] text-[#EAD196] hover:bg-red-800' : 'bg-[#7D0A0A] text-[#EAD196] hover:bg-red-700'}`} disabled>
            PAGE {currentPage}
          </button>
          {currentPage < totalPages && (
            <button
              onClick={handleNextPage}
              className={`p-2 rounded-full mx-2 text-lg sm:text-xl transition-colors ${isDarkMode ? 'bg-[#5B0A0A] text-[#EAD196] hover:bg-red-800' : 'bg-[#7D0A0A] text-[#EAD196] hover:bg-red-700'}`}
            >
              ▶
            </button>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );  
};

export default LiveReport;
