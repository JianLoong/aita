import { TagCloud } from "react-tagcloud";

export const SimpleCloud = ({ wordFrequency }) => {

    const darkMode = document.querySelector('html').getAttribute('data-theme') == "dark" ? true : false;

    const options = {
      luminosity: darkMode ? "light" : "dark",
      hue: darkMode ? undefined : "blue",
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
