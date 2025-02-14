import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html> 
       <Head>
       <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&family=Space+Grotesk:wght@300..700&family=Josefin+Sans&family=Blinker:wght@700&family=Montserrat:wght@700&family=Orbitron:wght@400..900&family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          />
            <meta name="description" content="The portfolio of Vasif Babazade" />
        
        {/* Open Graph Tags for Social Media Previews */}
        <meta property="og:title" content="Web Developer" />
        <meta property="og:description" content="The portfolio of Vasif Babazade" />
        <meta property="og:image" content="https://i.ibb.co/hD2Nw3J/Untitled.png" />
        <meta property="og:url" content="https://babazadevasif.vercel.app/" />
        <meta property="og:type" content="website" />
        
      
      </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
