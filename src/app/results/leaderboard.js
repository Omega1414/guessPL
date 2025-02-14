import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Link from "next/link"; // Import Link from next/link

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");

  const sortLeaderboard = (a, b) => b.totalPoints - a.totalPoints; // Sort by total points descending

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const leaderboardData = [];

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const userName = userData.name || "Anonymous";

          let totalPoints = 0;

          // Loop through all rounds (round25 to round38)
          for (let round = 25; round <= 38; round++) {
            const roundName = `round${round}`;

            // Check if the user has points for this round in the 'users' collection
            if (userData[roundName]) {
              totalPoints += userData[roundName]; // Add points for the round
            }
          }

          leaderboardData.push({
            userName,
            totalPoints,
            userId: userDoc.id,
          });
        }

        if (leaderboardData.length === 0) {
          setError("No users found.");
        }

        // Sort leaderboard by total points
        leaderboardData.sort(sortLeaderboard);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard: ", error);
        setError("There was an error fetching the leaderboard.");
      }
    };

    fetchLeaderboard();
  }, []);

  if (error) {
    return <div className="text-red-500 mt-4">{error}</div>;
  }

  if (leaderboard.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6">
    <h1 className="text-2xl font-semibold">Siqmaların cədvəli</h1>
    <div className="space-y-6 mt-6 flex flex-row h-full">
      <div className="w-[300px] xl:w-[600px] border p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <div className="space-y-4 mt-4">
          {leaderboard.map(({ userName, totalPoints }, index) => {
            let textColor = 'text-gray-500'; // Default color for all usernames
            let pointsColor = 'text-gray-500'; // Default color for all points
  
            if (index === 0) {
              textColor = 'text-green-500';  // First username (green)
              pointsColor = 'text-green-500'; // First points (green)
            }
            if (index === 1) {
              textColor = 'text-yellow-500'; // Second username (yellow)
              pointsColor = 'text-yellow-500'; // Second points (yellow)
            }
            if (index === 2) {
              textColor = 'text-blue-500';   // Third username (blue)
              pointsColor = 'text-blue-500'; // Third points (blue)
            }
  
            return (
              <div key={index} className="flex flex-row items-center justify-between">
                <Link href={`/scores/${userName.toLowerCase()}`}>
                  <div className={`text-lg cursor-pointer ${textColor}`}>
                    {index + 1}. {userName}
                  </div>
                </Link>
                <div className={`text-xl font-semibold ${pointsColor}`}>{totalPoints} points</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
  
  
  );
}
