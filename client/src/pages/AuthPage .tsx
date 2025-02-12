import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import "../styles/AuthPage.css";

export default function AuthPage() {
  return (
    <div>
      <h1 className="authpage-title">
        Bienvenue sur <br /> Papillon
      </h1>
      <LoginForm />
      <SignUpForm />
    </div>
  );
}
