"use client";
import { useState, useEffect } from "react";
import { auth } from "../../../firebaseConfig"; // Your Firebase config file
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Modular SDK imports
import { db } from "../../../firebaseConfig"; 
import NewRound from "./newRound";
import Leaderboard from "../results/leaderboard";

export default function Home() {

  return (
    <div className="flex flex-col lg:flex-row justify-between ">

    <NewRound />
    <Leaderboard />
    </div>
  );
}
