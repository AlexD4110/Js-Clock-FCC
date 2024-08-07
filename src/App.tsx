import { useState, useEffect} from 'react';
import './App.css';
import TimeSetter from './TimeSetter';
import Display from './Display'; 
import { DisplayState } from './helpers';
import AlarmSound from "./assets/AlarmSound.mp3";

// Define default values for break and session times
const defaultBreakTime = 5; // Default break time in minutes
const defaultSessionTime = 25; // Default session time in minutes
const sessionTime = defaultSessionTime * 60; // Assuming session time is in seconds

// Define the minimum, maximum, and interval for time settings
const min = 1;
const max = 60;
const interval = 1;

function App() {
  // State hooks for break and session lengths
  const [breakLength, setBreakLength] = useState(defaultBreakTime);
  const [sessionLength, setSessionLength] = useState(defaultSessionTime);

  // State hook for display status
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    timerRunning: false,
  });

  useEffect(() => {
    let timerID: number;
    if(!displayState.timerRunning) return;

    if(displayState.timerRunning) {
      timerID = window.setInterval(decrementDisplay, 1000);

    }

    return () => clearInterval(timerID);

  }, [displayState.timerRunning]);

  useEffect(() => {
    if (displayState.time === 0) {
      const audio = document.getElementById("beep") as HTMLAudioElement;
      audio.currentTime = 2;
      audio.play().catch((err) => console.log(err));
      setDisplayState((prev) => ({
      ...prev,
      timeType: prev.timeType === "Session" ? "Break" : "Session",
      time: prev.timeType === "Session" ? breakLength : sessionLength,
    }));
      }
  }, [displayState, breakLength, sessionLength]); //will run useEfect when one of these changes

  const reset = () => {
    setBreakLength(defaultBreakTime);
    setSessionLength(defaultSessionTime);
    setDisplayState({
      time: sessionTime,
      timeType: "Session",
      timerRunning: false,
    });
    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
  };

  const startStop = () => {
    setDisplayState((prev) => ({
      ...prev,
      timerRunning: !prev.timerRunning,
    }));
  };
  
  const changeBreakLength = (time: number) => {
    if (displayState.timerRunning) return;
    setBreakLength(time);
  };

  const decrementDisplay = () => {
    setDisplayState((prev) => ({
       ...prev, 
       time: prev.time - 1,
      }));
  };

  const changeSessionLength = (time: number) => {
    if (displayState.timerRunning) return;
    setSessionLength(time);
    setDisplayState({
      time: time,
      timeType: "Session",
      timerRunning: false,
    });
  };
  return (
    <div className="clock-container">
      <h1 className="title">25+5 Clock</h1>
      <div className="setters">
        <div id="app">
          <div className="break">
            <h4 id="break-label">Break Length</h4>
            <TimeSetter 
              time={breakLength}
              setTime={changeBreakLength}
              min={min}
              max={max}
              interval={interval}
              type="break"
            />
          </div>
          <div className="session">
            <h4 id="session-label">Session Length</h4>
            <TimeSetter
              time={sessionLength}
              setTime={changeSessionLength}
              min={min}
              max={max}
              interval={interval}
              type="session"
            />
          </div>
        </div>
      </div>
      <Display
        displayState={displayState}
        reset={reset}
        startStop={startStop} 
        />
        <audio id="beep" src={AlarmSound} />
    </div>
  );
}

export default App;
