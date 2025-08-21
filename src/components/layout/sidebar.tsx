import dreamicon from "../../assets/dreamicon.png";
import LanguageIcon from "../../assets/language.png";
import CustomerSupportIcon from "../../assets/cp.png";
import backButton from "../../assets/left-arrow.png";

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>
      <div>
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
            <img src={CustomerSupportIcon} alt="SupportIcon" />
            <a href="#Support">Support</a>
          </li>
        </ul>
        </div>
        <div className="sidebar-header">
        <button className="close-btn" onClick={() => setOpen(false)}>
          <img src={backButton} alt="Close" />
        </button>
      </div>
      </div>

      
    </>
  );
}
