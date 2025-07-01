import { useState, useEffect } from 'react';

export default function ScheduleTableOnly() {
  const getNavigationColor = () => getComputedStyle(document.documentElement).getPropertyValue('--nav-color') || '#ffffff';

  const daysSelect = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('schedule-tasks');
    return stored ? JSON.parse(stored) : [];
  });

  const [startTime, setStartTime] = useState(8);
  const [endTime, setEndTime] = useState(17);
  const [interval, setInterval] = useState(60);

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

  const toggleCompleted = (task) => {
    const updatedTasks = tasks.map(t =>
      t === task ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem('schedule-tasks', JSON.stringify(updatedTasks));
  };

  const getTimeIndex = (time) => times.findIndex(t => t === time);

  return (
    <div style={{ padding: '20px' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '30px',
          tableLayout: 'fixed',
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
          {times.map((time, rowIndex) => (
            <tr key={time}>
              <td style={{ textAlign: 'center' }}>{time}</td>
              {daysSelect.map(day => {
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
                          backgroundColor: task.color,
                          color: 'black',
                          minWidth: 0,
                          maxWidth: '80px',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          textDecoration: task.completed ? 'line-through' : 'none'
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
                          style={{ width: '12px', height: '12px', marginRight: '5px' }}
                        />
                        {task.name}
                      </td>
                    );
                  });
                }

                const isCovered = tasks.some(task => {
                  if (task.day !== day) return false;
                  const taskStart = getTimeIndex(task.time);
                  const taskEnd = taskStart + Math.ceil(task.duration / interval);
                  return rowIndex > taskStart && rowIndex < taskEnd;
                });
                if (isCovered) return null;

                return (
                  <td
                    key={day + time}
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
    </div>
  );
}
