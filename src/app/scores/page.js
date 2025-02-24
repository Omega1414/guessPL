"use client";
// pages/scores.js
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function Scores() {
  const [userScores, setUserScores] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all users and their scores from Firestore when the component mounts
    const fetchScores = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users")); // Get all users from the "users" collection
        const userScoresData = [];

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const userName = userData.name || "Anonymous"; // Use "Anonymous" if the user does not have a name
          
          // Get the guess collection for the user
          const guessRef = collection(db, "users", userDoc.id, "guess");
          const guessSnapshot = await getDocs(guessRef);

          guessSnapshot.forEach((guessDoc) => {
            const roundName = guessDoc.id; 
            const scores = guessDoc.data().scores;

            // Add user scores to the array
            userScoresData.push({
              userName,
              roundName,
              scores,
            });
          });
        }

        if (userScoresData.length === 0) {
          setError("No scores found.");
        } else {
          setUserScores(userScoresData);
        }
      } catch (error) {
        console.error("Error fetching scores: ", error);
        setError("There was an error fetching the scores.");
      }
    };

    fetchScores();
  }, []);

  if (error) {
    return <div className="text-red-500 mt-4">{error}</div>;
  }

  if (userScores.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-semibold">Submitted Football Match Scores</h1>
      <div className="space-y-6 mt-6 flex flex-row h-full">
        {userScores.map(({ userName, roundName, scores }, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold">{userName}</h2>
            <h3 className="text-lg font-semibold mt-2">Round: {roundName}</h3>

            <div className="space-y-4 mt-4">
              {Object.keys(scores).map((game, gameIndex) => {
                const teams = scores[game].teams.split(" - ");
                const score = scores[game]?.score || "";
                const homeScore = score.charAt(0); // First digit represents home team's score
                const awayScore = score.charAt(1); // Second digit represents away team's score

                return (
                  <div key={gameIndex} className="flex flex-row items-center space-x-4">
                    <div className="flex flex-col items-center">
                      <label className="text-lg font-semibold">{teams[0]}</label>
                      <div>{homeScore || "N/A"}</div> {/* Display home team's score */}
                    </div>

                    <span>-</span>

                    <div className="flex flex-col items-center">
                      <label className="text-lg font-semibold">{teams[1]}</label>
                      <div>{awayScore || "N/A"}</div> {/* Display away team's score */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
