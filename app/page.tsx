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

type Tutorial = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  createdAt: Date;
  ownerName?: string | null;
};

type VideoFAQ = {
  id: string;
  question: string;
  description: string;
  videoUrl: string;
  createdAt: Date;
  createdBy?: string | null;
};


const METRICS = [
  {
    label: "Temps moyen de visionnage",
    value: "87 %",
    change: "+12 % vs cohorte N-1",
  },
  {
    label: "Taux de complétion",
    value: "73 %",
    change: "+18 % avec rappels automatisés",
  },
  {
    label: "Étudiants actifs hebdomadaires",
    value: "92",
    change: "Top 10 % des parcours suivis",
  },
];

const STUDENT_FOLLOWUP = [
  {
    name: "Awa Ndiaye",
    status: "A visionné 94 %",
    tag: "Ambassadrice du cas",
  },
  {
    name: "Marc Lemoine",
    status: "Pause répétée à 02:14",
    tag: "Programmer un coaching",
  },
  {
    name: "Lina Benali",
    status: "3 réflexions partagées",
    tag: "À mettre en avant",
  },
];

const CTA_STEPS = [
  {
    title: "Connexion à la base de données",
    description:
      "Reliez ce tableau de bord à Firestore ou à votre API maison pour créer, publier et versionner vos cours en direct.",
  },
  {
    title: "Rôles & accès avancés",
    description:
      "Définissez les droits par équipe pédagogique, appliquez les règles Firebase Auth et sécurisez vos parcours premium.",
  },
  {
    title: "Suivi de cohorte",
    description:
      "Assignez chaque tutoriel à une promotion, déclenchez des rappels et comparez les niveaux d'attention d'une semaine à l'autre.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [videoFAQs, setVideoFAQs] = useState<VideoFAQ[]>([]);

  useEffect(() => {
    const tutorialsQuery = query(
      collection(db, "tutorials"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(
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

  // Fetch Video FAQs
  useEffect(() => {
    const faqsQuery = query(
      collection(db, "videoFAQs"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      faqsQuery,
      (snapshot) => {
        const faqs: VideoFAQ[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          const timestamp = data.createdAt as Timestamp | undefined;

          return {
            id: doc.id,
            question: data.question ?? "",
            description: data.description ?? "",
            videoUrl: data.videoUrl ?? "",
            createdBy: data.createdBy ?? null,
            createdAt: timestamp?.toDate
              ? timestamp.toDate()
              : new Date(data.createdAt ?? Date.now()),
          };
        });

        setVideoFAQs(faqs);
      },
      (error) => {
        console.error("Erreur lors de la récupération des FAQ vidéo", error);
      },
    );

    return () => unsubscribe();
  }, []);

  const tutorialCards = useMemo(() => {
    return tutorials.map((tutorial) => {
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
  }, [tutorials]);

  const hasTutorials = tutorialCards.length > 0;

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
          <nav className="hidden items-center gap-10 text-sm font-medium text-gray-300 md:flex animate-slide-in-right">
            <a className="transition-smooth hover:text-white hover:scale-105" href="#tutorials">
              Tutoriels
            </a>
            <a className="transition-smooth hover:text-white hover:scale-105" href="#experience">
              Expérience
            </a>
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
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 md:px-6 pb-24">
        
          <section
            id="tutorials"
            className="grid gap-8 rounded-[36px] border border-gray-700 bg-black p-4 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.3)] animate-scale-in"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between animate-fade-in stagger-1">
              <div>
           
                <h2 className="text-3xl font-semibold text-white">
                  Vos tutoriels sont prêts à être consultés
                   
                </h2>
              </div>
            </div>
            {hasTutorials ? (
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
                          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
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
                Aucune ressource n&apos;est encore publiée. Rendez-vous dans
                l&apos;espace administration pour ajouter votre premier tutoriel.
              </div>
            )}
          </section>

          {/* Video FAQs Section */}
          {videoFAQs.length > 0 && (
            <section className="mt-16 animate-fade-in">
              <div className="mb-8 animate-slide-in-left">
                <h2 className="text-2xl font-semibold text-white">
                  💡 FAQ Vidéo
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Réponses vidéo aux questions fréquentes des étudiants
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {videoFAQs.map((faq, index) => (
                  <article
                    key={faq.id}
                    className="group relative overflow-hidden rounded-3xl border border-gray-800 bg-black p-6 hover-lift animate-scale-in"
                    style={{ animationDelay: `${0.1 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-32 opacity-0 transition group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(239,68,68,0.2), rgba(0,0,0,0), rgba(0,0,0,0))",
                      }}
                    />
                    <div>
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-900/50 bg-red-950/30 px-3 py-1">
                        <span className="text-xs font-semibold text-red-400">❓ Question</span>
                      </div>
                      <h3 className="mb-3 text-xl font-semibold text-white">
                        {faq.question}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-300">
                        {faq.description}
                      </p>
                      <a
                        href={faq.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition hover:text-red-300"
                      >
                        📹 Voir la réponse vidéo
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
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
       
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
