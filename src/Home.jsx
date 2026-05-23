import { useState } from "react";
import "./Home.css";

export default function Home({ setLevel, setPlayers }) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(null);

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  const [timerMode, setTimerMode] = useState(false);
  const [timer, setTimer] = useState(60);

  function selectMode(m) {
    setMode(m);
    setStep(2);
  }

  function start(level) {
    setPlayers({
      mode,
      p1: player1.trim() || "Player 1",
      p2: mode === 2 ? (player2.trim() || "Player 2") : "",
      timerMode,
      timer,
    });

    setLevel(level);
  }

  return (
    <div className="home">

      <h1>🎮 Memory Battle</h1>

      {/* STEP TEXT (UPGRADED) */}
      <div className="stepText">
        {step === 1 && "Choose Game Mode"}
        {step === 2 && "Player Setup (1/2)"}
        {step === 3 && mode === 1 && "Timer Challenge (Optional)"}
        {step === 4 && "Choose Difficulty"}
      </div>

      <div className="steps">
        <div className={step >= 1 ? "dot activeDot" : "dot"} />
        <div className={step >= 2 ? "dot activeDot" : "dot"} />
        <div className={step >= 3 ? "dot activeDot" : "dot"} />
        <div className={step >= 4 ? "dot activeDot" : "dot"} />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="cardBox">
          <h2>Select Mode</h2>

          <button onClick={() => selectMode(1)}>👤 1 Player</button>
          <button onClick={() => selectMode(2)}>👥 2 Player</button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="cardBox">

          <h2>
            {mode === 1
              ? "Enter Your Name"
              : "Enter Player Names"}
          </h2>

          <input
            placeholder="Player 1"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />

          {mode === 2 && (
            <input
              placeholder="Player 2"
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
            />
          )}

          <div className="stepButtons">
            <button onClick={() => setStep(1)} className="backBtn">
              ← Back
            </button>

            <button onClick={() => setStep(3)} className="nextBtn">
              Next ➜
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && mode === 1 && (
        <div className="cardBox">

          <h2>⏱ Timer Mode</h2>

          <label className="toggle">
            <input
              type="checkbox"
              checked={timerMode}
              onChange={() => setTimerMode(!timerMode)}
            />
            Enable Challenge Timer
          </label>

          {timerMode && (
            <select
              className="timerSelect"
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
            >
              <option value={30}>30 Seconds</option>
              <option value={60}>60 Seconds</option>
              <option value={90}>90 Seconds</option>
              <option value={120}>120 Seconds</option>
            </select>
          )}

          <div className="stepButtons">
            <button onClick={() => setStep(2)} className="backBtn">
              ← Back
            </button>

            <button onClick={() => setStep(4)} className="nextBtn">
              Next ➜
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 */}
      {((step === 3 && mode === 2) || step === 4) && (
        <div className="cardBox">

          <h2>Choose Difficulty</h2>

          <button onClick={() => start("easy")}>🟢 Easy</button>
          <button onClick={() => start("medium")}>🟡 Medium</button>
          <button onClick={() => start("hard")}>🔴 Hard</button>

        </div>
      )}

    </div>
  );
}