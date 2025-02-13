import { useState } from "react";
import "../styles/SignUpForm.css";
import "../styles/FormValidations.css";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormError {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      return "La confirmation du mot de passe est requise";
    }
    if (confirmPassword !== formData.password) {
      return "Les mots de passe ne correspondent pas";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));

    switch (name) {
      case "email":
        setError((prev: FormError) => ({
          ...prev,
          email: validateEmail(value),
        }));
        break;
      case "password":
        setError((prev: FormError) => ({
          ...prev,
          password: validatePassword(value),
          confirmPassword: formData.confirmPassword
            ? validateConfirmPassword(formData.confirmPassword)
            : prev.confirmPassword,
        }));
        break;
      case "confirmPassword":
        setError((prev: FormError) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(value),
        }));
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de tous les champs y compris le nom
    const nameError = !formData.name ? "Le nom est requis" : "";
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.confirmPassword,
    );

    setError({
      name: nameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    // Vérifier s'il y a des erreurs
    if (nameError || emailError || passwordError || confirmPasswordError) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password_hash: formData.password,
          }),
        },
      );

      if (!response.ok) {
        if (response.status === 400) {
          const text = await response.text();
          alert(text);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert(data.message);
      // Optionnel : rediriger l'utilisateur ou vider le formulaire
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Erreur lors de la création du compte:", error);
      alert("Une erreur est survenue, veuillez réessayer");
    }
  };

  return (
    <div>
      <div className="signup-container">
        <h1 className="signup-title">Créez votre compte</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-input-container">
            <label htmlFor="name" className="signup-label">
              Nom <span className="signup-label-asterisk">*</span>
            </label>
            <input
              className={`signup-input ${error.name ? "input-error" : ""}`}
              placeholder="Papillon"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="email" className="signup-label">
              Email <span className="signup-label-asterisk">*</span>
            </label>
            <input
              className={`signup-input ${error.email ? "input-error" : ""}`}
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
          <div className="signup-input-container">
            <label htmlFor="password" className="signup-label">
              Mot de passe <span className="signup-label-asterisk">*</span>
            </label>
            <input
              className={`signup-input ${error.password ? "input-error" : ""}`}
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
          <div className="signup-input-container">
            <label htmlFor="password" className="signup-label">
              Confirmez votre mot de passe{" "}
              <span className="signup-label-asterisk">*</span>
            </label>
            <input
              className={`signup-input ${error.confirmPassword ? "input-error" : ""}`}
              placeholder="xxxxxxx"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {error.confirmPassword && (
              <p className="error-message">{error.confirmPassword}</p>
            )}
          </div>
          <button type="submit" className="signup-button">
            Inscription
          </button>
        </form>
      </div>
    </div>
  );
}
