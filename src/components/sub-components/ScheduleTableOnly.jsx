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

  const filteredTasks = (day, time) => tasks.filter(t => t.day === day && t.time === time);

  const toggleCompleted = (task) => {
    const updatedTasks = tasks.map(t =>
      t === task ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    localStorage.setItem('schedule-tasks', JSON.stringify(updatedTasks));
  };

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
          {times.map(time => (
            <tr key={time}>
              <td style={{ textAlign: 'center' }}>{time}</td>
              {daysSelect.map(day => (
                <td
                  key={day + time}
                  style={{
                    border: '1px solid var(--text-color)',
                    minHeight: '50px',
                    verticalAlign: 'top',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }}
                >
                  {filteredTasks(day, time).map((task, idx, arr) => (
                    <div
                      key={idx}
                      style={{
                        background: task.color,
                        marginTop: '2px',
                        marginBottom: idx === arr.length - 1 ? '10px' : '2px',
                        padding: '5px 6px',
                        borderRadius: '4px',
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleCompleted(task)}
                        style={{ width: '16px', height: '16px', marginRight: '5px' }}
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
    </div>
  );
}
