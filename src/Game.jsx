import { useEffect, useState } from "react";
import "./Game.css";

const emojis = [
  "🍎", "🚗", "🐶", "🎈", "🍕", "⚽", "🎵", "🌈", "🔥", "🚀",
  "🐼", "🍩", "🎮", "👑", "🦄", "🐸", "🍔", "🍟", "🎲", "🎸",
];

const levelConfig = {
  easy: { count: 6, cols: 3 },
  medium: { count: 10, cols: 5 },
  hard: { count: 20, cols: 8 }
};

function shuffle(level) {
  const config = levelConfig[level] || levelConfig.easy;

  const selected = emojis.slice(0, config.count);

  return [...selected, ...selected]
    .map((e, i) => ({
      id: i + Math.random(),
      emoji: e,
      matched: false,
      matchedBy: null
    }))
    .sort(() => Math.random() - 0.5);
}

export default function Game({
  level,
  goHome,
  players
}) {

  const config = levelConfig[level] || levelConfig.easy;

  const isSingle = players.mode === 1;

  const timerMode = players.timerMode;
  const initialTime = players.timer || 60;

  const [cards, setCards] = useState(() => shuffle(level));
  const [flipped, setFlipped] = useState([]);
  const [turn, setTurn] = useState(1);

  const [score, setScore] = useState({ p1: 0, p2: 0 });

  const [lock, setLock] = useState(false);

  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(true);

  const [timeLeft, setTimeLeft] = useState(initialTime);

  function play(type) {
    if (!sound) return;

    let url = "";

    if (type === "flip")
      url = "https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3";

    if (type === "match")
      url = "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3";

    if (type === "win")
      url = "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3";

    new Audio(url).play();
  }

  function click(i) {
    if (lock) return;
    if (cards[i].matched) return;
    if (flipped.includes(i)) return;

    play("flip");

    const next = [...flipped, i];
    setFlipped(next);

    if (next.length === 2) setLock(true);
  }

  useEffect(() => {
    if (flipped.length !== 2) return;

    const [a, b] = flipped;

    const c1 = cards[a];
    const c2 = cards[b];

    const key = turn === 1 ? "p1" : "p2";

    if (c1.emoji === c2.emoji) {

      play("match");

      setCards(prev =>
        prev.map(c =>
          c.emoji === c1.emoji
            ? { ...c, matched: true, matchedBy: turn }
            : c
        )
      );

      setScore(s => ({
        ...s,
        [key]: s[key] + 1
      }));

      setTimeout(() => {
        setFlipped([]);
        setLock(false);
      }, 500);

    } else {

      setTimeout(() => {
        setFlipped([]);
        if (!isSingle) setTurn(t => (t === 1 ? 2 : 1));
        setLock(false);
      }, 800);
    }

  }, [flipped]);

  const finished = cards.every(c => c.matched);

  const gameOver = timerMode && timeLeft <= 0;

  const winner =
    score.p1 > score.p2 ? "p1" :
      score.p2 > score.p1 ? "p2" :
        "draw";

  useEffect(() => {
    if (finished || gameOver) play("win");
  }, [finished, gameOver]);

  /* TIMER */
  useEffect(() => {
    if (!timerMode || !isSingle) return;
    if (finished) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, timerMode, finished]);

  function restart() {
    setCards(shuffle(level));
    setFlipped([]);
    setTurn(1);
    setScore({ p1: 0, p2: 0 });
    setLock(false);
    setTimeLeft(initialTime);
  }

  return (
    <div className={`app ${dark ? "dark" : ""}`}>

      <h1>🎮 Memory Battle ({level})</h1>

      {/* CONTROLS */}
      <div className="controls">

        <button onClick={goHome}>🏠 Home</button>

        <button onClick={() => setDark(!dark)}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        <button onClick={() => setSound(!sound)}>
          {sound ? "🔊 Sound" : "🔇 Mute"}
        </button>

        <button onClick={restart}>🔄 Restart</button>

      </div>

      {/* TIMER */}
      {timerMode && isSingle && (
        <h2 className="timerText">
          ⏱ {timeLeft}s
        </h2>
      )}

      {/* PLAYERS */}
      <div className="players">

        <div className={`player p1 ${turn === 1 ? "active" : ""}`}>
          <h3>{players.p1}</h3>
          <p>⭐ {score.p1}</p>
        </div>

        {!isSingle && (
          <div className={`player p2 ${turn === 2 ? "active" : ""}`}>
            <h3>{players.p2}</h3>
            <p>⭐ {score.p2}</p>
          </div>
        )}

      </div>

      {/* TURN */}
      {!isSingle && (
        <h3>
          👉 {turn === 1 ? players.p1 : players.p2}'s Turn
        </h3>
      )}

      {/* GRID */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, 60px)`
        }}
      >

        {cards.map((c, i) => {

          const show = flipped.includes(i) || c.matched;

          return (
            <div key={c.id} className="card" onClick={() => click(i)}>
              <div className={`inner ${show ? "flip" : ""}`}>

                <div className="front">?</div>

                <div className={`back
                  ${c.matchedBy === 1 ? "p1Card" : ""}
                  ${c.matchedBy === 2 ? "p2Card" : ""}
                `}>
                  {c.emoji}
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* POPUP */}
      {(finished || gameOver) && (
        <div className="winnerOverlay">

          <div className="winnerBox">

            <h2>🏁 Game Finished!</h2>

            {gameOver && !finished && (
              <h1 className="drawWin">
                ⌛ Time Over!
              </h1>
            )}

            {finished && (
              <>
                {winner === "p1" && <h1 className="p1Win">🎉 {players.p1} Wins!</h1>}
                {winner === "p2" && <h1 className="p2Win">🎉 {players.p2} Wins!</h1>}
                {winner === "draw" && <h1 className="drawWin">🤝 Draw!</h1>}
              </>
            )}

            <p>
              ⭐ P1: {score.p1}
              {!isSingle && ` | P2: ${score.p2}`}
            </p>

            <button onClick={restart}>Play Again</button>

          </div>

        </div>
      )}

    </div>
  );
}