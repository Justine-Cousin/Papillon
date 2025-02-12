import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import "../styles/AuthPage.css";

export default function AuthPage() {
  return (
    <div className="authpage-container">
      <h1 className="authpage-title">Bienvenue</h1>
      <div className="authpage-forms-container">
        <LoginForm />
        <SignUpForm />
      </div>
    </div>
  );
}
