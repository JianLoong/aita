import Chart from "react-google-charts";

export const PieChart = (summary) => {
    const data = [
      ["Category", "Counts"],
      ["Not the asshole", summary?.counts?.nta_count],
      ["You are the asshole", summary?.counts?.yta_count],
      ["Everyone Sucks Here", summary?.counts?.esh_count],
      ["Not Enough Information", summary?.counts?.info_count],
      ["No assholes here", summary?.counts?.nah_count],
    ];

    const darkMode = document.querySelector('html').getAttribute('data-theme') == "dark" ? true : false;

    const options = {
      legend: { position: "bottom" },
      is3D: true,
      backgroundColor: darkMode ? "#f9f1f1" : '#f9f1f1',
      colors: [
        "green",
        "red",
        "rgb(255, 205, 86)",
        "rgb(201, 203, 207)",
        "rgb(54, 162, 235)",
      ],
      fontcolor: 'green',
      // pieSliceText: "label"
    };

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
