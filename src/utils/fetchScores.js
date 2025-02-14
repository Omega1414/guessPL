import { getDocs, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { calculatePoints } from "./calculatePoints"; // Import calculatePoints function

export const fetchScores = async (db) => {
  const userScoresData = [];
  
  try {
    const usersSnapshot = await getDocs(collection(db, "users")); // Get all users from the "users" collection

    // Fetch the actual match results from the matchResults/round25 document
    const matchResultsRef = doc(db, "matchResults", "round25");
    const matchResultsDoc = await getDoc(matchResultsRef);
    const matchResults = matchResultsDoc.data()?.scores || {};

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userName = userData.name || "Anonymous"; // Use "Anonymous" if the user does not have a name
      const guessRef = collection(db, "users", userDoc.id, "guess");
      const guessSnapshot = await getDocs(guessRef);

      let totalPoints = 0; // Initialize points for the user

      guessSnapshot.forEach((guessDoc) => {
        const roundName = guessDoc.id; // The name of the round (e.g., "round25")
        const scores = guessDoc.data().scores;

        // Add user scores and actual results for comparison
        Object.keys(scores).forEach((game) => {
          const predictedScore = scores[game]?.score || "";
          const resultScore = matchResults[game]?.score || ""; // Fetch the result's score for comparison

          // Calculate points for this game
          totalPoints += calculatePoints(predictedScore, resultScore);
        });
      });

      // Add user data with total points
      userScoresData.push({
        userName,
        totalPoints, // Store the total points
        userId: userDoc.id,
      });

      // Update points in Firestore for the user
      await updateDoc(doc(db, "users", userDoc.id), {
        points: totalPoints, // Update points field for the user
      });
    }

    return userScoresData;
  } catch (error) {
    throw new Error("Error fetching scores and calculating points: " + error.message);
  }
};
