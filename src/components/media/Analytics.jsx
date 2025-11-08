// src/components/media/Analytics.jsx
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  ArcElement, // needed for Pie
} from "chart.js";
import supabase from "../../utils/supabase";
import "./Analytics.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  ArcElement
);

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Pull only what we need
        const { data, error } = await supabase
          .from("movies")
          .select("genres, rating");

        if (error) {
          console.error("Supabase error:", error);
          setBarChartData(emptyBar());
          setPieChartData(emptyPie());
          return;
        }

        console.log("movies rows:", data?.length ?? 0);

        // ---- Genres -> Bar
        const genreCounts = (data ?? []).reduce((acc, row) => {
          const genres = (row.genres || "")
            .split(",")
            .map((g) => g.trim().toLowerCase())
            .filter(Boolean);
          for (const g of genres) acc[g] = (acc[g] || 0) + 1;
          return acc;
        }, {});

        const genreEntries = Object.entries(genreCounts);
        // If you prefer count-desc order, use this sort:
        genreEntries.sort((a, b) => b[1] - a[1]);

        const genreLabels = genreEntries.map(
          ([g]) => g.charAt(0).toUpperCase() + g.slice(1)
        );
        const genreValues = genreEntries.map(([, count]) => count);

        setBarChartData({
          labels: genreLabels,
          datasets: [
            {
              label: "Movies per Genre",
              data: genreValues,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        });

        // ---- Ratings -> Pie
        const ratingCounts = (data ?? []).reduce((acc, m) => {
          const r = (m.rating || "Unrated").trim();
          acc[r] = (acc[r] || 0) + 1;
          return acc;
        }, {});
        const ratingLabels = Object.keys(ratingCounts);
        const ratingValues = ratingLabels.map((r) => ratingCounts[r]);

        const ratingColors = {
          G: "rgb(75, 192, 192)",
          PG: "rgb(54, 162, 235)",
          "PG-13": "rgb(255, 205, 86)",
          R: "rgb(255, 99, 132)",
          "NC-17": "rgb(153, 102, 255)",
          Unrated: "rgb(201, 203, 207)",
        };
        const backgroundColor = ratingLabels.map(
          (r) => ratingColors[r] || "gray"
        );

        setPieChartData({
          labels: ratingLabels,
          datasets: [
            {
              label: "Movies by Rating",
              data: ratingValues,
              backgroundColor,
              hoverOffset: 8,
            },
          ],
        });

        // console.log("genres ->", genreCounts);
        // console.log("ratings ->", ratingCounts);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Movies per Genre" },
      legend: { position: "bottom" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      title: { display: true, text: "Movies by Rating" },
    },
  };

  if (loading) return <p>Loading charts…</p>;

  return (
    <div className="analytics-container">
      <div
        style={{ width: "90%", maxWidth: 900, margin: "0 auto", height: 420 }}
      >
        {barChartData ? (
          <Bar data={barChartData} options={barChartOptions} />
        ) : (
          <p>No genre data.</p>
        )}
      </div>

      <div
        className="pie-chart-container"
        style={{
          width: "90%",
          maxWidth: 900,
          margin: "2rem auto",
          height: 420,
        }}
      >
        {pieChartData ? (
          <Pie data={pieChartData} options={pieOptions} />
        ) : (
          <p>No rating data.</p>
        )}
      </div>
    </div>
  );
}

function emptyBar() {
  return {
    labels: [],
    datasets: [{ label: "Movies per Genre", data: [] }],
  };
}

function emptyPie() {
  return {
    labels: [],
    datasets: [{ label: "Movies by Rating", data: [], backgroundColor: [] }],
  };
}
