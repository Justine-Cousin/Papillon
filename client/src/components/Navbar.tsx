import { Handshake, Home, LogOut, UserRound, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth() as {
    auth: { user: { id: string } } | null;
    setAuth: (auth: { user: { id: string } } | null) => void;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {/* Le lien Home est toujours visible */}
        <Link to="/" className="navbar-home">
          <Home className="navbar-icon" />
        </Link>

        {auth ? (
          // Liens visibles uniquement quand l'utilisateur est connecté
          <>
            <Link
              to="/children"
              className={`navbar-link ${location.pathname === "/children" ? "active" : ""}`}
            >
              <UserRound className="navbar-icon" />
            </Link>
            <Link
              to={`/parents/${auth.user.id}`}
              className={`navbar-link ${location.pathname.startsWith("/parents/") ? "active" : ""}`}
            >
              <Users className="navbar-icon" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="nav-auth-button"
            >
              <LogOut className="navbar-icon" />
            </button>
          </>
        ) : (
          // Uniquement le bouton de connexion quand l'utilisateur n'est pas connecté
          <Link to="/auth" className="nav-auth-button">
            <Handshake className="navbar-icon" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
