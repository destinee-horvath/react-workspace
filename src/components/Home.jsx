import { useState, useEffect } from 'react';

//check if a given date string is today
function isDateToday(dateString) {
  if (!dateString) return false;
  const today = new Date();
  const date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

//convert priority label to a numeric value to sort
function priorityToNumber(priority) {
  switch (priority) {
    case 'High': return 3;
    case 'Medium': return 2;
    case 'Low': return 1;
    default: return 0;
  }
}

export default function Home() {
  const [userName, setUserName] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [isBirthday, setIsBirthday] = useState(false);
  const [dob, setDob] = useState('');

  const sectionStyle = {
    border: '1px solid var(--text-color)',
    borderRadius: '8px',
    padding: '10px',
    boxSizing: 'border-box',
  };

  //load stored data from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('name');
    if (savedName) setUserName(savedName);

    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTaskList(JSON.parse(savedTasks));
    }

    const savedDob = localStorage.getItem('dob');
    if (savedDob) setDob(savedDob); 
  }, []);

  //load stored date of birth from localStorage
  useEffect(() => {
  localStorage.setItem('dob', dob);

  if (dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    if (
      birthDate.getDate() === today.getDate() &&
      birthDate.getMonth() === today.getMonth()
    ) {
      setIsBirthday(true);
    } else {
      setIsBirthday(false);
    }
  }
}, [dob]);


  //toggle the completion status of a task and update storage
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = taskList.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTaskList(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const tasksDueToday = taskList.filter(task => isDateToday(task.deadline));

  //get upcoming tasks (due after today) - sorted by deadline and priority, limited to 5
  const upcomingTasks = taskList
    .filter(task => {
      if (!task.deadline) return false;
      const deadlineDate = new Date(task.deadline);
      const today = new Date();
      return deadlineDate > today && !isDateToday(task.deadline); //task is due after today
    })
    .sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return priorityToNumber(b.priority) - priorityToNumber(a.priority); //if deadlines are the same, sort by priority descending
    })
    .slice(0, 5);

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        boxSizing: 'border-box',
        width: '95%', 
      }}
    >
      <h1 style={{ textAlign: 'center' }}>
        {isBirthday ? `🎉 Happy Birthday, ${userName}!` : `Hello, ${userName}`}
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '30px',
          flexWrap: 'wrap', //when screen is narrow, sections will stack
          justifyContent: 'space-between',
        }}
      >
        {/* Section for tasks due today */}
        <section style={{ ...sectionStyle, flex: '1 1 60%', minWidth: '280px' }}>
          <h3>Due Today ({tasksDueToday.length})</h3>
          {tasksDueToday.length === 0 ? (
            <p>No tasks due today!</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="checkbox-header"></th>
                  <th className="table-header">Task</th>
                  <th className="table-header">Priority</th>
                </tr>
              </thead>
              <tbody>
                {tasksDueToday.map((task) => (
                  <tr
                    key={task.id}
                    style={{ borderBottom: '1px solid var(--text-color)' }}
                  >
                    <td
                      style={{
                        width: '30px',
                        padding: '0 5px',
                        textAlign: 'center',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          margin: 0,
                          padding: 0,
                        }}
                      />
                    </td>
                    
                    <td style={{ padding: '6px 8px', whiteSpace: 'pre-wrap' }}>{task.text} </td>

                    <td style={{ padding: '6px 8px' }}>{task.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section style={{ ...sectionStyle, flex: '1 1 35%', minWidth: '220px' }}>
          {/* Section for upcoming - only displays next 5 upcoming tasks */}
          <h3>Upcoming</h3>
          {upcomingTasks.length === 0 ? (
            <p>No upcoming tasks!</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="checkbox-header"></th>
                  <th className="table-header">Task</th>
                  <th className="table-header">Days Left</th>
                  <th className="table-header">Priority</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTasks.map((task) => {
                  const today = new Date();
                  const deadlineDate = new Date(task.deadline);
                  const timeDiff = deadlineDate - today;
                  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                  return (
                    <tr
                      key={task.id}
                      style={{ borderBottom: '1px solid var(--text-color)' }}
                    >
                      <td
                        style={{
                          padding: '6px 8px',
                          textAlign: 'center',
                          width: '30px',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          style={{
                            cursor: 'pointer',
                            width: '16px',
                            height: '16px',
                          }}
                        />
                      </td>

                      <td style={{ padding: '6px 8px', whiteSpace: 'pre-wrap' }}>{task.text}</td>

                      <td style={{ padding: '6px 8px' }}>{daysLeft >= 0 ? daysLeft : 0}</td>

                      <td style={{ padding: '6px 8px' }}>{task.priority}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
