
import '../styles/header.css';
import TradeTrai_logo from '../assets/WebLogo.svg';
import { Link, useNavigate } from "react-router-dom";



export default function Header() {

    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUser");
        navigate("/");
        window.location.reload(); // refresh to re-trigger protected routes, etc.
    };
    return (
        <header className="header">
            <div className="logo-container">
                <img src={TradeTrai_logo} alt="TradeTrai logo" className="logo" />
                <h1 className="title">Trade Trail</h1>
            </div>
            {!isLoggedIn ? (
                <div className="navbar-home">
                    <Link to="/">
                        <i className="fa fa-fw fa-home"></i> Home
                    </Link>
                    <Link to="/about">
                        <i className="fa fa-fw fa-about"></i> About
                    </Link>
                    <Link to="/contact">
                        <i className="fa fa-fw fa-envelope"></i> Contact
                    </Link>
                    <Link to="/login">
                        <i className="fa fa-fw fa-user"></i> Login
                    </Link>
                </div>
            ) :(
            <div className="navbar-login">
                   <button className="menu-icon">☰</button>
                     <div className="dropdown">
                       <Link to="/account">Account</Link>
                       <button onClick={handleLogout}>Logout</button>
                    </div>  
            </div>
            )}
        </header>
    );
} 