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
        {/* 1. Logo */}
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

        {/* 2. Campo de Busca */}
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

        {/* 3. Filtros Tipo */}
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

        {/* 4. Ações de Admin / Login (Com estilo travado contra quebra) */}
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
              <LogIn size={15} /> Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
