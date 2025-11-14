'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RequireAuth } from '@/components/RequireAuth';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

type StudentWatchSession = {
  userId: string;
  tutorialId: string;
  tutorialTitle: string;
  totalMinutesWatched: number;
  lastUpdated: Date;
  userEmail: string;
  questions?: UserQuestion[];
};

type UserQuestion = {
  id: string;
  question: string;
  type: 'comprehension' | 'incomprehension';
  createdAt: Date;
};

type TutorialAnalytics = {
  tutorialId: string;
  tutorialTitle: string;
  totalViewers: number;
  averageWatchTime: number;
  totalViewMinutes: number;
};

export default function AnalyticsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [studentSessions, setStudentSessions] = useState<StudentWatchSession[]>([]);
  const [tutorialAnalytics, setTutorialAnalytics] = useState<TutorialAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'students' | 'tutorials'>('tutorials');
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  const toggleSessionExpansion = (sessionKey: string) => {
    setExpandedSessions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionKey)) {
        newSet.delete(sessionKey);
      } else {
        newSet.add(sessionKey);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        // Fetch all watch sessions for the current user as admin
        const watchSessionsRef = collection(db, 'users');
        const allUsers = await getDocs(watchSessionsRef);

        const allSessions: StudentWatchSession[] = [];

        for (const userDoc of allUsers.docs) {
          const watchSessionsCollection = collection(userDoc.ref, 'watchSessions');
          const snapshot = await getDocs(watchSessionsCollection);

          // Fetch user's questions
          const questionsCollection = collection(userDoc.ref, 'questions');
          const questionsSnapshot = await getDocs(questionsCollection);
          const userQuestions: { [tutorialId: string]: UserQuestion[] } = {};

          questionsSnapshot.docs.forEach((questionDoc) => {
            const questionData = questionDoc.data();
            const tutorialId = questionData.tutorialId;
            
            if (!userQuestions[tutorialId]) {
              userQuestions[tutorialId] = [];
            }

            userQuestions[tutorialId].push({
              id: questionDoc.id,
              question: questionData.question,
              type: questionData.type || 'comprehension',
              createdAt: questionData.createdAt?.toDate?.() || new Date(),
            });
          });

          for (const sessionDoc of snapshot.docs) {
            const data = sessionDoc.data();
            const tutorialId = sessionDoc.id;
            
            allSessions.push({
              userId: userDoc.id,
              tutorialId,
              tutorialTitle: data.tutorialTitle || 'Tutoriel sans titre',
              totalMinutesWatched: data.totalMinutesWatched || 0,
              lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
              userEmail: userDoc.id,
              questions: userQuestions[tutorialId] || [],
            });
          }
        }

        setStudentSessions(allSessions);

        // Calculate tutorial analytics
        const tutorialMap = new Map<string, TutorialAnalytics>();

        allSessions.forEach((session) => {
          const key = session.tutorialId;
          if (!tutorialMap.has(key)) {
            tutorialMap.set(key, {
              tutorialId: session.tutorialId,
              tutorialTitle: session.tutorialTitle,
              totalViewers: 0,
              averageWatchTime: 0,
              totalViewMinutes: 0,
            });
          }

          const analytics = tutorialMap.get(key)!;
          analytics.totalViewers += 1;
          analytics.totalViewMinutes += session.totalMinutesWatched;
        });

        // Calculate averages
        const tutorialsArray = Array.from(tutorialMap.values());
        tutorialsArray.forEach((t) => {
          if (t.totalViewers > 0) {
            t.averageWatchTime = Math.round(t.totalViewMinutes / t.totalViewers);
          }
        });

        // Sort by total view minutes descending
        tutorialsArray.sort((a, b) => b.totalViewMinutes - a.totalViewMinutes);

        setTutorialAnalytics(tutorialsArray);
      } catch (error) {
        console.error('Erreur lors du chargement des analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <RequireAuth>
        <div className="flex min-h-screen items-center justify-center bg-black">
          <p className="text-lg font-semibold text-white">
            Chargement des analyses...
          </p>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black pb-24">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Tableau de bord d&apos;engagement
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Suivi du temps de visionnage par tutoriel et étudiant
            </p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="rounded-full border border-gray-700 px-5 py-2 text-sm font-semibold text-white transition hover:border-gray-600"
          >
            Administration
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6">
          {/* Tabs */}
          <div className="mb-6 flex gap-4 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('tutorials')}
              className={`px-4 py-3 text-sm font-semibold transition ${
                activeTab === 'tutorials'
                  ? 'border-b-2 border-[#ff2600]-600 text-[#ff2600]-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Analyseur tutoriels
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-4 py-3 text-sm font-semibold transition ${
                activeTab === 'students'
                  ? 'border-b-2 border-[#ff2600]-600 text-[#ff2600]-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Suivi étudiants
            </button>
          </div>

          {/* Tutorials Tab */}
          {activeTab === 'tutorials' && (
            <section className="rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-white">
                Performance par tutoriel
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Vue d&apos;ensemble du temps moyen de visionnage par ressource
              </p>

              {tutorialAnalytics.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-gray-700 bg-gray-900 px-6 py-12 text-center text-sm text-gray-400">
                  Aucune données d&apos;engagement pour le moment. Les tutoriels
                  apparaîtront ici lorsque les étudiants commenceront à les
                  visionner.
                </div>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                          Tutoriel
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-white">
                          Visualisations
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-white">
                          Temps moyen
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-white">
                          Total minutes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tutorialAnalytics.map((tutorial) => (
                        <tr
                          key={tutorial.tutorialId}
                          className="border-b border-gray-800 transition hover:bg-gray-900"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-white">
                            {tutorial.tutorialTitle}
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-gray-300">
                            {tutorial.totalViewers}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-semibold text-[#ff2600]-400">
                            {tutorial.averageWatchTime} min
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-gray-300">
                            {tutorial.totalViewMinutes} min
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <section className="rounded-3xl border border-gray-800 bg-gray-950 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-white">
                Suivi par étudiant
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Temps de visionnage enregistré pour chaque tutoriel par étudiant
              </p>

              {studentSessions.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-gray-700 bg-gray-900 px-6 py-12 text-center text-sm text-gray-400">
                  Aucune session de visionnage enregistrée pour le moment.
                </div>
              ) : (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                          ID Étudiant
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                          Tutoriel
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-white">
                          Minutes visionnées
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-white">
                          Dernière mise à jour
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentSessions.map((session) => {
                        const sessionKey = `${session.userId}-${session.tutorialId}`;
                        const isExpanded = expandedSessions.has(sessionKey);
                        const hasQuestions = session.questions && session.questions.length > 0;

                        return (
                          <>
                            <tr
                              key={sessionKey}
                              className="border-b border-gray-800 transition hover:bg-gray-900"
                            >
                              <td className="px-4 py-4 text-sm font-mono text-gray-300">
                                {session.userId.substring(0, 8)}...
                              </td>
                              <td className="px-4 py-4 text-sm text-white">
                                {session.tutorialTitle}
                              </td>
                              <td className="px-4 py-4 text-right text-sm font-semibold text-[#ff2600]-400">
                                {session.totalMinutesWatched} min
                              </td>
                              <td className="px-4 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  <span className="text-sm text-gray-300">
                                    {session.lastUpdated.toLocaleDateString('fr-FR', {
                                      day: '2-digit',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                  {hasQuestions && (
                                    <button
                                      onClick={() => toggleSessionExpansion(sessionKey)}
                                      className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-300 transition hover:border-gray-600 hover:bg-gray-700"
                                    >
                                      {isExpanded ? '▼' : '▶'} {session.questions!.length} question(s)
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                            {isExpanded && hasQuestions && (
                              <tr key={`${sessionKey}-questions`}>
                                <td colSpan={4} className="bg-gray-900 px-4 py-4">
                                  <div className="space-y-4">
                                    {/* Questions de compréhension */}
                                    {session.questions!.filter(q => q.type === 'comprehension').length > 0 && (
                                      <div className="rounded-2xl border border-gray-800 bg-black p-4">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#ff2600]-400">
                                          📚 Ce que l&apos;étudiant a compris
                                        </p>
                                        <div className="space-y-2">
                                          {session.questions!
                                            .filter(q => q.type === 'comprehension')
                                            .map((q, index) => (
                                              <div
                                                key={q.id}
                                                className="flex gap-3 rounded-xl border border-gray-800 bg-gray-900 p-3"
                                              >
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff2600]-600 text-xs font-bold text-white">
                                                  {index + 1}
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
                                    {session.questions!.filter(q => q.type === 'incomprehension').length > 0 && (
                                      <div className="rounded-2xl border border-red-900/30 bg-black p-4">
                                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-400">
                                          ❓ Questions d&apos;incompréhension
                                        </p>
                                        <div className="space-y-2">
                                          {session.questions!
                                            .filter(q => q.type === 'incomprehension')
                                            .map((q, index) => (
                                              <div
                                                key={q.id}
                                                className="flex gap-3 rounded-xl border border-red-900/50 bg-red-950/30 p-3"
                                              >
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                                                  {index + 1}
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
          )}
        </main>
      </div>
    </RequireAuth>
  );
}

