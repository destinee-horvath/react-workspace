import React, { useState, useEffect, useMemo } from 'react';
import { useRef } from 'react'; //for date input 
import Popup from './popups/DeleteConfirmation'; 


export default function ToDo() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [taskInput, setTaskInput] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('Medium');

  const [editTaskId, setEditTaskId] = useState(null);
  const [editDeadline, setEditDeadline] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editTaskInput, setEditTaskInput] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const [sortKey, setSortKey] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const isValidDate = (dateString) => /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  const dateInputRef = useRef();

  const getFontSize = () => getComputedStyle(document.documentElement).getPropertyValue('--font-size') || '10px';


  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  //add task functionality
  const addTask = () => {
    if (!taskInput.trim()) return;

    const newTask = {
      id: Date.now(),
      text: taskInput,
      deadline,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
    setTaskInput('');
    setDeadline('');
    setPriority('None');
  };

  //delete task confirmation
  const confirmDeleteTask = (id) => {
    setTaskToDelete(id);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = () => {
    setTasks(tasks.filter(task => task.id !== taskToDelete));
    setShowConfirm(false);
    setTaskToDelete(null);
  };

  const handleDeleteCancelled = () => {
    setShowConfirm(false);
    setTaskToDelete(null);
  };

  //edit task functionality
  const startEditingTask = (task) => {
    setEditTaskId(task.id);
    setEditTaskInput(task.text);
    setEditDeadline(task.deadline || '');
    setEditPriority(task.priority || 'None');
  };

  const cancelEdit = () => {
    setEditTaskId(null);
    setEditTaskInput('');
    setEditDeadline('');
    setEditPriority('None');
  };

  const saveEditedTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        text: editTaskInput, 
        deadline: editDeadline, 
        priority: editPriority 
      } : task
    ));
    setEditTaskId(null);
    setEditTaskInput('');
    setEditDeadline('');
    setEditPriority('None');
  };

  //toggle completed state (the checkbox)
  const toggleCompleted = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityValue = (priority) => {
    switch (priority) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };

  const isOverdue = (deadline) => {
    return deadline && new Date(deadline) < new Date();
  };

  // Default sort by priority and then by deadline
  // const sortedTasks = [...tasks].sort((a, b) => {
  //   if (isOverdue(a.deadline) && !isOverdue(b.deadline)) return -1;
  //   if (!isOverdue(a.deadline) && isOverdue(b.deadline)) return 1;
  //   return getPriorityValue(b.priority) - getPriorityValue(a.priority);
  // });


  const sortedTasks = useMemo(() => {
    if (!sortKey) return tasks;

    return [...tasks].sort((a, b) => {
      let valA = a[sortKey] || '';
      let valB = b[sortKey] || '';

      if (sortKey === 'priority') {
        valA = getPriorityValue(valA);
        valB = getPriorityValue(valB);
      } else if (sortKey === 'deadline') {
        valA = isValidDate(valA) ? new Date(valA).getTime() : 0;
        valB = isValidDate(valB) ? new Date(valB).getTime() : 0;
      } else if (sortKey === 'text') {
        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();
      } else {
        valA = valA.toString();
        valB = valB.toString();
      }

      if (valA === valB) return 0;
      return sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [tasks, sortKey, sortAsc]);

  const sortTasks = (key) => {
    const asc = sortKey === key ? !sortAsc : true;
    setSortKey(key);
    setSortAsc(asc);
  };

  
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>To-Do</h1>
      <hr className='custom-hr' />

      {/* Input Row */}
      <div className="input-row">
        <input
          type="text"
          placeholder="Task"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          style={{ marginLeft: '10px', width: '40%' }}
        />

        <input
          type="date"
          defaultValue={deadline}
          ref={dateInputRef}
          onBlur={(e) => setDeadline(e.target.value)}
          style={{ marginLeft: '10px', width: '150px' , fontSize: (parseInt(getFontSize()) - 3) + 'px' }}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="custom-select"
          style={{ marginLeft: '10px' }}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
          <option value="None">None</option>
        </select>

        <button className="button-rectangle-small" onClick={addTask} style={{ marginLeft: '10px' }}>Add</button>
      </div>

      {/* Table Format */}
      <table style={{ width: '90%', margin: '0 auto', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '2px solid var(--text-color)', padding: '0px', width: '10px' }}></th>
            <th style={{ borderBottom: '2px solid var(--text-color)', padding: '10px', textAlign: 'left' }}>
              Task
              <button onClick={() => sortTasks('text')} className="button-rectangle-tiny" style={{ marginLeft: '5px' }}>↕</button>
            </th>
            <th style={{ borderBottom: '2px solid var(--text-color)', padding: '10px', textAlign: 'left' }}>
              Deadline
              <button onClick={() => sortTasks('deadline')} className="button-rectangle-tiny" style={{ marginLeft: '5px' }}>↕</button>
            </th>
            <th style={{ borderBottom: '2px solid var(--text-color)', padding: '10px', textAlign: 'left' }}>
              Priority
              <button onClick={() => sortTasks('priority')} className="button-rectangle-tiny" style={{ marginLeft: '5px' }}>↕</button>
            </th>
            <th style={{ borderBottom: '2px solid var(--text-color)', padding: '10px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>


        <tbody>
          {sortedTasks.map(task => (
            <tr key={task.id} style={{ borderBottom: '1px solid var(--text-color)' }}>
              {/* Checkbox column */}
              <td style={{ padding: '0 8px', textAlign: 'center', width: '40px', whiteSpace: 'nowrap' }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompleted(task.id)}
                  style={{ width: '16px', height: '16px', margin: 0 }}
                />
              </td>
              {/* Non-checkbox columns  */}
              <td style={{ 
                padding: '10px', 
                whiteSpace: 'pre-wrap', 
                wordWrap: 'break-word',
                maxWidth: '300px',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'gray' : 'inherit',
                opacity: task.completed ? 0.6 : 1,
              }}>
                {editTaskId === task.id ? (
                  <input 
                    type="text" 
                    value={editTaskInput} 
                    onChange={(e) => setEditTaskInput(e.target.value)} 
                    style={{ width: '90%' , fontSize: (parseInt(getFontSize()) - 3) + 'px' }} 
                  />
                ) : (
                  task.text
                )}
              </td>

              <td style={{ padding: '10px' }}>
                {editTaskId === task.id ? (
                  <input 
                    type="date" 
                    value={editDeadline} 
                    onChange={e => setEditDeadline(e.target.value)} 
                    style={{maxWidth: '50px', fontSize: (parseInt(getFontSize()) - 3) + 'px' }}
                  />
                ) : (
                  task.deadline || 'No deadline'
                )}
              </td>

              <td style={{ padding: '10px' }}>
                {editTaskId === task.id ? (
                  <select 
                    value={editPriority} 
                    onChange={e => setEditPriority(e.target.value)} 
                    className="custom-select"
                    style={{ width: '100px' }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="None">None</option>
                  </select>
                ) : (
                  isOverdue(task.deadline) ? 'Overdue' : task.priority
                )}
              </td>

              <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                {editTaskId === task.id ? (
                  <>
                    <button 
                      className="button-rectangle-small" 
                      onClick={() => saveEditedTask(task.id)} 
                      style={{ marginRight: '5px' }}
                    >
                      Save
                    </button>

                    <button 
                      className="button-rectangle-small" 
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="button-rectangle-small" 
                      onClick={() => startEditingTask(task)} 
                      style={{ marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="button-rectangle-small"
                      onClick={() => confirmDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup - delete confirmation */}
      {showConfirm && (
        <Popup
          message="Are you sure you want to delete this task?"
          onConfirm={handleDeleteConfirmed}
          onCancel={handleDeleteCancelled}
        />
      )}
    </div>
  );
}
