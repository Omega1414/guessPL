"use client";
import { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig"; // Your Firebase config file
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // We need setDoc to create user data in Firestore
import { db } from "../../firebaseConfig";
import Link from "next/link";
import Loading from "@/utils/loading";
import Image from "next/image";
import headerImg from "../../public/headIsi.png"
import "./header.css"
export default function Header() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign Up and Login forms
  const [user, setUser] = useState(null); // Track authenticated user
  const [loading, setLoading] = useState(true); // Loading state to avoid UI flicker
  const [userName, setUserName] = useState(""); // To store the user's name

  useEffect(() => {
    // Check if a user is already logged in from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser); // If a user exists in localStorage, set it to the state
    }

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the user if logged in
        localStorage.setItem("user", JSON.stringify(currentUser)); // Save to localStorage

        // Fetch the user name from Firestore
        const fetchUserName = async () => {
          const userDoc = doc(db, "users", currentUser.uid); // Access user document by UID
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            setUserName(docSnap.data().name); // Get name field from user document
          } else {
            console.log("No such user in Firestore!");
          }
        };

        fetchUserName();
      } else {
        setUser(null); // No user, remove from state
        setUserName(""); // Clear the name as well
        localStorage.removeItem("user"); // Clear user data from localStorage if logged out
      }
      setLoading(false); // Once authentication check is done, set loading to false
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify(user));
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: "", 
          createdAt: new Date(),
        });

        alert("User created successfully!");
      } else {
        // Login user with email and password
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
      }

      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null); 
      setUserName(""); 
      localStorage.removeItem("user"); 
      alert("Logged out successfully!");
    }).catch((err) => {
      setError("Error: " + err.message);
    });
  };

  if (loading) {
    return <Loading />; 
  }

  return (
    <div className="header flex justify-between items-center p-2 text-white headerCSS">
      <Link href={"/"}> 
        <Image src={headerImg} alt="header" width={150} className="ml-2"  />
      </Link>
      {/* Conditional Rendering: Show Login/Sign Up if not logged in */}
     

      
   {user ? (
        <div>
          <span className="text-blue-700 text-[16px] font-semibold lights xl:text-xl">Salam əlökü, {userName || "Guest"}</span> 
          
          {/* <button
            onClick={handleLogout}
            className="mx-2 bg-red-500 py-2 px-4 rounded"
          >
            Logout
          </button> */}
        </div>
      ) : (
        <div className="hidden">
          {/* <button
            onClick={() => setIsSignUp(true)}
            className="mx-2 bg-green-500 py-2 px-4 rounded"
          >
            Sign Up
          </button> */}
          {/* <button
            onClick={() => setIsSignUp(false)}
            className="mx-2 bg-blue-500 py-2 px-4 rounded"
          >
            Login
          </button> */}
        
        </div>
      )} 

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Form for Sign Up / Login */}
      {!user && (
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded text-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded mt-2 text-black"
            required
          />
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>
      )}
    </div>
  );
}
