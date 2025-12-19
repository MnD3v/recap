'use client';

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";
import { NotificationBell } from "@/components/NotificationBell";

type Playlist = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: Date;
};

type Tutorial = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  createdAt: Date;
  ownerName?: string | null;
  playlistId?: string | null;
};


export default function Home() {
  const { user } = useAuth();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Charger les tutoriels
    const tutorialsQuery = query(
      collection(db, "tutorials"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribeTutorials = onSnapshot(
      tutorialsQuery,
      (snapshot) => {
        const nextTutorials: Tutorial[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          const timestamp = data.createdAt as Timestamp | undefined;

          return {
            id: doc.id,
            title: data.title ?? "Tutoriel sans titre",
            description: data.description ?? "",
            videoUrl: data.videoUrl ?? "",
            ownerName: data.ownerName ?? null,
            playlistId: data.playlistId ?? null,
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

    // Charger les playlists
    const playlistsQuery = query(
      collection(db, "playlists"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribePlaylists = onSnapshot(
      playlistsQuery,
      (snapshot) => {
        const nextPlaylists: Playlist[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          const timestamp = data.createdAt as Timestamp | undefined;

          return {
            id: doc.id,
            name: data.name ?? "",
            description: data.description ?? "",
            color: data.color ?? "from-blue-500 to-blue-600",
            icon: data.icon ?? "📚",
            createdAt: timestamp?.toDate
              ? timestamp.toDate()
              : new Date(data.createdAt ?? Date.now()),
          };
        });
        setPlaylists(nextPlaylists);
      },
      (error) => {
        console.error("Erreur lors de la récupération des playlists", error);
      },
    );

    return () => {
      unsubscribeTutorials();
      unsubscribePlaylists();
    };
  }, []);

  const tutorialCards = useMemo(() => {
    if (!selectedPlaylist) return [];

    const filtered = tutorials.filter(t => t.playlistId === selectedPlaylist.id);

    return filtered.map((tutorial) => {
      const formattedDate = tutorial.createdAt.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      return {
        id: tutorial.id,
        title: tutorial.title,
        description:
          tutorial.description ||
          "Description à compléter pour guider vos étudiants.",
        videoUrl: tutorial.videoUrl,
        ownerName: tutorial.ownerName ?? undefined,
        meta: `Ajouté le ${formattedDate}`,
      };
    });
  }, [tutorials, selectedPlaylist]);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <RequireAuth>
      <div className="min-h-screen">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 animate-fade-in">
          <div className="flex items-center gap-3 animate-slide-in-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white transition-smooth hover:scale-110">
              <span className="text-lg font-semibold text-black">R</span>
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight text-white">
                Recap
              </p>
            </div>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-gray-300 md:flex animate-slide-in-right">
            <a className="transition-smooth hover:text-white hover:scale-105" href="#tutorials">
              Tutoriels
            </a>
            <a className="transition-smooth hover:text-white hover:scale-105" href="#experience">
              Expérience
            </a>
            <a className="flex items-center gap-2 transition-smooth hover:text-white hover:scale-105" href="/resources">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Ressources
            </a>
            <NotificationBell />
            <span className="rounded-full border border-gray-600 px-4 py-2 text-xs font-semibold text-gray-300">
              {user?.displayName ?? user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="rounded-full bg-white px-5 py-2 text-black font-semibold shadow-lg transition-smooth hover:bg-gray-200 hover:scale-105"
            >
              Se déconnecter
            </button>
          </nav>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <NotificationBell />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center rounded-lg p-2 text-gray-300 transition hover:bg-gray-800"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm md:hidden animate-fade-in">
            <div className="flex h-full flex-col">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between border-b border-gray-800 px-6 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                    <span className="text-lg font-semibold text-black">R</span>
                  </div>
                  <p className="text-xl font-semibold text-white">Recap</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-gray-300 transition hover:bg-gray-800"
                  aria-label="Fermer le menu"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Content */}
              <nav className="flex flex-1 flex-col gap-2 overflow-y-auto p-6">
                <a
                  href="#tutorials"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-4 text-base font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Tutoriels
                </a>

                <a
                  href="#experience"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-4 text-base font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Expérience
                </a>
                <a
                  href="/resources"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-4 text-base font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Ressources
                </a>

                <div className="my-4 border-t border-gray-800"></div>

                {/* User Info */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-4">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff2600] text-sm font-bold text-white">
                      {user?.displayName?.charAt(0) ?? user?.email?.charAt(0) ?? 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {user?.displayName ?? 'Utilisateur'}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-base font-semibold text-black transition hover:bg-gray-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Se déconnecter
                </button>
              </nav>
            </div>
          </div>
        )}

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 md:px-6 pb-24">

          {/* Hero Section - Landing Page */}
          <section className="px-6 py-16 md:py-24 animate-fade-in">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-slide-in-left">
                Suivez l&apos;engagement de vos étudiants
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed animate-slide-in-right" style={{ animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards' }}>
                Recap vous permet de mesurer précisément le temps que chaque étudiant consacre à vos tutoriels vidéo,
                tout en créant un espace d&apos;entraide où ils peuvent poser des questions et s&apos;entraider.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
                <div className="rounded-3xl border border-gray-700 bg-linear-to-br from-gray-900 to-black p-8 hover-lift animate-scale-in" style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff2600]/10">
                    <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Suivi d&apos;engagement précis
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Mesurez minute par minute le temps de visionnage de chaque étudiant.
                    Identifiez ceux qui sont investis et accompagnez ceux qui décrochent.
                  </p>
                </div>

                <div className="rounded-3xl border border-gray-700 bg-linear-to-br from-gray-900 to-black p-8 hover-lift animate-scale-in" style={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff2600]/10">
                    <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Entraide communautaire
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Vos étudiants posent des questions intelligentes et y répondent entre eux.
                    Créez une communauté d&apos;apprentissage collaborative et autonome.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            id="tutorials"
            className="grid gap-8 rounded-[36px] border border-gray-700 bg-black p-4 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.3)] animate-scale-in"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-fade-in stagger-1">
              <div>
                <h2 className="text-3xl font-semibold text-white">
                  {selectedPlaylist ? selectedPlaylist.name : "Vos parcours d'apprentissage"}
                </h2>
                {selectedPlaylist ? (
                  <button
                    onClick={() => setSelectedPlaylist(null)}
                    className="mt-2 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Retour aux playlists
                  </button>
                ) : (
                  <p className="mt-2 text-gray-400">
                    Sélectionnez une thématique pour accéder aux tutoriels correspondants.
                  </p>
                )}
              </div>
            </div>

            {!selectedPlaylist ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {playlists.length > 0 ? (
                  playlists.map((playlist, index) => {
                    const count = tutorials.filter(t => t.playlistId === playlist.id).length;
                    return (
                      <button
                        key={playlist.id}
                        onClick={() => setSelectedPlaylist(playlist)}
                        className="group relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/50 p-8 text-left transition hover:border-gray-600 hover:bg-gray-900 animate-fade-in"
                        style={{ animationDelay: `${0.1 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
                      >
                        <div className={`absolute inset-0 bg-linear-to-br ${playlist.color} opacity-0 transition group-hover:opacity-5`} />
                        <span className="text-4xl mb-4 block">{playlist.icon}</span>
                        <h3 className="text-xl font-bold text-white mb-2">{playlist.name}</h3>
                        <p className="text-sm text-gray-400 mb-6 line-clamp-2 min-h-[40px]">{playlist.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs font-medium text-gray-500">{count} tutoriel{count !== 1 ? 's' : ''}</span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 bg-black text-white transition group-hover:border-gray-500 group-hover:bg-gray-800">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full rounded-3xl border border-dashed border-gray-600 bg-black px-6 py-12 text-center text-sm text-gray-400">
                    Aucune playlist disponible. Rendez-vous dans l'espace administration pour créer votre première playlist.
                  </div>
                )}
              </div>
            ) : (
              <>
                {tutorialCards.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-3">
                    {tutorialCards.map((item, index) => (
                      <article
                        key={item.id}
                        className="group relative overflow-hidden rounded-3xl border border-gray-700 bg-black p-6 hover-lift animate-fade-in"
                        style={{ animationDelay: `${0.1 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-32 opacity-0 transition group-hover:opacity-100"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(59,130,246,0.2), rgba(15,23,42,0), rgba(15,23,42,0))",
                          }}
                        />
                        <div>
                          <h3 className="mb-3 text-xl font-semibold text-white">
                            {item.title}
                          </h3>
                          <span className="text-xs font-semibold text-gray-500">
                            {item.meta}
                          </span>
                          <p className="text-sm leading-relaxed text-gray-300">
                            {item.description}
                          </p>
                          {item.videoUrl ? (
                            <a
                              href={`/watch/${item.id}`}
                              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#ff2600] transition hover:text-[#ff4433]"
                            >
                              Visionner le tutoriel
                              <svg
                                className="h-4 w-4"
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
                          ) : (
                            <span className="mt-8 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                              Lien en cours d&apos;ajout
                            </span>
                          )}
                          <div className="mt-4 flex items-center justify-between">
                            <span className="rounded-full bg-black text-xs font-medium text-gray-400">
                              {item.ownerName
                                ? `Publié par ${item.ownerName}`
                                : "Publié par votre équipe"}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-gray-600 bg-black px-6 py-12 text-center text-sm text-gray-400">
                    Cette playlist ne contient aucun tutoriel pour le moment.
                  </div>
                )}
              </>
            )}
          </section>

        </main>

        <footer className="mx-auto mt-16 flex w-full max-w-6xl flex-col items-center gap-4 px-6 pb-12 text-center text-sm text-gray-400 md:flex-row md:justify-between md:text-left">
          <p>
            © {new Date().getFullYear()} Recap. Pensé pour les pédagogues
            exigeants.
          </p>
          <div className="flex gap-6">
            <a className="hover:text-white" href="#">
              Guide enseignant
            </a>
            <a className="hover:text-white" href="#">
              Confidentialité
            </a>
            <a className="hover:text-white" href="#">
              Accessibilité
            </a>
          </div>
        </footer>
      </div>
    </RequireAuth>
  );
}
