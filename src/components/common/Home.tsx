import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/AuthPage";
import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";



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


function Home() {
      const location = useLocation();
      const fullEmail = location.state?.email || "Guest";
      const username = fullEmail.split("@")[0];
  return (
    <div>
        <header>
            <div className="hometitle"><span>Veuron</span></div>
            <div className="navigation-items">
                <ul>
                    <li><a className="highlighted-link" href="#home">Home</a></li>
                    <li><a href="#shop">Shop</a></li>
                    <UserMenu userName={username} userIcon="./src/assets/usericon.png" />
                </ul>
            </div>
        </header>
        <section className="landing-section">
            <div className="landing-hero">
                <h1>Welcome to Veuron</h1>
                <p>
                    Your one-stop solution for all your needs.<br />
                    Discover, shop, and manage everything in one beautiful place.
                </p>
                <a className="explore-btn" href="#shop">
                    Explore Shop
                </a>
            </div>
            <div className="features-row">
                <FeatureCard
                    icon="🛒"
                    title="Seamless Shopping"
                    desc="Browse and buy from a curated selection of products with ease."
                />
                <FeatureCard
                    icon="🔒"
                    title="Secure & Private"
                    desc="Your data and transactions are protected with industry-leading security."
                />
                <FeatureCard
                    icon="⚡"
                    title="Fast Experience"
                    desc="Lightning-fast navigation and checkout for a smooth journey."
                />
            </div>
        </section>
    </div>
  );
}

export default Home;
