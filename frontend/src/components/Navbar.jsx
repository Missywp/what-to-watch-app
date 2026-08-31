import { Plus, LogOut, Search } from "lucide-react";
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
          <span>
            Wha<span className={styles.logoAccent}>To</span>Watch
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
            Filmes
          </button>
          <button
            type="button"
            onClick={() => setFiltroTipo("serie")}
            className={`${styles.typeBtn} ${filtroTipo === "serie" ? styles.typeBtnActive : ""}`}
          >
            Séries
          </button>
        </div>

        <div
          style={{
            display: "inline-flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.5rem",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={onAbrirCadastro}
                className={styles.btnAdd}
                style={{
                  margin: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <Plus size={16} /> Adicionar
              </button>
              <button
                type="button"
                onClick={onLogout}
                title="Sair do modo Admin"
                className={styles.btnLogout}
                style={{
                  margin: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onAbrirLogin}
              className={styles.btnLogin}
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
