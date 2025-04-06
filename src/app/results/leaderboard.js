import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Link from "next/link"; // Import Link from next/link
import Loading from "@/utils/loading";
import { useLoading } from "../loadingContext";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState("");
 const { loading, setLoading } = useLoading(); // Access loading state and setLoading function
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

      
          for (let round = 25; round <= 38; round++) {
            const roundName = `round${round}`;

        
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
        setLoading(false)
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


  if (loading) {
    return (
     <Loading />
    );
  }
  return (
    <div className="flex flex-col items-center p-6 font-robotoMono">
   
    <div className="space-y-6 mt-6 flex flex-row ">
      <div className="w-[300px] p-4 shadow-heavy">
      <h1 className="text-lg text-gray-200 font-semibold  text-center">Turnir cədvəli</h1>
        <div className="space-y-4 mt-6">
          {leaderboard.map(({ userName, totalPoints }, index) => {
           
  
            return (
              <div key={index} className="flex flex-row items-center justify-between ">
              <Link href={`scores/${userName.toLowerCase()}`}>
                  <div className="text-lg cursor-pointer   text-gray-200">
                    {index + 1}. {userName}
                  </div>
                </Link>
                <div className="text-lg font-semibold  text-gray-200">{totalPoints} xal</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
  
  
  );
}
