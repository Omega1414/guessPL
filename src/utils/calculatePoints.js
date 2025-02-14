// Function to determine the points based on the combined scores
export const calculatePoints = (predictedScore, resultScore) => {
    const predictedHomeScore = parseInt(predictedScore.charAt(0), 10) || 0;
    const predictedAwayScore = parseInt(predictedScore.charAt(1), 10) || 0;
    const resultHomeScore = parseInt(resultScore.charAt(0), 10) || 0;
    const resultAwayScore = parseInt(resultScore.charAt(1), 10) || 0;
  
    const predictedTotal = predictedHomeScore + predictedAwayScore;
    const resultTotal = resultHomeScore + resultAwayScore;
  
    // Check for over/under condition based on the total goals
    if (predictedTotal > 2 && resultTotal > 2) {
      return 1; // 1 point for 2.5 over
    } else if (predictedTotal < 1 && resultTotal < 1) {
      return 1; // 1 point for 2.5 under
    } else {
      return 0; // 0 points for goal count
    }
  };
  