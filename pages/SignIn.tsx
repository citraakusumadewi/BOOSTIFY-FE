import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession, getSession } from 'next-auth/react';
import Image from 'next/image'; // Import Next.js Image component
import Link from 'next/link'; // Import Next.js Link component
import { DefaultSession } from 'next-auth';
import { useTheme } from '../styles/ThemeContext';

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
  const { data: session } = useSession() as { data: CustomSession }; // Casting to CustomSession

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
      setError('Invalid credentials');
    } else {
      // Get the latest session after sign-in
      const session = await getSession() as CustomSession; // Ensure type casting here
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

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section - Logo and Tagline */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <div className="text-center">
          <Image 
            src="/logo.png" 
            alt="Boostify Logo" 
            width={800} 
            height={800} 
            className="mx-auto"
          />
          <Image 
            src="/tagline.png" 
            alt="Tagline Logo" 
            width={1000} 
            height={1000} 
            className="absolute top-52 left-[calc(50%+-500px)] w-[500px] h-auto mb-100 hidden lg:block" 
          />
        </div>
      </div>

      {/* Right Section - Sign In Form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8 bg-[#D7B66A] md:bg-[#EDD291] bg-white">
        
        {/* Show logo above form for small screens */}
        <div className="md:hidden mb-8 mt--16 text-center"> {/* Tambahkan mt-8 untuk geser ke bawah */}
          <Image 
            src="/logo.png" 
            alt="Boostify Logo" 
            width={200} 
            height={200} 
            className="mx-auto"
          />
        </div>
        
        {/* Form Sign In */}
        <div className="w-full max-w-md bg-[#7D0A0A] p-8 rounded-lg -mt-12"> {/* Tambahkan mt-4 untuk geser form */}
          <h2 className="text-3xl mb-8 font-bold text-[#EAD196] text-center">
            Sign In to Your Account
          </h2>
          <form className="flex flex-col gap-5" onSubmit={handleSignIn}>
            <div className="flex flex-col w-full">
              <label htmlFor="assistantCode" className="sr-only">Assistant Code</label>
              <input
                type="text"
                id="assistantCode"
                className="p-4 rounded bg-[#EAD196] text-lg w-full"
                style={{ color: '#7D0A0A' }}
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
                className="p-4 rounded bg-[#EAD196] text-lg w-full"
                style={{ color: '#7D0A0A' }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#7D0A0A]"
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
              type="submit"
              className="py-2 px-4 rounded font-bold bg-[#EAD196] text-[#7D0A0A] hover:bg-yellow-300 transition-colors mt-6"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
