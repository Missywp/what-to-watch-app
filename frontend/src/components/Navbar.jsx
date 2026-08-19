import {
  Film,
  Tv,
  Clapperboard,
  Plus,
  LogIn,
  LogOut,
  Search,
} from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar({
  busca,
  setBusca,
  filtroTipo,
  setFiltroTipo,
  isAdmin,
  onAbrirLogin,
  onAbrirCadastro,
  onLogout,
}) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div
          className={styles.logo}
          onClick={() => {
            setFiltroTipo("todos");
            setBusca("");
          }}
        >
          <Clapperboard className={styles.logoIcon} />
          <span>
            What<span className={styles.logoAccent}>To</span>Watch
          </span>
        </div>

        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar títulos"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.typeFilters}>
          <button
            type="button"
            onClick={() => setFiltroTipo("todos")}
            className={`${styles.typeBtn} ${filtroTipo === "todos" ? styles.typeBtnActive : ""}`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setFiltroTipo("filme")}
            className={`${styles.typeBtn} ${filtroTipo === "filme" ? styles.typeBtnActive : ""}`}
          >
            <Film size={14} /> Filmes
          </button>
          <button
            type="button"
            onClick={() => setFiltroTipo("serie")}
            className={`${styles.typeBtn} ${filtroTipo === "serie" ? styles.typeBtnActive : ""}`}
          >
            <Tv size={14} /> Séries
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {isAdmin ? (
            <>
              <button onClick={onAbrirCadastro} className={styles.btnAdd}>
                <Plus size={16} /> Adicionar
              </button>
              <button
                onClick={onLogout}
                title="Sair do modo Admin"
                className={styles.btnLogout}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button onClick={onAbrirLogin} className={styles.btnLogin}>
              <LogIn size={15} /> Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
