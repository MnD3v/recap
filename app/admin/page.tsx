'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { db } from "@/lib/firebase";

type Tutorial = {
  id: string;
  title: string;
  description: string;
  technicalDescription: string;
  videoUrl: string;
  createdAt: Date;
  ownerName?: string | null;
};

type StudentWatchData = {
  userId: string;
  totalMinutesWatched: number;
  lastUpdated: Date;
};

type TutorialEngagement = {
  tutorialId: string;
  tutorialTitle: string;
  students: StudentWatchData[];
};

const initialForm = {
  title: "",
  description: "",
  technicalDescription: "",
  videoUrl: "",
};

const initialFAQForm = {
  tutorialId: "",
  question: "",
  description: "",
  videoUrl: "",
};

export default function AdminPage() {
  const { user } = useAuth();
  const [formValues, setFormValues] = useState(initialForm);
  const [faqFormValues, setFaqFormValues] = useState(initialFAQForm);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [engagementData, setEngagementData] = useState<TutorialEngagement[]>([]);
  const [selectedTutorialId, setSelectedTutorialId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [faqStatus, setFaqStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [faqFormError, setFaqFormError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "engagement" | "faq">("form");
  const [pendingDelete, setPendingDelete] = useState<Tutorial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const tutorialsQuery = query(
      collection(db, "tutorials"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      tutorialsQuery,
      (snapshot) => {
        const nextTutorials: Tutorial[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          const timestamp = data.createdAt as Timestamp | undefined;

          return {
            id: doc.id,
            title: data.title ?? "",
            description: data.description ?? "",
            technicalDescription: data.technicalDescription ?? "",
            videoUrl: data.videoUrl ?? "",
            ownerName: data.ownerName ?? null,
            createdAt: timestamp?.toDate
              ? timestamp.toDate()
              : new Date(data.createdAt ?? Date.now()),
          };
        });

        setTutorials(nextTutorials);
      },
      (error) => {
        console.error("Erreur lors de la récupération des tutoriels", error);
      },
    );

    return () => unsubscribe();
  }, []);

  // Fetch engagement data for all tutorials
  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        const allUsers = await getDocs(collection(db, "users"));
        const engagement: TutorialEngagement[] = [];

        for (const userDoc of allUsers.docs) {
          const watchSessionsCollection = collection(userDoc.ref, "watchSessions");
          const sessions = await getDocs(watchSessionsCollection);

          for (const sessionDoc of sessions.docs) {
            const data = sessionDoc.data();
            const tutorialId = sessionDoc.id;

            let tutorialEngagement = engagement.find((e) => e.tutorialId === tutorialId);
            if (!tutorialEngagement) {
              const tutorialData = tutorials.find((t) => t.id === tutorialId);
              tutorialEngagement = {
                tutorialId,
                tutorialTitle: tutorialData?.title || "Tutoriel sans titre",
                students: [],
              };
              engagement.push(tutorialEngagement);
            }

            tutorialEngagement.students.push({
              userId: userDoc.id,
              totalMinutesWatched: data.totalMinutesWatched || 0,
              lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
            });
          }
        }

        setEngagementData(engagement);
      } catch (error) {
        console.error("Erreur lors du chargement des données d'engagement:", error);
      }
    };

    if (tutorials.length > 0) {
      fetchEngagementData();
    }
  }, [tutorials]);

  const totalTutorials = useMemo(() => tutorials.length, [tutorials]);

  const selectedEngagement = useMemo(
    () => engagementData.find((e) => e.tutorialId === selectedTutorialId),
    [engagementData, selectedTutorialId],
  );

  const handleChange =
    (field: keyof typeof initialForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const resetForm = () => {
    setFormValues(initialForm);
  };

  const handleDeleteTutorial = (tutorial: Tutorial) => {
    setDeleteError(null);
    setPendingDelete(tutorial);
  };

  const confirmDeleteTutorial = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteDoc(doc(db, "tutorials", pendingDelete.id));
      if (selectedTutorialId === pendingDelete.id) {
        setSelectedTutorialId(null);
      }
      setPendingDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression du tutoriel:", error);
      setDeleteError("Impossible de supprimer ce tutoriel. Veuillez réessayer.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!formValues.title || !formValues.videoUrl) {
      setFormError("Merci de renseigner au minimum un titre et un lien vidéo.");
      return;
    }

    const urlPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+$/i;

    if (!urlPattern.test(formValues.videoUrl)) {
      setFormError(
        "Veuillez saisir un lien YouTube valide (ex: https://youtu.be/...).",
      );
      return;
    }

    try {
      setStatus("saving");

      await addDoc(collection(db, "tutorials"), {
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        videoUrl: formValues.videoUrl.trim(),
        ownerId: user?.uid ?? null,
        ownerEmail: user?.email ?? null,
        ownerName: user?.displayName ?? null,
        createdAt: Timestamp.now(),
      });

      resetForm();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setFormError(
        "Un incident est survenu lors de l'enregistrement. Merci de réessayer.",
      );
      setTimeout(() => setStatus("idle"), 1500);
    }
  };

  const handleFAQChange =
    (field: keyof typeof initialFAQForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFaqFormValues({ ...faqFormValues, [field]: event.target.value });
    };

  const handleFAQSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFaqFormError(null);

    if (!faqFormValues.tutorialId || !faqFormValues.question || !faqFormValues.videoUrl) {
      setFaqFormError("Merci de renseigner un tutoriel, une question et un lien vidéo.");
      return;
    }

    const urlPattern =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+$/i;

    if (!urlPattern.test(faqFormValues.videoUrl)) {
      setFaqFormError(
        "Veuillez saisir un lien YouTube valide (ex: https://youtu.be/...).",
      );
      return;
    }

    try {
      setFaqStatus("saving");

      await addDoc(collection(db, "videoFAQs"), {
        tutorialId: faqFormValues.tutorialId.trim(),
        question: faqFormValues.question.trim(),
        description: faqFormValues.description.trim(),
        videoUrl: faqFormValues.videoUrl.trim(),
        createdBy: user?.displayName ?? user?.email ?? null,
        createdAt: Timestamp.now(),
      });

      setFaqStatus("saved");
      setFaqFormValues(initialFAQForm);
      setTimeout(() => setFaqStatus("idle"), 2000);
    } catch (error) {
      console.error(error);
      setFaqStatus("error");
      setFaqFormError(
        "Un incident est survenu lors de l'enregistrement. Merci de réessayer.",
      );
      setTimeout(() => setFaqStatus("idle"), 1500);
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black pb-24">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pt-12">
          <header className="flex flex-col gap-6 rounded-[36px] border border-gray-800 bg-gray-950 p-10 shadow-[0_32px_80px_rgba(0,0,0,0.3)] md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Espace administration
              </p>
              <h1 className="mt-4 text-4xl font-semibold text-white">
                Bibliothèque des tutoriels &amp; suivi d&apos;engagement
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300">
                Centralisez vos ressources pédagogiques, ajoutez des descriptions
                détaillées et associez chaque vidéo YouTube en moins de deux minutes.
                Ces contenus alimentent automatiquement l&apos;interface étudiante.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-800 bg-gray-900 px-6 py-4 text-sm text-gray-300">
              <p className="font-semibold text-white">Équipe pédagogique</p>
              <p className="mt-1">{user?.displayName ?? user?.email}</p>
              <p className="mt-2 text-xs text-gray-400">
                {totalTutorials} contenu(s) actuellement dans votre catalogue.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("form")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeTab === "form"
                    ? "bg-white text-black"
                    : "border border-gray-700 text-white hover:border-gray-600"
                }`}
              >
                Ajouter un contenu
              </button>
              <button
                onClick={() => setActiveTab("engagement")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  activeTab === "engagement"
                    ? "bg-white text-black"
                    : "border border-gray-700 text-white hover:border-gray-600"
                }`}
              >
                Engagement ({engagementData.length})
              </button>
            </div>
          </header>

          {activeTab === "form" && (
          <section className="grid gap-8 rounded-[32px] border border-gray-800 bg-gray-950 p-10 shadow-[0_32px_80px_rgba(0,0,0,0.3)] lg:grid-cols-[1.2fr_1fr]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Ajouter un contenu
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Renseignez les informations nécessaires pour intégrer un nouveau
                  tutoriel dans votre parcours Recap.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-300"
                  htmlFor="title"
                >
                  Titre du cours
                </label>
                <input
                  id="title"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange("title")}
                  placeholder="Leadership Studio — Module 03"
                  className="w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-800 focus:ring-2 focus:ring-gray-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-300"
                  htmlFor="description"
                >
                  Description détaillée
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formValues.description}
                  onChange={handleChange("description")}
                  placeholder="Objectifs pédagogiques, activités proposées, points de vigilance..."
                  className="w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-800 focus:ring-2 focus:ring-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-300"
                  htmlFor="technicalDescription"
                >
                  Description technique (pour l&apos;IA)
                </label>
                <textarea
                  id="technicalDescription"
                  name="technicalDescription"
                  rows={4}
                  value={formValues.technicalDescription}
                  onChange={handleChange("technicalDescription")}
                  placeholder="Détails techniques, concepts clés, vocabulaire important pour l'IA..."
                  className="w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-800 focus:ring-2 focus:ring-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-300"
                  htmlFor="videoUrl"
                >
                  Lien vidéo YouTube
                </label>
                <input
                  id="videoUrl"
                  name="videoUrl"
                  type="url"
                  value={formValues.videoUrl}
                  onChange={handleChange("videoUrl")}
                  placeholder="https://youtu.be/..."
                  className="w-full rounded-2xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-800 focus:ring-2 focus:ring-gray-700"
                  required
                />
              </div>

              {formError ? (
                <div className="rounded-2xl border border-red-900/50 bg-red-950/50 px-4 py-3 text-sm text-red-400">
                  {formError}
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "saving"}
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-white/15 transition hover:bg-gray-200 disabled:cursor-wait disabled:opacity-80"
                >
                  {status === "saving" ? "Enregistrement..." : "Ajouter au catalogue"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-gray-600 hover:text-white"
                >
                  Réinitialiser
                </button>
                {status === "saved" ? (
                  <span className="text-sm font-medium text-emerald-400">
                    Contenu enregistré
                  </span>
                ) : null}
                {status === "error" ? (
                  <span className="text-sm font-medium text-red-400">
                    Erreur lors de l&apos;enregistrement
                  </span>
                ) : null}
              </div>
            </form>

            <aside className="flex flex-col gap-5 rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-inner">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Prévisualisation
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Playlist en cours
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Les ressources ajoutées ici apparaissent instantanément côté
                  étudiant.
                </p>
              </div>
              <div className="flex-1 space-y-4">
                {tutorials.length === 0 ? (
                  <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-700 bg-gray-950 px-6 text-center text-sm text-gray-500">
                    <p>Ajoutez un premier contenu pour le visualiser ici.</p>
                  </div>
                ) : (
                  tutorials.map((tutorial) => (
                    <div
                      key={tutorial.id}
                      className="rounded-3xl border border-gray-800 bg-black px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-400">
                            {tutorial.createdAt.toLocaleDateString("fr-FR", {
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-white">
                            {tutorial.title}
                          </p>
                          {tutorial.description ? (
                            <p className="mt-1 text-sm text-gray-300">
                              {tutorial.description}
                            </p>
                          ) : null}
                          {tutorial.ownerName ? (
                            <p className="mt-2 text-xs text-gray-400">
                              Publié par {tutorial.ownerName}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 flex-col gap-2">
                          <a
                            href={tutorial.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-[#ff2600]-900/50 bg-[#ff2600]-950 px-3 py-1 text-xs font-semibold text-[#ff2600]-400 transition hover:border-[#ff2600]-800 hover:bg-[#ff2600]-900"
                          >
                            Ouvrir la vidéo
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5h10m0 0v10m0-10L5 19"
                              />
                            </svg>
                          </a>
                          <a
                            href={`/stats/${tutorial.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-900/50 bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-400 transition hover:border-emerald-800 hover:bg-emerald-900"
                          >
                            Voir les stats
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteTutorial(tutorial)}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-900/50 bg-red-950 px-3 py-1 text-xs font-semibold text-red-400 transition hover:border-red-800 hover:bg-red-900"
                          >
                            Supprimer
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </aside>
          </section>
          )}

          {activeTab === "faq" && (
            <section className="rounded-[32px] border border-gray-800 bg-gray-950 p-10 shadow-[0_32px_80px_rgba(0,0,0,0.3)]">
              <form onSubmit={handleFAQSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    📹 Ajouter une Vidéo FAQ
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Créez des réponses vidéo aux questions fréquentes des étudiants
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-white"
                    htmlFor="tutorialId"
                  >
                    Tutoriel concerné
                  </label>
                  <select
                    id="tutorialId"
                    name="tutorialId"
                    required
                    value={faqFormValues.tutorialId}
                    onChange={(e) => setFaqFormValues({ ...faqFormValues, tutorialId: e.target.value })}
                    className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700 cursor-pointer"
                  >
                    <option value="" className="bg-gray-800">Sélectionnez un tutoriel</option>
                    {tutorials.map((tutorial) => (
                      <option key={tutorial.id} value={tutorial.id} className="bg-gray-800">
                        {tutorial.title}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400">
                    La FAQ sera visible sur la page de ce tutoriel
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-white"
                    htmlFor="question"
                  >
                    Question posée
                  </label>
                  <input
                    id="question"
                    name="question"
                    type="text"
                    required
                    value={faqFormValues.question}
                    onChange={handleFAQChange("question")}
                    placeholder="Ex: Comment utiliser la fonction X ?"
                    className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-white"
                    htmlFor="faq-description"
                  >
                    Description / Contexte
                  </label>
                  <textarea
                    id="faq-description"
                    name="description"
                    rows={4}
                    value={faqFormValues.description}
                    onChange={handleFAQChange("description")}
                    placeholder="Contexte de la question, détails supplémentaires..."
                    className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-white"
                    htmlFor="faq-videoUrl"
                  >
                    Lien vidéo YouTube
                  </label>
                  <input
                    id="faq-videoUrl"
                    name="videoUrl"
                    type="url"
                    required
                    value={faqFormValues.videoUrl}
                    onChange={handleFAQChange("videoUrl")}
                    placeholder="https://youtu.be/..."
                    className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700"
                  />
                  <p className="text-xs text-gray-400">
                    Collez le lien complet de votre vidéo YouTube
                  </p>
                </div>

                {faqFormError && (
                  <div className="rounded-2xl border border-rose-900 bg-rose-900/30 px-4 py-3 text-sm text-rose-400">
                    {faqFormError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={faqStatus === "saving"}
                  className="flex w-full items-center justify-center rounded-full bg-[#ff2600]-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff2600]-600/30 transition hover:bg-[#ff2600]-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {faqStatus === "saving" && "Enregistrement..."}
                  {faqStatus === "saved" && "✓ Enregistrée"}
                  {(faqStatus === "idle" || faqStatus === "error") &&
                    "Publier la FAQ vidéo"}
                </button>
              </form>
            </section>
          )}

          {activeTab === "engagement" && (
          <section className="rounded-[32px] border border-gray-800 bg-gray-950 p-10 shadow-[0_32px_80px_rgba(0,0,0,0.3)]">
            <h3 className="text-2xl font-semibold text-white">
              Suivi d&apos;engagement par tutoriel
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              Consultez le temps de visionnage de chaque étudiant pour chaque tutoriel
            </p>

            {engagementData.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-700 bg-gray-900 px-6 py-12 text-center text-sm text-gray-400">
                Aucune donnée d&apos;engagement pour le moment. Les étudiants doivent visionner des tutoriels pour que les données apparaissent.
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                {/* Tutorial Selection */}
                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
                  <p className="mb-3 text-sm font-semibold text-gray-300">Sélectionner un tutoriel</p>
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {engagementData.map((engagement) => (
                      <button
                        key={engagement.tutorialId}
                        onClick={() => setSelectedTutorialId(engagement.tutorialId)}
                        className={`rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                          selectedTutorialId === engagement.tutorialId
                            ? "border-2 border-[#ff2600]-600 bg-[#ff2600]-950 text-[#ff2600]-300"
                            : "border border-gray-700 bg-black text-gray-300 hover:border-gray-600"
                        }`}
                      >
                        <p className="font-semibold">{engagement.tutorialTitle}</p>
                        <p className="text-xs text-gray-500">
                          {engagement.students.length} étudiant(s)
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Tutorial Details */}
                {selectedEngagement && (
                  <div className="rounded-2xl border border-gray-800 bg-black p-6">
                    <h4 className="text-lg font-semibold text-white">
                      {selectedEngagement.tutorialTitle}
                    </h4>
                    <p className="mt-1 text-sm text-gray-400">
                      {selectedEngagement.students.length} étudiant(s) ayant suivi ce tutoriel
                    </p>

                    {selectedEngagement.students.length === 0 ? (
                      <div className="mt-6 rounded-xl border border-dashed border-gray-700 bg-gray-900 px-4 py-6 text-center text-sm text-gray-400">
                        Aucun suivi enregistré pour ce tutoriel.
                      </div>
                    ) : (
                      <div className="mt-6 overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                                ID Étudiant
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-white">
                                Minutes visionnées
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-semibold text-white">
                                Dernière activité
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedEngagement.students
                              .sort(
                                (a, b) => b.totalMinutesWatched - a.totalMinutesWatched,
                              )
                              .map((student) => (
                                <tr
                                  key={student.userId}
                                  className="border-b border-gray-800 transition hover:bg-gray-900"
                                >
                                  <td className="px-4 py-4 text-sm font-mono text-gray-300">
                                    {student.userId.substring(0, 12)}...
                                  </td>
                                  <td className="px-4 py-4 text-right">
                                    <span className="inline-flex items-center rounded-full border border-[#ff2600]-900/50 bg-[#ff2600]-950 px-3 py-1 text-sm font-semibold text-[#ff2600]-400">
                                      {student.totalMinutesWatched} min
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 text-right text-sm text-gray-300">
                                    {student.lastUpdated.toLocaleDateString(
                                      "fr-FR",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
          )}
        </div>
      </div>

      {pendingDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
                  Confirmation
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Supprimer ce tutoriel ?
                </h2>
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-slate-300">
              Vous êtes sur le point de supprimer{" "}
              <span className="font-semibold text-white">
                {pendingDelete.title || "ce tutoriel"}
              </span>
              . Cette action est définitive et retirera immédiatement la ressource des
              espaces étudiants.
            </p>

            {deleteError ? (
              <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {deleteError}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => (isDeleting ? null : setPendingDelete(null))}
                className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDeleteTutorial}
                className="rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-400 disabled:cursor-wait disabled:opacity-70"
                disabled={isDeleting}
              >
                {isDeleting ? "Suppression..." : "Confirmer la suppression"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </RequireAuth>
  );
}

