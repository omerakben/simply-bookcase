// Mark as client-side component since we're using browser APIs and state
'use client';

// Import Firebase authentication utilities
import { auth, googleProvider } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/useAuth';
import { signInWithPopup, signOut } from 'firebase/auth';

// Next.js components for optimized image loading and client-side navigation
import Image from 'next/image';
import Link from 'next/link';

// React hooks for state management
import { useState } from 'react';

export default function Navbar() {
  // Custom hook to handle Firebase authentication state
  // user: contains user data if logged in, null if not
  // loading: indicates if auth state is being determined
  const { user, loading } = useAuth();

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');

  // Handler for Google Sign-in
  // Uses Firebase popup authentication with Google provider
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      console.error('Error signing in:', error instanceof Error ? error.message : error);
    }
  };

  // Handler for Sign-out functionality
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      console.error('Error signing out:', error instanceof Error ? error.message : error);
    }
  };

  return (
    // Main navigation container with white background and shadow
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section - Left side */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/bookcase-logo.png"
                alt="Bookcase Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="ml-2 text-xl font-bold text-gray-800">Bookcase</span>
            </Link>
          </div>

          {/* Search Bar Section - Center */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Search Icon Button */}
              <button className="absolute right-3 top-2.5">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Links and Auth Section - Right side */}
          <div className="flex items-center space-x-4">
            {/* Books navigation link */}
            <Link href="/books" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Books
            </Link>

            {/* Conditional rendering based on authentication state */}
            {loading ? (
              // Show loading skeleton while auth state is being determined
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
            ) : user ? (
              // Show user profile and sign out button when logged in
              <div className="flex items-center space-x-3">
                <Image
                  src={user.photoURL || '/default-avatar.png'} // Fallback to default avatar if no photo URL
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <button
                  onClick={handleSignOut}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              // Show sign in button when logged out
              <button
                onClick={handleSignIn}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
