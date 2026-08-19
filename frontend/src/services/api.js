const API_URL = "http://localhost:5000/api";

const authHeadersMultipart = () => {
  const token = localStorage.getItem("@whattowatch:token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  async getTitulos(params = {}) {
    const query = new URLSearchParams();
    if (params.genero && params.genero !== "todos")
      query.append("genero", params.genero);
    if (params.tipo && params.tipo !== "todos")
      query.append("tipo", params.tipo);
    if (params.busca) query.append("busca", params.busca);

    const res = await fetch(`${API_URL}/titulos?${query.toString()}`);
    if (!res.ok) throw new Error("Erro ao buscar títulos");
    return res.json();
  },

  async criarTitulo(formData) {
    const res = await fetch(`${API_URL}/titulos`, {
      method: "POST",
      headers: authHeadersMultipart(),
      body: formData,
    });
    if (!res.ok) throw new Error("Erro ao cadastrar título");
    return res.json();
  },

  async atualizarTitulo(id, formData) {
    const res = await fetch(`${API_URL}/titulos/${id}`, {
      method: "PUT",
      headers: authHeadersMultipart(),
      body: formData,
    });
    if (!res.ok) throw new Error("Erro ao atualizar título");
    return res.json();
  },

  async deletarTitulo(id) {
    const res = await fetch(`${API_URL}/titulos/${id}`, {
      method: "DELETE",
      headers: authHeadersMultipart(),
    });
    if (!res.ok) throw new Error("Erro ao deletar título");
    return res.json();
  },

  async login(email, senha) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.mensagem || "Falha no login");
    }
    return res.json();
  },
};
