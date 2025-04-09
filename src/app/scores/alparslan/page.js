"use client";
import { calculateUserScores } from "@/utils/calculatePoints";
import { useEffect, useState } from "react";

export default function VasifResults() {
  const [userScores, setUserScores] = useState([]);
  const [activeRoundIndex, setActiveRoundIndex] = useState(0); // Aktiv turu seçmək üçün əlavə edildi
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Loading vəziyyəti üçün

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true); // Yükləmə başladıqda loading-in aktiv edilməsi
        const scores = await calculateUserScores("GXGFuYcuyIfq8YvOORFOkBTMk6H3"); // Vasifin yeni user ID-sini daxil et
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

  const activeRound = userScores[activeRoundIndex];

  return (
    <div className="flex flex-col items-center p-6">
      {/* Tab buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {userScores.map(({ roundName }, index) => (
          <button
            key={index}
            onClick={() => setActiveRoundIndex(index)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold shadow 
              ${index === activeRoundIndex ? "bg-blue-600 text-white" : "bg-blue-200 text-gray-700"}
              hover:bg-blue-500 hover:text-white transition`}
          >
            Tur {roundName.match(/\d+/)?.[0]}
          </button>
        ))}
      </div>

      {/* Active Round Data */}
      <div className="flex h-full items-center justify-center my-auto font-robotoMono space-y-5">
        <div className="shadow-heavy rounded-lg p-6 w-full h-full xl:w-[600px]">
          <h3 className="text-lg font-semibold mt-2">
            Tur: {activeRound.roundName.match(/\d+/)?.[0]}
          </h3>

          <div className="space-y-3 pt-4">
            {activeRound.roundResults.map(({ teams, score, resultScore, points }, gameIndex) => (
              <div key={gameIndex} className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 border-b pb-2 pt-2">
                <div className="flex flex-col sm:flex-row justify-between w-full sm:items-center gap-2">
                  <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
                    <span className="truncate text-sm sm:text-base">{teams[0]}</span>
                    <span className="text-sm sm:text-base font-semibold">{score?.charAt(0)} - {score?.charAt(1)}</span>
                    <span className="truncate text-sm sm:text-base">{teams[1]}</span>
                  </div>

                  <div className="text-sm text-blue-200">
                    Nəticə: {resultScore !== "NA" ? `${resultScore.charAt(0)} - ${resultScore.charAt(1)}` : "N/A"}
                  </div>
                </div>

                {resultScore !== "NA" && (
                  <div
                    className={`text-sm xl:w-[100px] ml-0 xl:ml-5 sm:text-base font-medium ${
                      points === 0
                        ? "text-red-200"
                        : points === 10
                        ? "text-blue-400 font-bold"
                        : "text-green-500"
                    }`}
                  >
                    {points} xal
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-[18px] font-semibold">
            Toplam: {activeRound.roundPoints} xal
          </div>
        </div>
      </div>
    </div>
  );
}
