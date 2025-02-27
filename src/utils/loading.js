import React, { useState, useEffect } from 'react';

const Loading = () => {
  const text = [
    "Bura yüklənir",
    "Ora da yüklənir",
    "Bu tərəf də yüklənir",
    "Hər tərəf yükləniree",
    "Sigma sigma boooooooy",
    "Sən o canana görə, mən bu canana görə",
  ];

  const [randomText, setRandomText] = useState('');

  useEffect(() => {
    // Generate random text only after the component has mounted
    const random = text[Math.floor(Math.random() * text.length)];
    setRandomText(random);
  }, []); // Empty dependency array ensures it only runs once, after mount

  return (
    <div>
      {randomText || "Yüklənir..."} {/* Fallback text while loading */}
    </div>
  );
};

export default Loading;
