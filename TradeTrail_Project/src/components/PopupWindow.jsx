import '../styles/popupwindow.css'; 

export default function PopupWindow({ message, show, onClose }) {
    if (!show) return null;

    return (
        <div className="popup-backdrop">
            <div className="popup-box">
                <p>{message}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}