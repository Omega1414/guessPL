"use client";
import { useState, useEffect } from "react";
import { doc, setDoc, collection } from "firebase/firestore"; // Modular SDK imports
import { db } from "../../../firebaseConfig"; 

export default function SubmitResults() {
  const [scores, setScores] = useState({
    game1: { teams: "Brighton - Chelsea", score:"" },
    game2: { teams: "Leicester - Arsenal", score:"" },
    game3: { teams: "Villa - Ipswich", score:"" },
    game4: { teams: "Fulham - Nottingham", score:"" },
    game5: { teams: "ManCity - Newcastle", score:"" },
    game6: { teams: "Soton - Bournemouth", score:"" },
    game7: { teams: "WestHam - Brentford", score:"" },
    game8: { teams: "Palace - Everton", score:"" },
    game9: { teams: "Liverpool - Wolves", score:"" },
    game10: { teams: "Tottenham - ManUtd", score:"" },
  });

  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Check if the component is mounted
  useEffect(() => {
    setIsMounted(true); // Set the mounted flag to true once the component is mounted
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser && currentUser.email === "vass@mail.ru") {
      setUser(currentUser); // Set user if logged in and email matches
    } else {
      console.log("Error: User is not authorized.");
    }
  }, [isMounted]);

  const handleScoreChange = (game, score) => {
    if (score === "") {
      setError(""); // Clear the error if input is empty
    } else if (/[^0-9]/.test(score)) {  // Check if there's any non-numeric character
      setError("You can only enter numbers.");
    } else if (score.length > 2) {
      setError("The maximum score value is two digits.");
    } else {
      setError(""); // Clear error if valid input
      setScores({
        ...scores,
        [game]: {
          ...scores[game],
          score: score,
        },
      });
    }
  };

  const handleKeyDown = (e) => {
    // Allow only numeric input (0-9) and Backspace or Delete for correcting mistakes
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault(); // Prevent any non-numeric characters from being typed
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to submit results.");
      return;
    }

    try {
      const resultsRef = collection(db, "matchResults"); // Collection for all match results
      const round25Ref = doc(resultsRef, "round25"); 

      await setDoc(round25Ref, { scores: scores });

      alert("Scores submitted successfully!");

      // Optionally, reset the form after successful submission
      setScores({
        game1: { teams: "Brighton - Chelsea", score:"" },
        game2: { teams: "Leicester - Arsenal", score:"" },
        game3: { teams: "Villa - Ipswich", score:"" },
        game4: { teams: "Fulham - Nottingham", score:"" },
        game5: { teams: "ManCity - Newcastle", score:"" },
        game6: { teams: "Soton - Bournemouth", score:"" },
        game7: { teams: "WestHam - Brentford", score:"" },
        game8: { teams: "Palace - Everton", score:"" },
        game9: { teams: "Liverpool - Wolves", score:"" },
        game10: { teams: "Tottenham - ManUtd", score:"" },
      });
    } catch (error) {
      console.error("Error submitting scores: ", error);
      setError("There was an error submitting the scores.");
    }
  };

  if (!isMounted) {
    return null; // Prevent any rendering on the server or during SSR
  }

  if (!user || user.email !== "vass@mail.ru") {
    return (
      <div className="flex flex-col items-center p-6">
        <h1>Dərhal bu səhifəni tərk et</h1> {/* Message for unauthorized users */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h1>Football Match Score Prediction</h1>
      <p>Enter the predicted score for each game below:</p>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <div className="space-y-4 mt-6">
        {Object.keys(scores).map((game) => {
          const teams = scores[game].teams.split(" - ");
          return (
            <div key={game} className="flex flex-row items-center space-x-4">
              <div className="flex flex-col items-center">
                <label className="text-lg font-semibold">{teams[0]}</label>
                <input
                  type="text"
                  value={scores[game].score?.[0] || ""}
                  onChange={(e) => handleScoreChange(game, e.target.value + (scores[game].score[1] || ""))}
                  onKeyDown={handleKeyDown}
                  className="border p-2 rounded mt-2"
                  placeholder="Score"
                />
              </div>

              <span>-</span>

              <div className="flex flex-col items-center">
                <label className="text-lg font-semibold">{teams[1]}</label>
                <input
                  type="text"
                  value={scores[game].score?.[1] || ""}
                  onChange={(e) => handleScoreChange(game, (scores[game].score[0] || "") + e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border p-2 rounded mt-2"
                  placeholder="Score"
                />
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-500 text-white py-2 px-6 rounded"
      >
        Submit Scores
      </button>
    </div>
  );
}
