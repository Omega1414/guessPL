import { useState, useEffect } from "react";
import { auth } from "../../../firebaseConfig"; // Your Firebase config file
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // Modular SDK imports
import { db } from "../../../firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";

export default function NewRound() {
  const [scores, setScores] = useState({
    game1: { teams: "Villa - Liverpool", score1: "", score2: "" },
    game2: { teams: "Leicester - Brentford", score1: "", score2: "" },
    game3: { teams: "Everton - ManUtd", score1: "", score2: "" },
    game4: { teams: "Arsenal - WestHam", score1: "", score2: "" },
    game5: { teams: "Bournemouth - Wolves", score1: "", score2: "" },
    game6: { teams: "Fulham - Palace", score1: "", score2: "" },
    game7: { teams: "Ipswich - Tottenham", score1: "", score2: "" },
    game8: { teams: "Soton - Brighton", score1: "", score2: "" },
    game9: { teams: "Villa - Chelsea", score1: "", score2: "" },
    game10: { teams: "Newcastle - Nottingham", score1: "", score2: "" },
    game11: { teams: "ManCity - Liverpool", score1: "", score2: "" },
  });

  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [submittedScores, setSubmittedScores] = useState(null); // Store submitted scores
  const [canSubmit, setCanSubmit] = useState(true); // Track if user can submit

  // Check if user is logged in from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user if logged in
      } else {
        setUser(null); // Set user to null if not logged in
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkPreviousSubmission = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid); // Reference to user's document
        const guessRef = doc(userRef, "guess", "round26"); 
        const guessDoc = await getDoc(guessRef);
        
        if (guessDoc.exists()) {
          setSubmittedScores(guessDoc.data().scores); // Show previously submitted scores
          setCanSubmit(false); // Disable the submit button
        } else {
          setSubmittedScores(null); // No previous submission
          setCanSubmit(true); // Allow submission
        }
      }
    };

    checkPreviousSubmission(); // Check for previous submissions when the component mounts
  }, [user]);

  const handleScoreChange = (game, team, value) => {
    if (value === "" || /^[0-9]$/.test(value)) {
      setError(""); // Clear the error if valid input (single digit)
      setScores({
        ...scores,
        [game]: {
          ...scores[game],
          [team]: value, // Update the correct team's score
        },
      });
    } else {
      setError("Please enter a valid digit (0-9).");
    }
  };

  const handleKeyDown = (e) => {
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("Please log in to submit your scores.");
      return;
    }

    const combinedScores = {};
    for (const game in scores) {
      const { score1, score2 } = scores[game];
      if (!score1 || !score2) {
        setError("Please enter both scores for each game.");
        return;
      }
      combinedScores[game] = { 
        teams: scores[game].teams,
        score: `${score1}${score2}`,
      };
    }

    try {
      const userRef = doc(db, "users", user.uid); 
      const guessRef = doc(userRef, "guess", "round26"); 

      await setDoc(guessRef, { scores: combinedScores });

      alert("Scores submitted successfully!");

      // Update submitted scores and disable submission
      setSubmittedScores(combinedScores);
      setCanSubmit(false);

      // Optionally reset the form after successful submission
      setScores({
        game1: { teams: "Villa - Liverpool", score1: "", score2: "" },
        game2: { teams: "Leicester - Brentford", score1: "", score2: "" },
        game3: { teams: "Everton - ManUtd", score1: "", score2: "" },
        game4: { teams: "Arsenal - WestHam", score1: "", score2: "" },
        game5: { teams: "Bournemouth - Wolves", score1: "", score2: "" },
        game6: { teams: "Fulham - Palace", score1: "", score2: "" },
        game7: { teams: "Ipswich - Tottenham", score1: "", score2: "" },
        game8: { teams: "Soton - Brighton", score1: "", score2: "" },
        game9: { teams: "Villa - Chelsea", score1: "", score2: "" },
        game10: { teams: "Newcastle - Nottingham", score1: "", score2: "" },
        game11: { teams: "ManCity - Liverpool", score1: "", score2: "" },
      });
    } catch (error) {
      console.error("Error submitting scores: ", error);
      setError("There was an error submitting the scores.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 justify-center text-center">
  
      {submittedScores ? 
        <p>Babat osturağa basmısan, uğurlar. </p>
      :
      
        <p>Nostradamus yığını, tur başlamadan öz təxminlərinizi yazın:</p>
      }
     
      {error && <div className="text-red-500 mt-2">{error}</div>}
      
      {submittedScores && (
        <div className="mt-6">
        
          {Object.keys(submittedScores).map((game) => {
            const { teams, score } = submittedScores[game];
            const [team1, team2] = teams.split(" - ");
            const [score1, score2] = score.split("");
            return (
              <div key={game} className="mt-2 justify-center text-center">
              <p>{team1}&nbsp;&nbsp;{score1}&nbsp;:&nbsp;{score2}&nbsp;&nbsp;{team2}</p>

              </div>
            );
          })}
        </div>
      )}

      {submittedScores ? (
        <div className="mt-6">Yaxşı indi get oyunları sıx</div>
      ) : (
        <div className="space-y-4 mt-6">
          {Object.keys(scores).map((game) => {
            const teams = scores[game].teams.split(" - ");
            return (
              <div key={game} className="flex flex-row items-center space-x-4 justify-center">
                <div className="flex flex-col items-center">
                  <label className="text-[16px] xl:text-lg font-semibold">{teams[0]}</label>
                  <input
                    type="text"
                    value={scores[game].score1 || ""}
                    onChange={(e) => handleScoreChange(game, "score1", e.target.value)}
                    onKeyDown={handleKeyDown}
                        className="border p-2 rounded mt-2 text-black w-[100px] xl:w-[200px]"
                    placeholder="Cəld"
                    maxLength="1"
                    required
                    disabled={!canSubmit} // Disable if already submitted
                  />
                </div>

                <span className="pt-8">-</span>

                <div className="flex flex-col items-center">
                    <label className="text-[16px] xl:text-lg font-semibold">{teams[1]}</label>
                  <input
                    type="text"
                    value={scores[game].score2 || ""}
                    onChange={(e) => handleScoreChange(game, "score2", e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border p-2 rounded mt-2 text-black w-[100px] xl:w-[200px]"
                    placeholder="ol"
                    maxLength="1"
                    required
                    disabled={!canSubmit} // Disable if already submitted
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
{canSubmit ? 
  <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-500 text-white py-2 px-6 rounded"
        disabled={!canSubmit} // Disable button if submission is not allowed
      >
        Osturağa bas
      </button>
      : null}
   
    </div>
  );
}
