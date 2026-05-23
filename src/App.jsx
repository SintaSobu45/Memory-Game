import { useState } from "react";
import Home from "./Home";
import Game from "./Game";

export default function App() {

  const [level, setLevel] = useState(null);

  const [players, setPlayers] = useState({
    mode: 2,
    p1: "Player 1",
    p2: "Player 2"
  });

  return (
    <>
      {!level ? (

        <Home
          setLevel={setLevel}
          setPlayers={setPlayers}
        />

      ) : (

        <Game
          level={level}
          players={players}
          goHome={() => setLevel(null)}
        />

      )}
    </>
  );
}