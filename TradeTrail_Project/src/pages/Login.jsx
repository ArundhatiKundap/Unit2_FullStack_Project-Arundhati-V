import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import '../styles/login.css';
import PopupWindow from '../components/PopupWindow';

export default function Login() {

    const navigate = useNavigate();
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    
    const [formData, setFormData] = useState({    
        email: "",
        password: ""
    });
    const resetForm = () => {
        setFormData({
            email: "",
            password:""
        });
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInfo = JSON.parse(localStorage.getItem("users") || "[]");
        if (formData.email !== "" && formData.password !== "") {
            const findUser = userInfo.find(
                (user) =>
                    user.email === formData.email &&
                    user.password === formData.password
            );

            if (findUser) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("loggedInUser", JSON.stringify(findUser));
                navigate("/dashboard");
            } else {
                setPopupMessage("Invalid email or password");
                setPopupVisible(true); 
            }
        }
        else {
            setPopupMessage("please provide a valid input");
            setPopupVisible(true); 
        }
    }

    return (    
        <div className="page-wrapper">
            
                <form className="form-container" onSubmit={handleSubmit}>
                    <h1>Login</h1>

                    <label>
                        <strong>Email:</strong>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInput}
                            maxLength={30}
                        />
                    </label>
                    <label>
                        <strong>Password:</strong>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInput}
                            maxLength={30}
                        />
                    </label>
                    <div className="button-group">
                        <button type="submit" className="btn-submit">Login</button>
                        <PopupWindow
                            show={popupVisible}
                            message={popupMessage}
                            onClose={() => setPopupVisible(false)}
                        />
                        <button type="button" className="btn-cancel" onClick={() => {
                            resetForm();
                            navigate("/");
                        }}>Cancel</button>
                        <p>
                            Don't have an account? <Link to="/register">Register here</Link>
                        </p>
                    </div>
                </form>
            
        </div>
     
    );
}