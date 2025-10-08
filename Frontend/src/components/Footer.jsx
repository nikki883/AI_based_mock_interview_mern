import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/help">Help Center</Link>
      </div>
      <p>© 2025 ⚡ PrepAI. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
