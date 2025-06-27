import Chart from "react-google-charts";
import { useState, useEffect } from "react";

export const PieChart = (summary) => {
    const data = [
      ["Category", "Counts"],
      ["Not the asshole", summary?.counts?.nta_count],
      ["You are the asshole", summary?.counts?.yta_count],
      ["Everyone Sucks Here", summary?.counts?.esh_count],
      ["Not Enough Information", summary?.counts?.info_count],
      ["No assholes here", summary?.counts?.nah_count],
    ];

    const [options, setOptions] = useState(() => {
      const initialTheme = document.documentElement.getAttribute('data-theme');
      return {
        legend: {
          position: "bottom",
          textStyle: {
            color: initialTheme === 'dark' ? 'white' : 'black',
          },
        },
        is3D: false,
        colors: [
          "green",
          "red",
          "rgb(255, 205, 86)",
          "rgb(201, 203, 207)",
          "rgb(54, 162, 235)",
        ],
        fontcolor: initialTheme === 'dark' ? 'white' : 'black',
        backgroundColor: initialTheme === 'dark' ? '#2a303c' : 'white',
        // pieSliceText: "label"
      };
    });

    useEffect(() => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            const newTheme = document.documentElement.getAttribute('data-theme');
            setOptions(prevOptions => ({
              ...prevOptions,
              fontcolor: newTheme === 'dark' ? 'white' : 'black',
              backgroundColor: newTheme === 'dark' ? '#2a303c' : 'white',
              legend: {
                ...prevOptions.legend,
                textStyle: {
                  color: newTheme === 'dark' ? 'white' : 'black',
                },
              },
            }));
          }
        });
      });

      observer.observe(document.documentElement, { attributes: true });

      return () => observer.disconnect();
    }, []);

    return (
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"500px"}
      />
    );
  };
