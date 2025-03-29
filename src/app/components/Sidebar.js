"use client";

import React, { useState } from "react";

export default function Sidebar({
  sessions,
  setSessions,
  currentSession,
  setCurrentSession,
  currentTime,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatTime = (time) => {
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
  };

  const handleSessionChange = (e) => {
    setCurrentSession(parseInt(e.target.value) - 1); // Update to selected session (0-based index
  };

  const handleDeleteSession = () => {
    if (isDeleting) {
      // Create a copy of the sessions array to avoid direct mutation
      const updatedSessions = [...sessions];
      
      // Log before and after to see if the session is correctly being deleted
      console.log("Before delete", updatedSessions);
      
      // Clear timings and bestTime of the current session
      updatedSessions[currentSession] = { timings: [], bestTime: null };
      
      // Log after deletion
      console.log("After delete", updatedSessions);

      // Update the sessions state with the new array
      setSessions(updatedSessions);
      setIsDeleting(false);
      setShowDeleteConfirm(false); // Hide confirmation dialog
    } else {
      setShowDeleteConfirm(true); // Show confirmation dialog
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="sidebar">
      <div className="session-selector">
        <label>Session: </label>
        <select value={currentSession + 1} onChange={handleSessionChange}>
          {[...Array(10)].map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <button onClick={handleDeleteSession}>
          {isDeleting ? "Confirm Delete" : "Delete Session"}
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm">
          <p>Are you sure you want to delete all timings from this session?</p>
          <button onClick={handleDeleteSession}>Yes</button>
          <button onClick={handleCancelDelete}>No</button>
        </div>
      )}

      <div className="timing-info">
        <p>Current Time: {currentTime ? formatTime(currentTime) : "0.00"}</p>
        <p>
          Best Time:{" "}
          {sessions[currentSession]?.bestTime
            ? formatTime(sessions[currentSession].bestTime)
            : "0.00"}
        </p>
      </div>

      <div className="timings-table">
        <h3>Recorded Timings</h3>
        <table>
          <thead>
            <tr>
              <th>Timing #</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions[currentSession]?.timings.length > 0 ? (
              sessions[currentSession].timings.map((time, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{formatTime(time)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No timings recorded</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
