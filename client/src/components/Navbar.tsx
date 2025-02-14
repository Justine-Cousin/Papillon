import { Handshake, Home, LogOut, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import "../styles/Navbar.css";
import ChildSelector from "../components/ChildSelector";

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
        <Link to="/" className="navbar-home">
          <Home className="navbar-icon" />
        </Link>

        {auth ? (
          <>
            <ChildSelector
              isActive={location.pathname.startsWith("/children/")}
              userId={auth.user.id}
            />
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
          <Link to="/auth" className="nav-auth-button">
            <Handshake className="navbar-icon" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
