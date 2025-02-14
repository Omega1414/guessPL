"use client";
import { useEffect, useState } from "react";
import { getFirestore, collection, doc, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export default function Results() {
  const [userScores, setUserScores] = useState([]);
  const [error, setError] = useState("");

  const sortGames = (a, b) => {
    const gameNumberA = parseInt(a.replace('game', ''), 10);
    const gameNumberB = parseInt(b.replace('game', ''), 10);
    return gameNumberA - gameNumberB;
  };

  const goalCountMessage = (predictedScore, resultScore) => {
    const getScore = (score) => [parseInt(score.charAt(0), 10) || 0, parseInt(score.charAt(1), 10) || null];

    const [predictedHomeScore, predictedAwayScore] = getScore(predictedScore);
    const [resultHomeScore, resultAwayScore] = getScore(resultScore);

    const predictedTotal = predictedHomeScore + predictedAwayScore;
    const resultTotal = resultHomeScore + resultAwayScore;
    const totalUnder = predictedTotal < 3 && resultTotal < 3;
    const totalOver = predictedTotal > 2 && resultTotal > 2;
    const homeWin = resultHomeScore > resultAwayScore && predictedHomeScore > predictedAwayScore;
    const awayWin = resultAwayScore > resultHomeScore && predictedAwayScore > predictedHomeScore;
    const draw = resultHomeScore === resultAwayScore && predictedHomeScore === predictedAwayScore;
    const bothTeamsScored = resultHomeScore > 0 && resultAwayScore > 0 && predictedHomeScore > 0 && predictedAwayScore > 0;
    const bothTeamsNotScored = (resultHomeScore === 0 || resultAwayScore === 0) && (predictedHomeScore === 0 || predictedAwayScore === 0);

    const isCorrectResult = (homeWin || awayWin || draw);
    const isCorrectBTTS = (bothTeamsScored || bothTeamsNotScored);
    const isCorrectTotal = (totalUnder || totalOver);

    if (isCorrectResult && isCorrectBTTS && isCorrectTotal) {
        return "3 xal";
    }

    if (totalOver) {
        if (bothTeamsScored) return "2 xal";
        if (bothTeamsNotScored) return "2 xal";
        if (homeWin) return "2 xal";
        if (awayWin) return "2 xal";
        if (draw) return "2 xal";
        return "1 xal";
    }

    if (totalUnder) {
        if (bothTeamsScored) return "2 xal";
        if (bothTeamsNotScored) return "2 xal";
        if (homeWin) return "2 xal";
        if (awayWin) return "2 xal";
        if (draw) return "2 xal";
        return "1 xal";
    }

    if (bothTeamsScored) return "1 xal";
    if (bothTeamsNotScored) return "1 xal";

    if (homeWin) return "1 xal";
    if (awayWin) return "1 xal";
    if (draw) return "1 xal";

    return "0 xal";
  };

  const compareScores = (predictedScore, actualScore) => {
    return predictedScore === actualScore ? "Correct" : "Wrong";
  };

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const userScoresData = [];

        // Fetch all rounds dynamically from the matchResults collection
        const matchResultsSnapshot = await getDocs(collection(db, "matchResults"));
        const matchResults = {};

        // Create an object with round names as keys and their data as values
        matchResultsSnapshot.forEach(doc => {
          matchResults[doc.id] = doc.data().scores;
        });

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const userName = userData.name || "Anonymous";
          
          const guessRef = collection(db, "users", userDoc.id, "guess");
          const guessSnapshot = await getDocs(guessRef);

          guessSnapshot.forEach((guessDoc) => {
            const roundName = guessDoc.id; // dynamically get the round name from guess collection
            const scores = guessDoc.data().scores;

            let roundPoints = 0; // this will hold the points for the current round

            const roundResults = [];

            Object.keys(scores)
              .sort(sortGames)
              .forEach((game) => {
                const teams = scores[game].teams.split(" - ");
                const score = scores[game]?.score || "";
                const homeScore = score.charAt(0);
                const awayScore = score.charAt(1);
                const resultScore = matchResults[roundName]?.[game]?.score || ""; // dynamically fetch result for the round

                const comparison = compareScores(score, resultScore);
                const goalCount = goalCountMessage(score, resultScore);

                if (comparison === "Correct") {
                  roundPoints += 10;
                } else if (goalCount === "3 xal") {
                  roundPoints += 3;
                } else if (goalCount === "2 xal") {
                  roundPoints += 2;
                } else if (goalCount === "1 xal") {
                  roundPoints += 1;
                }

                roundResults.push({
                  teams,
                  homeScore,
                  awayScore,
                  comparison,
                  goalCount,
                  resultScore,
                });
              });

            userScoresData.push({
              userName,
              roundName,
              roundResults,
              roundPoints, // store the points for the round
              userId: userDoc.id,
            });

            // After processing the guesses, update the user's points for the round dynamically
            const userDocRef = doc(db, "users", userDoc.id);

            updateDoc(userDocRef, {
              [roundName]: roundPoints, // update the points for the current round
            });
          });
        }

        if (userScoresData.length === 0) {
          setError("No scores found.");
        }

        setUserScores(userScoresData);
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
      <div className=" mt-4 gap-3 grid grid-cols-2 ">
        {userScores.map(({ userName, roundName, roundResults, roundPoints }, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg w-[600px]">
            <h2 className="text-xl font-bold">{userName}</h2>
            <h3 className="text-lg font-semibold mt-2">Round: {roundName}</h3>

            <div className="space-y-4 mt-4">
              {roundResults.map(({ teams, homeScore, awayScore, comparison, goalCount, resultScore }, gameIndex) => {
                return (
                  <div key={gameIndex} className="flex flex-row items-center space-x-2">
                    <div className="flex flex-row items-center">
                      <label className="text-lg font-semibold mr-2">{teams[0]}</label>
                      <div>{homeScore || "N/A"}</div>
                    </div>

                    <span>-</span>

                    <div className="flex flex-row items-center">
                      <div>{awayScore || "N/A"}</div>
                      <label className="text-lg font-semibold ml-2">{teams[1]}</label>
                    </div>

                    <div className="ml-4 text-sm text-green-600">
                      <span>Nəticə: {resultScore ? `${resultScore.charAt(0)} - ${resultScore.charAt(1)}` : "Gözlə"}</span>
                    </div>

                    <div className={`${comparison === "Correct" ? "text-green-500" : "text-red-500"} ml-4 text-sm`}>
                      {comparison === "Correct" ? <h1>10 xal</h1> : null}
                    </div>

                    {comparison !== "Correct" ? (
                      <div className={`${goalCount === "0 points for goal count" ? "text-red-500" : "text-green-500 ml-4 text-sm"}`}>
                        {goalCount}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-xl font-semibold">Round Points: {roundPoints}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
