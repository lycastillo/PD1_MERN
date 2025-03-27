import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer,} from "recharts";
import "./ProgressTracker.css";

const API_BASE_URL = "http://localhost:5000/api";

const ProgressTracker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedPlayerName = location.state?.playerName || null;
  const [showTableView, setShowTableView] = useState(false);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerProgress, setPlayerProgress] = useState([]);
  const [filteredProgress, setFilteredProgress] = useState([]);
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/players`)
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("❌ Error fetching players:", err));
  }, []);

  const fetchPlayerProgress = (playerName) => {
    setSelectedPlayer(playerName);
    axios
      .get(`${API_BASE_URL}/progress/${playerName}`)
      .then((res) => {
        setPlayerProgress(res.data);
        setFilteredProgress(res.data);
      })
      .catch(() => {
        setPlayerProgress([]);
        setFilteredProgress([]);
      });
  };

  useEffect(() => {
    if (passedPlayerName) {
      fetchPlayerProgress(passedPlayerName);
    }
  }, [passedPlayerName]);

  const getImprovementMap = (entries) => {
    const map = {};

    entries.forEach((entry) => {
      const key = `${entry.Module}-${entry.Level}`;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(entry);
    });

    const improvements = {};
    Object.entries(map).forEach(([key, list]) => {
      const sorted = list.sort((a, b) => new Date(a.Date) - new Date(b.Date));
      const first = sorted[0].Score;
      sorted.forEach((attempt, index) => {
        const change = attempt.Score - first;
        const percent = Math.round((change / Math.max(first, 1)) * 100);
        improvements[`${key}-${attempt.Date}-${attempt.Score}`] = percent;
      });
    });

    return improvements;
  };

  useEffect(() => {
    let filtered = [...playerProgress];

    if (selectedModule !== "All") {
      filtered = filtered.filter((entry) => entry.Module === parseInt(selectedModule));
    }
    if (selectedLevel !== "All") {
      filtered = filtered.filter((entry) => entry.Level === parseInt(selectedLevel));
    }

    if (selectedModule === "All" && selectedLevel === "All") {
      filtered.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    } else {
      filtered.sort((a, b) => {
        if (a.Module !== b.Module) return a.Module - b.Module;
        if (a.Level !== b.Level) return a.Level - b.Level;
        return new Date(a.Date) - new Date(b.Date);
      });
    }

    setFilteredProgress(filtered);
  }, [selectedModule, selectedLevel, playerProgress]);

  const improvementMap = getImprovementMap(filteredProgress);

  return (
    <div
      className="progress-tracker-screen"
      style={{
        backgroundImage: `url(${require("./game-UI.png")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <h1 className="progress-tracker-title">PROGRESS TRACKER</h1>
      <button className="progress-tracker-back-button" onClick={() => navigate("/")}>
        Back
      </button>

      <div className="progress-tracker-layout">
        <div className="player-sidebar">
          {players.map((player) => (
            <div
              key={player._id}
              className={`progress-tracker-box ${selectedPlayer === player.name ? "active" : ""}`}
              onClick={() => fetchPlayerProgress(player.name)}
            >
              <div className="progress-tracker-initial">{player.name.charAt(0)}</div>
              <div className="progress-tracker-name">{player.name}</div>
            </div>
          ))}
        </div>
        <div className="chart-container">
          {selectedPlayer && filteredProgress.length > 0 ? (
            <>
              <div className="view-toggle">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={showTableView}
                    onChange={() => setShowTableView(!showTableView)}
                  />
                  <span className="slider"></span>
                </label>
                <span className="view-label">{showTableView ? "Table View" : "Graph View"}</span>
              </div>

              {showTableView ? (
                <div className="table-view">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Module</th>
                        <th>Level</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProgress.map((entry, index) => {
                        const key = `${entry.Module}-${entry.Level}-${entry.Date}-${entry.Score}`;
                        const improvement = improvementMap[key];
                        const dotColor = improvement > 0 ? "#00FF7F" : "#FFA500";

                        return (
                          <tr key={index}>
                            <td>{entry.Date}</td>
                            <td>{entry.Module}</td>
                            <td>{entry.Level}</td>
                            <td>
  {entry.Score}
  <span
    className="improvement-dot"
    style={{ backgroundColor: dotColor }}
  >
    <div className="improvement-tooltip">
      {improvement > 0
        ? `${improvement}% improvement since first attempt`
        : "No improvement"}
    </div>
  </span>
</td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="graph-view">
                  <ResponsiveContainer width="100%" height={330}>
                    <LineChart data={filteredProgress}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#808080" />
                      <XAxis dataKey="Date" stroke="#FFD700" />
                      <YAxis domain={[0, 10]} stroke="#FFD700" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          color: "#333",
                          borderRadius: "10px",
                        }}
                        labelStyle={{ fontWeight: "bold", color: "#000" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Score"
                        stroke="#00FF7F"
                        strokeWidth={3}
                        dot={(dotProps) => {
                          const entry = filteredProgress[dotProps.index];
                          const key = `${entry.Module}-${entry.Level}-${entry.Date}-${entry.Score}`;
                          const improvement = improvementMap[key];
                          const fillColor = improvement > 0 ? "#00FF7F" : "#FFA500";

                          return (
                            <circle
                              cx={dotProps.cx}
                              cy={dotProps.cy}
                              r={6}
                              fill={fillColor}
                              stroke="#000"
                              strokeWidth={1}
                            />
                          );
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="filters-under-chart bottom-center">
                <div className="filters-wrapper">
                  <label>Module:</label>
                  <select
                    className="dropdown-filter"
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                  >
                    <option value="All">All</option>
                    {[...Array(15)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        Module {i + 1}
                      </option>
                    ))}
                  </select>

                  <label>Level:</label>
                  <select
                    className="dropdown-filter"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    <option value="All">All</option>
                    {"Very Easy,Easy,Normal,Hard".split(",").map((label, i) => (
                      <option key={i} value={i + 1}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="no-progress-message">No progress found on this module.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
