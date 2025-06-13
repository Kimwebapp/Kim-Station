import { useState } from "react";

export default function Login() {
  const [showResetModal, setShowResetModal] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [resetPasswordMsg, setResetPasswordMsg] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Qui puoi mettere la tua logica di login
    console.log("Login con", email, password);
    setLoginError(""); // oppure mostra un messaggio di errore se necessario
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    const email = e.target.resetEmail.value;
    const newPassword = e.target.resetNewPassword.value;
    const confirmPassword = e.target.resetConfirmPassword.value;

    if (newPassword !== confirmPassword) {
      setResetPasswordMsg("Le password non coincidono.");
      return;
    }

    // Qui puoi mettere la tua logica di reset password
    console.log("Reset password per", email, newPassword);
    setResetPasswordMsg("Password reset completata.");
  };

  return (
    <>
      <div className="login-bg">
        <div className="login-card">
          <form id="loginForm" onSubmit={handleLoginSubmit}>
            <div className="login-logo">
              <img src="Logo/logo.png" alt="kim" />
            </div>
            <h2 className="login-title">Accedi al tuo account</h2>
            <input type="email" id="email" name="email" placeholder="Email" required />
            <input type="password" id="password" name="password" placeholder="Password" required />
            <button type="button" className="forgot-password" id="showResetPassword" onClick={openResetModal} style={{background:'none',border:'none',padding:0,cursor:'pointer'}}>Password dimenticata?</button>
            <button type="submit" className="login-btn">Accedi</button>
            <div id="loginError" style={{ color: 'red', marginTop: '10px' }}>{loginError}</div>
          </form>
        </div>
      </div>

      {/* MODALE RESET PASSWORD */}
      {showResetModal && (
        <div
          style={{
            display: 'flex',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1000,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '32px 24px',
              borderRadius: '8px',
              maxWidth: '350px',
              margin: '80px auto',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowResetModal(false)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '12px',
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
            <h2 style={{ marginBottom: '16px' }}>Reset password</h2>
            <form id="resetPasswordForm" onSubmit={handleResetPasswordSubmit}>
              <input
                type="email"
                id="resetEmail"
                name="resetEmail"
                placeholder="Email"
                required
                style={{ marginBottom: '10px', width: '100%' }}
              />
              <input
                type="password"
                id="resetNewPassword"
                name="resetNewPassword"
                placeholder="Nuova password"
                required
                style={{ marginBottom: '10px', width: '100%' }}
              />
              <input
                type="password"
                id="resetConfirmPassword"
                name="resetConfirmPassword"
                placeholder="Conferma nuova password"
                required
                style={{ marginBottom: '10px', width: '100%' }}
              />
              <button type="submit" className="login-btn" style={{ width: '100%' }}>
                Reset password
              </button>
              <div id="resetPasswordMsg" style={{ marginTop: '10px', color: 'red' }}>
                {resetPasswordMsg}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
