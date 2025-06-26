import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import EditSubjectsPopup from './popups/EditSubjectsPopup';
import Popup from './popups/DeleteConfirmation'; 

export default function Grades() {
  const getFontSize = () => getComputedStyle(document.documentElement).getPropertyValue('--font-size') || '10px';

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('grades_subjects');
    return saved ? JSON.parse(saved) : ['Math', 'Science'];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('grades_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedSubject, setSelectedSubject] = useState(() => {
    return localStorage.getItem('grades_selectedSubject') || 'All';
  });

  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editTaskData, setEditTaskData] = useState({
    name: '',
    subject: '',
    type: 'Exam',
    grade: '',
    weight: '',
  });
  const [newSubject, setNewSubject] = useState('');
  const [newTask, setNewTask] = useState({
    name: '',
    subject: '',
    type: 'Exam',
    grade: '',
    weight: '',
  });

  const [showEditSubjects, setShowEditSubjects] = useState(false);
  const [showDeleteSubjectConfirm, setShowDeleteSubjectConfirm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState(false);
  const [taskToDeleteIndex, setTaskToDeleteIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('grades_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('grades_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('grades_selectedSubject', selectedSubject);
  }, [selectedSubject]);


  const handleAddSubject = () => {
  if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
    setSubjects([...subjects, newSubject.trim()]);
    setNewSubject('');
  }
    };

  const handleAddOrUpdateTask = () => {
    const gradeValue = parseFloat(newTask.grade);
    const weightValue = parseFloat(newTask.weight);

    if (
        !newTask.name.trim() ||
        !newTask.subject.trim() ||
        isNaN(gradeValue) ||
        isNaN(weightValue)
    ) {
        alert('Please fill all fields with valid values.');
        return;
    }

    const weightedMark = (gradeValue * weightValue) / 100;

    if (editingTaskIndex !== null) {
        // update existing task
        const updatedTasks = [...tasks];
        updatedTasks[editingTaskIndex] = {
        ...updatedTasks[editingTaskIndex],
        name: newTask.name,
        subject: newTask.subject,
        type: newTask.type,
        gradeValue,
        weight: weightValue,
        weightedMark,
        };
        setTasks(updatedTasks);
        setEditingTaskIndex(null);
    } else {
        // add new task
        setTasks([...tasks, { 
        name: newTask.name,
        subject: newTask.subject,
        type: newTask.type,
        gradeValue,
        weight: weightValue,
        weightedMark,
        }]);
    }

    setNewTask({ name: '', subject: '', type: 'Exam', grade: '', weight: '' });

    // If new subject added
    if (!subjects.includes(newTask.subject)) {
        setSubjects([...subjects, newTask.subject]);
    }
  };


  const confirmDeleteSubject = (subject) => {
    setSubjectToDelete(subject);
    setShowDeleteSubjectConfirm(true);
  };

  const handleDeleteSubjectConfirmed = () => {
    setSubjects(subjects.filter(subj => subj !== subjectToDelete));
    setTasks(tasks.filter(task => task.subject !== subjectToDelete));
    setShowDeleteSubjectConfirm(false);
    setSubjectToDelete(null);
  };

  const handleDeleteSubjectCancelled = () => {
    setShowDeleteSubjectConfirm(false);
    setSubjectToDelete(null);
  };

  const handleDeleteTaskConfirmed = () => {
    setTasks(tasks.filter((_, i) => i !== taskToDeleteIndex));
    setShowDeleteTaskConfirm(false);
    setTaskToDeleteIndex(null);
    if (editingTaskIndex === taskToDeleteIndex) {
      setEditingTaskIndex(null);
      setEditTaskData({
        name: '',
        subject: '',
        type: 'Exam',
        grade: '',
        weight: '',
      });
    }
  };

  const handleDeleteTaskCancelled = () => {
    setShowDeleteTaskConfirm(false);
    setTaskToDeleteIndex(null);
  };

  const confirmDeleteTask = (filteredIndex) => {
    const filteredTask = filteredTasks[filteredIndex];
    const realIndex = tasks.findIndex(t => t === filteredTask);
    if (realIndex === -1) return; // safety

    setTaskToDeleteIndex(realIndex);
    setShowDeleteTaskConfirm(true);
  };

  const filteredTasks = selectedSubject === 'All'
    ? tasks
    : tasks.filter(task => task.subject === selectedSubject);

  const startEditingTask = (filteredIndex) => {
    const filteredTask = filteredTasks[filteredIndex];
    const realIndex = tasks.findIndex(t => t === filteredTask);
    if (realIndex === -1) return; // safety

    setEditingTaskIndex(realIndex);
    setEditTaskData({
        name: filteredTask.name,
        subject: filteredTask.subject,
        type: filteredTask.type,
        grade: filteredTask.gradeValue.toString(),
        weight: filteredTask.weight.toString(),
    });
  };

  const cancelEditing = () => {
    setEditingTaskIndex(null);
    setEditTaskData({
      name: '',
      subject: '',
      type: 'Exam',
      grade: '',
      weight: '',
    });
  };

  const saveEditedTask = (index) => {
    const gradeValue = parseFloat(editTaskData.grade);
    const weightValue = parseFloat(editTaskData.weight);
    if (
      !editTaskData.name.trim() ||
      !editTaskData.subject.trim() ||
      isNaN(gradeValue) ||
      isNaN(weightValue)
    ) {
      alert('Please fill all fields with valid values.');
      return;
    }

    const weightedMark = (gradeValue * weightValue) / 100;

    let realIndex;
    if (selectedSubject === 'All') {
      realIndex = index;
    } else {
      const taskInFiltered = filteredTasks[index];
      realIndex = tasks.findIndex(t => t === taskInFiltered);
    }

    const updatedTasks = [...tasks];
    updatedTasks[realIndex] = {
      ...updatedTasks[realIndex],
      name: editTaskData.name,
      subject: editTaskData.subject,
      type: editTaskData.type,
      gradeValue,
      weight: weightValue,
      weightedMark,
    };

    setTasks(updatedTasks);
    setEditingTaskIndex(null);
    setEditTaskData({
      name: '',
      subject: '',
      type: 'Exam',
      grade: '',
      weight: '',
    });

    // If new subject added during edit
    if (!subjects.includes(editTaskData.subject)) {
      setSubjects([...subjects, editTaskData.subject]);
    }
  };

  const calculateWeightedTotal = () => {
    const total = filteredTasks.reduce((sum, t) => {
      const weightedMark = t.weightedMark !== undefined
        ? t.weightedMark
        : (t.gradeValue * t.weight) / 100;
      return sum + weightedMark;
    }, 0);
    return total.toFixed(2);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return; 

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (selectedSubject === 'All') {
      const newTasks = Array.from(tasks);
      const [removed] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(destinationIndex, 0, removed);
      setTasks(newTasks);
    } else {
      const filteredIndices = filteredTasks.map(task => tasks.indexOf(task));

      const newTasks = [...tasks];

      const [removedIndex] = filteredIndices.splice(sourceIndex, 1);
      filteredIndices.splice(destinationIndex, 0, removedIndex);

      filteredIndices.forEach((taskIndex, i) => {
        newTasks[taskIndex] = filteredTasks[i === sourceIndex ? sourceIndex : i];
      });

      return;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Grades</h1>
      <hr className='custom-hr' />

      {/* Add Subject */}
      <div className="input-row">
        <input
          type="text"
          placeholder="New Subject"
          value={newSubject}
          onChange={e => setNewSubject(e.target.value)}
          style={{ maxWidth: '15vw'}}
        />
        <button className='button-rectangle-small' onClick={handleAddSubject}>Add Subject</button>
        <button className='button-rectangle-small' onClick={() => setShowEditSubjects(true)}>Edit Subjects</button>
      </div>

      {/* Add Task */}
      <div className="input-row">
        <input type="text" placeholder="Task Name" value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} style={{ maxWidth: '20vw'}} />
        <select value={newTask.subject} onChange={e => setNewTask({ ...newTask, subject: e.target.value })} className="custom-select">
          <option value="">Select Subject</option>
          {subjects.map((subj, idx) => <option key={idx} value={subj}>{subj}</option>)}
        </select>
        <select value={newTask.type} onChange={e => setNewTask({ ...newTask, type: e.target.value })} className="custom-select">
          <option>Exam</option>
          <option>Assignment</option>
          <option>Quiz</option>
          <option>Weekly Task</option>
          <option>Other</option>
        </select>
        <input type="text" placeholder="Grade %" value={newTask.grade} onChange={e => setNewTask({ ...newTask, grade: e.target.value })} style={{ width: '80px' }} />
        <input type="number" placeholder="Weight %" value={newTask.weight} onChange={e => setNewTask({ ...newTask, weight: e.target.value })} style={{ width: '80px' }} />
        <button className='button-rectangle-small' onClick={handleAddOrUpdateTask}>{'Add Grade'}</button>
      </div>

      {/* Filter by Subject */}
      <div style={{ width: '90%', margin: '0 auto', textAlign: 'left', paddingTop: '10px' }}>
      <select 
        onChange={e => setSelectedSubject(e.target.value)} 
        value={selectedSubject} 
        className="custom-select"
      >
        <option value="All">All Subjects</option>
        {subjects.map((subj, index) => <option key={index} value={subj}>{subj}</option>)}
      </select>
      </div>


      {/* Table */}
      <DragDropContext onDragEnd={onDragEnd}>
        <table style={{ width: '90%', margin: '0 auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid var(--text-color)' }}>Task Name</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid var(--text-color)' }}>Subject</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid var(--text-color)' }}>Type</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid var(--text-color)' }}>Grade (%)</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid var(--text-color)' }}>Weight (%)</th>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid var(--text-color)' }}>Actions</th>
            </tr>
          </thead>

          <Droppable droppableId="tasks-droppable" direction="vertical" >
            {(provided) => (
              <tbody
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {filteredTasks.map((task, idx) => {
                  const isEditing = editingTaskIndex === idx;

                  return (
                    <Draggable key={task.name + idx} draggableId={task.name + idx} index={idx}>
                      {(providedDrag) => (
                        <tr
                          ref={providedDrag.innerRef}
                          {...providedDrag.draggableProps}
                          {...providedDrag.dragHandleProps}
                          style={{
                            ...providedDrag.draggableProps.style,
                            borderBottom: '1px solid var(--text-color)',
                            background: 'transparent', 
                          }}
                        >
                          <td style={{ padding: '10px', maxWidth: '30vw' }}>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editTaskData.name}
                                onChange={e => setEditTaskData({ ...editTaskData, name: e.target.value })}
                                style={{ width: '100%' }}
                              />
                            ) : (
                              task.name
                            )}
                          </td>
                          <td style={{ padding: '10px' }}>
                            {isEditing ? (
                              <select
                                value={editTaskData.subject}
                                onChange={e => setEditTaskData({ ...editTaskData, subject: e.target.value })}
                                className="custom-select"
                                style={{ width: '120px' }}
                              >
                                {subjects.map((subj, i) => (
                                  <option key={i} value={subj}>{subj}</option>
                                ))}
                                <option value={editTaskData.subject}>{editTaskData.subject}</option>
                              </select>
                            ) : (
                              task.subject
                            )}
                          </td>
                          <td style={{ padding: '10px' }}>
                            {isEditing ? (
                              <select
                                value={editTaskData.type}
                                onChange={e => setEditTaskData({ ...editTaskData, type: e.target.value })}
                                className="custom-select"
                                style={{ width: '100px' }}
                              >
                                <option>Exam</option>
                                <option>Assignment</option>
                                <option>Quiz</option>
                              </select>
                            ) : (
                              task.type
                            )}
                          </td>
                          <td style={{ padding: '10px' }}>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editTaskData.grade}
                                onChange={e => setEditTaskData({ ...editTaskData, grade: e.target.value })}
                                style={{ width: '80px' }}
                                min="0"
                                max="100"
                                step="0.01"
                              />
                            ) : (
                              task.gradeValue.toFixed(2)
                            )}
                          </td>
                          <td style={{ padding: '10px' }}>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editTaskData.weight}
                                onChange={e => setEditTaskData({ ...editTaskData, weight: e.target.value })}
                                style={{ width: '80px' }}
                                min="0"
                                max="100"
                                step="0.01"
                              />
                            ) : (
                              task.weight
                            )}
                          </td>
                          <td style={{ padding: '10px' }}>
                            {isEditing ? (
                              <>
                                <button
                                  className="button-rectangle-small"
                                  onClick={() => saveEditedTask(idx)}
                                  style={{ marginRight: '5px', marginBottom: '5px' }}
                                >
                                  Save
                                </button>
                                <button
                                  className="button-rectangle-small"
                                  onClick={cancelEditing}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="button-rectangle-small"
                                  onClick={() => startEditingTask(idx)}
                                  style={{ marginRight: '5px'  , marginBottom: '5px' }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="button-rectangle-small"
                                  onClick={() => confirmDeleteTask(idx)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </DragDropContext>

      {selectedSubject !== 'All' && (
        <h3 style={{ textAlign: 'right' }}>Weighted Total: {calculateWeightedTotal()}%</h3>
      )}

      {/* Popups */}
      {showEditSubjects && (
        <EditSubjectsPopup subjects={subjects} onDeleteSubject={confirmDeleteSubject} onClose={() => setShowEditSubjects(false)} />
      )}

      {showDeleteSubjectConfirm && (
        <Popup
          message={`Are you sure you want to delete the subject "${subjectToDelete}"? This will remove all related grades.`}
          onConfirm={handleDeleteSubjectConfirmed}
          onCancel={handleDeleteSubjectCancelled}
        />
      )}

      {showDeleteTaskConfirm && (
        <Popup
          message={`Are you sure you want to delete this grade?`}
          onConfirm={handleDeleteTaskConfirmed}
          onCancel={handleDeleteTaskCancelled}
        />
      )}
    </div>
  );
}
