'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addDoc, collection, doc, getDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RequireAuth } from '@/components/RequireAuth';
import { useAuth } from '@/components/AuthProvider';
import { EducationalLoader } from '@/components/EducationalLoader';

type Tutorial = {
  id: string;
  title: string;
  description: string;
  ownerName?: string | null;
};

type StudentStat = {
  userId: string;
  displayName: string | null;
  email: string | null;
  totalMinutesWatched: number;
  lastUpdated: Date;
  questions?: UserQuestion[];
};

type UserQuestion = {
  id: string;
  question: string;
  type: 'comprehension' | 'incomprehension';
  createdAt: Date;
};

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth(); // Ensure user is authenticated via RequireAuth
  const tutorialId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
  
  // FAQ Modal states
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [faqFormValues, setFaqFormValues] = useState({
    description: '',
    videoUrl: '',
  });
  const [faqStatus, setFaqStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [faqError, setFaqError] = useState<string | null>(null);

  const toggleStudentExpansion = (userId: string) => {
    setExpandedStudents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleOpenFAQModal = (question: string) => {
    setSelectedQuestion(question);
    setFaqFormValues({ description: '', videoUrl: '' });
    setFaqError(null);
    setFaqStatus('idle');
    setIsFAQModalOpen(true);
  };

  const handleCloseFAQModal = () => {
    setIsFAQModalOpen(false);
    setSelectedQuestion('');
    setFaqFormValues({ description: '', videoUrl: '' });
    setFaqError(null);
    setFaqStatus('idle');
  };

  const handleFAQChange = (field: 'description' | 'videoUrl') => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFaqFormValues({ ...faqFormValues, [field]: event.target.value });
  };

  const handleFAQSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFaqError(null);

    if (!faqFormValues.videoUrl) {
      setFaqError('Merci de renseigner un lien vidéo.');
      return;
    }

    const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+$/i;

    if (!urlPattern.test(faqFormValues.videoUrl)) {
      setFaqError('Veuillez saisir un lien YouTube valide (ex: https://youtu.be/...).');
      return;
    }

    try {
      setFaqStatus('saving');

      await addDoc(collection(db, 'videoFAQs'), {
        tutorialId: tutorialId,
        question: selectedQuestion,
        description: faqFormValues.description.trim(),
        videoUrl: faqFormValues.videoUrl.trim(),
        createdBy: user?.displayName ?? user?.email ?? null,
        createdAt: Timestamp.now(),
      });

      setFaqStatus('saved');
      setTimeout(() => {
        handleCloseFAQModal();
      }, 1500);
    } catch (error) {
      console.error(error);
      setFaqStatus('error');
      setFaqError('Un incident est survenu lors de l\'enregistrement. Merci de réessayer.');
      setTimeout(() => setFaqStatus('idle'), 1500);
    }
  };

  useEffect(() => {
    const fetchStatsData = async () => {
      if (!tutorialId) {
        setError('ID du tutoriel manquant');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching stats for tutorial:', tutorialId);

        // Fetch tutorial info
        const tutorialDoc = await getDoc(doc(collection(db, 'tutorials'), tutorialId));

        if (!tutorialDoc.exists()) {
          setError('Tutoriel non trouvé');
          setLoading(false);
          return;
        }

        const tutorialData = tutorialDoc.data();
        setTutorial({
          id: tutorialDoc.id,
          title: tutorialData.title ?? 'Tutoriel sans titre',
          description: tutorialData.description ?? '',
          ownerName: tutorialData.ownerName ?? null,
        });

        // Fetch all users and their watch sessions
        const allUsers = await getDocs(collection(db, 'users'));
        console.log('Total users in database:', allUsers.docs.length);
        
        const stats: StudentStat[] = [];

        for (const userDoc of allUsers.docs) {
          const watchSessionsCollection = collection(userDoc.ref, 'watchSessions');
          const sessionsSnapshot = await getDocs(watchSessionsCollection);
          
          console.log(`User ${userDoc.id} has ${sessionsSnapshot.docs.length} watch sessions`);

          // Fetch user's questions for this tutorial
          const questionsCollection = collection(userDoc.ref, 'questions');
          const questionsSnapshot = await getDocs(questionsCollection);
          const userQuestions: UserQuestion[] = [];

          questionsSnapshot.docs.forEach((questionDoc) => {
            const questionData = questionDoc.data();
            
            // Only include questions for this specific tutorial
            if (questionData.tutorialId === tutorialId) {
              userQuestions.push({
                id: questionDoc.id,
                question: questionData.question,
                type: questionData.type || 'comprehension',
                createdAt: questionData.createdAt?.toDate?.() || new Date(),
              });
            }
          });

          for (const sessionDoc of sessionsSnapshot.docs) {
            const sessionTutorialId = sessionDoc.id;
            
            // Only include if it matches our tutorialId
            if (sessionTutorialId === tutorialId) {
              const sessionData = sessionDoc.data();
              const userData = userDoc.data();
              
              console.log(`Found session for user ${userDoc.id}: ${sessionData.totalMinutesWatched} minutes`);
              
              stats.push({
                userId: userDoc.id,
                displayName: userData?.displayName || null,
                email: userData?.email || null,
                totalMinutesWatched: sessionData.totalMinutesWatched || 0,
                lastUpdated: sessionData.lastUpdated?.toDate?.() || new Date(),
                questions: userQuestions,
              });
              break; // Found the tutorial for this user, move to next user
            }
          }
        }

        // Sort by minutes watched (descending)
        stats.sort((a, b) => b.totalMinutesWatched - a.totalMinutesWatched);

        console.log(`Final stats: Loaded ${stats.length} students for tutorial ${tutorialId}`);
        setStudentStats(stats);
      } catch (err) {
        console.error('Erreur lors du chargement des stats:', err);
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, [tutorialId]);

  if (loading) {
    return (
      <RequireAuth>
        <EducationalLoader message="Chargement des statistiques..." />
      </RequireAuth>
    );
  }

  if (error || !tutorial) {
    return (
      <RequireAuth>
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="text-center">
            <p className="text-lg font-semibold text-white">
              {error || 'Tutoriel non trouvé'}
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
            >
              Retour
            </button>
          </div>
        </div>
      </RequireAuth>
    );
  }

  const totalViewers = studentStats.length;
  const totalMinutes = studentStats.reduce((sum, stat) => sum + stat.totalMinutesWatched, 0);
  const averageMinutes = totalViewers > 0 ? Math.round(totalMinutes / totalViewers) : 0;
  const maxMinutes = totalViewers > 0 ? Math.max(...studentStats.map((s) => s.totalMinutesWatched)) : 0;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Statistiques d&apos;engagement
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              {tutorial.title}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-full border border-gray-700 px-5 py-2 text-sm font-semibold text-white transition hover:border-gray-600"
          >
            ← Retour
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 pb-24">
          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Total visualisations
              </p>
              <p className="mt-3 text-3xl font-bold text-white">{totalViewers}</p>
              <p className="mt-2 text-xs text-gray-400">étudiant(s) ayant suivi</p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Temps moyen
              </p>
              <p className="mt-3 text-3xl font-bold text-indigo-400">{averageMinutes}</p>
              <p className="mt-2 text-xs text-gray-400">minutes par étudiant</p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Temps total
              </p>
              <p className="mt-3 text-3xl font-bold text-emerald-400">{totalMinutes}</p>
              <p className="mt-2 text-xs text-gray-400">minutes cumulées</p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                Max visualisé
              </p>
              <p className="mt-3 text-3xl font-bold text-rose-400">{maxMinutes}</p>
              <p className="mt-2 text-xs text-gray-400">minutes (meilleur étudiant)</p>
            </div>
          </div>

          {/* Detailed Table */}
          <section className="rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-white">
              Détail par étudiant
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Trié par temps de visionnage (du plus engagé au moins engagé)
            </p>

            {studentStats.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-gray-700 bg-gray-900 px-6 py-12 text-center text-sm text-gray-400">
                Aucune donnée de visionnage pour ce tutoriel.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                        Rang
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                        ID Étudiant
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-white">
                        Minutes visionnées
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-white">
                        % du temps moyen
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-white">
                        Dernière activité
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentStats.map((stat, index) => {
                      const percentageOfAverage = averageMinutes > 0
                        ? Math.round((stat.totalMinutesWatched / averageMinutes) * 100)
                        : 0;

                      let badgeColor = 'bg-gray-800 text-gray-300';
                      if (percentageOfAverage >= 150) badgeColor = 'bg-emerald-950 text-emerald-400 border border-emerald-900';
                      else if (percentageOfAverage >= 100) badgeColor = 'bg-indigo-950 text-indigo-400 border border-indigo-900';
                      else if (percentageOfAverage >= 50) badgeColor = 'bg-amber-950 text-amber-400 border border-amber-900';
                      else badgeColor = 'bg-rose-950 text-rose-400 border border-rose-900';

                      const isExpanded = expandedStudents.has(stat.userId);
                      const hasQuestions = stat.questions && stat.questions.length > 0;

                      return (
                        <>
                          <tr
                            key={stat.userId}
                            className="border-b border-gray-800 transition hover:bg-gray-900"
                          >
                            <td className="px-4 py-4 text-sm font-bold text-white">
                              #{index + 1}
                            </td>
                            <td className="px-4 py-4 text-sm text-white">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold">
                                    {stat.displayName || 'Étudiant sans nom'}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {stat.email || stat.userId.substring(0, 12) + '...'}
                                  </p>
                                </div>
                                {hasQuestions && (
                                  <button
                                    onClick={() => toggleStudentExpansion(stat.userId)}
                                    className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-300 transition hover:border-gray-600 hover:bg-gray-700"
                                  >
                                    {isExpanded ? '▼' : '▶'} {stat.questions!.length} question(s)
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="inline-flex items-center rounded-full border border-indigo-900/50 bg-indigo-950 px-3 py-1 text-sm font-semibold text-indigo-400">
                                {stat.totalMinutesWatched} min
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}>
                                {percentageOfAverage}%
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right text-sm text-gray-300">
                              {stat.lastUpdated.toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                          </tr>
                          {isExpanded && hasQuestions && (
                            <tr key={`${stat.userId}-questions`}>
                              <td colSpan={5} className="bg-gray-900 px-4 py-4">
                                <div className="space-y-4">
                                  {/* Questions de compréhension */}
                                  {stat.questions!.filter(q => q.type === 'comprehension').length > 0 && (
                                    <div className="rounded-2xl border border-gray-800 bg-black p-4">
                                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                                        📚 Ce que l&apos;étudiant a compris
                                      </p>
                                      <div className="space-y-2">
                                        {stat.questions!
                                          .filter(q => q.type === 'comprehension')
                                          .map((q, qIndex) => (
                                            <div
                                              key={q.id}
                                              className="flex gap-3 rounded-xl border border-gray-800 bg-gray-900 p-3"
                                            >
                                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                                {qIndex + 1}
                                              </span>
                                              <div className="flex-1">
                                                <p className="text-sm text-white">{q.question}</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                  {q.createdAt.toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                  })}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Questions d'incompréhension */}
                                  {stat.questions!.filter(q => q.type === 'incomprehension').length > 0 && (
                                    <div className="rounded-2xl border border-red-900/30 bg-black p-4">
                                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-400">
                                        ❓ Questions d&apos;incompréhension
                                      </p>
                                      <div className="space-y-2">
                                        {stat.questions!
                                          .filter(q => q.type === 'incomprehension')
                                          .map((q, qIndex) => (
                                            <div
                                              key={q.id}
                                              className="flex gap-3 rounded-xl border border-red-900/50 bg-red-950/30 p-3"
                                            >
                                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                                                {qIndex + 1}
                                              </span>
                                              <div className="flex-1">
                                                <p className="text-sm text-white">{q.question}</p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                  {q.createdAt.toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                  })}
                                                </p>
                                              </div>
                                              <button
                                                onClick={() => handleOpenFAQModal(q.question)}
                                                className="shrink-0 rounded-lg border border-emerald-900/50 bg-emerald-950 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition hover:border-emerald-800 hover:bg-emerald-900"
                                                title="Créer une FAQ vidéo"
                                              >
                                                📹 Créer FAQ
                                              </button>
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Legend */}
          <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="mb-4 text-sm font-semibold text-white">Légende des couleurs</p>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-400"></div>
                <p className="text-xs text-gray-300">150%+ du temps moyen (très engagé)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-400"></div>
                <p className="text-xs text-gray-300">100%+ du temps moyen (engagé)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <p className="text-xs text-gray-300">50-99% du temps moyen (modéré)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-400"></div>
                <p className="text-xs text-gray-300">&lt;50% du temps moyen (faible)</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FAQ Modal */}
      {isFAQModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-700 bg-gray-900 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">
                📹 Créer une FAQ Vidéo
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Créez une réponse vidéo pour cette question d&apos;étudiant
              </p>
            </div>

            <form onSubmit={handleFAQSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Question
                </label>
                <div className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3">
                  <p className="text-sm text-white">{selectedQuestion}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-white"
                  htmlFor="faq-description"
                >
                  Description de la réponse
                </label>
                <textarea
                  id="faq-description"
                  name="description"
                  rows={4}
                  value={faqFormValues.description}
                  onChange={handleFAQChange('description')}
                  placeholder="Résumé de la réponse, points clés abordés dans la vidéo..."
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
                  onChange={handleFAQChange('videoUrl')}
                  placeholder="https://youtu.be/..."
                  className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700"
                />
                <p className="text-xs text-gray-400">
                  Collez le lien de votre vidéo de réponse
                </p>
              </div>

              {faqError && (
                <div className="rounded-2xl border border-rose-900 bg-rose-900/30 px-4 py-3 text-sm text-rose-400">
                  {faqError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCloseFAQModal}
                  className="rounded-full border border-gray-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-800"
                  disabled={faqStatus === 'saving'}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={faqStatus === 'saving'}
                  className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {faqStatus === 'saving' && 'Enregistrement...'}
                  {faqStatus === 'saved' && '✓ Enregistrée'}
                  {(faqStatus === 'idle' || faqStatus === 'error') && 'Publier la FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}

