import { useState, useEffect } from 'react';
import DeleteConfirmation from './popups/DeleteConfirmation'; 

export default function Schedule() {
  const getNavigationColor = () => getComputedStyle(document.documentElement).getPropertyValue('--nav-color') || '#ffffff';
  const getFontSize = () => getComputedStyle(document.documentElement).getPropertyValue('--font-size') || '10px';

  const daysSelect = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [newTask, setNewTask] = useState({ name: '', day: 'Monday', time: '08:00', color: getNavigationColor().trim(), duration: 60 });
  const [editingTask, setEditingTask] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [startTime, setStartTime] = useState(8);
  const [endTime, setEndTime] = useState(17);
  const [interval, setInterval] = useState(60);
  const [cellTaskDuration, setCellTaskDuration] = useState(60);

  const [times, setTimes] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('schedule-settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.startTime !== undefined) setStartTime(parsed.startTime);
      if (parsed.endTime !== undefined) setEndTime(parsed.endTime);
      if (parsed.interval !== undefined) setInterval(parsed.interval);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('schedule-settings', JSON.stringify({ startTime, endTime, interval }));
    const generated = [];
    for (let hour = startTime; hour <= endTime; hour++) {
      for (let min = 0; min < 60; min += interval) {
        generated.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
      }
    }
    setTimes(generated);
  }, [startTime, endTime, interval]);

  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('schedule-tasks');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('schedule-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const [cellTaskPopup, setCellTaskPopup] = useState(null);
  const [cellTaskName, setCellTaskName] = useState('');
  const [cellTaskColor, setCellTaskColor] = useState(getNavigationColor().trim());

  const [confirmation, setConfirmation] = useState({ message: '', onConfirm: null, onCancel: null, taskToDelete: null });

  const addTask = () => {
    if (!newTask.name.trim()) return;
    setTasks([...tasks, {
      name: newTask.name,
      day: newTask.day,
      time: newTask.time,
      color: newTask.color,
      duration: newTask.duration,
      completed: false
    }]);
    setNewTask(prev => ({ ...prev, name: '' }));
  };

  const editTask = (task) => setEditingTask({ ...task, original: task });

  const saveEditedTask = () => {
    setTasks(tasks.map(t => t === editingTask.original ? editingTask : t));
    setEditingTask(null);
  };

  const deleteTask = () => {
    const task = editingTask.original;
    setConfirmation({
      message: 'Are you sure you want to delete this task?',
      onConfirm: () => {
        setTasks(tasks => tasks.filter(t => t !== task));
        setEditingTask(null);
      },
      onCancel: () => {},
    });
  };

  const removeAllTasks = () => {
    setConfirmation({
      message: 'Are you sure you want to delete all tasks?',
      onConfirm: () => setTasks([]),
      onCancel: () => {}
    });
  };

  const toggleCompleted = (task) => {
    setTasks(tasks.map(t => t === task ? { ...t, completed: !t.completed } : t));
  };

  const resetCheckboxes = () => {
    setConfirmation({
      message: 'Are you sure you want to reset all checkboxes?',
      onConfirm: () => {
        setTasks(tasks.map(t => ({ ...t, completed: false })));
      },
      onCancel: () => {}
    });
  };

  const getTimeIndex = (time) => times.findIndex(t => t === time);

  const renderCell = (day, time, rowIndex) => {
  const overlappingTasks = tasks.filter(task => {
    if (task.day !== day) return false;
    const taskStart = getTimeIndex(task.time);
    const taskEnd = taskStart + Math.ceil(task.duration / interval);
    return rowIndex >= taskStart && rowIndex < taskEnd;
  });

  if (overlappingTasks.length === 0) {
    return <td key={day + time} onClick={() => setCellTaskPopup({ day, time })} style={{ border: '1px solid var(--text-color)', minHeight: '50px', padding: '2px', verticalAlign: 'top', cursor: 'pointer' }} />;
  }

  if (overlappingTasks.some(task => getTimeIndex(task.time) === rowIndex)) {
    const tasksToShow = overlappingTasks.filter(task => getTimeIndex(task.time) === rowIndex).slice(0, 3);
    const totalTasks = tasksToShow.length;
    return (
      <td
        key={day + time}
        style={{
          border: '1px solid var(--text-color)',
          padding: '2px',
          verticalAlign: 'top',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2px' }}>
          {tasksToShow.map((task, idx) => {
            const width = `${100 / totalTasks}%`;
            return (
              <div
                key={idx}
                title={task.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setCellTaskPopup({ day, time });
                }}
                style={{
                  flex: `1 0 ${width}`,
                  backgroundColor: task.color,
                  color: 'black',
                  padding: '2px 4px',
                  fontSize: '9px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  borderRadius: '4px'
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleCompleted(task);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: '12px', height: '12px', marginRight: '2px' }}
                />
                {task.name}
              </div>
            );
          })}
        </div>
      </td>
    );
  }

  return null;
};

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h1 style={{ textAlign: 'center' }}>Schedule</h1>
      <hr className='custom-hr' />
      <button 
        onClick={() => setSettingsOpen(true)} 
        style={{ position: 'absolute', right: '20px', top: '50px' }}
        className='button-rectangle'
      >
        Settings
      </button>

      {/* Add Task */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'center',}}>
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          style={{ marginLeft: '10px', width: '200px', fontSize: (parseInt(getFontSize())) + 'px' }}
        />
        <select value={newTask.day} onChange={(e) => setNewTask({ ...newTask, day: e.target.value })} className="custom-select" style={{ marginLeft: '10px' }}>
          {[...daysSelect].map(day => <option key={day}>{day}</option>)}
        </select>
        <select value={newTask.time} onChange={(e) => setNewTask({ ...newTask, time: e.target.value })} className="custom-select" style={{ marginLeft: '10px' }}>
          {times.map(time => <option key={time}>{time}</option>)}
        </select>
        <select 
          value={newTask.duration} 
          onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) })} 
          className="custom-select" 
          style={{ marginLeft: '10px' }}
        >
          <option value={15}>15 min</option>
          <option value={30}>30 min</option>
          <option value={45}>45 min</option>
          <option value={60}>1 hour</option>
          <option value={90}>1.5 hours</option>
          <option value={120}>2 hours</option>
        </select>
        <input
          type="color"
          value={newTask.color}
          onChange={(e) => setNewTask({ ...newTask, color: e.target.value })}
          style={{ marginLeft: '10px', maxWidth: '50px' }}
        />
        <button className='button-rectangle-small' onClick={addTask} style={{ marginLeft: '10px'}}>Add Task</button>
      </div>

      {/* Schedule Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '30px',
          tableLayout: 'fixed', // evenly distribute columns
        }}
      >
        <thead>
            <tr>
            <th style={{ width: '10%' }}>Time</th>
            {daysSelect.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {times.map((time, rowIndex) => (
            <tr key={time}>
              <td style={{ textAlign: 'center', border: '1px solid var(--text-color)' }}>{time}</td>
              {daysSelect.map(day => {
                // Find if a task starts at this cell
                const startingTasks = tasks.filter(task =>
                  task.day === day && getTimeIndex(task.time) === rowIndex
                );

                if (startingTasks.length > 0) {
                  return startingTasks.map((task, idx) => {
                    const rowSpan = Math.ceil(task.duration / interval);
                    return (
                      <td
                        key={day + time + idx}
                        rowSpan={rowSpan}
                        style={{
                          border: '1px solid var(--text-color)',
                          padding: '2px',
                          verticalAlign: 'top',
                          position: 'relative',
                          backgroundColor: task.color,
                          color: 'black',
                          minWidth: 0,
                          maxWidth: '80px',
                          boxSizing: 'border-box',
                          cursor: 'pointer'
                        }}
                        title={task.name}
                        onClick={e => {
                          e.stopPropagation();
                          setEditingTask({ ...task, original: task });
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={e => {
                            e.stopPropagation();
                            toggleCompleted(task);
                          }}
                          onClick={e => e.stopPropagation()}
                          style={{ width: '12px', height: '12px', marginRight: '2px' }}
                        />
                        {task.name}
                      </td>
                    );
                  });
                }

                // If this cell is covered by a task (but not the start), render null
                const isCovered = tasks.some(task => {
                  if (task.day !== day) return false;
                  const taskStart = getTimeIndex(task.time);
                  const taskEnd = taskStart + Math.ceil(task.duration / interval);
                  return rowIndex > taskStart && rowIndex < taskEnd;
                });
                if (isCovered) return null;

                // Otherwise, render an empty cell
                return (
                  <td
                    key={day + time}
                    onClick={() => setCellTaskPopup({ day, time })}
                    style={{
                      border: '1px solid var(--text-color)',
                      minHeight: '50px',
                      padding: '2px',
                      verticalAlign: 'top',
                      cursor: 'pointer'
                    }}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reset and Remove All Buttons (bottom left) */}
      <div style={{ marginLeft: '10px', display: 'flex', gap: '10px' }}>
        <button className='button-rectangle-small' onClick={resetCheckboxes}>Reset Checkboxes</button>
        <button className='button-rectangle-small' onClick={removeAllTasks}>Remove All Tasks</button>
      </div>

      {/* Edit Popup */}
      {editingTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <input
              type="text"
              value={editingTask.name}
              onChange={(e) => setEditingTask({ ...editingTask, name: e.target.value })}
              style={{ maxWidth: '100px', marginLeft: '10px', marginRight: '10px', fontSize: (parseInt(getFontSize())) + 'px'  }}
            />
            <select
              value={editingTask.day}
              onChange={(e) => setEditingTask({ ...editingTask, day: e.target.value })}
              className="custom-select" 
              style={{marginRight: '10px' }}
            >
              {[...daysSelect].map(day => <option key={day}>{day}</option>)}
            </select>
            <select
              value={editingTask.time}
              onChange={(e) => setEditingTask({ ...editingTask, time: e.target.value })}
              className="custom-select" 
              style={{marginRight: '10px' }}
            >
              {times.map(time => <option key={time}>{time}</option>)}
            </select>
            <select 
              value={editingTask.duration} 
              onChange={(e) => setEditingTask({ ...editingTask, duration: parseInt(e.target.value) })}
              className="custom-select" 
              style={{ marginLeft: '0px' }}
            >

              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
            <input
              type="color"
              value={editingTask.color}
              onChange={(e) => setEditingTask({ ...editingTask, color: e.target.value })}
              style={{ maxWidth: '50px', marginLeft: '10px' }}
            />
            <br />
            <br />
            <button onClick={saveEditedTask} className='button-rectangle-small' style={{marginRight: '3px'}}>Save</button>
            <button onClick={() => setEditingTask(null)} className='button-rectangle-small' style={{marginRight: '3px'}}>Cancel</button>
            <button onClick={deleteTask} className='button-rectangle-small'> Delete</button>
          </div>
        </div>
      )}

      {/* Settings Popup */}
      {settingsOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Settings</h3>
            <label style={{marginRight: '10px'}}>Start Time:
              <input
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(parseInt(e.target.value))}
                min="0"
                max="23"
                style={{maxWidth: '50px', marginRight: '10px', marginTop: '20px', marginBottom: '10px', fontSize: (parseInt(getFontSize()) - 3) + 'px' }}
              />
            </label>
            <br />
            <label>End Time:
              <input
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(parseInt(e.target.value))}
                min="0"
                max="23"
                style={{maxWidth: '50px', marginRight: '10px', marginBottom: '10px', fontSize: (parseInt(getFontSize()) - 3) + 'px' }}
              />
            </label>
            <br />
            <label>Interval (min):
              <select className='custom-select' value={interval} onChange={(e) => setInterval(parseInt(e.target.value))} style={{maxWidth: '50px', marginRight: '10px', marginBottom: '10px'}}>
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={60}>60</option>
              </select>
            </label>
            <br />
            <button className='button-rectangle-small' onClick={() => setSettingsOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {cellTaskPopup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Task for {cellTaskPopup.day} at {cellTaskPopup.time}</h3>
            <input
              type="text"
              placeholder="Task Name"
              value={cellTaskName}
              onChange={(e) => setCellTaskName(e.target.value)}
              style={{ width: '200px', marginRight: '10px',fontSize: (parseInt(getFontSize())) + 'px'  }}
            />
            <select 
              value={cellTaskDuration} 
              onChange={(e) => setCellTaskDuration(parseInt(e.target.value))} 
              className="custom-select" 
              style={{ marginRight: '10px' }}
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
            <input
              type="color"
              value={cellTaskColor}
              onChange={(e) => setCellTaskColor(e.target.value)}
              style={{ maxWidth: '50px', marginRight: '10px' }}
            />
            <br /><br />
            <button
              onClick={() => {
                if (!cellTaskName.trim()) return;
                setTasks([...tasks, {
                  name: cellTaskName,
                  day: cellTaskPopup.day,
                  time: cellTaskPopup.time,
                  color: cellTaskColor,
                  completed: false, 
                  duration: cellTaskDuration
                }]);
                setCellTaskPopup(null);
                setCellTaskName('');
              }}
              className="button-rectangle-small"
              style={{ marginRight: '10px' }}
            >
              Add
            </button>
            <button
              onClick={() => setCellTaskPopup(null)}
              className="button-rectangle-small"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {confirmation.message && (
        <DeleteConfirmation
          message={confirmation.message}
          onConfirm={() => {
            confirmation.onConfirm();
            setConfirmation({ message: '', onConfirm: null, onCancel: null, taskToDelete: null });
          }}
          onCancel={() => setConfirmation({ message: '', onConfirm: null, onCancel: null, taskToDelete: null })}
        />
      )}

    </div>
  );
}
