import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";


export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4 font-semibold">
        Olá, {user?.name}! 👋
      </h1>
      <p className="text-gray-700">
        Bem-vindo à sua área de trabalho do consultório.
      </p>
      <Link
        to="/appointments"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Ver Agendamentos
      </Link>
      
      <Link
        to="/appointments"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Criar Agendamento
      </Link>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 mt-6 rounded hover:bg-red-600"
      >
        Sair
      </button>
    </div>
  );
}
