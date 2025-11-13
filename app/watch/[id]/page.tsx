'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RequireAuth } from '@/components/RequireAuth';
import { useAuth } from '@/components/AuthProvider';
import { getYouTubeVideoId, getYouTubeEmbedUrl } from '@/lib/youtube';

type Tutorial = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  ownerName?: string | null;
};

type WatchSession = {
  userId: string;
  tutorialId: string;
  totalMinutesWatched: number;
  lastUpdated: Timestamp;
};

const TRACKING_INTERVAL_MS = 60000; // 1 minute

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const tutorialId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minutesWatched, setMinutesWatched] = useState(0);
  const [videoId, setVideoId] = useState<string | null>(null);

  const handleStartQuiz = () => {
    router.push(`/quiz/${tutorialId}`);
  };

  const playerRef = useRef<HTMLIFrameElement>(null);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch tutorial data
  useEffect(() => {
    const fetchTutorial = async () => {
      if (!tutorialId) {
        setError('ID du tutoriel manquant');
        setLoading(false);
        return;
      }

      try {
        const tutorialDoc = await getDoc(doc(collection(db, 'tutorials'), tutorialId));

        if (!tutorialDoc.exists()) {
          setError('Tutoriel non trouvé');
          setLoading(false);
          return;
        }

        const data = tutorialDoc.data();
        const tutorial: Tutorial = {
          id: tutorialDoc.id,
          title: data.title ?? 'Tutoriel sans titre',
          description: data.description ?? '',
          videoUrl: data.videoUrl ?? '',
          ownerName: data.ownerName ?? null,
        };

        setTutorial(tutorial);

        // Extract video ID
        const vId = getYouTubeVideoId(data.videoUrl);
        if (vId) {
          setVideoId(vId);
        } else {
          setError('Lien YouTube invalide');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du tutoriel:', err);
        setError('Erreur lors du chargement du tutoriel');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [tutorialId]);

  // Track watch time every minute
  useEffect(() => {
    if (!user || !tutorialId || !tutorial) return;

    const trackWatchTime = async () => {
      try {
        // Ensure user document exists
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          lastUpdated: Timestamp.now(),
        }, { merge: true });

        // Get current watch session from Firestore to get the existing total
        const watchSessionRef = doc(
          db,
          `users/${user.uid}/watchSessions`,
          tutorialId,
        );

        const existingSession = await getDoc(watchSessionRef);
        const existingMinutes = existingSession.exists() 
          ? (existingSession.data().totalMinutesWatched || 0)
          : 0;
        
        const newMinutesWatched = existingMinutes + 1;

        // Save to Firestore with the incremented total
        const watchSession: WatchSession = {
          userId: user.uid,
          tutorialId,
          totalMinutesWatched: newMinutesWatched,
          lastUpdated: Timestamp.now(),
        };

        await setDoc(watchSessionRef, watchSession, { merge: true });
        console.log(`Saved watch time for user ${user.uid}: ${newMinutesWatched} minutes (previous: ${existingMinutes})`);
        
        setMinutesWatched(newMinutesWatched);

        // Optional: Log to analytics collection for historical tracking
        const analyticsRef = doc(
          collection(db, `tutorials/${tutorialId}/viewLogs`),
        );

        await setDoc(analyticsRef, {
          userId: user.uid,
          userEmail: user.email,
          timestamp: Timestamp.now(),
          minuteMarker: newMinutesWatched,
        });
      } catch (err) {
        console.error('Erreur lors de l\'enregistrement du temps de visionnage:', err);
      }
    };

    // Start tracking when page loads
    trackingIntervalRef.current = setInterval(trackWatchTime, TRACKING_INTERVAL_MS);

    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, [user, tutorialId, tutorial, minutesWatched]);

  // Handle page visibility to pause tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, tracking will continue but could be paused if needed
        console.log('Page hidden, tracking continues');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <RequireAuth>
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="text-center">
            <p className="text-lg font-semibold text-white">
              Chargement du tutoriel...
            </p>
          </div>
        </div>
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

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {tutorial.title}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {tutorial.ownerName ? `Par ${tutorial.ownerName}` : 'Ressource pédagogique'}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="rounded-full border border-gray-700 px-5 py-2 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-900"
          >
            ← Retour
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Video Player */}
            <section className="rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-sm">
              <div className="aspect-video rounded-2xl bg-gray-900">
                {videoId ? (
                  <iframe
                    ref={playerRef}
                    className="h-full w-full rounded-2xl"
                    src={getYouTubeEmbedUrl(videoId)}
                    title={tutorial.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-white">Vidéo indisponible</p>
                  </div>
                )}
              </div>

              {/* Verify Understanding Button */}
              {/* <div className="mt-6">
                <button
                  onClick={handleStartQuiz}
                  className="w-full rounded-full border border-white bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  ✓ Vérifier ma compréhension
                </button>
              </div> */}

              {/* Video Info */}
              <div className="mt-8 space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {tutorial.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">
                    {tutorial.description ||
                      'Aucune description disponible pour ce tutoriel.'}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Votre progression
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {minutesWatched} min
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Temps enregistré toutes les minutes
                  </p>
                </div>

                <a
                  href={`/stats/${tutorialId}`}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-800"
                >
                  <svg
                    className="h-5 w-5"
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
                  Voir les statistiques
                </a>
              </div>
            </section>

            {/* Sidebar Info */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  À propos
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-white">Instructeur</p>
                    <p className="text-gray-300">
                      {tutorial.ownerName || 'Équipe pédagogique'}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Format</p>
                    <p className="text-gray-300">Vidéo YouTube intégrée</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Suivi</p>
                    <p className="text-gray-300">Engagement minute par minute</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
                  💡 Info
                </p>
                <p className="mt-3 text-sm text-gray-300">
                  Votre temps de visionnage est enregistré automatiquement chaque minute pour suivre votre engagement.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

