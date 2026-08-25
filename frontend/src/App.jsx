import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import FilterBar from "./components/FilterBar";
import CarouselSection from "./components/CarouselSection";
import MovieModal from "./components/MovieModal";
import LoginModal from "./components/LoginModal";
import { api } from "./services/api";

export default function App() {
  const [titulos, setTitulos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [generoSelecionado, setGeneroSelecionado] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busca, setBusca] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [modalLoginAberto, setModalLoginAberto] = useState(false);
  const [modalTituloAberto, setModalTituloAberto] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("@whattowatch:token");
    if (token) setIsAdmin(true);
  }, []);

  const carregarTitulos = useCallback(async () => {
    try {
      setCarregando(true);
      const dados = await api.getTitulos({
        genero: generoSelecionado,
        tipo: filtroTipo,
        busca: busca,
      });
      setTitulos(dados || []);
    } catch (err) {
      console.error("Erro ao carregar títulos:", err);
      setTitulos([]);
    } finally {
      setCarregando(false);
    }
  }, [generoSelecionado, filtroTipo, busca]);

  useEffect(() => {
    carregarTitulos();
  }, [carregarTitulos]);

  const handleLogout = () => {
    localStorage.removeItem("@whattowatch:token");
    setIsAdmin(false);
  };

  const handleEditar = (item) => {
    setItemParaEditar(item);
    setModalTituloAberto(true);
  };

  const handleDeletar = async (id, nomeTitulo) => {
    if (
      confirm(
        `Tem certeza que deseja excluir "${nomeTitulo || "este título"}"?`,
      )
    ) {
      try {
        await api.deletarTitulo(id);
        carregarTitulos();
      } catch (err) {
        alert("Erro ao excluir título.");
      }
    }
  };

  const listaSegura = Array.isArray(titulos) ? titulos : [];
  const filmes = listaSegura.filter((t) => t.tipo === "filme");
  const series = listaSegura.filter((t) => t.tipo === "serie");

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F6F2", // Branco-marfim neutro, sem tom amarelado
        color: "#2D0A14",
      }}
    >
      <Navbar
        busca={busca}
        setBusca={setBusca}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        isAdmin={isAdmin}
        onAbrirLogin={() => setModalLoginAberto(true)}
        onAbrirCadastro={() => {
          setItemParaEditar(null);
          setModalTituloAberto(true);
        }}
        onLogout={handleLogout}
      />

      <main
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem 1rem" }}
      >
        <FilterBar
          generoSelecionado={generoSelecionado}
          onSelectGenero={(genero) => setGeneroSelecionado(genero)}
        />

        {carregando ? (
          <p style={{ textAlign: "center", color: "#838c76", padding: "3rem" }}>
            Carregando catálogo...
          </p>
        ) : listaSegura.length === 0 ? (
          <p style={{ textAlign: "center", color: "#838c76", padding: "3rem" }}>
            Nenhum título encontrado com esses filtros.
          </p>
        ) : (
          <>
            {filtroTipo === "todos" ? (
              <>
                {filmes.length > 0 && (
                  <CarouselSection
                    items={filmes}
                    generoAtivo={
                      generoSelecionado !== "todos"
                        ? generoSelecionado
                        : "Filmes"
                    }
                    isAdmin={isAdmin}
                    onEditar={handleEditar}
                    onDeletar={handleDeletar}
                  />
                )}

                {series.length > 0 && (
                  <CarouselSection
                    items={series}
                    generoAtivo={
                      generoSelecionado !== "todos"
                        ? generoSelecionado
                        : "Séries"
                    }
                    isAdmin={isAdmin}
                    onEditar={handleEditar}
                    onDeletar={handleDeletar}
                  />
                )}
              </>
            ) : (
              <CarouselSection
                items={listaSegura}
                generoAtivo={
                  generoSelecionado !== "todos" ? generoSelecionado : filtroTipo
                }
                isAdmin={isAdmin}
                onEditar={handleEditar}
                onDeletar={handleDeletar}
              />
            )}
          </>
        )}
      </main>

      <LoginModal
        isOpen={modalLoginAberto}
        onClose={() => setModalLoginAberto(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          setModalLoginAberto(false);
        }}
      />

      <MovieModal
        isOpen={modalTituloAberto}
        onClose={() => setModalTituloAberto(false)}
        onSalvo={carregarTitulos}
        itemParaEditar={itemParaEditar}
      />
    </div>
  );
}
