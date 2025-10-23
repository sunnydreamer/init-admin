"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/fireabse";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  FieldValue,
} from "firebase/firestore";

export interface FirestoreUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  isAdmin: boolean;
  createdAt: FieldValue;
  lastLoginAt: FieldValue;
  isVerified?: boolean;
}

interface UserContextType {
  user: FirestoreUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshUserInfo: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirestoreUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFirestoreUser = async (
    uid: string
  ): Promise<FirestoreUser | null> => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data() as FirestoreUser;
      }
      return null;
    } catch (err) {
      console.error("Error fetching Firestore user:", err);
      return null;
    }
  };

  const refreshUserInfo = async () => {
    if (!auth.currentUser) return;
    const firestoreUser = await fetchFirestoreUser(auth.currentUser.uid);
    if (firestoreUser) {
      setUser(firestoreUser);
      sessionStorage.setItem("user", JSON.stringify(firestoreUser));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const firestoreUser = await fetchFirestoreUser(currentUser.uid);
        if (firestoreUser) {
          setUser(firestoreUser);
          sessionStorage.setItem("user", JSON.stringify(firestoreUser));
        }
      } else {
        setUser(null);
        sessionStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const loggedInUser = userCredential.user;

    const firestoreUser = await fetchFirestoreUser(loggedInUser.uid);
    if (firestoreUser) {
      setUser(firestoreUser);
      sessionStorage.setItem("user", JSON.stringify(firestoreUser));
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const newUser = userCredential.user;

    const firestoreUser: FirestoreUser = {
      id: newUser.uid,
      firstName,
      lastName,
      email: newUser.email,
      isAdmin: false,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      isVerified: false,
    };

    await setDoc(doc(db, "users", newUser.uid), firestoreUser);

    setUser(firestoreUser);
    sessionStorage.setItem("user", JSON.stringify(firestoreUser));
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{ user, loading, login, signup, logout, refreshUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
