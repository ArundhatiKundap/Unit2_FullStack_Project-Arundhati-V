import React, { useState } from "react";
import '../styles/login.css';

import { useNavigate } from "react-router-dom";
import PopupWindow from '../components/PopupWindow';

export default function Signup() {
  
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        instruments: ["stock"] // only stock selected
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setErrors({});
    };


    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            confirmpassword: "",
            instruments: ["stock"]
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
         const newErrors = validateForm(formData);
        setErrors(newErrors);

        const userInfo = JSON.parse(localStorage.getItem("users") || "[]");
        const emailExists = userInfo.some(user => user.email === formData.email);
        if (emailExists) {
            setPopupMessage("Email already registered. Please use a different email.");
            setPopupVisible(true); 
            return;
        }

        if (Object.keys(newErrors).length === 0 ) {
            const newUser = {
               name: formData.name,
               email: formData.email,
               password: formData.password,
               instruments: formData.instruments
             };

            userInfo.push(newUser);

            localStorage.setItem("users", JSON.stringify(userInfo));
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("loggedInUser", JSON.stringify(newUser));
            setPopupMessage("Account created successfully!");
            setPopupVisible(true); 
            resetForm();
            
           
            navigate("/dashboard");
            
        } else {
            setPopupMessage("Something is Wrong..check all fields");
            setPopupVisible(true); 
            return;
        }
    };
    const validateForm = (data) => {
        const errors = {};

        if (!data.name.trim()) {
            errors.name = 'Name is required';
        } else if (data.name.length < 4) {
            errors.name = 'Name must be at least 4 characters long';
        }

        if (!data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email is invalid';
        }
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!data.password) {
            errors.password = 'Password is required';
        } else if (data.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }else if(!passwordRegex.test(data.password)){
            errors.password = 'Password include at least one special character and one number.'
        }

        if (data.confirmPassword !== data.password) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };
    


    return (
        <div className="page-wrapper">
           
                <form className="form-container" onSubmit={handleSubmit}>
                    <h1>Registration</h1>

                    <label>
                        <strong>Name</strong>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            maxLength={30}
                        />
                        {errors.name && (
                        <span className="error-message">
                            {errors.name}
                        </span>
                        )}
                    </label>

                    <label><strong>Select Instrument</strong></label>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" value="stock" checked readOnly />
                            Stock
                        </label>
                    </div>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" value="crypto" disabled />
                            Crypto
                        </label>
                    </div>

                    <label>
                        <strong>Email</strong>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            maxLength={30}
                        />
                        {errors.email && (
                        <span className="error-message">
                            {errors.email}
                        </span>
                       )}
                    </label>

                    <label>
                        <strong>Password</strong>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            minlength={8}
                            maxLength={30}
                        />
                        {errors.password && (
                        <span className="error-message">
                            {errors.password}
                        </span>
                        )}
                    </label>

                    <label>
                        <strong>Confirm Password</strong>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            maxLength={30}
                        />
                        {errors.confirmPassword && (
                        <span className="error-message">
                            {errors.confirmPassword}
                        </span>
                    )}
                    </label>

                    <button type="submit" className="btn-submit">Register</button>
                    <PopupWindow
                            show={popupVisible}
                            message={popupMessage}
                            onClose={() => setPopupVisible(false)}
                        />
                    <button type="button" className="btn-cancel" onClick={() => {
                        resetForm();
                         navigate("/");
                    }}>Cancel</button>
                </form>
           
        </div>
    );
}
