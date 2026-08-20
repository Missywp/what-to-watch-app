const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "https://what-to-watch-app.onrender.com/api";

const getHeaders = (isJson = false) => {
  const token = localStorage.getItem("@whattowatch:token");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
};

export const api = {
  async getTitulos(params = {}) {
    const query = new URLSearchParams();
    if (params.genero && params.genero !== "todos")
      query.append("genero", params.genero);
    if (params.tipo && params.tipo !== "todos")
      query.append("tipo", params.tipo);
    if (params.busca) query.append("busca", params.busca);

    const qs = query.toString();
    const res = await fetch(`${BASE_URL}/titulos${qs ? `?${qs}` : ""}`);
    if (!res.ok) throw new Error("Erro ao buscar títulos");
    return res.json();
  },

  async criarTitulo(dados) {
    const isFormData = dados instanceof FormData;
    const res = await fetch(`${BASE_URL}/titulos`, {
      method: "POST",
      headers: getHeaders(!isFormData),
      body: isFormData ? dados : JSON.stringify(dados),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.mensagem || "Erro ao cadastrar título");
    }
    return res.json();
  },

  async atualizarTitulo(id, dados) {
    const isFormData = dados instanceof FormData;
    const res = await fetch(`${BASE_URL}/titulos/${id}`, {
      method: "PUT",
      headers: getHeaders(!isFormData),
      body: isFormData ? dados : JSON.stringify(dados),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.mensagem || "Erro ao atualizar título");
    }
    return res.json();
  },

  async deletarTitulo(id) {
    const res = await fetch(`${BASE_URL}/titulos/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.mensagem || "Erro ao deletar título");
    }
    return res.json();
  },

  async login(email, senha) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.mensagem || "Falha no login");
    }
    return res.json();
  },
};
