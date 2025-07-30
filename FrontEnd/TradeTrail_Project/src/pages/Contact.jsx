import React, { useState } from "react";
import "../styles/contact.css";
import PopupWindow from '../components/PopupWindow';

       
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     const newErrors = validateForm(formData);
     setErrors(newErrors);
     if (Object.keys(newErrors).length === 0 ) {
        setPopupMessage("Form submitted:", formData);
        setPopupVisible(true); 
     }else {
            setPopupMessage("Please fill in all fields.");
            setPopupVisible(true); 
            return;
        }
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
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

        if (!data.message.trim()){
            errors.message ="Add Some Message"
        }else if(data.message.length < 4){
            errors.message ="Add message at least 4 characters long"
        }

        return errors;
    };
    

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <div className="contact-content">
        <form onSubmit={handleSubmit} className="contact-form">
          {submitted && <p className="success-message">Thank you! We'll get back to you soon.</p>}
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
            <strong>Message</strong>
            <textarea
                            
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required rows="4"
                            maxLength={200}
                        />
                     {errors.message && (
                        <span className="error-message">
                            {errors.message}
                        </span>
                       )}
          </label>
          <button type="submit">Send</button>
          <PopupWindow
                            show={popupVisible}
                            message={popupMessage}
                            onClose={() => setPopupVisible(false)}
                        />
        </form>

        <div className="contact-info">
          <p><i className="fas fa-map-marker-alt"></i> <strong>Office Address:</strong> 123 Main Street, Manhatten, New York, USA</p>
          <p><i className="fas fa-phone"></i> <strong>Phone:</strong> +1 666-543-2120</p>
          <p><i className="fas fa-envelope"></i> <strong>Email:</strong> contact@Tradetrail.com</p>
          <p><i className="fas fa-globe"></i> <strong>Follow Us:</strong></p>
          <ul className="social-links">
            <li><a href="https://linkedin.com" target="_blank" rel="noreferrer"><i className="fab fa-linkedin"></i> LinkedIn</a></li>
            <li><a href="https://x.com/" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i> Twitter</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

   