import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Buscar agendamentos no backend
  const fetchAppointments = async () => {
    try {
      setLoading(true);

          const token = localStorage.getItem("token");
    console.log("Token encontrado:", token);
    
      const res = await api.get("/appointments");
      
      console.log("Resposta completa do Axios:", res);
      console.log("Dados do Backend:", res.data);
      
      const data = res.data?.data?.appointments || [];
      setAppointments(data);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Excluir agendamento
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

      {loading ? (
        <p className="text-center text-gray-600">Carregando consultas...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-600">Nenhuma consulta agendada.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm text-left shadow-md">
            <thead className="bg-blue-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Paciente</th>
                <th className="border border-gray-300 px-4 py-2">Data</th>
                <th className="border border-gray-300 px-4 py-2">Modo</th>
                <th className="border border-gray-300 px-4 py-2">Notas</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {a.patient?.name || "Paciente não informado"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(a.date).toLocaleString("pt-BR")}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">
                    {a.mode || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {a.notes || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(a._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
