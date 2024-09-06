import React, { useEffect, useState } from 'react';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import { useTheme } from '../styles/ThemeContext';
import 'react-datepicker/dist/react-datepicker.css';

interface AttendanceItem {
  id: number;
  assisstant_code: string;
  name: string;
  time: string;
}

interface ApiResponse {
  assistances: AttendanceItem[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const LiveReport: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceItem[]>([]); // state untuk data terfilter
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { isDarkMode } = useTheme(); // Get the theme (dark/light mode)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const authDataString = localStorage.getItem('authData');
      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);
          const token = authData.token.token;

          const response = await fetch(`https://boostify-back-end.vercel.app/api/attendances?page=${currentPage}`, {
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
          setFilteredData(data.assistances); // set data awal terfilter
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
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
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
      const filtered = attendanceData.filter(item => {
        const itemDate = new Date(item.time).setHours(0, 0, 0, 0); // Hanya bandingkan tanggal tanpa waktu
        const selected = selectedDate.setHours(0, 0, 0, 0);
        return itemDate === selected;
      });
      setFilteredData(filtered); // Set data terfilter
    } else {
      setFilteredData(attendanceData); // Jika tidak ada tanggal yang dipilih, tampilkan semua data
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-black'}`}>
      <HomeNav />
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
            dateFormat="dd/MM/yyyy"
            placeholderText="Click to select a date"
          />
          <button
            onClick={filterByDate}
            className={`p-2 rounded-lg text-base sm:text-lg font-bold ${isDarkMode ? 'bg-[#5B0A0A] text-[#EAD196]' : 'bg-[#7D0A0A] text-[#EAD196]'}`}
          >
            Apply
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 mb-8">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} className={`p-5 rounded-lg w-full max-w-3xl flex justify-between items-center shadow-md ${isDarkMode ? 'bg-[#D7B66A] text-[#3F3C38]' : 'bg-[#EAD196] text-black'}`}>
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
            className={`p-2 rounded-full mx-2 text-lg sm:text-xl transition-colors ${isDarkMode ? 'bg-[#5B0A0A] text-[#EAD196] hover:bg-red-600' : 'bg-red-800 text-[#EAD196] hover:bg-red-700'}`}
          >
            ◀
          </button>
        )}
        <button className={`p-3 rounded-full mx-2 text-lg sm:text-xl font-bold ${isDarkMode ? 'bg-[#5B0A0A] text-[#EAD196]' : 'bg-red-800 text-[#EAD196]'}`} disabled>
          PAGE {currentPage}
        </button>
        {currentPage < totalPages && (
          <button
            onClick={handleNextPage}
            className={`p-2 rounded-full mx-2 text-lg sm:text-xl transition-colors ${isDarkMode ? 'bg-[#5B0A0A] text-[#EAD196] hover:bg-red-600' : 'bg-red-800 text-[#EAD196] hover:bg-red-700'}`}
          >
            ▶
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LiveReport;
