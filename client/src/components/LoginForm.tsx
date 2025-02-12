import "../styles/LoginForm.css";

export default function LoginForm() {
  return (
    <div>
      <div className="login-container">
        <h1 className="login-title">Connexion</h1>
        <form className="login-form">
          <div className="login-input-container">
            <label htmlFor="email" className="login-label">
              Email <span className="login-label-asterisk">*</span>
            </label>
            <input
              className="login-input"
              placeholder="papillon@gmail.com"
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className="login-input-container">
            <label htmlFor="password" className="login-label">
              Mot de passe <span className="login-label-asterisk">*</span>
            </label>
            <input
              className="login-input"
              placeholder="xxxxxxx"
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
          <button type="button">Connexion</button>
        </form>
      </div>
    </div>
  );
}
