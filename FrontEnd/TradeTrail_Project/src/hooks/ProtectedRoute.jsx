
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    // Just check if token exists
    if (!token) {
        return <Navigate to="/" />;
    }

    return children;
}