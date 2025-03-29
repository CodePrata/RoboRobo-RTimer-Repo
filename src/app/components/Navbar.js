"use client";

import { useState, useEffect } from "react";

// Function to generate a random 3x3x3 scramble
const generateScramble = () => {
  const moves = ["U", "D", "L", "R", "F", "B"];
  const modifiers = ["", "'", "2"];
  let scramble = [];
  let lastMove = "";

  for (let i = 0; i < 20; i++) {
    let move;
    do {
      move = moves[Math.floor(Math.random() * moves.length)];
    } while (move === lastMove);
    
    lastMove = move;
    scramble.push(move + modifiers[Math.floor(Math.random() * modifiers.length)]);
  }

  return scramble.join(" ");
};

export default function Navbar() {
  const [scramble, setScramble] = useState("");

  useEffect(() => {
    // Generate scramble only on the client side after component mounts
    setScramble(generateScramble());
  }, []);

  return (
    <nav className="navbar">
      <div className="scramble-container">
        <button onClick={() => setScramble(generateScramble())}>New Scramble</button>
        <p className="scramble">{scramble}</p>
      </div>
    </nav>
  );
}