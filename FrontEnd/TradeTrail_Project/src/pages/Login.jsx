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
        if (formData.email !== "" && formData.password !== "") {
            try {

                const response = await fetch("http://localhost:8080/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                   // Save JWT and user info in localStorage or preferably sessionStorage
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("loggedInUser", JSON.stringify(data.user));
                    localStorage.setItem("isLoggedIn", "true");

                    navigate("/dashboard");
                } else {
                    const errorText = await response.text();  // Get error string
                    setPopupMessage(errorText || "Invalid email or password");
                    setPopupVisible(true);
                }
            } catch (error) {              
                setPopupMessage("Something went wrong.Please try again.");
                setPopupVisible(true);
               
            }
        } else {
            setPopupMessage("Please provide valid input");
            setPopupVisible(true);
        }
    };

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