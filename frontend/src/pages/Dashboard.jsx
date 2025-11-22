import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("agenda");

  // Dados
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("todas");

  // Paginação
  const [pageAppointments, setPageAppointments] = useState(1);
  const [pagePatients, setPagePatients] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const limit = 8;

  // Popup
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupType, setPopupType] = useState(null);

  // === BUSCA CONSULTAS ===
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();
      query.append("page", pageAppointments);
      query.append("limit", limit);
      if (filter !== "todas") query.append("status", filter);

      const res = await api.get(`/appointments?${query.toString()}`);
      const data = res.data?.data?.appointments || res.data?.data?.appointment || [];

      setAppointments(data);
      setTotalAppointments(res.data?.results || 0);
    } catch (err) {
      console.error("Erro ao buscar agendamentos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePage === "agenda") fetchAppointments();
  }, [activePage, filter, pageAppointments]);

  // === BUSCA PACIENTES ===
  const fetchPatients = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/patients?page=${pagePatients}&limit=${limit}`);
      setPatients(res.data?.data?.patients || []);
      setTotalPatients(res.data?.results || 0);
    } catch (err) {
      console.error("Erro ao buscar pacientes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePage === "pacientes") fetchPatients();
  }, [activePage, pagePatients]);

  // === CRUD ===
  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/patients", patientForm);
      alert("Paciente cadastrado com sucesso!");
      setPatientForm({ patientName: "", email: "", phone: "", birthDate: "" });
      fetchPatients();
    } catch {
      alert("Erro ao cadastrar paciente");
    }
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/appointments", appointmentForm);
      alert("Consulta agendada com sucesso!");
      setAppointmentForm({ patient: "", date: "", mode: "presencial", notes: "" });
      fetchAppointments();
    } catch {
      alert("Erro ao criar agendamento");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/appointments/${id}`, { status: newStatus });
      fetchAppointments();
    } catch {
      alert("Erro ao alterar status da consulta");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este agendamento?")) return;
    await api.delete(`/appointments/${id}`);
    fetchAppointments();
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Deseja realmente excluir este paciente?")) return;
    await api.delete(`/patients/${id}`);
    fetchPatients();
  };

  // === FORMS ===
  const [patientForm, setPatientForm] = useState({
    patientName: "",
    email: "",
    phone: "",
    birthDate: "",
    notes: ""
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patient: "",
    date: "",
    mode: "presencial",
    notes: "",
  });

  // === POPUP ===
  const openPopup = (item, type) => {
    setSelectedItem(item);
    setPopupType(type);
  };

  const closePopup = () => {
    setSelectedItem(null);
    setPopupType(null);
  };

  return (
    <div className="dashboard">
      <button
        className={`menu-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <aside className={`sidebar ${menuOpen ? "active" : ""}`}>
        <h2>Menu</h2>
        <ul>
          <li onClick={() => { setActivePage("cadastrar"); setMenuOpen(false); }}>Cadastrar Paciente</li>
          <li onClick={() => { setActivePage("nova"); setMenuOpen(false); }}>Nova Consulta</li>
          <li onClick={() => { setActivePage("pacientes"); setMenuOpen(false); }}>Pacientes</li>
          <li onClick={() => { setActivePage("agenda"); setMenuOpen(false); }}>Agenda</li>
        </ul>
        <button className="logout-btn" onClick={logout}>Sair</button>
      </aside>

      <main className="main">
        <h1>Bem-vindo, {user?.name || "Usuário"} 👋</h1>

        {/* === CADASTRAR PACIENTE === */}
        {activePage === "cadastrar" && (
          <>
            <h2>Cadastrar Novo Paciente</h2>
            <form className="form-container" onSubmit={handlePatientSubmit}>
              <label>
                Nome:
                <input
                  type="text"
                  value={patientForm.patientName}
                  onChange={(e) => setPatientForm({ ...patientForm, patientName: e.target.value })}
                  required
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  value={patientForm.email}
                  onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                />
              </label>

              <label>
                Telefone:
                <input
                  type="text"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                />
              </label>

              <label>
                Data de Nascimento:
                <input
                  type="date"
                  value={patientForm.birthDate}
                  onChange={(e) => setPatientForm({ ...patientForm, birthDate: e.target.value })}
                />
              </label>

              <label>
                Notas:
                <textarea
                  value={patientForm.notes}
                  onChange={(e) => setPatientForm({ ...patientForm, notes: e.target.value })}
                  placeholder="Observações (opcional)"
                ></textarea>
              </label>

              <button type="submit" className="btn-primary">Cadastrar</button>
            </form>
          </>
        )}

        {/* === NOVA CONSULTA === */}
        {activePage === "nova" && (
          <>
            <h2>Agendar Nova Consulta</h2>
            <form className="form-container" onSubmit={handleAppointmentSubmit}>
              <label>
                Paciente:
                <input
                  type="text"
                  list="patient-list"
                  placeholder="Digite ou selecione um paciente"
                  value={appointmentForm.patientName || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    setAppointmentForm({ ...appointmentForm, patientName: name });

                    // Se o nome digitado corresponde a um paciente, salva o ID também
                    const selected = patients.find((p) => p.patientName === name);
                    if (selected) {
                      setAppointmentForm((prev) => ({ ...prev, patient: selected._id }));
                    } else {
                      setAppointmentForm((prev) => ({ ...prev, patient: "" }));
                    }
                  }}
                  required
                />
                <datalist id="patient-list">
                  {patients.map((p) => (
                    <option key={p._id} value={p.patientName} />
                  ))}
                </datalist>
              </label>


              <label>
                Data e Hora:
                <input
                  type="datetime-local"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                  required
                />
              </label>

              <label>
                Modo:
                <select
                  value={appointmentForm.mode}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, mode: e.target.value })}
                >
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                </select>
              </label>

              <label>
                Notas:
                <textarea
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                  placeholder="Observações sobre a consulta (opcional)"
                ></textarea>
              </label>

              <button type="submit" className="btn-primary">Agendar</button>
            </form>
          </>
        )}
        {/* === AGENDA === */}
        {activePage === "agenda" && (
          <>
            <h2>Agendamentos</h2>

            <div className="filter-container">
              <label>Filtrar por status: </label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="todas">Todas</option>
                <option value="finalizado">Finalizadas</option>
                <option value="cancelado">Canceladas</option>
                <option value="pendente">Próximas</option>
              </select>
            </div>

            {loading ? (
              <p>Carregando...</p>
            ) : appointments.length === 0 ? (
              <p>Nenhum agendamento encontrado.</p>
            ) : (
              <>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Paciente</th>
                        <th>Data</th>
                        <th>Modo</th>
                        <th>Status</th>
                        <th>Notas</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((a) => (
                        <tr key={a._id} onClick={() => openPopup(a, "consulta")}>
                          <td>{a.patient?.patientName || "Não informado"}</td>
                          <td>{new Date(a.date).toLocaleString("pt-BR")}</td>
                          <td>{a.mode}</td>
                          <td>{a.status}</td>
                          <td>{a.notes || "-"}</td>
                          <td>
                            {a.status !== "finalizado" && (
                              <button
                                className="finalizar-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(a._id, "finalizado");
                                }}
                              >
                                Finalizar
                              </button>
                            )}
                            <button
                              className="edit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPopup(a, "editar-consulta");
                              }}
                            >
                              Editar
                            </button>

                            {a.status !== "cancelado" && (
                              <button
                                className="cancelar-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(a._id, "cancelado");
                                }}
                              >
                                Cancelar
                              </button>
                            )}
                            <button
                              className="delete-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(a._id);
                              }}
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                <div className="pagination">
                  <button disabled={pageAppointments <= 1} onClick={() => setPageAppointments(pageAppointments - 1)}>Anterior</button>
                  <span>Página {pageAppointments}</span>
                  <button
                    disabled={pageAppointments * limit >= totalAppointments}
                    onClick={() => setPageAppointments(pageAppointments + 1)}
                  >
                    Próxima
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* === PACIENTES === */}
        {activePage === "pacientes" && (
          <>
            <h2>Pacientes Cadastrados</h2>
            {loading ? (
              <p>Carregando...</p>
            ) : patients.length === 0 ? (
              <p>Nenhum paciente encontrado.</p>
            ) : (
              <>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Data de Nascimento</th>
                        <th>Notas</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((p) => (
                        <tr key={p._id} onClick={() => openPopup(p, "paciente")}>
                          <td>{p.patientName}</td>
                          <td>{p.email || "-"}</td>
                          <td>{p.phone || "-"}</td>
                          <td>{p.birthDate || "-"}</td>
                          <td>{p.notes || "-"}</td>
                          <td>
                            <button
                              className="delete-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePatient(p._id);
                              }}
                            >
                              Excluir
                            </button>
                            <button
                              className="edit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openPopup(p, "editar-paciente");
                              }}
                            >
                              Editar
                            </button>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação */}
                <div className="pagination">
                  <button disabled={pagePatients <= 1} onClick={() => setPagePatients(pagePatients - 1)}>Anterior</button>
                  <span>Página {pagePatients}</span>
                  <button
                    disabled={pagePatients * limit >= totalPatients}
                    onClick={() => setPagePatients(pagePatients + 1)}
                  >
                    Próxima
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* === POPUP === */}
      {selectedItem && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>×</button>
            {popupType === "editar-paciente" && (
              <>
                <h3>Editar Paciente</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await api.patch(`/patients/${selectedItem._id}`, selectedItem);
                      alert("Paciente atualizado com sucesso!");
                      closePopup();
                      fetchPatients();
                    } catch {
                      alert("Erro ao atualizar paciente.");
                    }
                  }}
                  className="form"
                >
                  <input
                    type="text"
                    placeholder="Nome"
                    value={selectedItem.patientName}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, patientName: e.target.value })
                    }
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={selectedItem.email || ""}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, email: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Telefone"
                    value={selectedItem.phone || ""}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, phone: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    placeholder="Data de nascimento"
                    value={selectedItem.birthDate || ""}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, birthDate: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Notas"
                    value={selectedItem.notes || ""}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, notes: e.target.value })
                    }
                  />
                  <button className="save-btn" type="submit">
                    Salvar Alterações
                  </button>
                </form>
              </>
            )}

            {popupType === "editar-consulta" && (
              <>
                <h3>Editar Consulta</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      await api.patch(`/appointments/${selectedItem._id}`, selectedItem);
                      alert("Consulta atualizada com sucesso!");
                      closePopup();
                      fetchAppointments();
                    } catch {
                      alert("Erro ao atualizar consulta.");
                    }
                  }}
                  className="form"
                >
                  <input
                    type="datetime-local"
                    value={new Date(selectedItem.date).toISOString().slice(0, 16)}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, date: e.target.value })
                    }
                    required
                  />
                  <select
                    value={selectedItem.mode || "presencial"}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, mode: e.target.value })
                    }
                  >
                    <option value="presencial">Presencial</option>
                    <option value="online">Online</option>
                  </select>
                  <textarea
                    placeholder="Notas"
                    value={selectedItem.notes || ""}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, notes: e.target.value })
                    }
                  />
                  <select
                    value={selectedItem.status || "pendente"}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, status: e.target.value })
                    }
                  >
                    <option value="pendente">Pendente</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                  <button className="save-btn" type="submit">
                    Salvar Alterações
                  </button>
                </form>
              </>
            )}


            {popupType === "paciente" ? (
              <>
                <h3>Detalhes do Paciente</h3>
                <p><b>Nome:</b> {selectedItem.patientName}</p>
                <p><b>Email:</b> {selectedItem.email || "-"}</p>
                <p><b>Telefone:</b> {selectedItem.phone || "-"}</p>
                <p><b>Data de Nascimento:</b> {selectedItem.birthDate || "-"}</p>
                <p><b>Obs:</b>
                  {selectedItem.notes?.length
                    ? selectedItem.notes.map((n, i) => (
                      <span key={n._id}> {n.content}{i < selectedItem.notes.length - 1 ? "; " : ""}</span>
                    ))
                    : "-"}
                </p>
                <p><b>Cadastrado em:</b> {new Date(selectedItem.createdAt).toLocaleString("pt-BR")}</p>
              </>
            ) : (
              <>
                <h3>Detalhes da Consulta</h3>
                <p><b>Paciente:</b> {selectedItem.patient?.patientName}</p>
                <p><b>Data:</b> {new Date(selectedItem.date).toLocaleString("pt-BR")}</p>
                <p><b>Modo:</b> {selectedItem.mode}</p>
                <p><b>Status:</b> {selectedItem.status}</p>
                <p><b>Notas:</b> {selectedItem.notes || "-"}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
