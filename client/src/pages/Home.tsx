import { Link } from "react-router-dom";
import logo from "../assets/images/logo_papillon.png";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <div className="content-wrapper">
        <div className="title-wrapper">
          <h1 className="home-title">Papillon</h1>
          <img className="home-logo" src={logo} alt="logo papillon" />
        </div>
        <p className="home-text">
          Papillon, l'application qui accompagne votre enfant dans sa
          croissance. Des routines ludiques et des moments de partage pour
          grandir en douceur, en famille.
        </p>
        <div className="home-button-container">
          <Link className="home-connect-link" to="/Auth">
            Connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
