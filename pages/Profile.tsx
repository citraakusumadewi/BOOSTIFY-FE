import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import { useTheme } from '../styles/ThemeContext';

type AttendanceItem = {
  time: string;
  rawTime: string;
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
        setSelectedFileName(null);
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
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-[#0D0D0D] text-[#BDBDBD]' : 'bg-white text-[#515151]'}`}>
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
              className="absolute bottom-1 right-2 cursor-pointer sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-13 lg:h-13"
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
            attendanceData.map((item: AttendanceItem, index: number) => {
              // Mengambil jam saja dari rawTime, misalnya "14:30:45"
              const timeOnly = item.rawTime.split('T')[1]?.substring(0, 8);
              return (
                <div key={index} className={`flex justify-between py-2 border-b text-base sm:text-lg font-bold ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#3F3C38]'}`}>
                  <span className="flex-1">{item.time}</span>
                  <span className="flex-1 text-right">{timeOnly}</span>
                </div>
              );
            })
          ) : (
            <p className={`text-base sm:text-lg ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#515151]'}`}>
              No attendance records found.
            </p>
          )}
        </section>
      </main>
      <Footer />
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 sm:p-6 rounded-lg text-center w-72 sm:w-80 relative ${isDarkMode ? 'bg-[#3F3C38] text-[#BDBDBD]' : 'bg-white text-gray-800'}`}>
            <button
              className="absolute top-2 right-2 text-lg font-bold"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="mb-4 text-base sm:text-lg font-bold">
              Edit Profile Picture
            </h3>

            {/* Conditional rendering based on whether a file is selected */}
            <div className={`flex ${selectedFileName ? 'justify-start' : 'justify-center'} items-center mb-4`}>
              <label className={`inline-block py-2 px-4 rounded cursor-pointer ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/heic"
                  onChange={handleFileChange}
                  className="hidden"
                />
                Choose File
              </label>

              {/* Show the selected file name if a file is chosen */}
              {selectedFileName && (
                <p className={`ml-4 text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedFileName}
                </p>
              )}
            </div>

            <div className="flex justify-between gap-4 mt-6">
              <button
                className={`py-2 px-4 rounded font-bold ${isDarkMode ? 'bg-[#5B0A0A] text-[#D7B66A]' : 'bg-[#7D0A0A] text-[#EAD196]'}`}
                onClick={handleDeleteImage}
              >
                Delete Image
              </button>
              <button
                className={`py-2 px-4 rounded font-bold ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}
                onClick={() => setShowModal(false)}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
