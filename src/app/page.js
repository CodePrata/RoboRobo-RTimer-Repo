"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [holding, setHolding] = useState(false);
  const [holdStart, setHoldStart] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true); // New state for the sidebar
  const [sessions, setSessions] = useState(
    Array(10).fill({ timings: [], bestTime: null })
  );
  const [currentSession, setCurrentSession] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running) {
      const startTime = performance.now();
      timerRef.current = setInterval(() => {
        setTime(performance.now() - startTime);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && !holding) {
        setHoldStart(performance.now());
        setHolding(true);
        setReady(false);
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space" && holding) {
        const holdDuration = performance.now() - holdStart;
        setHolding(false);

        if (!hasStarted && holdDuration >= 500) {
          setRunning(true);
          setHasStarted(true);
          setShowNavbar(false); // Hide navbar when the timer starts
          setShowSidebar(false); // Hide sidebar when the timer starts
        } else if (hasStarted) {
          setRunning(false);
          setHasStarted(false);
          setShowNavbar(true); // Show navbar when the timer stops
          setShowSidebar(true); // Show sidebar when the timer stops

          // Add the timing to the current session when the timer stops
          const currentTimings = [...sessions[currentSession].timings, time];
          const bestTime =
            sessions[currentSession].bestTime === null ||
            time < sessions[currentSession].bestTime
              ? time
              : sessions[currentSession].bestTime;

          const updatedSessions = [...sessions];
          updatedSessions[currentSession] = {
            timings: currentTimings,
            bestTime,
          };
          setSessions(updatedSessions);
        }

        setReady(false);
      }
    };

    const checkHoldTime = () => {
      if (holding && !ready && performance.now() - holdStart >= 500) {
        setReady(true);
        setTime(0); // Reset timer to 0 when turning green
      }
    };

    const interval = setInterval(checkHoldTime, 50);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      clearInterval(interval);
    };
  }, [holding, holdStart, hasStarted, time, sessions, currentSession]);

  const formatTime = (time) => {
    const seconds = Math.floor((time % 60000) / 1000); // Whole seconds
    const milliseconds = Math.floor((time % 1000) / 100); // Deciseconds (0.1, 1.2, 2.3, etc.)
    const centiseconds = Math.floor((time % 1000) / 10); // Centiseconds (same value as deciseconds in this context)

    // While running, show seconds and deciseconds (0.1, 1.2, etc.)
    if (running) {
      return `${String(seconds).padStart(1, "0")}.${String(milliseconds).padStart(1, "0")}`;
    } else {
      // When stopped, show seconds, deciseconds, and centiseconds (1.23, 2.45, etc.)
      return `${String(seconds).padStart(1, "0")}.${String(centiseconds).padStart(2, "0")}`;
    }
  };

  return (
    <div className="home-container">
      {/* Navbar should be above */}
      {showNavbar && <Navbar />}

      {/* Sidebar component */}
      <Sidebar
        sessions={sessions}
        setSessions={setSessions}
        currentSession={currentSession}
        setCurrentSession={setCurrentSession}
        currentTime={time}
        showSidebar={showSidebar} // Passing the showSidebar state to Sidebar
      />

      <div className="main-container">
        <main className="timer-container">
          <div className="timer-box">
            <h2
              className={`timer-text ${holding ? (ready ? "green" : "red") : ""}`}
            >
              {formatTime(time)}
            </h2>
          </div>
        </main>
      </div>
    </div>
  );
}
