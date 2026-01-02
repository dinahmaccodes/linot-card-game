"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from './types';

interface UserProfileContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    // Get player number from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const playerParam = urlParams.get('player');
    const playerNumber = playerParam === '2' ? 2 : 1;
    
    // Load the profile for the current player
    const profileKey = `whot_player_profile_${playerNumber}`;
    const savedProfile = localStorage.getItem(profileKey);
    
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfileState(profile);
      } catch (e) {
        console.error(`Failed to parse player ${playerNumber} profile`, e);
      }
    }
  }, []);

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    // Sync to localStorage
    localStorage.setItem(
      `whot_player_profile_${profile.playerNumber}`,
      JSON.stringify(profile)
    );
  };

  const clearUserProfile = () => {
    setUserProfileState(null);
    // Clear from localStorage
    localStorage.removeItem('whot_player_profile_1');
    localStorage.removeItem('whot_player_profile_2');
  };

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile, clearUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

// Custom hook for easy access
export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
