'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RequireAuth } from '@/components/RequireAuth';
import { useAuth } from '@/components/AuthProvider';
import { getYouTubeVideoId, getYouTubeEmbedUrl } from '@/lib/youtube';
import { AddQuestionModal } from '@/components/AddQuestionModal';
import { DeleteQuestionModal } from '@/components/DeleteQuestionModal';

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

type UserQuestion = {
  id: string;
  userId: string;
  tutorialId: string;
  question: string;
  createdAt: Timestamp;
  type?: 'comprehension' | 'incomprehension'; // comprehension = pour les autres, incomprehension = personnelle
};

type VideoFAQ = {
  id: string;
  tutorialId: string;
  question: string;
  description: string;
  videoUrl: string;
  createdAt: Timestamp;
  createdBy?: string | null;
};

const TRACKING_INTERVAL_MS = 60000; // 1 minute

export default function WatchPage() {
  const params = useParams();
  const { user } = useAuth();
  const tutorialId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minutesWatched, setMinutesWatched] = useState(0);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [otherTutorials, setOtherTutorials] = useState<Tutorial[]>([]);
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>([]);
  const [videoFAQs, setVideoFAQs] = useState<VideoFAQ[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionType, setQuestionType] = useState<'comprehension' | 'incomprehension'>('comprehension');
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; question: string } | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<{ id: string; question: string } | null>(null);

  // Filtrer les questions par type
  const comprehensionQuestions = userQuestions.filter(q => q.type === 'comprehension' || !q.type);
  const incomprehensionQuestions = userQuestions.filter(q => q.type === 'incomprehension');

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

  // Fetch user's questions for this tutorial
  useEffect(() => {
    if (!user || !tutorialId) return;

    const questionsQuery = query(
      collection(db, `users/${user.uid}/questions`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      questionsQuery,
      (snapshot) => {
        const questions = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (data.tutorialId === tutorialId) {
              return {
                id: doc.id,
                userId: data.userId,
                tutorialId: data.tutorialId,
                question: data.question,
                type: (data.type || 'comprehension') as 'comprehension' | 'incomprehension', // Par défaut, les anciennes questions sont de type comprehension
                createdAt: data.createdAt,
              } as UserQuestion;
            }
            return null;
          })
          .filter((q): q is UserQuestion => q !== null);

        setUserQuestions(questions);
      },
      (error) => {
        console.error('Erreur lors de la récupération des questions:', error);
      }
    );

    return () => unsubscribe();
  }, [user, tutorialId]);

  // Fetch Video FAQs for this tutorial
  useEffect(() => {
    if (!tutorialId) return;

    const faqsQuery = query(
      collection(db, 'videoFAQs'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      faqsQuery,
      (snapshot) => {
        const faqs = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (data.tutorialId === tutorialId) {
              return {
                id: doc.id,
                tutorialId: data.tutorialId,
                question: data.question,
                description: data.description,
                videoUrl: data.videoUrl,
                createdBy: data.createdBy,
                createdAt: data.createdAt,
              } as VideoFAQ;
            }
            return null;
          })
          .filter((faq): faq is VideoFAQ => faq !== null);

        setVideoFAQs(faqs);
      },
      (error) => {
        console.error('Erreur lors de la récupération des FAQ vidéo:', error);
      }
    );

    return () => unsubscribe();
  }, [tutorialId]);

  const handleAddQuestion = async (question: string) => {
    if (!user || !tutorialId) return;

    try {
      if (editingQuestion) {
        // Update existing question
        const questionRef = doc(db, `users/${user.uid}/questions`, editingQuestion.id);
        await updateDoc(questionRef, {
          question,
        });
        setEditingQuestion(null);
      } else {
        // Add new question
        const questionRef = doc(collection(db, `users/${user.uid}/questions`));
        await setDoc(questionRef, {
          userId: user.uid,
          tutorialId,
          question,
          type: questionType,
          createdAt: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout/modification de la question:', error);
      throw error;
    }
  };

  const handleEditQuestion = (questionId: string, questionText: string, type: 'comprehension' | 'incomprehension') => {
    setEditingQuestion({ id: questionId, question: questionText });
    setQuestionType(type);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = async () => {
    if (!user || !deletingQuestion) return;

    try {
      const questionRef = doc(db, `users/${user.uid}/questions`, deletingQuestion.id);
      await deleteDoc(questionRef);
    } catch (error) {
      console.error('Erreur lors de la suppression de la question:', error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setQuestionType('comprehension');
  };

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
          <div className="text-center animate-fade-in">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-800 border-t-indigo-500"></div>
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
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 animate-fade-in">
          <div className="animate-slide-in-left">
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
            <section className="rounded-3xl border border-gray-800 bg-black p-3 md:p-6 shadow-sm animate-scale-in">
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
                <div className="animate-fade-in stagger-1">
                  <h2 className="text-2xl font-semibold text-white">
                    {tutorial.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">
                    {tutorial.description ||
                      'Aucune description disponible pour ce tutoriel.'}
                  </p>
                </div>

              

                  {/* Questions Section - Compréhension */}
                  <div className="rounded-2xl border border-gray-800 bg-black p-4 animate-fade-in stagger-3">
                    <div className="mb-4">
                      <h2 className='text-xl font-semibold text-white'>Ce que vous avez compris</h2>
                      <p className="mt-2 text-sm text-white">
                        Formulez des questions pour les autres étudiants.
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {comprehensionQuestions.length}/4 questions minimum
                      </p>
                    </div>
                   
                  <button
                      onClick={() => {
                        setQuestionType('comprehension');
                        setIsModalOpen(true);
                      }}
                      className="rounded-full bg-indigo-600 px-4 py-2 my-3 text-xs font-semibold text-white transition-smooth hover:bg-indigo-700 hover:scale-105"
                    >
                      + Ajouter une question
                    </button>

                  {comprehensionQuestions.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Aucune question ajoutée pour le moment
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {comprehensionQuestions.map((q, index) => (
                        <div
                          key={q.id}
                          className="rounded-xl border border-gray-800 bg-gray-900 p-3 animate-fade-in hover-lift"
                          style={{ animationDelay: `${0.1 + index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
                        >
                          <div className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                              {index + 1}
                            </span>
                            <p className="flex-1 text-sm text-gray-200">{q.question}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditQuestion(q.id, q.question, 'comprehension')}
                                className="rounded-lg border border-gray-700 bg-gray-800 p-1.5 text-gray-300 transition-smooth hover:border-gray-600 hover:bg-gray-700 hover:text-white hover:scale-110"
                                title="Modifier"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeletingQuestion({ id: q.id, question: q.question })}
                                className="rounded-lg border border-red-900/50 bg-red-950 p-1.5 text-red-400 transition-smooth hover:border-red-800 hover:bg-red-900 hover:text-red-300 hover:scale-110"
                                title="Supprimer"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {comprehensionQuestions.length < 4 && (
                    <div className="mt-4 rounded-xl border border-yellow-900/30 bg-yellow-900/10 p-3">
                      <p className="text-xs text-yellow-400">
                        💡 Ajoutez au moins {4 - comprehensionQuestions.length} question(s) supplémentaire(s) pour valider votre apprentissage
                      </p>
                    </div>
                  )}
                </div>

                {/* Questions Section - Incompréhension */}
                <div className="rounded-2xl border border-red-900/30 bg-black p-4 animate-fade-in stagger-4">
                  <div className="mb-4">
                    <h2 className='text-xl font-semibold text-red-400'>Questions d&apos;incompréhension</h2>
                    <p className="mt-2 text-sm text-white">
                      Notez ce qui reste flou pour vous, vos interrogations personnelles.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {incomprehensionQuestions.length} question(s)
                    </p>
                  </div>
                 
                <button
                    onClick={() => {
                      setQuestionType('incomprehension');
                      setIsModalOpen(true);
                    }}
                    className="rounded-full bg-red-600 px-4 py-2 my-3 text-xs font-semibold text-white transition-smooth hover:bg-red-700 hover:scale-105"
                  >
                    + Ajouter une question
                  </button>

                {incomprehensionQuestions.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Aucune question d&apos;incompréhension pour le moment
                  </p>
                ) : (
                  <div className="space-y-2">
                    {incomprehensionQuestions.map((q, index) => (
                      <div
                        key={q.id}
                        className="rounded-xl border border-red-900/50 bg-red-950/30 p-3 animate-fade-in hover-lift"
                        style={{ animationDelay: `${0.1 + index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
                      >
                        <div className="flex gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <p className="flex-1 text-sm text-gray-200">{q.question}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditQuestion(q.id, q.question, 'incomprehension')}
                              className="rounded-lg border border-gray-700 bg-gray-800 p-1.5 text-gray-300 transition-smooth hover:border-gray-600 hover:bg-gray-700 hover:text-white hover:scale-110"
                              title="Modifier"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => setDeletingQuestion({ id: q.id, question: q.question })}
                              className="rounded-lg border border-red-900/50 bg-red-950 p-1.5 text-red-400 transition-smooth hover:border-red-800 hover:bg-red-900 hover:text-red-300 hover:scale-110"
                              title="Supprimer"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 rounded-xl border border-blue-900/30 bg-blue-900/10 p-3">
                  <p className="text-xs text-blue-400">
                    💬 Ces questions sont personnelles et vous aideront à identifier vos points d&apos;amélioration
                  </p>
                </div>
              </div>
                <div className="rounded-2xl border border-gray-800 bg-black p-4 animate-fade-in stagger-2 hover-lift">
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
              <div className="rounded-2xl border border-gray-800 bg-black p-6 shadow-sm animate-slide-in-right hover-lift">
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

              <div className="rounded-2xl border border-gray-700 bg-black p-6 shadow-sm animate-slide-in-right stagger-1 hover-lift">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
                  💡 Info
                </p>
                <p className="mt-3 text-sm text-gray-300">
                  Votre temps de visionnage est enregistré automatiquement chaque minute pour suivre votre engagement.
                </p>
              </div>
            </aside>
          </div>

          {/* Video FAQs Section */}
          {videoFAQs.length > 0 && (
            <section className="mt-16 animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white">
                  💡 Questions fréquentes - Vidéos explicatives
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Réponses vidéo aux questions courantes sur ce tutoriel
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {videoFAQs.map((faq, index) => (
                  <article
                    key={faq.id}
                    className="group relative overflow-hidden rounded-3xl border border-red-900/30 bg-black p-6 hover-lift animate-scale-in"
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
                        <span className="text-xs font-semibold text-red-400">❓ FAQ</span>
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

          {/* Other Tutorials Section */}
          {otherTutorials.length > 0 && (
            <section className="mt-16 animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white">
                  Autres tutoriels disponibles
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Continuez votre apprentissage avec ces ressources
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {otherTutorials.map((item, index) => (
                  <article
                    key={item.id}
                    className="group relative overflow-hidden rounded-3xl border border-gray-800 bg-black p-6 hover-lift animate-scale-in"
                    style={{ animationDelay: `${0.1 + index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
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

        {/* Add/Edit Question Modal */}
        <AddQuestionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleAddQuestion}
          editingQuestion={editingQuestion}
        />

        {/* Delete Question Modal */}
        <DeleteQuestionModal
          isOpen={!!deletingQuestion}
          onClose={() => setDeletingQuestion(null)}
          onConfirm={handleDeleteQuestion}
          questionText={deletingQuestion?.question || ''}
        />
      </div>
    </RequireAuth>
  );
}

