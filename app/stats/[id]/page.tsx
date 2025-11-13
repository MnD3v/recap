'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RequireAuth } from '@/components/RequireAuth';
import { useAuth } from '@/components/AuthProvider';

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
};

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  useAuth(); // Ensure user is authenticated via RequireAuth
  const tutorialId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <p className="text-lg font-semibold text-slate-900">
            Chargement des statistiques...
          </p>
        </div>
      </RequireAuth>
    );
  }

  if (error || !tutorial) {
    return (
      <RequireAuth>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900">
              {error || 'Tutoriel non trouvé'}
            </p>
            <button
              onClick={() => router.back()}
              className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
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
      <div className="min-h-screen bg-slate-50">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Statistiques d&apos;engagement
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {tutorial.title}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
          >
            ← Retour
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 pb-24">
          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Total visualisations
              </p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{totalViewers}</p>
              <p className="mt-2 text-xs text-slate-500">étudiant(s) ayant suivi</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Temps moyen
              </p>
              <p className="mt-3 text-3xl font-bold text-indigo-600">{averageMinutes}</p>
              <p className="mt-2 text-xs text-slate-500">minutes par étudiant</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Temps total
              </p>
              <p className="mt-3 text-3xl font-bold text-emerald-600">{totalMinutes}</p>
              <p className="mt-2 text-xs text-slate-500">minutes cumulées</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Max visualisé
              </p>
              <p className="mt-3 text-3xl font-bold text-rose-600">{maxMinutes}</p>
              <p className="mt-2 text-xs text-slate-500">minutes (meilleur étudiant)</p>
            </div>
          </div>

          {/* Detailed Table */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Détail par étudiant
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Trié par temps de visionnage (du plus engagé au moins engagé)
            </p>

            {studentStats.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-12 text-center text-sm text-slate-500">
                Aucune donnée de visionnage pour ce tutoriel.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                        Rang
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                        ID Étudiant
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                        Minutes visionnées
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                        % du temps moyen
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                        Dernière activité
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentStats.map((stat, index) => {
                      const percentageOfAverage = averageMinutes > 0
                        ? Math.round((stat.totalMinutesWatched / averageMinutes) * 100)
                        : 0;

                      let badgeColor = 'bg-slate-100 text-slate-700';
                      if (percentageOfAverage >= 150) badgeColor = 'bg-emerald-100 text-emerald-700';
                      else if (percentageOfAverage >= 100) badgeColor = 'bg-indigo-100 text-indigo-700';
                      else if (percentageOfAverage >= 50) badgeColor = 'bg-amber-100 text-amber-700';
                      else badgeColor = 'bg-rose-100 text-rose-700';

                      return (
                          <tr
                          key={stat.userId}
                          className="border-b border-slate-200 transition hover:bg-slate-50"
                        >
                          <td className="px-4 py-4 text-sm font-bold text-slate-900">
                            #{index + 1}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-900">
                            <div>
                              <p className="font-semibold">
                                {stat.displayName || 'Étudiant sans nom'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {stat.email || stat.userId.substring(0, 12) + '...'}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600">
                              {stat.totalMinutesWatched} min
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}>
                              {percentageOfAverage}%
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-slate-600">
                            {stat.lastUpdated.toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Legend */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="mb-4 text-sm font-semibold text-slate-900">Légende des couleurs</p>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <p className="text-xs text-slate-600">150%+ du temps moyen (très engagé)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                <p className="text-xs text-slate-600">100%+ du temps moyen (engagé)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <p className="text-xs text-slate-600">50-99% du temps moyen (modéré)</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                <p className="text-xs text-slate-600">&lt;50% du temps moyen (faible)</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

