import { TagCloud } from "react-tagcloud";
import { useState, useEffect } from "react";

export const SimpleCloud = ({ wordFrequency }) => {

    const [darkMode, setDarkMode] = useState(document.querySelector('html').getAttribute('data-theme') == "dark" ? true : false);

    useEffect(() => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            setDarkMode(document.querySelector('html').getAttribute('data-theme') == "dark" ? true : false);
          }
        });
      });

      observer.observe(document.documentElement, { attributes: true });

      return () => observer.disconnect();
    }, []);

    const options = darkMode ? {
      colors: ['#ADD8E6', '#87CEEB', '#6495ED', '#4682B4', '#1E90FF', '#00BFFF', '#87CEFA', '#B0E0E6'],
    } : {
      luminosity: "dark",
      hue: "blue",
    };

    if (!wordFrequency || wordFrequency.length === 0) {
      return null; // Don't render if no word frequency data
    }

    return (
      <TagCloud
        minSize={30}
        maxSize={60}
        tags={wordFrequency}
        colorOptions={options}
      />
    );
  };
