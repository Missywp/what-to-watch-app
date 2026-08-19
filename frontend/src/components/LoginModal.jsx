import { useState } from "react";
import { X, Lock } from "lucide-react";
import { api } from "../services/api";
import styles from "./LoginModal.module.css";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const data = await api.login(email, senha);
      localStorage.setItem("@whattowatch:token", data.token);
      onLoginSuccess(data.email);
      onClose();
    } catch (err) {
      setErro(err.message || "informações inválidas");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h2 className={styles.title}>Acesso de administrador</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {erro && <div className={styles.error}>{erro}</div>}

          <div className={styles.field}>
            <label className={styles.label}>E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@whattowatch.com"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={styles.submitBtn}
          >
            {carregando ? "Entrando..." : "Acessar"}
          </button>
        </form>
      </div>
    </div>
  );
}
