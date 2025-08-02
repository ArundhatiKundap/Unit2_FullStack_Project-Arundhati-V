
import '../styles/header.css';
import TradeTrai_logo from '../assets/WebLogo.svg';
import { useNavigate,Link } from "react-router-dom";


export default function Header() {

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const navigate = useNavigate();
  
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
                        <i className="fa fa-fw fa-info-circle"></i> About
                    </Link>
                    <Link to="/contact">
                        <i className="fa fa-fw fa-envelope"></i> Contact
                    </Link>
                    <Link to="/login">
                        <i className="fa fa-fw fa-user"></i> Login
                    </Link>
                </div>
            ) : (
                <div className="navbar-home">
                   
                    <button onClick={() => {
                        localStorage.removeItem("isLoggedIn");
                        localStorage.removeItem("loggedInUser");
                        navigate("/login");
                    }}>
                        <i className="fa fa-fw fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            )}
        </header>
    );
} 