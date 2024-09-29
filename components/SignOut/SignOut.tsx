import React from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { useTheme } from '../../styles/ThemeContext';
interface SignOutPopupProps {
  onClose: () => void;
  onSignOut: () => void;
}

const SignOutPopup: React.FC<SignOutPopupProps> = ({ onClose, onSignOut }) => {
  const router = useRouter();

  const handleGoBack = () => {
    onClose(); // Close the popup
    router.back(); // Redirect to the previous page
  };
  const { isDarkMode } = useTheme();

  const handleSignOut = async () => {
    const authData = localStorage.getItem('authData');
    
    if (authData) {
      const parsedAuthData = JSON.parse(authData);
      const token = parsedAuthData.token?.token; // Access the token inside the nested structure

      if (token) {
        try {
          const response = await fetch('https://boostify-back-end.vercel.app/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ token }), // Sending the token to the API for invalidation
          });

          if (response.ok) {
            console.log('Sign-out successful, removing token from localStorage...');
            localStorage.removeItem('authData'); // Clear the authData from localStorage
            await signOut({ redirect: false }); // Prevent automatic redirect
            router.push('/'); // Redirect to homepage after sign-out
          } else {
            console.error('Sign-out failed, response status:', response.status);
          }
        } catch (error) {
          console.error('Error during sign-out:', error);
        }
      } else {
        console.error('No token found in localStorage');
      }
    } else {
      console.error('No authData found in localStorage');
    }

    onSignOut(); // Additional actions after sign-out, if needed
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={` ${isDarkMode ? 'bg-[#5B0A0A]' : 'bg-[#7D0A0A]'} p-10 rounded-lg text-center`}>
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-[#d7b66a]' :'text-[#EAD196]'} mb-6`}>Are You Sure?</h2>
        <div className="flex justify-center gap-5">
          <button
            onClick={onClose}
            className={` ${isDarkMode ? 'bg-[#EDD7A3]' : 'bg-[#F3EDC8]'}  ${isDarkMode ? 'text-[#5b0a0a]' : 'text-[#7D0A0A]'} px-6 py-2 rounded-full text-lg transition-opacity duration-300 hover:opacity-90`}
          >
            Go Back
          </button>
          <button
            onClick={handleSignOut}
            className={` ${isDarkMode ? 'bg-[#D7B66A]' : 'bg-[#EAD196]'} ${isDarkMode ? 'text-[#5b0a0a]' : 'text-[#7D0A0A]'} px-6 py-2 rounded-full text-lg transition-opacity duration-300 hover:opacity-90`}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutPopup;
