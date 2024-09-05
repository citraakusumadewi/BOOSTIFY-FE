import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import { useTheme } from '../styles/ThemeContext';

type AttendanceItem = {
  time: string;
  rawTime: string;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<{ id: number; name: string; assisstant_code: string; image_url: string } | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  const { isDarkMode } = useTheme();
  const [profileImage, setProfileImage] = useState<string>('/user.png');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const fetchUserData = async () => {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        const token = authData.token.token;

        const response = await fetch('https://boostify-back-end.vercel.app/api/whoami', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProfileData(data);
        setProfileImage(data.image_url || '/user.png');
      } catch (error: any) {
        console.error('Failed to fetch user data:', error.message);
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, JPEG, PNG, and HEIC formats are allowed.');
        return;
      }

      const authDataString = localStorage.getItem('authData');
      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);
          const token = authData.token.token;

          const formData = new FormData();
          formData.append('image', file);

          const response = await fetch('https://boostify-back-end.vercel.app/api/uploadImage', {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload image: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          const updatedImageUrl = data.updatedUser.imageUrl;

          setProfileData((prevState) => {
            if (!prevState) return null;
            return {
              ...prevState,
              image_url: updatedImageUrl,
            };
          });
          setProfileImage(updatedImageUrl);
        } catch (error: any) {
          console.error('Failed to upload image:', error.message);
        }
      }
    }
  };

  const handleDeleteImage = async () => {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        const token = authData.token.token;

        const response = await fetch('https://boostify-back-end.vercel.app/api/deleteImage', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        setProfileImage('/user.png');
        setProfileData((prevState) => {
          if (!prevState) return null;
          return {
            ...prevState,
            image_url: '/user.png',
          };
        });
        setShowModal(false);
      } catch (error: any) {
        console.error('Failed to delete image:', error.message);
      }
    }
  };

  const fetchAttendanceData = async () => {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        const token = authData.token.token;

        const response = await fetch('https://boostify-back-end.vercel.app/api/personalrec', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setAttendanceData([]);
          } else {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
          }
        } else {
          const data = await response.json();
          setAttendanceData(data.payload.attendancesTime || []);
        }
      } catch (error: any) {
        console.error('Failed to fetch attendance data:', error.message);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAttendanceData();
  }, []);

  return (
    <div className={`max-w-7xl mx-auto ${isDarkMode ? 'bg-[#0D0D0D] text-[#BDBDBD]' : 'bg-white text-[#515151]'}`}>
      <HomeNav />
      <main className="px-4 py-10">
        <div className={`flex flex-col items-center mb-10 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <div className="relative flex flex-col items-center">
            <div className="bg-yellow-100 w-36 h-36 sm:w-48 sm:h-48 rounded-full flex items-center justify-center overflow-hidden mt-8 sm:mt-12">
              <Image 
                src={profileImage} 
                alt="User Avatar" 
                width={100} 
                height={100} 
                className="object-cover w-full h-full" 
              />
            </div>
            <Image
              src={isDarkMode ? "/pencil-dark.png" : "/pencil-light.png"}
              alt="Edit Profile"
              width={40} // Default width for smaller screens
              height={40} // Default height for smaller screens
              style={{ objectFit: 'cover' }}
              className="absolute bottom-1 right-0 cursor-pointer sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16"
              onClick={() => setShowModal(true)}
            />
          </div>
          <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#515151]'} my-4 sm:my-5`}>
            {profileData?.assisstant_code || 'N/A'}
          </h2>
          <h1 className={`text-lg sm:text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#515151]'}`}>
            {profileData?.name || 'Loading...'}
          </h1>
        </div>
        <section className="mt-8 sm:mt-12">
          <h2 className={`font-bold text-xl sm:text-2xl mb-6 sm:mb-8 ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#7D0A0A]'}`}>
            Attendance History
          </h2>
          {attendanceData.length > 0 ? (
            attendanceData.map((item: AttendanceItem, index: number) => (
              <div key={index} className={`flex justify-between py-2 border-b text-base sm:text-lg font-bold ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#3F3C38]'}`}>
                <span className="flex-1">{item.time}</span>
                <span className="flex-1 text-right">{formatTime(item.rawTime)}</span>
              </div>
            ))
          ) : (
            <p className={`text-base sm:text-lg ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#515151]'}`}>
              No attendance records found.
            </p>
          )}
        </section>
      </main>
      <Footer />
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`bg-white p-6 rounded-lg ${isDarkMode ? 'bg-[#1C1C1C]' : 'bg-white'}`}>
            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete your profile image?</h2>
            <div className="flex justify-between">
              <button onClick={handleDeleteImage} className="bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
              <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
