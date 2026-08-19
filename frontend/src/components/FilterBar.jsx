import styles from "./FilterBar.module.css";

const CATEGORIAS = [
  { id: "todos", label: "TODOS" },
  { id: "acao", label: "AÇÃO" },
  { id: "terror", label: "TERROR" },
  { id: "ficcao", label: "FICÇÃO" },
  { id: "suspense", label: "SUSPENSE" },
  { id: "super-herois", label: "SUPER-HERÓIS" },
  { id: "romance", label: "ROMANCE" },
  { id: "drama", label: "DRAMA" },
  { id: "fantasia", label: "FANTASIA" },
  { id: "comedia", label: "COMÉDIA" },
];

export default function FilterBar({ generoSelecionado, onSelectGenero }) {
  return (
    <nav className={styles.container}>
      <div className={styles.bar}>
        {CATEGORIAS.map((cat) => {
          const isAtivo = generoSelecionado === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectGenero(cat.id)}
              className={`${styles.tabBtn} ${isAtivo ? styles.activeTab : ""}`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
