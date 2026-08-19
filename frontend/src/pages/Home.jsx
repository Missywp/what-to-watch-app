import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import CarouselSection from "../components/CarouselSection";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";
import MovieModal from "../components/MovieModal";
import { api } from "../services/api";
import styles from "./Home.module.css";

export default function Home() {
  const [titulos, setTitulos] = useState([]);
  const [busca, setBusca] = useState("");
  const [generoAtivo, setGeneroAtivo] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  // Estados de Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [modalLoginAberto, setModalLoginAberto] = useState(false);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("@whattowatch:token");
    if (token) setIsAdmin(true);
  }, []);

  const carregarTitulos = useCallback(async () => {
    try {
      const data = await api.getTitulos({
        genero: generoAtivo,
        tipo: filtroTipo,
        busca: busca,
      });
      setTitulos(data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }, [generoAtivo, filtroTipo, busca]);

  useEffect(() => {
    carregarTitulos();
  }, [carregarTitulos]);

  const handleLogout = () => {
    localStorage.removeItem("@whattowatch:token");
    setIsAdmin(false);
  };

  const handleAbrirCadastro = () => {
    setItemParaEditar(null);
    setModalCadastroAberto(true);
  };

  const handleAbrirEditar = (item) => {
    setItemParaEditar(item);
    setModalCadastroAberto(true);
  };

  const handleDeletar = async (id, titulo) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir "${titulo}" do banco de dados?`,
      )
    ) {
      try {
        await api.deletarTitulo(id);
        carregarTitulos();
      } catch (err) {
        alert(err.message || "Erro ao excluir título");
      }
    }
  };

  return (
    <div className={styles.layout}>
      <Navbar
        busca={busca}
        setBusca={setBusca}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        isAdmin={isAdmin}
        onAbrirLogin={() => setModalLoginAberto(true)}
        onAbrirCadastro={handleAbrirCadastro}
        onLogout={handleLogout}
      />

      <FilterBar generoAtivo={generoAtivo} setGeneroAtivo={setGeneroAtivo} />

      <main className={styles.main}>
        {titulos.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              Nenhum título encontrado com esses filtros.
            </p>
          </div>
        ) : (
          <CarouselSection
            items={titulos}
            generoAtivo={generoAtivo}
            isAdmin={isAdmin}
            onEditar={handleAbrirEditar}
            onDeletar={handleDeletar}
          />
        )}
      </main>

      <Footer />

      <LoginModal
        isOpen={modalLoginAberto}
        onClose={() => setModalLoginAberto(false)}
        onLoginSuccess={() => setIsAdmin(true)}
      />

      <MovieModal
        isOpen={modalCadastroAberto}
        onClose={() => setModalCadastroAberto(false)}
        onSalvo={carregarTitulos}
        itemParaEditar={itemParaEditar}
      />
    </div>
  );
}
