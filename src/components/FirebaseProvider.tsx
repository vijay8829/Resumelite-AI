import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Sync user to Firestore
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error("Error syncing user to Firestore:", error);
          // We don't block the UI here, but we log the error. 
          // If permission is denied, it usually means the user needs to verify their email.
        }
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.warn("Authentication window closed by user.");
      } else if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        const msg = `Unauthorized Domain: ${domain}. Please add this domain to the "Authorized domains" list in Firebase Console > Authentication > Settings.`;
        console.error(msg);
        setAuthError(msg);
      } else {
        console.error("Login failed:", error.message);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, login, logout }}>
      {authError && (
        <div className="fixed top-0 left-0 right-0 z-[1000] bg-red-600 text-white p-4 text-center font-bold text-sm shadow-xl flex items-center justify-center gap-4">
          <span>⚠️ {authError}</span>
          <button 
            onClick={() => setAuthError(null)}
            className="px-3 py-1 rounded bg-white/20 hover:bg-white/30 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
