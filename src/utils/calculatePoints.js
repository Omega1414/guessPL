import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";


// Oyunları düzgün sıralamaq üçün funksiya
const sortGames = (a, b) => {
  const gameNumberA = parseInt(a.replace('game', ''), 10);
  const gameNumberB = parseInt(b.replace('game', ''), 10);
  return gameNumberA - gameNumberB;
};

// Ümumi qol sayı və nəticəni yoxlayan funksiya
const goalCountMessage = (predictedScore, resultScore) => {
  if (!resultScore) return "0 xal";

  const getScore = (score) => [parseInt(score.charAt(0), 10), parseInt(score.charAt(1), 10)];
  const [predictedHome, predictedAway] = getScore(predictedScore);
  const [resultHome, resultAway] = getScore(resultScore);

  const predictedTotal = predictedHome + predictedAway;
  const resultTotal = resultHome + resultAway;

  const totalUnder = predictedTotal < 3 && resultTotal < 3;
  const totalOver = predictedTotal > 2 && resultTotal > 2;

  const homeWin = resultHome > resultAway && predictedHome > predictedAway;
  const awayWin = resultAway > resultHome && predictedAway > predictedHome;
  const draw = resultHome === resultAway && predictedHome === predictedAway;

  const isCorrectResult = homeWin || awayWin || draw;
  const isCorrectTotal = totalUnder || totalOver;

  if (isCorrectResult && isCorrectTotal) return "2 xal";
  if (isCorrectResult || isCorrectTotal) return "1 xal";

  return "0 xal";
};

// Xal hesablayan əsas funksiya
export const calculateUserScores = async (userId) => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const matchResultsSnapshot = await getDocs(collection(db, "matchResults"));

    const matchResults = {};
    matchResultsSnapshot.forEach(doc => {
      matchResults[doc.id] = doc.data().scores;
    });

    let userScoresData = [];

    for (const userDoc of usersSnapshot.docs) {
      if (userDoc.id !== userId) continue;

      const guessRef = collection(db, "users", userDoc.id, "guess");
      const guessSnapshot = await getDocs(guessRef);

      guessSnapshot.forEach((guessDoc) => {
        const roundName = guessDoc.id;
        const scores = guessDoc.data().scores;

        let roundPoints = 0;
        const roundResults = [];

        Object.keys(scores)
          .sort(sortGames)
          .forEach((game) => {
            const teams = scores[game].teams.split(" - ");
            const score = scores[game]?.score || "";
            const resultScore = matchResults[roundName]?.[game]?.score || "NA";

            let points = 0;

            if (score === resultScore) {
              points = 10; // Dəqiq hesab, birbaşa 10 xal ver
            } else {
              const goalCount = goalCountMessage(score, resultScore);
              if (goalCount === "2 xal") points = 2;
              else if (goalCount === "1 xal") points = 1;
            }

            roundPoints += points;

            roundResults.push({
              teams,
              score,
              resultScore,
              points,
            });
          });

        userScoresData.push({
          userId: userDoc.id,
          roundName,
          roundResults,
          roundPoints,
        });

        // Firestore-dakı user sənədini yenilə
        const userDocRef = doc(db, "users", userDoc.id);
        updateDoc(userDocRef, {
          [roundName]: roundPoints,
        });
      });
    }

    return userScoresData;
  } catch (error) {
    console.error("Xal hesablama xətası:", error);
    throw new Error("Xal hesablama zamanı xəta baş verdi.");
  }
};
