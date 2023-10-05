import { TagCloud } from "react-tagcloud";

export const SimpleCloud = (wordFrequency) => {

    const darkMode = document.querySelector('html').getAttribute('data-theme') == "dark" ? true : false;

    const options = {
      luminosity: darkMode ? "light" : "dark",
      hue: darkMode ? "blue" : "blue",
    };

    const words = Object.keys(wordFrequency).map((key) => wordFrequency[key]);

    return (
      <TagCloud
        minSize={30}
        maxSize={60}
        tags={words}
        colorOptions={options}
      />
    );
  };
