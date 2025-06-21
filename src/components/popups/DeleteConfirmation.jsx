export default function DeleteConfirmation({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button className="button-rectangle-small" onClick={onConfirm}>Yes</button>
        <button className="button-rectangle-small" onClick={onCancel} style={{ marginLeft: '10px' }}>No</button>
      </div>
    </div>
  );
}
