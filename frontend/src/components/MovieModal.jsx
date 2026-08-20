import { useState, useEffect } from "react";
import {
  X,
  PlusCircle,
  Edit3,
  Trash2,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "../services/api";
import styles from "./MovieModal.module.css";

export default function MovieModal({
  isOpen,
  onClose,
  onSalvo,
  itemParaEditar,
}) {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("filme");
  const [generos, setGeneros] = useState("terror, suspense");
  const [sinopse, setSinopse] = useState("");
  const [nota, setNota] = useState(7.5);
  const [ano, setAno] = useState(2024);
  const [posterUrl, setPosterUrl] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (itemParaEditar) {
      setTitulo(itemParaEditar.titulo || "");
      setTipo(itemParaEditar.tipo || "filme");

      if (Array.isArray(itemParaEditar.generos)) {
        setGeneros(itemParaEditar.generos.join(", "));
      } else if (typeof itemParaEditar.generos === "string") {
        try {
          const parsed = JSON.parse(itemParaEditar.generos);
          setGeneros(
            Array.isArray(parsed) ? parsed.join(", ") : itemParaEditar.generos,
          );
        } catch {
          setGeneros(itemParaEditar.generos);
        }
      } else {
        setGeneros("");
      }

      setSinopse(itemParaEditar.sinopse || "");
      setNota(itemParaEditar.nota || 7.5);
      setAno(itemParaEditar.ano || 2024);
      setPosterUrl(itemParaEditar.posterUrl || "");
    } else {
      setTitulo("");
      setTipo("filme");
      setGeneros("terror, suspense");
      setSinopse("");
      setNota(7.5);
      setAno(2024);
      setPosterUrl("");
    }
  }, [itemParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const payload = {
        titulo,
        tipo,
        generos,
        sinopse,
        nota,
        ano,
        posterUrl: posterUrl.trim(),
      };

      if (itemParaEditar) {
        await api.atualizarTitulo(itemParaEditar.id, payload);
      } else {
        await api.criarTitulo(payload);
      }

      onSalvo();
      onClose();
    } catch (err) {
      alert(err.message || "Erro ao salvar título");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {itemParaEditar ? (
              <Edit3 size={18} color="#640017" />
            ) : (
              <PlusCircle size={18} color="#640017" />
            )}
            <h2 className={styles.title}>
              {itemParaEditar ? "Editar Título" : "Cadastrar Novo Título"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              background: "none",
              border: "none",
              color: "#9e9e80",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Título do Filme/Série</label>
            <input
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Stranger Things"
              className={styles.input}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className={styles.select}
              >
                <option value="filme">Filme</option>
                <option value="serie">Série</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Ano de Lançamento</label>
              <input
                type="number"
                required
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Minha Avaliação</label>
              <input
                type="number"
                step="0.1"
                max="10"
                min="0"
                required
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Gêneros (separados por vírgula)
              </label>
              <input
                value={generos}
                onChange={(e) => setGeneros(e.target.value)}
                placeholder="acao, terror, comedia"
                className={styles.input}
              />
            </div>
          </div>

          {/* Campo de URL com prévia visual */}
          <div className={styles.field}>
            <label className={styles.label}>
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <LinkIcon size={14} /> URL da Imagem / Pôster
              </span>
            </label>
            <input
              type="url"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className={styles.input}
            />

            {posterUrl.trim() && (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "fit-content",
                  margin: "0.75rem auto 0 auto",
                }}
              >
                <img
                  src={posterUrl.trim()}
                  alt="Prévia do pôster"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";
                  }}
                  style={{
                    maxHeight: "140px",
                    borderRadius: "0.5rem",
                    objectFit: "cover",
                    display: "block",
                    border: "1px solid #4a2d2b",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setPosterUrl("")}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    backgroundColor: "rgba(100, 0, 23, 0.95)",
                    color: "#EFEFC9",
                    border: "none",
                    borderRadius: "50%",
                    width: "26px",
                    height: "26px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title="Limpar URL"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Sinopse</label>
            <textarea
              required
              value={sinopse}
              onChange={(e) => setSinopse(e.target.value)}
              placeholder="Escreva um resumo do enredo..."
              className={styles.textarea}
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className={styles.submitBtn}
          >
            {carregando
              ? "Salvando..."
              : itemParaEditar
                ? "Salvar Alterações"
                : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
