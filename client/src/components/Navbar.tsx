import { Home, LogIn, UserRound, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/" className="navbar-home">
          <Home className="navbar-icon" />
          Accueil
        </Link>
        <Link
          to="/children"
          className={`navbar-link ${location.pathname === "/espace-enfants" ? "active" : ""}`}
        >
          <UserRound className="navbar-icon" />
          Espace enfants
        </Link>
        <Link
          to="/parents"
          className={`navbar-link ${location.pathname === "/espace-parents" ? "active" : ""}`}
        >
          <Users className="navbar-icon" />
          Espace parents
        </Link>
        <Link to="/auth" className="nav-auth-button">
          <LogIn className="navbar-icon" />
          connexion
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
