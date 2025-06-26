import { useState, useEffect } from 'react';
import DeleteConfirmation from './popups/DeleteConfirmation'; 


export default function Schedule() {
  // Get CSS variables
  const getNavigationColor = () => getComputedStyle(document.documentElement).getPropertyValue('--nav-color') || '#ffffff';
  const getFontSize = () => getComputedStyle(document.documentElement).getPropertyValue('--font-size') || '10px';

  const daysSelect = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [newTask, setNewTask] = useState({ name: '', day: 'Monday', time: '08:00', color: getNavigationColor().trim() });
  const [editingTask, setEditingTask] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [startTime, setStartTime] = useState(8);
  const [endTime, setEndTime] = useState(17);
  const [interval, setInterval] = useState(60); // in minutes

  // Tasks state with localStorage 
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

  const [confirmation, setConfirmation] = useState({
    message: '',
    onConfirm: null,
    onCancel: null,
    taskToDelete: null,
  });
  
  const addTask = () => {
    if (!newTask.name.trim()) return;
    setTasks([...tasks, { ...newTask, completed: false }]);
    setNewTask({ name: '', day: 'Monday', time: times[0], color: '#00bfff' });
  };

  // Edit a task (that is selected)
  const editTask = (task) => setEditingTask({ ...task });

  // Save the edited task
  const saveEditedTask = () => {
    setTasks(tasks.map(t => 
      t === tasks.find(task => task === editingTask.original) ? editingTask : t
    ));
    setEditingTask(null);
  };

  // Delete a single task (that is selected) 
  const deleteTask = () => {
    setConfirmation({
      message: 'Are you sure you want to delete this task?',
      onConfirm: () => {
        setTasks(tasks.filter(t => t !== confirmation.taskToDelete));
        setEditingTask(null);
      },
      onCancel: () => {},
      taskToDelete: editingTask.original, 
    });
  };

  const removeAllTasks = () => {
    setConfirmation({
      message: 'Are you sure you want to delete all tasks?',
      onConfirm: () => setTasks([]),
      onCancel: () => {}
    });
  };

  // Generate times based on startTime, endTime, and interval for time column
  const generateTimes = () => {
    const times = [];
    for (let hour = startTime; hour <= endTime; hour++) {
      for (let min = 0; min < 60; min += interval) {
        times.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
      }
    }
    return times;
  };

  const times = generateTimes();

  // Toggle completed state directly from checkbox in schedule cell
  const toggleCompleted = (task) => {
    setTasks(tasks.map(t =>
      t === task ? { ...t, completed: !t.completed } : t
    ));
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

  const filteredTasks = (day, time) => tasks.filter(t => t.day === day && t.time === time);

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
          style={{ marginLeft: '10px', width: '200px' }}
        />
        <select value={newTask.day} onChange={(e) => setNewTask({ ...newTask, day: e.target.value })} className="custom-select" style={{ marginLeft: '10px' }}>
          {[...daysSelect].map(day => <option key={day}>{day}</option>)}
        </select>
        <select value={newTask.time} onChange={(e) => setNewTask({ ...newTask, time: e.target.value })} className="custom-select" style={{ marginLeft: '10px' }}>
          {times.map(time => <option key={time}>{time}</option>)}
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
              <th key={day} style={{ width: `${90 / daysSelect.length}%` }}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr key={'top' + time}>
              <td style={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word', textAlign: 'center' }}>{time}</td>
              {daysSelect.map(day => (
                <td
                  key={day + time}
                  onClick={() => setCellTaskPopup({ day, time })} // open add popup
                  style={{
                    border: '1px solid var(--text-color)',
                    minHeight: '50px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    verticalAlign: 'top',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {filteredTasks(day, time).map((task, idx, arr) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: task.color,
                        marginTop: '2px',
                        marginBottom: idx === arr.length - 1 ? '10px' : '2px', //add bottom margin only for the last task
                        padding: '5px 6px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        flexWrap: 'wrap',
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering add-task popup
                        editTask({ ...task, original: task });
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
                        style={{ width: '16px', height: '16px', margin: 0, marginRight: '5px' }}
                      />
                      <span>{task.name}</span>
                    </div>
                  ))}
                </td>
              ))}
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
              style={{ maxWidth: '100px', marginLeft: '10px', marginRight: '10px' }}
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
            <input
              type="color"
              value={editingTask.color}
              onChange={(e) => setEditingTask({ ...editingTask, color: e.target.value })}
              style={{ maxWidth: '50px', marginRight: '10px' }}
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
              style={{ width: '200px', marginRight: '10px' }}
            />
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
                  completed: false
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
