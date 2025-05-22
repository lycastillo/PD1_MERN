import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./ProgressTracker.css";

const API_BASE_URL = "http://localhost:5000/api";

const moduleNames = [
  '2 Letter Words', 'CVC Words', 'VCV Words', 'VCC Words',
  '3 Letter Words', 'CVVC Words', 'CVCC Words', '4 Letter Words',
  '5 Letter Words', 'Colors', 'Numbers', 'Animals', 'Food', 'Body Parts'
];

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
  const [scoreMessage, setScoreMessage] = useState("");
  const [overallScore, setOverallScore] = useState(0);
  const [dailyScores, setDailyScores] = useState({});
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/players`)
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

const fetchPlayerProgress = (playerName) => {
  setSelectedPlayer(playerName);
axios.get(`${API_BASE_URL}/progress/${playerName}`)
  .then((res) => {
    const data = Array.isArray(res.data) ? res.data : [res.data];
    setPlayerProgress(data);
    setFilteredProgress(data);
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
  const safeEntries = Array.isArray(entries) ? entries : [entries]; // ✅ Fix here

  const map = {};
  safeEntries.forEach((entry) => {
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
    sorted.forEach((attempt) => {
      const change = attempt.Score - first;
      improvements[`${key}-${attempt.Date}-${attempt.Score}`] = change;
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

    if (filtered.length >= 2) {
      const latestScore = filtered[0].Score;
      const previousScore = filtered[1].Score;
      const diff = latestScore - previousScore;
      const capitalize = (name) => name.charAt(0).toUpperCase() + name.slice(1);
      if (diff > 0) {
        setScoreMessage(`🎉 ${capitalize(selectedPlayer)} scored ${diff} point${diff > 1 ? "s" : ""} higher than yesterday!`);
      } else if (diff < 0) {
        setScoreMessage(`⬇️ ${capitalize(selectedPlayer)} scored ${Math.abs(diff)} point${Math.abs(diff) > 1 ? "s" : ""} lower than yesterday.`);
      } else {
        setScoreMessage(`➖ ${capitalize(selectedPlayer)} scored the same as yesterday. Keep going!`);
      }
    } else {
      setScoreMessage("");
    }

    const total = filtered.reduce((sum, entry) => sum + entry.Score, 0);
    setOverallScore(total);

    const dailyMap = {};
    filtered.forEach(({ Date, Score }) => {
      if (!dailyMap[Date]) dailyMap[Date] = 0;
      dailyMap[Date] += Score;
    });
    setDailyScores(dailyMap);
  }, [selectedModule, selectedLevel, playerProgress]);

  const improvementMap = getImprovementMap(filteredProgress);

  return (
    <div className="progress-tracker-screen" style={{ backgroundImage: `url(${require("./game-UI.png")})` }}>
      <h1 className="progress-tracker-title">PROGRESS TRACKER</h1>
      <button className="progress-tracker-back-button" onClick={() => navigate("/")}>Back</button>

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
              {scoreMessage && (
                <div className="score-message" style={{ textAlign: "center", marginBottom: "10px", color: "#D94924", fontSize: "20px", fontWeight: "bold" }}>{scoreMessage}</div>
              )}

              <div className="score-buttons" style={{ textAlign: "center", marginBottom: "15px" }}>
                <button className="btn-overall" onClick={() => {
                  setPopupContent(`Overall Score: ${overallScore}`);
                  setShowScorePopup(true);
                }}>
                  Show Overall Score
                </button>
                <button className="btn-daily" onClick={() => {
                  const dailyEntries = Object.entries(dailyScores).sort(([a], [b]) => new Date(b) - new Date(a));
                  const latestDay = dailyEntries[0];
                  setPopupContent(latestDay ? `Latest Daily Score (${latestDay[0]}): ${latestDay[1]}` : "No daily scores available.");
                  setShowScorePopup(true);
                }}>
                  Show Daily Scores
                </button>
              </div>

              <div className="view-toggle">
                <label className="switch">
                  <input type="checkbox" checked={showTableView} onChange={() => setShowTableView(!showTableView)} />
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
                        const message = improvement > 0 ? `Improved by ${improvement} point${improvement > 1 ? "s" : ""}` : "No improvement";
                        return (
                          <tr key={index}>
                            <td style={{ backgroundColor: "yellow" }}>{entry.Date}</td>
                            <td>{moduleNames[entry.Module - 1] || entry.Module}</td>
                            <td>{entry.Level}</td>
                            <td>
                              {entry.Score}
                              <span className="improvement-dot" style={{ backgroundColor: dotColor }}>
                                <div className="improvement-tooltip">{message}</div>
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
                      <Tooltip contentStyle={{ backgroundColor: "#fff", color: "#333", borderRadius: "10px" }} />
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
                          return <circle cx={dotProps.cx} cy={dotProps.cy} r={6} fill={fillColor} stroke="#000" strokeWidth={1} />;
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          ) : (
            <div className="no-progress-message">No progress found on this module.</div>
          )}
        </div>
      </div>

      {showScorePopup && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 2000,
        }}>
          <div style={{
            backgroundColor: "white", padding: "30px", borderRadius: "15px",
            textAlign: "center", boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
            maxWidth: "90%",
          }}>
            <h2 style={{ marginBottom: "20px" }}>Score Information</h2>
            <p style={{ fontSize: "20px", marginBottom: "20px" }}>{popupContent}</p>
            <button
              onClick={() => setShowScorePopup(false)}
              style={{
                padding: "10px 20px", backgroundColor: "#65DA5A", border: "none",
                borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
