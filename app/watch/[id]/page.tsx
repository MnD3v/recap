'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
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
  const [otherTutorials, setOtherTutorials] = useState<Tutorial[]>([]);

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

  // Fetch other tutorials
  useEffect(() => {
    const tutorialsQuery = query(
      collection(db, 'tutorials'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      tutorialsQuery,
      (snapshot) => {
        const allTutorials: Tutorial[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title ?? 'Tutoriel sans titre',
            description: data.description ?? '',
            videoUrl: data.videoUrl ?? '',
            ownerName: data.ownerName ?? null,
          };
        });

        // Filter out the current tutorial
        const filtered = allTutorials.filter(t => t.id !== tutorialId);
        setOtherTutorials(filtered);
      },
      (error) => {
        console.error('Erreur lors de la récupération des autres tutoriels', error);
      }
    );

    return () => unsubscribe();
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
         
        </header>

        <main className="mx-auto w-full max-w-6xl px-2 md:px-6 pb-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Video Player */}
            <section className="rounded-3xl border border-gray-800 bg-black p-3 md:p-6 shadow-sm">
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

                <div className="rounded-2xl border border-gray-800 bg-black p-4">
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

            
              </div>
            </section>

            {/* Sidebar Info */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-gray-800 bg-black p-6 shadow-sm">
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

              <div className="rounded-2xl border border-gray-700 bg-black p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
                  💡 Info
                </p>
                <p className="mt-3 text-sm text-gray-300">
                  Votre temps de visionnage est enregistré automatiquement chaque minute pour suivre votre engagement.
                </p>
              </div>
            </aside>
          </div>

          {/* Other Tutorials Section */}
          {otherTutorials.length > 0 && (
            <section className="mt-16">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white">
                  Autres tutoriels disponibles
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Continuez votre apprentissage avec ces ressources
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {otherTutorials.map((item) => (
                  <article
                    key={item.id}
                    className="group relative overflow-hidden rounded-3xl border border-gray-800 bg-black p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-32 opacity-0 transition group-hover:opacity-100"
                      style={{
                        background:
                          'linear-gradient(to bottom, rgba(59,130,246,0.2), rgba(0,0,0,0), rgba(0,0,0,0))',
                      }}
                    />
                    <div>
                      <h3 className="mb-3 text-xl font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-300 line-clamp-3">
                        {item.description || 'Description à compléter pour guider vos étudiants.'}
                      </p>
                      {item.videoUrl ? (
                        <a
                          href={`/watch/${item.id}`}
                          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 transition hover:text-indigo-300"
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
                        <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                          Lien en cours d&apos;ajout
                        </span>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">
                          {item.ownerName
                            ? `Par ${item.ownerName}`
                            : 'Par votre équipe'}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </RequireAuth>
  );
}

