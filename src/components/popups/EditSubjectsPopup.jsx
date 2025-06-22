export default function EditSubjectsPopup({ subjects, onDeleteSubject, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ marginTop: '0px', textAlign: 'right' }}>
          <button className="button-rectangle-small" onClick={onClose}>X</button>
        </div>
        <h3>Edit Subjects</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {subjects.map((subject, idx) => (
            <li key={idx} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{subject}</span>
              <button 
                className='button-rectangle-small' 
                onClick={() => onDeleteSubject(subject)} // Call parent's delete function
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
