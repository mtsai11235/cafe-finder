import Head from 'next/head';
import { useEffect } from 'react';
import fs from 'fs';
import path from 'path';

// Get the content of the HTML, CSS, and JS files at build time
export async function getStaticProps() {
  // Read the HTML file from public directory
  const publicDir = path.join(process.cwd(), 'public');
  
  // Read the HTML file content
  const htmlContent = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
  
  // Extract the body content from the HTML
  const bodyMatch = htmlContent.match(/<body>([\s\S]*)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : '';
  
  return {
    props: {
      bodyContent
    }
  };
}

export default function Home({ bodyContent }) {
  useEffect(() => {
    // Load the scripts that were originally in the HTML file
    const secureApiScript = document.createElement('script');
    secureApiScript.src = '/secure-api.js';
    document.body.appendChild(secureApiScript);
    
    const mainScript = document.createElement('script');
    mainScript.src = '/script.js';
    document.body.appendChild(mainScript);
    
    // Add event listener for when scripts are loaded
    secureApiScript.onload = () => {
      console.log('Secure API script loaded');
    };
    
    mainScript.onload = () => {
      console.log('Main script loaded');
    };
    
    return () => {
      // Clean up scripts when component unmounts
      document.body.removeChild(secureApiScript);
      document.body.removeChild(mainScript);
    };
  }, []);
  
  return (
    <>
      <Head>
        <title>Cafe Finder</title>
        <meta name="description" content="Find cafes near you" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      
      {/* Render the body content from the HTML file */}
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </>
  );
}
