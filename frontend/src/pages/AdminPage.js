import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const BASE = (process.env.REACT_APP_API_URL || "https://as-motors.onrender.com").replace(/\/+$/, "");
const api = axios.create({
  baseURL: BASE, 
  withCredentials: true,
});


const Card = ({ className = "", children }) => (
  <div className={`bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-zinc-200/60 dark:ring-zinc-800 rounded-2xl ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, description, right, children }) => (
  <div className="flex items-start justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
    <div>
      {title && <h3 className="text-lg font-semibold tracking-tight">{title}</h3>}
      {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
      {children}
    </div>
    {right && <div className="flex items-center gap-2">{right}</div>}
  </div>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

const Button = ({ variant = "primary", size = "md", className = "", ...props }) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-black text-white hover:bg-zinc-800 focus:ring-black dark:bg-white dark:text-black dark:hover:bg-zinc-200",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
    ghost:
      "bg-transparent text-zinc-700 hover:bg-zinc-100 focus:ring-zinc-300 dark:text-zinc-200 dark:hover:bg-zinc-800",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
  };
  const sizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4" };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};

const Input = (props) => (
  <input
    className="w-full h-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30"
    {...props}
  />
);

const Badge = ({ intent = "default", children }) => {
  const styles = {
    default: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
    danger: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
    neutral: "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-white",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[intent]}`}>
      {children}
    </span>
  );
};

const Table = ({ children, className = "" }) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="w-full text-sm border-collapse">{children}</table>
  </div>
);
const Th = ({ children }) => (
  <th className="text-left text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 py-3 border-b border-zinc-200 dark:border-zinc-800">
    {children}
  </th>
);
const Td = ({ children, compact }) => (
  <td className={`py-3 ${compact ? "" : "pr-2"} border-b border-zinc-100 dark:border-zinc-800 align-middle`}>
    {children}
  </td>
);

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = "Supprimer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-xl ring-1 ring-zinc-200/60 dark:ring-zinc-800 w-full max-w-md p-6">
        <h4 className="text-lg font-semibold">{title}</h4>
        {description && <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">{description}</p>}
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Page Admin
   ========================= */
export default function AdminPage() {
  const [tab, setTab] = useState("overview");

  const [vehicles, setVehicles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const [queryVehicles, setQueryVehicles] = useState("");
  const [queryReservations, setQueryReservations] = useState("");
  const [queryMessages, setQueryMessages] = useState("");

  const [confirm, setConfirm] = useState({
    open: false,
    entity: null,
    id: null,
    label: null,
  });

  // Chargement initial des sections
  useEffect(() => {
    // Véhicules
    api
      .get("/vehicules")
      .then(({ data }) => setVehicles(Array.isArray(data) ? data : data?.data || []))
      .catch(() => {});
    // Réservations
    api
      .get("/reservations")
      .then(({ data }) => setReservations(Array.isArray(data) ? data : data?.data || []))
      .catch(() => {});
    // Messages de contact
    api
      .get("/contact")
      .then(({ data }) => setMessages(Array.isArray(data) ? data : data?.data || []))
      .catch(() => {});
    // Utilisateurs (adapte si ton backend expose différemment)
    api
      .get("/auth/users")
      .then(({ data }) => setUsers(Array.isArray(data) ? data : data?.data || []))
      .catch(() => {});
  }, []);

  // KPI
  const revenueThisMonth = useMemo(() => {
    return reservations.reduce((sum, r) => (r.status === "confirmed" ? sum + (Number(r.total) || 0) : sum), 0);
  }, [reservations]);

  // Recherche locale
  const vehiclesFiltered = useMemo(() => {
    const q = queryVehicles.toLowerCase().trim();
    if (!q) return vehicles;
    return vehicles.filter((v) => `${v.name ?? v.nom} ${v.brand ?? v.marque} ${v.plate ?? v.immatriculation}`.toLowerCase().includes(q));
  }, [vehicles, queryVehicles]);

  const reservationsFiltered = useMemo(() => {
    const q = queryReservations.toLowerCase().trim();
    if (!q) return reservations;
    return reservations.filter((r) => `${r.customer ?? r.client} ${r.vehicle ?? r.vehicule}`.toLowerCase().includes(q));
  }, [reservations, queryReservations]);

  const messagesFiltered = useMemo(() => {
    const q = queryMessages.toLowerCase().trim();
    if (!q) return messages;
    return messages.filter((m) => `${m.name ?? m.nom} ${m.email} ${m.subject ?? m.objet}`.toLowerCase().includes(q));
  }, [messages, queryMessages]);

  // Suppression avec confirmation
  const openDelete = (entity, id, label) => setConfirm({ open: true, entity, id, label });
  const closeDelete = () => setConfirm({ open: false, entity: null, id: null, label: null });

  const handleConfirmDelete = async () => {
    const { entity, id } = confirm;
    try {
      if (entity === "vehicle") {
        await api.delete(`/vehicules/${id}`);
        setVehicles((prev) => prev.filter((v) => (v.id || v._id) !== id));
      } else if (entity === "reservation") {
        await api.delete(`/reservations/${id}`);
        setReservations((prev) => prev.filter((r) => (r.id || r._id) !== id));
      } else if (entity === "message") {
        await api.delete(`/contact/${id}`);
        setMessages((prev) => prev.filter((m) => (m.id || m._id) !== id));
      } else if (entity === "user") {
        await api.delete(`/auth/users/${id}`);
        setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
      }
    } catch (e) {
      // tu peux afficher un toast ici si tu en as un
    } finally {
      closeDelete();
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] p-4 md:p-6 space-y-5">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
          <p className="text-sm text-zinc-500 mt-1">Gérez véhicules, réservations, messages et utilisateurs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setTab("reservations")}>
            Nouvelle réservation
          </Button>
          <Button onClick={() => setTab("vehicles")}>Ajouter un véhicule</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-5">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <Card>
            <nav className="p-2">
              {[
                ["overview", "Vue d'ensemble"],
                ["vehicles", "Véhicules"],
                ["reservations", "Réservations"],
                ["messages", "Messages"],
                ["users", "Utilisateurs"],
                ["settings", "Paramètres"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors ${
                    tab === key
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </nav>
          </Card>
        </aside>

        {/* Content */}
        <main className="space-y-5">
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <Card>
                <CardHeader title="Véhicules disponibles" />
                <CardContent>
                  <div className="text-3xl font-bold">
                    {vehicles.filter((v) => (v.status ?? v.etat) === "available").length}
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">Prêts à être loués</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Locations actives" />
                <CardContent>
                  <div className="text-3xl font-bold">
                    {reservations.filter((r) => r.status === "confirmed").length}
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">En cours aujourd'hui</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Messages en attente" />
                <CardContent>
                  <div className="text-3xl font-bold">
                    {messages.filter((m) => !(m.read ?? m.lu)).length}
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">À traiter</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Revenu (mois)" />
                <CardContent>
                  <div className="text-3xl font-bold">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(revenueThisMonth)}
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">Estimé</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* VEHICLES */}
          {tab === "vehicles" && (
            <Card>
              <CardHeader
                title="Véhicules"
                description="Gérez le parc : création, édition, disponibilité et tarifs."
                right={<Input placeholder="Rechercher..." value={queryVehicles} onChange={(e) => setQueryVehicles(e.target.value)} className="w-56" />}
              />
              <CardContent>
                <Table>
                  <thead>
                    <tr>
                      <Th>Nom</Th>
                      <Th>Marque</Th>
                      <Th>Immat.</Th>
                      <Th>Prix/J</Th>
                      <Th>Statut</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclesFiltered.map((v) => {
                      const id = v.id || v._id;
                      return (
                        <tr key={id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                          <Td>{v.name ?? v.nom}</Td>
                          <Td>{v.brand ?? v.marque}</Td>
                          <Td>{v.plate ?? v.immatriculation}</Td>
                          <Td>{v.pricePerDay ?? v.prixParJour} €</Td>
                          <Td>
                            {(v.status ?? v.etat) === "available" && <Badge intent="success">Disponible</Badge>}
                            {(v.status ?? v.etat) === "unavailable" && <Badge intent="danger">Indispo</Badge>}
                            {(v.status ?? v.etat) === "maintenance" && <Badge intent="warning">Maintenance</Badge>}
                          </Td>
                          <Td>
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" onClick={() => console.log("edit vehicle", id)}>
                                Éditer
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => openDelete("vehicle", id, v.name ?? v.nom)}
                                aria-label={`Supprimer ${v.name ?? v.nom}`}
                                title="Supprimer"
                              >
                                {/* Icône corbeille */}
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-1"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                                </svg>
                                Supprimer
                              </Button>
                            </div>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* RESERVATIONS */}
          {tab === "reservations" && (
            <Card>
              <CardHeader
                title="Réservations"
                description="Suivez et gérez les réservations clients."
                right={<Input placeholder="Rechercher..." value={queryReservations} onChange={(e) => setQueryReservations(e.target.value)} className="w-56" />}
              />
              <CardContent>
                <Table>
                  <thead>
                    <tr>
                      <Th>Client</Th>
                      <Th>Véhicule</Th>
                      <Th>Début</Th>
                      <Th>Fin</Th>
                      <Th>Total</Th>
                      <Th>Statut</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationsFiltered.map((r) => {
                      const id = r.id || r._id;
                      return (
                        <tr key={id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                          <Td>{r.customer ?? r.client}</Td>
                          <Td>{r.vehicle ?? r.vehicule}</Td>
                          <Td>{r.startDate ? new Date(r.startDate).toLocaleDateString("fr-FR") : "-"}</Td>
                          <Td>{r.endDate ? new Date(r.endDate).toLocaleDateString("fr-FR") : "-"}</Td>
                          <Td>{Number(r.total || 0).toFixed(2)} €</Td>
                          <Td>
                            {r.status === "confirmed" && <Badge intent="success">Confirmée</Badge>}
                            {r.status === "pending" && <Badge intent="warning">En attente</Badge>}
                            {r.status === "cancelled" && <Badge intent="danger">Annulée</Badge>}
                          </Td>
                          <Td>
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" onClick={() => console.log("edit reservation", id)}>
                                Éditer
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => openDelete("reservation", id, r.customer ?? r.client)}>
                                Supprimer
                              </Button>
                            </div>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* MESSAGES */}
          {tab === "messages" && (
            <Card>
              <CardHeader
                title="Messages"
                description="Messages de contact reçus via le site."
                right={<Input placeholder="Rechercher..." value={queryMessages} onChange={(e) => setQueryMessages(e.target.value)} className="w-56" />}
              />
              <CardContent>
                <Table>
                  <thead>
                    <tr>
                      <Th>Nom</Th>
                      <Th>Email</Th>
                      <Th>Objet</Th>
                      <Th>Reçu</Th>
                      <Th>Lu</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {messagesFiltered.map((m) => {
                      const id = m.id || m._id;
                      return (
                        <tr key={id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                          <Td>{m.name ?? m.nom}</Td>
                          <Td>{m.email}</Td>
                          <Td className="truncate max-w-[240px]">{m.subject ?? m.objet}</Td>
                          <Td>{m.createdAt ? new Date(m.createdAt).toLocaleString("fr-FR") : "-"}</Td>
                          <Td>{(m.read ?? m.lu) ? <Badge intent="neutral">Oui</Badge> : <Badge intent="warning">Non</Badge>}</Td>
                          <Td>
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" onClick={() => console.log("reply message", id)}>
                                Répondre
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => openDelete("message", id, m.subject ?? m.objet)}>
                                Supprimer
                              </Button>
                            </div>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* USERS */}
          {tab === "users" && (
            <Card>
              <CardHeader title="Utilisateurs" description="Comptes internes et rôles." />
              <CardContent>
                <Table>
                  <thead>
                    <tr>
                      <Th>Nom</Th>
                      <Th>Email</Th>
                      <Th>Rôle</Th>
                      <Th>Statut</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const id = u.id || u._id;
                      return (
                        <tr key={id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                          <Td>{u.name ?? u.nom}</Td>
                          <Td>{u.email}</Td>
                          <Td>
                            {u.role === "admin" && <Badge intent="danger">Admin</Badge>}
                            {u.role === "manager" && <Badge intent="neutral">Manager</Badge>}
                            {u.role === "agent" && <Badge intent="default">Agent</Badge>}
                          </Td>
                          <Td>{u.active ? <Badge intent="success">Actif</Badge> : <Badge intent="warning">Suspendu</Badge>}</Td>
                          <Td>
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" onClick={() => console.log("edit user", id)}>
                                Éditer
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => openDelete("user", id, u.name ?? u.nom)}>
                                Supprimer
                              </Button>
                            </div>
                          </Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* SETTINGS (exemple simple) */}
          {tab === "settings" && (
            <Card>
              <CardHeader title="Paramètres" description="Préférences de l'application et intégrations." />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Nom de l'entreprise</label>
                    <Input placeholder="AS Motors" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email de contact</label>
                    <Input placeholder="contact@as-motors.com" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Devise</label>
                    <Input placeholder="EUR" />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full md:w-auto">Enregistrer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Modal confirmation */}
      <ConfirmDialog
        open={confirm.open}
        title="Confirmer la suppression"
        description={`Cette action est définitive. Voulez-vous supprimer ${confirm.label ? `"${confirm.label}"` : "cet élément"} ?`}
        onCancel={closeDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
