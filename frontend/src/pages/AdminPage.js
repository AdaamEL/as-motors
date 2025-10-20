import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const BASE = (process.env.REACT_APP_API_URL || "https://as-motors.onrender.com/api");
const api = axios.create({
  baseURL: BASE || undefined, 
  withCredentials: false,
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token"); 
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const Card = ({ className = "", children }) => (
  <div className={`bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-zinc-200/60 dark:ring-zinc-800 rounded-2xl ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, description, right, children }) => (
  <div className="flex items-start justify-between p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800">
    <div>
      {title && <h3 className="text-base sm:text-lg font-semibold tracking-tight">{title}</h3>}
      {description && <p className="text-xs sm:text-sm text-zinc-500 mt-1">{description}</p>}
      {children}
    </div>
    {right && <div className="ml-3 flex items-center gap-2">{right}</div>}
  </div>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-4 sm:p-5 ${className}`}>{children}</div>
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
  const sizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-sm" };
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
  // si ton header global est en position: fixed; on compense ici
  return (
    <div className="pt-20 sm:pt-24"> {/* <-- empêche le contenu d'être caché sous le header */}
      <AdminContent />
    </div>
  );
}

function AdminContent() {
  const [tab, setTab] = useState("overview");

  const [vehicles, setVehicles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState({ vehicules: false, reservations: false, messages: false, users: false });
  const [error, setError] = useState({ vehicules: null, reservations: null, messages: null, users: null });

  const [queryVehicles, setQueryVehicles] = useState("");
  const [queryReservations, setQueryReservations] = useState("");
  const [queryMessages, setQueryMessages] = useState("");

  const [confirm, setConfirm] = useState({ open: false, entity: null, id: null, label: null });

  // Chargement initial fiable (4 GET) + gestion d'erreur individuelle
  useEffect(() => {
    const fetchAll = async () => {
      setLoading({ vehicules: true, reservations: true, messages: true, users: true });
      setError({ vehicules: null, reservations: null, messages: null, users: null });

      const reqs = [
        api.get("/vehicules"),
        api.get("/reservations"),
        api.get("/contact"),         // si ton backend n'a pas GET /contact, cette case affichera une alerte non bloquante
        api.get("/auth/users"),      // adapte si nécessaire
      ];

      const [veh, res, msg, usr] = await Promise.allSettled(reqs);

      if (veh.status === "fulfilled") {
        const data = Array.isArray(veh.value.data) ? veh.value.data : veh.value.data?.data || [];
        setVehicles(data);
      } else {
        setError((e) => ({ ...e, vehicules: veh.reason?.message || "Erreur chargement véhicules" }));
      }

      if (res.status === "fulfilled") {
        const data = Array.isArray(res.value.data) ? res.value.data : res.value.data?.data || [];
        setReservations(data);
      } else {
        setError((e) => ({ ...e, reservations: res.reason?.message || "Erreur chargement réservations" }));
      }

      if (msg.status === "fulfilled") {
        const data = Array.isArray(msg.value.data) ? msg.value.data : msg.value.data?.data || [];
        setMessages(data);
      } else {
        // si pas d'endpoint GET /contact on laisse la liste vide et on note l'erreur
        setError((e) => ({ ...e, messages: msg.reason?.response?.status === 404 ? "Listing /contact indisponible" : (msg.reason?.message || "Erreur chargement messages") }));
      }

      if (usr.status === "fulfilled") {
        const data = Array.isArray(usr.value.data) ? usr.value.data : usr.value.data?.data || [];
        setUsers(data);
      } else {
        setError((e) => ({ ...e, users: usr.reason?.message || "Erreur chargement utilisateurs" }));
      }

      setLoading({ vehicules: false, reservations: false, messages: false, users: false });
    };

    fetchAll();
  }, []);

  // KPIs (sans revenus)
  const kpis = useMemo(() => {
    const available = vehicles.filter((v) => (v.status ?? v.etat) === "available").length;
    const activeRes = reservations.filter((r) => r.status === "confirmed").length;
    const unread = messages.filter((m) => !(m.read ?? m.lu)).length;
    return { available, activeRes, unread };
  }, [vehicles, reservations, messages]);

  // Recherches locales
  const vehiclesFiltered = useMemo(() => {
    const q = queryVehicles.toLowerCase().trim();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      `${v.name ?? v.nom} ${v.brand ?? v.marque} ${v.plate ?? v.immatriculation}`.toLowerCase().includes(q)
    );
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
      // ici tu peux déclencher un toast si tu en as
      console.error("Delete error:", e?.response?.data || e.message);
    } finally {
      closeDelete();
    }
  };

  /* =========================
     Responsive: 
     - mobile: onglets compacts + cartes au lieu de tables
     - desktop: sidebar + tableaux
     ========================= */

  return (
    <div className="min-h-[calc(100vh-6rem)] px-3 sm:px-4 pb-6 space-y-4">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Administration</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Gérez véhicules, réservations, messages et utilisateurs.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Button variant="secondary" onClick={() => setTab("reservations")}>
            Nouvelle réservation
          </Button>
          <Button onClick={() => setTab("vehicles")}>Ajouter un véhicule</Button>
        </div>
      </div>

      {/* Onglets mobiles */}
      <div className="sm:hidden">
        <div className="grid grid-cols-2 gap-2">
          {[
            ["overview", "Vue d'ensemble"],
            ["vehicles", "Véhicules"],
            ["reservations", "Réservations"],
            ["messages", "Messages"],
            ["users", "Utilisateurs"],
          ].map(([key, label]) => (
            <button
              key={key}
              className={`px-3 py-2 rounded-xl text-sm ${
                tab === key ? "bg-zinc-900 text-white dark:bg-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800"
              }`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[16rem_1fr] gap-4">
        {/* Sidebar desktop */}
        <aside className="hidden sm:block w-64 shrink-0">
          <Card>
            <nav className="p-2">
              {[
                ["overview", "Vue d'ensemble"],
                ["vehicles", "Véhicules"],
                ["reservations", "Réservations"],
                ["messages", "Messages"],
                ["users", "Utilisateurs"],
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
        <main className="space-y-4">
          {/* OVERVIEW (sans revenus) */}
          {tab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader title="Véhicules disponibles" />
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">{kpis.available}</div>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">Prêts à être loués</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Locations actives" />
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">{kpis.activeRes}</div>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">En cours aujourd'hui</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Messages en attente" />
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold">{kpis.unread}</div>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">À traiter</p>
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
                right={
                  <div className="flex items-center gap-2">
                    <Input placeholder="Rechercher..." value={queryVehicles} onChange={(e) => setQueryVehicles(e.target.value)} className="w-40 sm:w-56" />
                  </div>
                }
              />
              <CardContent>
                {/* Mobile: cartes */}
                <div className="grid gap-3 sm:hidden">
                  {vehiclesFiltered.map((v) => {
                    const id = v.id || v._id;
                    return (
                      <div key={id} className="rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{v.name ?? v.nom}</div>
                          <div>
                            {(v.status ?? v.etat) === "available" && <Badge intent="success">Disponible</Badge>}
                            {(v.status ?? v.etat) === "unavailable" && <Badge intent="danger">Indispo</Badge>}
                            {(v.status ?? v.etat) === "maintenance" && <Badge intent="warning">Maintenance</Badge>}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                          {v.brand ?? v.marque} · {v.plate ?? v.immatriculation} · {(v.pricePerDay ?? v.prixParJour) || "-"} €/j
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => console.log("edit vehicle", id)}>Éditer</Button>
                          <Button variant="danger" size="sm" onClick={() => openDelete("vehicle", id, v.name ?? v.nom)}>Supprimer</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop: tableau */}
                <div className="hidden sm:block">
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
                                <Button variant="secondary" size="sm" onClick={() => console.log("edit vehicle", id)}>Éditer</Button>
                                <Button variant="danger" size="sm" onClick={() => openDelete("vehicle", id, v.name ?? v.nom)}>Supprimer</Button>
                              </div>
                            </Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {loading.vehicules && <p className="text-xs text-zinc-500 mt-3">Chargement des véhicules…</p>}
                {error.vehicules && <p className="text-xs text-red-600 mt-3">{error.vehicules}</p>}
              </CardContent>
            </Card>
          )}

          {/* RESERVATIONS */}
          {tab === "reservations" && (
            <Card>
              <CardHeader
                title="Réservations"
                description="Suivez et gérez les réservations clients."
                right={<Input placeholder="Rechercher..." value={queryReservations} onChange={(e) => setQueryReservations(e.target.value)} className="w-40 sm:w-56" />}
              />
              <CardContent>
                {/* Mobile: cartes */}
                <div className="grid gap-3 sm:hidden">
                  {reservationsFiltered.map((r) => {
                    const id = r.id || r._id;
                    return (
                      <div key={id} className="rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{r.customer ?? r.client}</div>
                          <div>
                            {r.status === "confirmed" && <Badge intent="success">Confirmée</Badge>}
                            {r.status === "pending" && <Badge intent="warning">En attente</Badge>}
                            {r.status === "cancelled" && <Badge intent="danger">Annulée</Badge>}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                          {r.vehicle ?? r.vehicule} · {r.startDate ? new Date(r.startDate).toLocaleDateString("fr-FR") : "-"} → {r.endDate ? new Date(r.endDate).toLocaleDateString("fr-FR") : "-"}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => console.log("edit reservation", id)}>Éditer</Button>
                          <Button variant="danger" size="sm" onClick={() => openDelete("reservation", id, r.customer ?? r.client)}>Supprimer</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop: tableau */}
                <div className="hidden sm:block">
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
                                <Button variant="secondary" size="sm" onClick={() => console.log("edit reservation", id)}>Éditer</Button>
                                <Button variant="danger" size="sm" onClick={() => openDelete("reservation", id, r.customer ?? r.client)}>Supprimer</Button>
                              </div>
                            </Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {loading.reservations && <p className="text-xs text-zinc-500 mt-3">Chargement des réservations…</p>}
                {error.reservations && <p className="text-xs text-red-600 mt-3">{error.reservations}</p>}
              </CardContent>
            </Card>
          )}

          {/* MESSAGES */}
          {tab === "messages" && (
            <Card>
              <CardHeader
                title="Messages"
                description="Messages de contact reçus via le site."
                right={<Input placeholder="Rechercher..." value={queryMessages} onChange={(e) => setQueryMessages(e.target.value)} className="w-40 sm:w-56" />}
              />
              <CardContent>
                {/* Mobile: cartes */}
                <div className="grid gap-3 sm:hidden">
                  {messagesFiltered.map((m) => {
                    const id = m.id || m._id;
                    return (
                      <div key={id} className="rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{m.name ?? m.nom}</div>
                          <div>{(m.read ?? m.lu) ? <Badge intent="neutral">Lu</Badge> : <Badge intent="warning">Non lu</Badge>}</div>
                        </div>
                        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 truncate">{m.email}</div>
                        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 truncate">{m.subject ?? m.objet}</div>
                        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                          {m.createdAt ? new Date(m.createdAt).toLocaleString("fr-FR") : "-"}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => console.log("reply message", id)}>Répondre</Button>
                          <Button variant="danger" size="sm" onClick={() => openDelete("message", id, m.subject ?? m.objet)}>Supprimer</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop: tableau */}
                <div className="hidden sm:block">
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
                                <Button variant="secondary" size="sm" onClick={() => console.log("reply message", id)}>Répondre</Button>
                                <Button variant="danger" size="sm" onClick={() => openDelete("message", id, m.subject ?? m.objet)}>Supprimer</Button>
                              </div>
                            </Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {loading.messages && <p className="text-xs text-zinc-500 mt-3">Chargement des messages…</p>}
                {error.messages && <p className="text-xs text-amber-600 mt-3">{error.messages}</p>}
              </CardContent>
            </Card>
          )}

          {/* USERS */}
          {tab === "users" && (
            <Card>
              <CardHeader title="Utilisateurs" description="Comptes internes et rôles." />
              <CardContent>
                {/* Mobile: cartes */}
                <div className="grid gap-3 sm:hidden">
                  {users.map((u) => {
                    const id = u.id || u._id;
                    return (
                      <div key={id} className="rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800 p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{u.name ?? u.nom}</div>
                          <div>{u.active ? <Badge intent="success">Actif</Badge> : <Badge intent="warning">Suspendu</Badge>}</div>
                        </div>
                        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 truncate">{u.email}</div>
                        <div className="mt-2 flex gap-2">
                          <Button variant="secondary" size="sm" onClick={() => console.log("edit user", id)}>Éditer</Button>
                          <Button variant="danger" size="sm" onClick={() => openDelete("user", id, u.name ?? u.nom)}>Supprimer</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop: tableau */}
                <div className="hidden sm:block">
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
                                <Button variant="secondary" size="sm" onClick={() => console.log("edit user", id)}>Éditer</Button>
                                <Button variant="danger" size="sm" onClick={() => openDelete("user", id, u.name ?? u.nom)}>Supprimer</Button>
                              </div>
                            </Td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {loading.users && <p className="text-xs text-zinc-500 mt-3">Chargement des utilisateurs…</p>}
                {error.users && <p className="text-xs text-red-600 mt-3">{error.users}</p>}
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