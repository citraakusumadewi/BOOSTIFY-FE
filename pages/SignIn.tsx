import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession, getSession } from 'next-auth/react';
import Image from 'next/image';
import { DefaultSession } from 'next-auth';
import { useTheme } from '../styles/ThemeContext';
import { MdClose } from 'react-icons/md';

// Extend the DefaultSession type to include the id and token
interface CustomUser {
  id?: number;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  token?: string;
}

interface CustomSession extends DefaultSession {
  user: CustomUser;
}

const SignIn: React.FC = () => {
  const [assistantCode, setAssistantCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { data: session } = useSession() as { data: CustomSession }; 
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      username: assistantCode,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError('Wrong password!');
    } else {
      const session = await getSession() as CustomSession;
      if (session?.user?.token) {
        const userData = {
          id: session.user.id,
          name: session.user.name,
          assistant_code: session.user.email,
          token: session.user.token,
        };
        localStorage.setItem('authData', JSON.stringify(userData));
      }
      router.push('/HomePage');
    }
  };

  const handleAssistantCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setAssistantCode(value);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email for password reset:", email);
    setEmail('');
    setShowForgotPassword(false);
    alert('If an account with that email exists, a reset link will be sent.');
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-black'}`}>
      {/* Mobile Section */}
      <div className="sm:hidden flex flex-col items-center justify-center w-full p-8">
        <div className="mb-1 -mt-12 text-center">
          <Image 
            src="/Boostifylogo.png" 
            alt="Boostify Logo" 
            width={400} 
            height={400} 
            className="mx-auto"
          />
        </div>

        <div className={`w-full max-w-md p-8 rounded-lg ${isDarkMode ? 'bg-[#5B0A0A]' : 'bg-[#7D0A0A]'}`}>
          <h2 className={`text-3xl mb-8 font-bold text-center ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'}`}>
            Sign In to Your Account
          </h2>
          <form className="flex flex-col gap-5" onSubmit={handleSignIn}>
            <div className="flex flex-col w-full">
              <label htmlFor="assistantCode" className="sr-only">Assistant Code</label>
              <input
                type="text"
                id="assistantCode"
                className={`p-4 rounded text-lg w-full ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}
                placeholder="Assistant Code"
                value={assistantCode}
                onChange={handleAssistantCodeChange}
                required
              />
            </div>

            <div className="relative flex items-center w-full">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`p-4 rounded text-lg w-full ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 ${isDarkMode ? 'text-[#5B0A0A]' : 'text-[#7D0A0A]'}`}
              >
                <Image
                  src={showPassword ? '/eye-slash.png' : '/eye.png'}
                  alt="Toggle Password Visibility"
                  width={35}
                  height={30}
                />
              </button>
            </div>

            {error && <div className="text-red-500 mt-2">{error}</div>}
            
            <button
              onClick={() => setShowForgotPassword(true)}
              className={`mt-2 underline text-left ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'}`}
            >
              Forgot Password?
            </button>

            <button
              type="submit"
              className={`py-2 px-4 rounded font-bold transition-colors mt-4 ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Section */}
      <div className="hidden sm:flex flex-row w-full min-h-screen">
        <div className="w-1/2 flex items-center justify-center">
          <Image 
            src={isDarkMode ? '/logoTagline-dark.png' : '/logoTagline.png'} 
            alt="Boostify Logo" 
            width={800} 
            height={800} 
            className="mx-auto"
            priority
          />
        </div>

        <div className={`w-1/2 flex items-center justify-center ${isDarkMode ? 'bg-[#D7B66A]' : 'bg-[#EAD196]'}`}>
          <div className={`w-full max-w-md p-8 rounded-lg ${isDarkMode ? 'bg-[#5B0A0A]' : 'bg-[#7D0A0A]'}`}>
            <h2 className={`text-3xl mb-8 font-bold text-center ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'}`}>
              Sign In to Your Account
            </h2>
            <form className="flex flex-col gap-5" onSubmit={handleSignIn}>
              <div className="flex flex-col w-full">
                <label htmlFor="assistantCode" className="sr-only">Assistant Code</label>
                <input
                  type="text"
                  id="assistantCode"
                  className={`p-4 rounded text-lg w-full ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}
                  placeholder="Assistant Code"
                  value={assistantCode}
                  onChange={handleAssistantCodeChange}
                  required
                />
              </div>

              <div className="relative flex items-center w-full">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={`p-4 rounded text-lg w-full ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 ${isDarkMode ? 'text-[#5B0A0A]' : 'text-[#7D0A0A]'}`}
                >
                  <Image
                    src={showPassword ? '/eye-slash.png' : '/eye.png'}
                    alt="Toggle Password Visibility"
                    width={35}
                    height={30}
                  />
                </button>
              </div>

              {error && <div className="text-red-500 mt-2">{error}</div>}

              <button
                onClick={() => setShowForgotPassword(true)}
                className={`mt-2 underline text-left ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'}`}
              >
                Forgot Password?
              </button>

              <button
                type="submit"
                className={`py-2 px-4 rounded font-bold transition-colors mt-4 ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`w-full max-w-md p-8 rounded-lg ${isDarkMode ? 'bg-[#5B0A0A]' : 'bg-[#7D0A0A]'}`}>
            <div className="flex justify-end">
              <button onClick={() => setShowForgotPassword(false)} className={`text-3xl ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'}`}>
                <MdClose />
              </button>
            </div>
            <h2 className={`text-3xl mb-8 font-bold text-left ${isDarkMode ? 'text-[#D7B66A]' : 'text-[#EAD196]'}`}>
              Forgot Password
            </h2>
            <form className="flex flex-col gap-5" onSubmit={handleForgotPassword}>
              <div className="flex flex-col w-full">
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  className={`p-4 rounded text-lg w-full ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={`py-2 px-4 rounded font-bold transition-colors mt-4 ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#EAD196] text-[#7D0A0A]'}`}
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
