'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { LogOut, User as UserIcon, Brain } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">
                  Quiz.AI
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                
                 
                  
                  <Link
  href="/profile"
  className="
    inline-flex items-center
    px-4 py-2
    rounded-md
    text-gray-700
    border border-gray-300
    transition-colors duration-200
    hover:bg-orange-500
    hover:text-white
    hover:border-orange-500
  "
>
  Profile
</Link>
                  <button
  onClick={handleSignOut}
  className="
    flex items-center space-x-1
    px-3 py-1.5
    rounded-md
    text-red-600
    transition-colors duration-200
    hover:bg-red-50
    hover:text-red-700
    active:bg-red-100
  "
>
  <LogOut className="h-4 w-4" />
  <span>Sign Out</span>
</button>

                </>
              ) : (
                <Link
                  href="/auth"
                  className="btn-primary"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main>{children}</main>
    </div>
  );
}
