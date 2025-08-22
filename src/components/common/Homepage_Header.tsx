import DreamIcon from "../../assets/dreamicon.png";
function Homepage_Header() {
    return (
        <header>
            <div className="header__wrapper">
                <div className="header_title"><img src={DreamIcon} alt="" /><h3>Dream</h3></div>
                <div className="header_nav">
                    <ul className="header_nav_items">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#shop">Shop</a></li>
                        <li><a href="#about">About</a></li> 
                    </ul>
                </div>
                <div className="header_profile">
                    <button>Profile Section</button>
                </div>
            </div>
        </header>
   );
}





export default Homepage_Header;