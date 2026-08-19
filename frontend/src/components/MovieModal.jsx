import { useState, useEffect } from "react";
import { X, PlusCircle, Edit3, UploadCloud, Trash2 } from "lucide-react";
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
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [preview, setPreview] = useState("");
  const [removerImagem, setRemoverImagem] = useState(false);
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

      setPreview(itemParaEditar.posterUrl || "");
      setArquivoImagem(null);
      setRemoverImagem(false);
    } else {
      setTitulo("");
      setTipo("filme");
      setGeneros("terror, suspense");
      setSinopse("");
      setNota(7.5);
      setAno(2024);
      setArquivoImagem(null);
      setPreview("");
      setRemoverImagem(false);
    }
  }, [itemParaEditar, isOpen]);

  if (!isOpen) return null;

  const handleArquivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoImagem(file);
      setPreview(URL.createObjectURL(file));
      setRemoverImagem(false);
    }
  };

  const handleRemoverImagem = () => {
    setArquivoImagem(null);
    setPreview("");
    setRemoverImagem(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("tipo", tipo);
      formData.append("generos", generos);
      formData.append("sinopse", sinopse);
      formData.append("nota", nota);
      formData.append("ano", ano);

      if (arquivoImagem) {
        formData.append("imagem", arquivoImagem);
      }

      if (removerImagem) {
        formData.append("removerImagem", "true");
      }

      if (itemParaEditar) {
        await api.atualizarTitulo(itemParaEditar.id, formData);
      } else {
        await api.criarTitulo(formData);
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
              <label className={styles.label}>Minha Avaliação </label>
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
                placeholder="acao, terror, ficcao"
                className={styles.input}
              />
            </div>
          </div>

          {/* Campo de Imagem */}
          <div className={styles.field}>
            <label className={styles.label}>Capa / Pôster</label>

            {preview ? (
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "fit-content",
                  margin: "0 auto",
                }}
              >
                <img
                  src={preview}
                  alt="Prévia"
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
                  onClick={handleRemoverImagem}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    backgroundColor: "rgba(100, 0, 23, 0.95)",
                    color: "#EFEFC9",
                    border: "none",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title="Excluir imagem"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.25rem",
                  border: "2px dashed #4a2d2b",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  backgroundColor: "#2F1B1A",
                  gap: "0.5rem",
                }}
              >
                <UploadCloud size={24} color="#941832" />
                <span style={{ fontSize: "0.8rem", color: "#d6d6b2" }}>
                  {arquivoImagem
                    ? arquivoImagem.name
                    : "Clique para selecionar uma imagem (PNG, JPG)"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleArquivoChange}
                  style={{ display: "none" }}
                />
              </label>
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
