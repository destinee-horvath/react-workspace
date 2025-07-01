import { useState, useEffect } from 'react';

export default function Timer() {
  const [mode, setMode] = useState('pomodoro'); // pomodoro, custom, simple
  const [customPopupOpen, setCustomPopupOpen] = useState(false);
  const [tasksFromTodo, setTasksFromTodo] = useState([]);
  const [selectTaskPopup, setSelectTaskPopup] = useState(false);

  // Pomodoro defaults
  const pomodoroWork = 25 * 60;
  const pomodoroBreak = 5 * 60;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pomodoroWorkTime, setPomodoroWorkTime] = useState(pomodoroWork);
  const [pomodoroBreakTime, setPomodoroBreakTime] = useState(pomodoroBreak);
  const [simpleCountdownTime, setSimpleCountdownTime] = useState(60);

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  // Task info from ToDo or manual input
  const [currentTaskName, setCurrentTaskName] = useState('');
  const [currentTaskDuration, setCurrentTaskDuration] = useState(25 * 60);
  const [newManualTaskName, setNewManualTaskName] = useState('');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasksFromTodo(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    const savedWork = localStorage.getItem('pomodoroWorkTime');
    const savedBreak = localStorage.getItem('pomodoroBreakTime');
    const savedCountdown = localStorage.getItem('simpleCountdownTime');

    if (savedWork) setPomodoroWorkTime(Number(savedWork));
    if (savedBreak) setPomodoroBreakTime(Number(savedBreak));
    if (savedCountdown) setSimpleCountdownTime(Number(savedCountdown));
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoroWorkTime', pomodoroWorkTime);
  }, [pomodoroWorkTime]);

  useEffect(() => {
    localStorage.setItem('pomodoroBreakTime', pomodoroBreakTime);
  }, [pomodoroBreakTime]);

  useEffect(() => {
    localStorage.setItem('simpleCountdownTime', simpleCountdownTime);
  }, [simpleCountdownTime]);

  useEffect(() => {
    if (!running) return;

    if (secondsLeft === 0) {
      if (mode === 'pomodoro') {
        setOnBreak(!onBreak);
        setSecondsLeft(onBreak ? pomodoroWorkTime : pomodoroBreakTime);
      } else {
        setRunning(false);
      }
      return;
    }

    const intervalId = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [running, secondsLeft, mode, onBreak]);

  useEffect(() => {
    setRunning(false);
    setOnBreak(false);

    if (mode === 'pomodoro') {
      setSecondsLeft(pomodoroWorkTime);
    } else if (mode === 'countdown') {
      setSecondsLeft(simpleCountdownTime * 60);
    } else if (mode === 'custom') {
      setSecondsLeft(currentTaskDuration);
    } else {
      setSecondsLeft(0);
    }
  }, [mode, pomodoroWorkTime, pomodoroBreakTime, simpleCountdownTime, currentTaskDuration]);

  const startTimer = () => {
    if (secondsLeft === 0) {
      if (mode === 'pomodoro') {
        setSecondsLeft(onBreak ? pomodoroBreakTime : pomodoroWorkTime);
      } else if (mode === 'custom') {
        setCustomPopupOpen(true);
        return;
      } else if (mode === 'countdown') {
        setCurrentTaskName('Countdown');
        setSecondsLeft(simpleCountdownTime * 60);
      }
    }
    setRunning(true);
  };

  const resetTimer = () => {
    setRunning(false);
    setOnBreak(false);

    if (mode === 'pomodoro') {
      setSecondsLeft(pomodoroWorkTime);
    } else if (mode === 'custom') {
      setSecondsLeft(currentTaskDuration);
    } else if (mode === 'countdown') {
      setSecondsLeft(simpleCountdownTime * 60);
    } else {
      setSecondsLeft(0);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const pickTaskFromTodo = (task) => {
    setCurrentTaskName(task.text);
    setSecondsLeft(25 * 60);
    setRunning(false);
    setSelectTaskPopup(false);
  };

  const addManualTask = () => {
    if (!newManualTaskName.trim()) return;
    setCurrentTaskName(newManualTaskName.trim());
    setSecondsLeft(25 * 60);
    setRunning(false);
    setNewManualTaskName('');
    setSelectTaskPopup(false);
  };


  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Timer</h1>
      <hr className="custom-hr" />
      <button
        onClick={() => setSettingsOpen(true)}
        style={{
          position: 'absolute',
          top: '120px',
          right: '150px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
        className="button-rectangle"
      >
        Settings
      </button>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label>
          Select Timer Mode:&nbsp;
          <select className='custom-select' value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="pomodoro">Pomodoro</option>
            {/* <option value="custom">Custom</option> */}
            <option value="countdown">Countdown</option>
          </select>
        </label>
      </div>

      <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '10px' }}>
        {formatTime(secondsLeft)}
      </div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <strong>Current Task:</strong> {currentTaskName || '(none)'}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {!running ? (
          <>
            <button className="button-rectangle" onClick={startTimer}>
              Start
            </button>
            <button
              className="button-rectangle"
              style={{ marginLeft: '10px' }}
              onClick={resetTimer}
            >
              Reset
            </button>
          </>
        ) : (
          <>
            <button
              className="button-rectangle"
              onClick={() => setRunning(false)}
            >
              Pause
            </button>
            <button
              className="button-rectangle"
              style={{ marginLeft: '10px' }}
              onClick={resetTimer}
            >
              Reset
            </button>
          </>
        )}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          className="button-rectangle-small"
          onClick={() => setSelectTaskPopup(true)}
        >
          Pick Task From To-Do / Add New Task
        </button>
      </div>

      {/* Custom popup placeholder */}
      {customPopupOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '300px' }}>
            <h3>Custom Timer Settings</h3>
            <p>This popup is not implemented yet.</p>
            <button
              className="button-rectangle-small"
              onClick={() => setCustomPopupOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Select Task Popup */}
      {selectTaskPopup && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '50%' }}>
            <h3>Select a Task from To-Do or Add New</h3>

            {tasksFromTodo.length === 0 && <p>No tasks found in To-Do.</p>}
            {tasksFromTodo.length > 0 && (
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  marginBottom: '20px',
                }}
              >
                {tasksFromTodo.map((task) => {
                  const taskName = task.name || task.text || 'Unnamed Task';
                  return (
                    <li key={task.id} style={{ marginBottom: '8px' }}>
                      <button
                        className="button-rectangle-small"
                        onClick={() => pickTaskFromTodo(task)}
                        style={{ width: '100%', textAlign: 'left' }}
                      >
                        {taskName} {task.deadline ? `- Due: ${task.deadline}` : ''}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div>
              <input
                type="text"
                placeholder="New task name"
                value={newManualTaskName}
                onChange={(e) => setNewManualTaskName(e.target.value)}
                style={{ width: '100%', marginBottom: '10px', fontSize: '16px' }}
              />
              <button
                className="button-rectangle-small"
                onClick={addManualTask}
                disabled={!newManualTaskName.trim()}
                style={{ width: '100%' }}
              >
                Add New Task
              </button>
            </div>

            <button
              className="button-rectangle-small"
              onClick={() => setSelectTaskPopup(false)}
              style={{ marginTop: '15px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '350px' }}>
            <h3>Timer Settings</h3>

            <label>
              Pomodoro Work (minutes):
              <input
                type="number"
                min={1}
                max={180}
                value={pomodoroWorkTime / 60}
                onChange={(e) => setPomodoroWorkTime(Number(e.target.value) * 60)}
                style={{ width: '60px', marginLeft: '10px', marginBottom: '10px' }}
              />
            </label>

            <br />

            <label>
              Pomodoro Break (minutes):
              <input
                type="number"
                min={1}
                max={60}
                value={pomodoroBreakTime / 60}
                onChange={(e) => setPomodoroBreakTime(Number(e.target.value) * 60)}
                style={{ width: '60px', marginLeft: '10px', marginBottom: '10px' }}
              />
            </label>

            <br />

            <label>
              Countdown (minutes):
              <input
                type="number"
                min={1}
                max={3600}
                value={simpleCountdownTime}
                onChange={(e) => setSimpleCountdownTime(Number(e.target.value))}
                style={{ width: '80px', marginLeft: '10px', marginBottom: '10px' }}
              />
            </label>

            <br /><br />

            <button
              className="button-rectangle-small"
              onClick={() => setSettingsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}