import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Edit3, Trash2 } from "lucide-react";
import styles from "./CarouselSection.module.css";

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

export default function CarouselSection({
  items = [],
  generoAtivo = "todos",
  isAdmin,
  onEditar,
  onDeletar,
}) {
  const [selecionado, setSelecionado] = useState(items[0] || null);
  const trackRef = useRef(null);

  const rolar = (direcao) => {
    if (trackRef.current) {
      const scrollAmount = direcao === "left" ? -300 : 300;
      trackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  const itemAtivo = items.find((i) => i.id === selecionado?.id) || items[0];

  const formatarGeneros = (generos) => {
    if (!generos) return "";
    if (Array.isArray(generos)) return generos.join(" / ");
    try {
      const parsed = JSON.parse(generos);
      if (Array.isArray(parsed)) return parsed.join(" / ");
    } catch {}
    return String(generos).replace(/,/g, " / ");
  };

  const getPosterUrl = (url) => {
    if (!url || typeof url !== "string") return FALLBACK_POSTER;
    const cleanUrl = url.trim();
    if (cleanUrl.startsWith("http://localhost")) return FALLBACK_POSTER;
    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
      return cleanUrl;
    }
    return FALLBACK_POSTER;
  };

  const formatarTituloSecao = (texto) => {
    if (!texto || texto.toLowerCase() === "todos")
      return "Destaques do Catálogo";
    if (texto.toLowerCase() === "filme" || texto.toLowerCase() === "filmes")
      return "Filmes";
    if (texto.toLowerCase() === "serie" || texto.toLowerCase() === "series")
      return "Séries";
    return String(texto).replace("-", " ");
  };

  return (
    <section className={styles.section}>
      <header className={styles.headerSecao}>
        <h2 className={styles.tituloSecao}>
          {formatarTituloSecao(generoAtivo)}
        </h2>
      </header>

      <div className={styles.sliderWrapper}>
        <button
          onClick={() => rolar("left")}
          className={`${styles.navButton} ${styles.btnPrev}`}
          aria-label="Rolar para a esquerda"
        >
          <ChevronLeft size={22} />
        </button>

        <div className={styles.sliderTrack} ref={trackRef}>
          {items.map((item) => {
            const isActive = itemAtivo.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelecionado(item)}
                className={`${styles.slideCard} ${isActive ? styles.slideCardActive : ""}`}
              >
                <img
                  src={getPosterUrl(item.posterUrl)}
                  alt={item.titulo}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_POSTER;
                  }}
                  className={styles.slideImage}
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={() => rolar("right")}
          className={`${styles.navButton} ${styles.btnNext}`}
          aria-label="Rolar para a direita"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className={styles.detailsBox}>
        <div className={styles.detailsContent}>
          <div className={styles.detailsHeader}>
            <span className={styles.detailBadge}>
              {itemAtivo.tipo === "filme" ? "FILME" : "SÉRIE"} •{" "}
              {formatarGeneros(itemAtivo.generos)}
            </span>

            {isAdmin && (
              <div className={styles.adminActions}>
                <button
                  onClick={() => onEditar(itemAtivo)}
                  title="Editar este título"
                  className={styles.btnEditar}
                >
                  <Edit3 size={13} color="#7a142c" /> Editar
                </button>
                <button
                  onClick={() => onDeletar(itemAtivo.id, itemAtivo.titulo)}
                  title="Excluir este título"
                  className={styles.btnExcluir}
                >
                  <Trash2 size={13} /> Excluir
                </button>
              </div>
            )}
          </div>

          <h3 className={styles.detailTitle}>{itemAtivo.titulo}</h3>

          <div className={styles.detailMetaRow}>
            <span className={styles.metaYear}>{itemAtivo.ano}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaRating}>
              {itemAtivo.nota} <small>/10</small>
            </span>
          </div>

          <p className={styles.detailDesc}>{itemAtivo.sinopse}</p>
        </div>
      </div>
    </section>
  );
}
