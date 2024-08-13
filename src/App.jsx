import React, { useState, useEffect } from "react";

export default function App() {
  const [recording, setRecording] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const [status, setStatus] = useState("");

  const startRecording = () => {
    window.electronAPI.startRecording();
    setRecording(true);
    setStatus("Started recording mouse actions...");
  };

  const stopRecording = () => {
    window.electronAPI.stopRecording();
    setRecording(false);
    setStatus("Stopped recording mouse actions...");
  };

  const replayActions = () => {
    window.electronAPI.replayActions();
    setReplaying(true);
    setStatus("Replaying mouse actions...");
    setTimeout(() => {
      setReplaying(false);
      setStatus("Stopped recording mouse actions...");
    }, window.electronAPI.actions || 0);
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    const handleStartShortcut = () => {
      startRecording();
    };

    const handleStopShortcut = () => {
      stopRecording();
    };

    const handleReplayShortcut = () => {
      replayActions();
    };

    window.electronAPI.onStartShortcut(handleStartShortcut);
    window.electronAPI.onStopShortcut(handleStopShortcut);
    window.electronAPI.onReplayShortcut(handleReplayShortcut);

    return () => {
      // Clean up the listeners
      window.electronAPI.onStartShortcut(null);
      window.electronAPI.onStopShortcut(null);
      window.electronAPI.onReplayShortcut(null);
    };
  }, []);

  return (
    <div className="min-h-screen max-h-full bg-zinc-950 p-4">
      <div className="font-bold text-white mb-4">Mouse Action Recorder</div>
      <button
        onClick={toggleRecording}
        disabled={replaying}
        className={`${
          recording ? "bg-red-500" : "bg-blue-500"
        } text-white p-2 rounded mx-1 mb-2`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <button
        onClick={replayActions}
        disabled={recording || replaying}
        className="bg-green-500 text-white p-2 rounded mx-1 mb-2"
      >
        Replay Actions
      </button>
      <div className="text-white mt-4">{status}</div>
    </div>
  );
}
