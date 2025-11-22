import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("todas");

  // 🧭 Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // mesmo valor configurado no backend

  // === BUSCAR CONSULTAS (com paginação e filtro do backend) ===
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();
      query.append("page", page);
      query.append("limit", limit);
      if (filter !== "todas") query.append("status", filter);

      const res = await api.get(`/appointments?${query.toString()}`);
      const data = res.data?.data?.appointments || [];

      setAppointments(data);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      console.error("❌ Erro ao buscar agendamentos:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Atualiza quando muda filtro ou página
  useEffect(() => {
    fetchAppointments();
  }, [filter, page]);

  // === Atualizar status ===
  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/appointments/${id}`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status da consulta.");
    }
  };

  // === Excluir agendamento ===
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este agendamento?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error("Erro ao excluir agendamento:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Consultas Agendadas</h1>

      {/* 🔍 Filtros */}
      <div className="flex justify-center mb-4 gap-3">
        <select
          value={filter}
          onChange={(e) => {
            setPage(1); // reseta pra primeira página ao mudar filtro
            setFilter(e.target.value);
          }}
          className="p-2 border rounded"
        >
          <option value="todas">Todas</option>
          <option value="proximas">Próximas</option>
          <option value="finalizado">Finalizadas</option>
          <option value="cancelado">Canceladas</option>
        </select>
      </div>

      {/* 🧭 Tabela */}
      {loading ? (
        <p className="text-center text-gray-600">Carregando consultas...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-600">Nenhuma consulta encontrada.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm text-left shadow-md">
              <thead className="bg-blue-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Paciente</th>
                  <th className="border border-gray-300 px-4 py-2">Data</th>
                  <th className="border border-gray-300 px-4 py-2">Modo</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Notas</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {a.patient?.patientName || "Paciente não informado"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(a.date).toLocaleString("pt-BR")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">
                      {a.mode || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">
                      <span
                        className={`${
                          a.status === "finalizado"
                            ? "text-green-600"
                            : a.status === "cancelado"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {a.notes || "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        {a.status !== "finalizado" && (
                          <button
                            onClick={() => updateStatus(a._id, "finalizado")}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                          >
                            Finalizar
                          </button>
                        )}
                        {a.status !== "cancelado" && (
                          <button
                            onClick={() => updateStatus(a._id, "cancelado")}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 🔄 Paginação */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-3 py-1 border rounded ${
                page === 1 ? "text-gray-400 border-gray-300" : "hover:bg-gray-100"
              }`}
            >
              Anterior
            </button>
            <span className="px-3 py-1">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-3 py-1 border rounded ${
                page === totalPages ? "text-gray-400 border-gray-300" : "hover:bg-gray-100"
              }`}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}
