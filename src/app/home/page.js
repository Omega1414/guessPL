"use client";

import NewRound from "./newRound";
import Leaderboard from "../results/leaderboard";



export default function Home() {

  return (
    <div className="flex flex-col lg:flex-row justify-between ">
 
   <NewRound  />
   <Leaderboard  />
 
   
    </div>
  );
}
