'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RequireAuth } from '@/components/RequireAuth';
import { useAuth } from '@/components/AuthProvider';
import { getYouTubeVideoId, getYouTubeEmbedUrl } from '@/lib/youtube';
import { AddQuestionModal } from '@/components/AddQuestionModal';
import { DeleteQuestionModal } from '@/components/DeleteQuestionModal';
import { EducationalLoader } from '@/components/EducationalLoader';

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
  userName?: string; // Nom de l'étudiant qui a posé la question
  userEmail?: string; // Email de l'étudiant
};

type QuestionResponse = {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  userEmail: string;
  response: string;
  createdAt: Timestamp;
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

// Function to detect and linkify URLs in text
const linkifyText = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 underline hover:text-indigo-300 transition"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

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
  const [allPublicQuestions, setAllPublicQuestions] = useState<UserQuestion[]>([]);
  const [questionResponses, setQuestionResponses] = useState<Record<string, QuestionResponse[]>>({});
  const [videoFAQs, setVideoFAQs] = useState<VideoFAQ[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionType, setQuestionType] = useState<'comprehension' | 'incomprehension'>('comprehension');
  const [editingQuestion, setEditingQuestion] = useState<{ id: string; question: string } | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<{ id: string; question: string } | null>(null);
  const [respondingToQuestion, setRespondingToQuestion] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [loadingPublicQuestions, setLoadingPublicQuestions] = useState(true);
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());

  // Filtrer les questions par type
  const comprehensionQuestions = userQuestions.filter(q => q.type === 'comprehension' || !q.type);

  const playerRef = useRef<HTMLIFrameElement>(null);
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const questionsLoadedRef = useRef(false);

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

  // Fetch all public questions (comprehension) from all users for this tutorial
  useEffect(() => {
    // Reset the ref when tutorialId changes
    questionsLoadedRef.current = false;
    
    if (!tutorialId || questionsLoadedRef.current) return;

    const fetchAllPublicQuestions = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const allQuestions: UserQuestion[] = [];

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const questionsSnapshot = await getDocs(
            collection(db, `users/${userDoc.id}/questions`)
          );

          questionsSnapshot.docs.forEach((questionDoc) => {
            const questionData = questionDoc.data();
            // Only include comprehension questions for this tutorial
            if (
              questionData.tutorialId === tutorialId &&
              (questionData.type === 'comprehension' || !questionData.type)
            ) {
              allQuestions.push({
                id: questionDoc.id,
                userId: userDoc.id,
                tutorialId: questionData.tutorialId,
                question: questionData.question,
                type: 'comprehension',
                createdAt: questionData.createdAt,
                userName: userData.displayName || 'Étudiant',
                userEmail: userData.email || '',
              });
            }
          });
        }

        // Sort by creation date (newest first)
        allQuestions.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        setAllPublicQuestions(allQuestions);
        setLoadingPublicQuestions(false);
        questionsLoadedRef.current = true;
      } catch (error) {
        console.error('Erreur lors de la récupération des questions publiques:', error);
        setLoadingPublicQuestions(false);
      }
    };

    fetchAllPublicQuestions();
  }, [tutorialId]);

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

  const handleSubmitResponse = async (questionId: string, questionUserId: string) => {
    if (!user || !responseText.trim()) return;

    try {
      // Add the response
      const responseRef = collection(db, `users/${questionUserId}/questions/${questionId}/responses`);
      await addDoc(responseRef, {
        questionId,
        userId: user.uid,
        userName: user.displayName || 'Étudiant',
        userEmail: user.email || '',
        response: responseText.trim(),
        createdAt: Timestamp.now(),
      });

      // Create notification for the question owner (only if not responding to own question)
      if (questionUserId !== user.uid) {
        const notificationRef = collection(db, `users/${questionUserId}/notifications`);
        await addDoc(notificationRef, {
          userId: questionUserId,
          type: 'response',
          title: 'Nouvelle réponse à votre question',
          message: `${user.displayName || 'Un étudiant'} a répondu à votre question sur "${tutorial?.title || 'ce tutoriel'}"`,
          questionId,
          tutorialId,
          tutorialTitle: tutorial?.title || 'Tutoriel',
          responderId: user.uid,
          responderName: user.displayName || 'Étudiant',
          isRead: false,
          createdAt: Timestamp.now(),
        });
      }

      setResponseText('');
      setRespondingToQuestion(null);
      
      // Refresh responses for this question
      fetchResponsesForQuestion(questionId, questionUserId);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
    }
  };

  const fetchResponsesForQuestion = async (questionId: string, questionUserId: string) => {
    try {
      const responsesSnapshot = await getDocs(
        collection(db, `users/${questionUserId}/questions/${questionId}/responses`)
      );

      const responses: QuestionResponse[] = responsesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          questionId,
          userId: data.userId,
          userName: data.userName,
          userEmail: data.userEmail,
          response: data.response,
          createdAt: data.createdAt,
        };
      });

      responses.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());

      setQuestionResponses((prev) => ({
        ...prev,
        [questionId]: responses,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des réponses:', error);
    }
  };

  const toggleResponseSection = async (questionId: string, questionUserId: string) => {
    if (respondingToQuestion === questionId) {
      setRespondingToQuestion(null);
      setResponseText('');
    } else {
      setRespondingToQuestion(questionId);
      // Fetch responses if not already loaded
      if (!questionResponses[questionId]) {
        await fetchResponsesForQuestion(questionId, questionUserId);
      }
    }
  };

  const toggleExpandResponses = (questionId: string) => {
    setExpandedResponses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
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
        <EducationalLoader message="Chargement du tutoriel..." />
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

          {/* Community Q&A Section */}
          {loadingPublicQuestions ? (
            <section className="mt-16 animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white">
                  💬 Questions & Réponses de la communauté
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Chargement des questions...
                </p>
              </div>

              <div className="rounded-3xl border border-gray-800 bg-gray-950 p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  {/* Educational Mini Loader */}
                  <div className="relative mb-6 h-16 w-16">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-14 w-12">
                        <div 
                          className="absolute left-0 top-0 h-full w-1/2 origin-right rounded-l-lg border-2 border-indigo-500 bg-gradient-to-br from-indigo-950 to-indigo-900"
                          style={{
                            animation: 'bookFlip 2s ease-in-out infinite',
                            transformStyle: 'preserve-3d',
                          }}
                        ></div>
                        <div 
                          className="absolute right-0 top-0 h-full w-1/2 origin-left rounded-r-lg border-2 border-indigo-500 bg-gradient-to-bl from-indigo-950 to-indigo-900"
                          style={{
                            animation: 'bookFlip 2s ease-in-out infinite 1s',
                            transformStyle: 'preserve-3d',
                          }}
                        ></div>
                        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-indigo-600"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Récupération des questions de la communauté...
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div 
                      className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                      style={{ animation: 'dotPulse 1.5s ease-in-out infinite' }}
                    ></div>
                    <div 
                      className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                      style={{ animation: 'dotPulse 1.5s ease-in-out infinite 0.3s' }}
                    ></div>
                    <div 
                      className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                      style={{ animation: 'dotPulse 1.5s ease-in-out infinite 0.6s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>
          ) : allPublicQuestions.length > 0 ? (
            <section className="mt-16 animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white">
                  💬 Questions & Réponses de la communauté
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {allPublicQuestions.length} question(s) posée(s) par les étudiants · Participez à l&apos;entraide
                </p>
              </div>

              <div className="space-y-6">
                {allPublicQuestions.map((question, index) => {
                  const responses = questionResponses[question.id] || [];
                  const isResponding = respondingToQuestion === question.id;
                  const isExpanded = expandedResponses.has(question.id);
                  const firstResponse = responses[0];
                  const hasMoreResponses = responses.length > 1;
                  
                  // Auto-load responses for display
                  if (responses.length === 0 && !questionResponses[question.id]) {
                    fetchResponsesForQuestion(question.id, question.userId);
                  }
                  
                  return (
                    <article
                      key={question.id}
                      className="rounded-3xl border border-gray-800 bg-black p-6 animate-scale-in hover-lift"
                      style={{ animationDelay: `${0.05 + index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
                    >
                      {/* Question Header */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                          {question.userName?.charAt(0) || 'E'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-white">{question.userName}</p>
                            <span className="text-xs text-gray-500">·</span>
                            <p className="text-xs text-gray-400">
                              {question.createdAt.toDate().toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <p className="mt-2 text-base text-gray-200">{question.question}</p>
                        </div>
                      </div>

                      {/* First Response (always visible if exists) */}
                      {firstResponse && (
                        <div className="mt-4 ml-14">
                          <div className="flex gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-white">
                              {firstResponse.userName?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-white">{firstResponse.userName}</p>
                                <span className="text-xs text-gray-500">·</span>
                                <p className="text-xs text-gray-400">
                                  {firstResponse.createdAt.toDate().toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-300">{linkifyText(firstResponse.response)}</p>
                            </div>
                          </div>

                          {/* Show all responses button */}
                          {hasMoreResponses && (
                            <button
                              onClick={() => toggleExpandResponses(question.id)}
                              className="mt-3 text-xs font-semibold text-indigo-400 transition hover:text-indigo-300"
                            >
                              {isExpanded ? '▼ Masquer' : `▶ Voir toutes les réponses (${responses.length})`}
                            </button>
                          )}

                          {/* Additional Responses (when expanded) */}
                          {isExpanded && hasMoreResponses && (
                            <div className="mt-3 space-y-3">
                              {responses.slice(1).map((response) => (
                                <div
                                  key={response.id}
                                  className="flex gap-3 rounded-xl border border-gray-800 bg-gray-900 p-4"
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-white">
                                    {response.userName?.charAt(0) || 'U'}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-semibold text-white">{response.userName}</p>
                                      <span className="text-xs text-gray-500">·</span>
                                      <p className="text-xs text-gray-400">
                                        {response.createdAt.toDate().toLocaleDateString('fr-FR', {
                                          day: '2-digit',
                                          month: 'short',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-300">{linkifyText(response.response)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-4 ml-14 flex items-center gap-3">
                        <button
                          onClick={() => toggleResponseSection(question.id, question.userId)}
                          className="inline-flex items-center gap-2 rounded-full border border-indigo-900/50 bg-indigo-950 px-4 py-2 text-xs font-semibold text-indigo-400 transition hover:border-indigo-800 hover:bg-indigo-900"
                        >
                          💬 Répondre
                        </button>
                        {responses.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {responses.length} réponse{responses.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {/* Response Form */}
                      {isResponding && (
                        <div className="mt-6 ml-14 space-y-4 border-t border-gray-800 pt-6">
                          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
                            <textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Écrivez votre réponse..."
                              rows={3}
                              className="w-full rounded-sm border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none transition focus:border-gray-600 focus:ring-2 focus:ring-indigo-600"
                            />
                            <div className="mt-3 flex items-center justify-end gap-3">
                              <button
                                onClick={() => {
                                  setRespondingToQuestion(null);
                                  setResponseText('');
                                }}
                                className="rounded-full border border-gray-700 px-4 py-2 text-xs font-semibold text-gray-300 transition hover:border-gray-600 hover:bg-gray-800"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => handleSubmitResponse(question.id, question.userId)}
                                disabled={!responseText.trim()}
                                className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Publier la réponse
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

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

