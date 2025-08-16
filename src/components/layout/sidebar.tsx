import dreamicon from "../../assets/dreamicon.png";
import LanguageIcon from "../../assets/language.png";
import CustomerSupportIcon from "../../assets/cp.png";

export default function loginsidebar() {
  return (
    <div className="sidebar">
        <div className="dream-icon__wrapper">
            <div className="circle-dreamicon">
                <img src={dreamicon} alt="dreamicon" />
            </div>
            <h2>Dream</h2>
        </div>
        <ul className="sidebar-item">
          <li>
            <img src={LanguageIcon} alt="LanguageIcon" />
            <a href="#Language">English (US)</a>
          </li>
          <li>
            <img src={CustomerSupportIcon} alt="CustomerSupportIcon" />
            <a href="#CS">Customer Support</a>
          </li>
        </ul>
    </div>
  );
}