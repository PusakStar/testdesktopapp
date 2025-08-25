import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./AuthPage";
import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../common/Homepage_Header";
import Home_Content from "../layout/Home_Content";



type UserMenuProps = {
    userName: string;
    userIcon: string;
};

function UserMenu({ userName, userIcon }: UserMenuProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const userInfoRef = useRef<HTMLLIElement>(null);
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate("/");
    };

    return (
        <li
            className={`user-info${dropdownOpen ? " dropdown-open" : ""}`}
            ref={userInfoRef}
            onClick={() => setDropdownOpen((open) => !open)}
        >
            <img src={userIcon} alt="Logo" />
            <span>{userName}</span>
            <div className="user-dropdown">
                <ul>
                    <li><a href="#manage-profile">Manage Profile</a></li>
                    <li>
                        <a href="#logout" onClick={handleLogout}>Logout</a>
                    </li>
                </ul>
            </div>
        </li>
    );
}


type FeatureCardProps = {
    icon: string;
    title: string;
    desc: string;
};

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
    return (
        <div className="feature-card">
            <div className="feature-icon" style={{ fontSize: "2rem" }}>{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    );
}


function Homepage() {
      const location = useLocation();
      const fullEmail = location.state?.email || "Guest";
      const username = fullEmail.split("@")[0];
  return (
    <div>
       <Header/>
       <Home_Content/>
    </div>
  );
}

export default Homepage;
