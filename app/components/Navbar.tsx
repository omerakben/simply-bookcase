'use client'; // Mark as client-side component since we're using browser APIs and state

// Import Firebase authentication utilities
import { auth, googleProvider } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/firebase/useAuth';
import { signInWithPopup, signOut } from 'firebase/auth';
import Image from 'next/image'; // Next.js components for optimized image loading and client-side navigation
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="bg-white-100 border-b-[3px] border-black">
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
                className="rounded-full border-[3px] border-black"
              />
              <span className="ml-2 text-24-black">Bookcase</span>
            </Link>
          </div>

          {/* Search Bar Section - Center (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full border-[3px] border-black focus:outline-none focus:border-primary text-16-medium placeholder:text-black-300"
              />
              <button className="absolute right-3 top-2.5">
                <svg className="h-5 w-5 text-black-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Hamburger Menu Button (visible on mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-primary"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation Links and Auth Section - Right side (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link href="/books" className="text-16-medium hover:text-primary transition-colors">
                  Books
                </Link>
                <Link href="/authors" className="text-16-medium hover:text-primary transition-colors">
                  Authors
                </Link>
              </>
            )}

            {loading ? (
              <div className="animate-pulse h-8 w-24 bg-gray-200 rounded-full"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Image
                  src={user.photoURL || '/default-avatar.png'}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full border-[3px] border-black"
                />
                <button
                  onClick={handleSignOut}
                  className="text-16-medium hover:text-primary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="login rounded-full hover:bg-secondary/10"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu (visible when hamburger is clicked) */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t-2 border-gray-200">
              {/* Search Bar for Mobile */}
              <div className="px-2 py-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-full border-[3px] border-black focus:outline-none focus:border-primary text-16-medium placeholder:text-black-300"
                  />
                  <button className="absolute right-3 top-2.5">
                    <svg className="h-5 w-5 text-black-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {user && (
                <>
                  <Link
                    href="/books"
                    className="block px-3 py-2 text-16-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Books
                  </Link>
                  <Link
                    href="/authors"
                    className="block px-3 py-2 text-16-medium hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Authors
                  </Link>
                </>
              )}

              {!loading && (
                <div className="px-3 py-2">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={user.photoURL || '/default-avatar.png'}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full border-[3px] border-black"
                        />
                        <span className="text-16-medium">{user.displayName}</span>
                      </div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="text-16-medium hover:text-primary transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleSignIn();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-center login rounded-full hover:bg-secondary/10"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
