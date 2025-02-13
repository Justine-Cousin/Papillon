import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import "../styles/LoginForm.css";
import "../styles/FormValidations.css";

interface FormData {
  email: string;
  password: string;
}

interface FormError {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return "L'email est requis";
    }
    if (!emailRegex.test(email)) {
      return "L'email n'est pas valide";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Le mot de passe est requis";
    }
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setError((prev: FormError) => ({
        ...prev,
        email: validateEmail(value),
      }));
    } else if (name === "password") {
      setError((prev: FormError) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("token", data.token);
      setAuth(data);
      navigate(`/parents/${data.user.id}`, { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        setError({ email: "", password: error.message });
      } else {
        setError({ email: "", password: "Erreur de connexion" });
      }
    }
  };

  return (
    <div>
      <div className="login-container">
        <h1 className="login-title">Connexion</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-container">
            <label htmlFor="email" className="login-label">
              Email <span className="login-label-asterisk">*</span>
            </label>
            <input
              className={`login-input ${error.email ? "input-error" : ""}`}
              placeholder="papillon@gmail.com"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {error.email && <p className="error-message">{error.email}</p>}
          </div>

          <div className="login-input-container">
            <label htmlFor="password" className="login-label">
              Mot de passe <span className="login-label-asterisk">*</span>
            </label>
            <input
              className={`login-input ${error.password ? "input-error" : ""}`}
              placeholder="xxxxxxx"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {error.password && (
              <p className="error-message">{error.password}</p>
            )}
          </div>
          <button type="submit" className="login-button">
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}
