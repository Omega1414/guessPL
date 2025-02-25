"use client";
import { calculateUserScores } from "@/utils/calculatePoints";
import { useEffect, useState } from "react";

export default function VasifResults() {
  const [userScores, setUserScores] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading vəziyyəti üçün

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true); // Yükləmə başladıqda loading-in aktiv edilməsi
        const scores = await calculateUserScores("dZLnAReVibVVbpORo5sTnBvdid63"); // Vasifin user ID-sini daxil et
       
        if (scores.length === 0) {
          setError("Hələ təxmin etməyib.");
        } else {
          setUserScores(scores);
        }
      } catch (error) {
        setError("Xal hesablama zamanı xəta baş verdi.");
      } finally {
        setLoading(false); // Yükləmə bitdikdən sonra loading-in deaktiv edilməsi
      }
    };

    fetchScores();
  }, []);

  if (error) {
    return <div className="text-red-500 mt-4">{error}</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Yüklənir...</div>
        {/* Burada daha yaxşı bir "loading" animasiyası əlavə edə bilərsiniz */}
      </div>
    );
  }

  if (userScores.length === 0) {
    return <div className="text-red-500 mt-4">Heç bir nəticə tapılmadı.</div>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      <title>Başın qalıb burda?</title>
   
      <div className="gap-3 mt-6 grid grid-cols-1 xl:grid-cols-2 h-full items-center justify-center my-auto">
        {userScores.map(({ roundName, roundResults, roundPoints }, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg w-full xl:w-[600px]">
            <h3 className="text-lg font-semibold mt-2">Tur: {roundName.match(/\d+/)?.[0]}</h3>

            <div className="space-y-4 pt-4">
              {roundResults.map(({ teams, score, resultScore, points }, gameIndex) => (
                <div key={gameIndex} className="flex flex-row items-center space-x-1">
                  <span className="text-sm xl:text-lg">{teams[0]} {score?.charAt(0)} - {score?.charAt(1)} {teams[1]}</span>
                  <div className="pl-2 xl:pl-4 text-[12px] xl:text-sm text-green-600">
                    <span>Nəticə: {resultScore !== "NA" ? `${resultScore.charAt(0)} - ${resultScore.charAt(1)}` : "N/A"}</span>
                  </div>
                  {resultScore !== "NA" ?
                    <div className={`pl-1 xl:pl-2 text-sm ${points === 0 ? "text-red-500" : points === 10  ? "text-blue-500 font-bold" : "text-green-500"}`}>
                    {points} xal
                  </div>
                  : null
                  }
                 
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm xl:text-xl font-semibold">Toplam: {roundPoints} xal</div>
          </div>
        ))}
      </div>
    </div>
  );
}
