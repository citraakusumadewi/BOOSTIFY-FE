import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../styles/ThemeContext';
import SignOut from './SignOut/SignOut';
import { signOut } from 'next-auth/react';

const HomeNav: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [assistantCode, setAssistantCode] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isDarkMode, toggleMode } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      const authDataString = localStorage.getItem('authData');
      if (authDataString) {
        const authData = JSON.parse(authDataString);
        const token = authData.token.token;

        if (token) {
          try {
            const response = await fetch('https://boostify-back-end.vercel.app/api/whoami', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              if (response.status === 401) {
                localStorage.removeItem('authData');
                router.push('/SignIn');
              } else {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
              }
            }

            const data = await response.json();
            setUserName(data.name);
            setAssistantCode(data.assisstant_code);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        }
      }
    };

    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('authData');
      localStorage.removeItem('nextauth.message');
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setShowPopup(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
  
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('All password fields are required.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }
  
    try {
      const authDataString = localStorage.getItem('authData');
      const authData = authDataString ? JSON.parse(authDataString) : null;
      const token = authData ? authData.token.token : null;
  
      console.log('Submitting:', { currentPassword, newPassword, confirmPassword });
  
      const response = await fetch('https://boostify-back-end.vercel.app/api/auth/updatePassword', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to update password.');
      } else {
        alert('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
      }
    } catch (error) {
      setErrorMessage('Error updating password.');
      console.error('Error:', error);
    }
  };  

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowChangePassword(false);
      }
    };

    if (isDropdownOpen || showChangePassword) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, showChangePassword]);

  return (
    <div className={`w-full min-h-100 ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-black'}`}>
      <header className={`flex justify-between items-center px-4 py-4 h-20 ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-black'}`}>
        <Link href="/HomePage" passHref>
          <Image
            src="/Boostifylogo.png"
            alt="Boostify Logo"
            className="h-20 w-auto sm:h-24 md:h-28 lg:h-32" // Ukuran h ditingkatkan
            width={180}
            height={180}
          />
        </Link>
        <nav className="flex items-center gap-5">
          <button onClick={toggleMode} className="transition-transform duration-300">
            <Image
              src={isDarkMode ? "/light-mode-icon.png" : "/moon.png"}
              alt={isDarkMode ? "Light Mode Icon" : "Dark Mode Icon"}
              className="h-7 w-9 hover:rotate-20"
              width={24}
              height={24}
            />
          </button>
          <button className="flex flex-col gap-1.5 bg-transparent border-none cursor-pointer md:hidden" onClick={handleMenuToggle}>
            <span className="w-6 h-0.5 bg-gray-500"></span>
            <span className="w-6 h-0.5 bg-gray-500"></span>
            <span className="w-6 h-0.5 bg-gray-500"></span>
          </button>
          {/* Navbar Links */}
          <ul className={`flex-col items-center gap-8 md:flex ${isMenuOpen ? 'flex' : 'hidden'} ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-black'} absolute top-20 left-0 right-0 p-4 md:static md:flex-row md:shadow-none shadow-lg z-50`}>
            <li className="w-full text-center md:w-auto">
              <Link href="/About" passHref>
                <span className={`font-medium ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#7D0A0A]'}`}>
                  About
                </span>
              </Link>
            </li>
            <li className="w-full text-center md:w-auto">
              <Link href="/Team" passHref>
                <span className={`font-medium ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#7D0A0A]'}`}>
                  Our Team
                </span>
              </Link>
            </li>
            <li className="w-full text-center md:w-auto">
              <Link href="/LiveReport" passHref>
                <span className={`font-medium ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#7D0A0A]'}`}>
                  Live Report
                </span>
              </Link>
            </li>
            <li className="w-full text-center md:w-auto">
              <Link href="/Recap" passHref>
                <span className={`font-medium ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#7D0A0A]'}`}>
                  Recap
                </span>
              </Link>
            </li>
            <li className="w-full text-center md:w-auto">
              <button onClick={() => setShowPopup(true)} className={`font-bold ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#7D0A0A]'}`}>
                Sign Out
              </button>
            </li>
          </ul>
          <div className="relative" ref={dropdownRef}>
            <button onClick={handleDropdownToggle} className="bg-transparent border-none cursor-pointer">
              <div className={`flex items-center justify-center rounded-full w-12 h-12 ${isDarkMode ? 'bg-[#D7B66A]' : 'bg-[#EAD196]'}`}>
                {assistantCode && (
                  <span className={`font-bold text-sm ${isDarkMode ? 'text-[#5B0A0A]' : 'text-[#7D0A0A]'}`}>{assistantCode}</span>
                )}
              </div>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 p-4 bg-white border rounded shadow-lg z-10">
                <ul>
                  <li>
                    <Link href="/Profile" passHref>
                      <button className="block text-sm text-gray-700 py-2">Profile</button>
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => { setShowChangePassword(true); setIsDropdownOpen(false); }} className="block text-sm text-gray-700 py-2">
                      Change Password
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {showChangePassword && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div ref={formRef} className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
                <form onSubmit={handleChangePasswordSubmit}>
                  <h2 className="text-xl font-bold mb-4 text-center">Change Password</h2>
                  <div className="mb-2">
                    <label className="block text-sm">Current Password</label>
                    <input
                      type="password"
                      className="w-full p-2 border rounded"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm">New Password</label>
                    <input
                      type="password"
                      className="w-full p-2 border rounded"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full p-2 border rounded"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowChangePassword(false)} className="px-4 py-2 bg-gray-300 text-black rounded">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </nav>
      </header>

      {showPopup && <SignOut onClose={() => setShowPopup(false)} onSignOut={handleSignOut} />}
    </div>
  );
};

export default HomeNav;
