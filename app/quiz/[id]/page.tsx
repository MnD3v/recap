'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { useAuth } from '@/components/AuthProvider';
import Image from 'next/image';
import { getDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const GOOGLE_API_KEY = "AIzaSyDcTBq4rqYvLZw1EcTtUnoq5NCIcvYQuBA";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const MIN_QUESTION_COUNT = 20;

type Tutorial = {
  id: string;
  title: string;
  description: string;
  technicalDescription: string;
};

type QuizMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const tutorialId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<QuizMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  // Fetch tutorial data
  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const tutorialDoc = await getDoc(doc(collection(db, 'tutorials'), tutorialId));
        if (tutorialDoc.exists()) {
          const data = tutorialDoc.data();
          setTutorial({
            id: tutorialDoc.id,
            title: data.title ?? '',
            description: data.description ?? '',
            technicalDescription: data.technicalDescription ?? '',
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement du tutoriel:', error);
      }
    };

    fetchTutorial();
  }, [tutorialId]);

  // Initialize first question
  useEffect(() => {
    if (tutorial && messages.length === 0) {
      generateFirstQuestion();
    }
  }, [tutorial]);

  const generateFirstQuestion = async () => {
    if (!tutorial) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const prompt = `Tu es un professeur expert qui teste la compréhension d'un étudiant sur le sujet suivant:

Titre du tutoriel: "${tutorial.title}"
Description: "${tutorial.description}"
Description technique: "${tutorial.technicalDescription}"

Génère UNE première question de compréhension pertinente pour tester la compréhension de l'étudiant sur ce sujet. 
La question doit être claire, directe et en français.
Réponds UNIQUEMENT avec la question, sans numérotation ni explication supplémentaire.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      const data = await response.json();
      const question =
        data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        'Quelle est votre compréhension du sujet ?';
      
      setMessages([{ role: 'assistant', content: question }]);
      setQuestionsAsked(1);
    } catch (error) {
      console.error('Erreur lors de la génération de la question:', error);
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);
      setErrorMessage(`Erreur IA (question initiale) : ${message}`);

      const fallbackContext =
        tutorial.technicalDescription?.trim() ||
        tutorial.description?.trim() ||
        tutorial.title;

      const fallbackQuestion = fallbackContext
        ? `Pour démarrer, que peux-tu m'expliquer à propos de "${fallbackContext}" ?`
        : "Pour commencer, quelle notion clé retiens-tu de ce tutoriel ?";

      setMessages([{ role: 'assistant', content: fallbackQuestion }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !tutorial) return;

    setIsSubmitting(true);
    const userMessage = userInput.trim();
    setUserInput('');

    // Add user message to chat
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setAnsweredCount((prev) => prev + 1);

    try {
      await generateNextQuestion([...messages, { role: 'user', content: userMessage }]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Une erreur est survenue. Veuillez réessayer.',
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishQuiz = async () => {
    if (!tutorial) return;
    if (answeredCount < MIN_QUESTION_COUNT) {
      setErrorMessage(
        `Vous devez répondre à au moins ${MIN_QUESTION_COUNT} questions avant de terminer le quiz.`,
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await generateFeedbackAndScore(messages);
      setQuizComplete(true);
    } catch (error) {
      console.error('Erreur lors de la finalisation du quiz:', error);
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      setErrorMessage(`Erreur IA (évaluation finale) : ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateNextQuestion = async (conversationHistory: QuizMessage[]) => {
    try {
      const conversationText = conversationHistory
        .map((msg) => `${msg.role === 'user' ? 'Étudiant' : 'Professeur'}: ${msg.content}`)
        .join('\n');

      const prompt = `Tu es un professeur expert qui teste la compréhension d'un étudiant sur:

Titre: "${tutorial?.title}"
Description technique: "${tutorial?.technicalDescription}"

Voici la conversation jusqu'à présent:
${conversationText}

Analyse la dernière réponse de l'étudiant et fournis:
EXPLICATION: [brève explication ou correction. Félicite en cas de succès, explique la bonne réponse sinon]
QUESTION: [nouvelle question de suivi adaptée au niveau actuel]

Respecte STRICTEMENT ce format avec les préfixes EXPLICATION et QUESTION sur deux lignes distinctes.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

      let explanation = '';
      let question = '';

      const explanationMatch = raw.match(/EXPLICATION:\s*([\s\S]*?)\nQUESTION:/i);
      const questionMatch = raw.match(/QUESTION:\s*([\s\S]*)$/i);

      if (explanationMatch) {
        explanation = explanationMatch[1].trim();
      }
      if (questionMatch) {
        question = questionMatch[1].trim();
      }

      if (!question) {
        question = 'Continuons. Peux-tu approfondir davantage ta réponse précédente ?';
      }

      setMessages((prev) => [
        ...prev,
        ...(explanation
          ? [
              {
                role: 'assistant',
                content: explanation,
              } satisfies QuizMessage,
            ]
          : []),
        { role: 'assistant', content: question },
      ]);
      setQuestionsAsked((prev) => prev + 1);
      setErrorMessage(null);
    } catch (error) {
      console.error('Erreur lors de la génération de la question:', error);
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);
      setErrorMessage(`Erreur IA (question suivante) : ${message}`);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Une erreur est survenue. Veuillez réessayer.',
        },
      ]);
    }
  };

  const generateFeedbackAndScore = async (conversationHistory: QuizMessage[]) => {
    try {
      const conversationText = conversationHistory
        .map((msg) => `${msg.role === 'user' ? 'Étudiant' : 'Professeur'}: ${msg.content}`)
        .join('\n');

      const prompt = `Tu es un professeur expert qui évalue la compréhension d'un étudiant sur:

Titre: "${tutorial?.title}"
Description technique: "${tutorial?.technicalDescription}"

Voici la conversation complète:
${conversationText}

Basé sur les réponses de l'étudiant, fournis:
1. Une évaluation générale (1-2 phrases)
2. Un score sur 100
3. Les points forts et les points à améliorer

Format ta réponse exactement comme ceci (sur des lignes séparées):
EVALUATION: [évaluation générale]
SCORE: [nombre entre 0 et 100]
POINTS_FORTS: [liste des points forts]
POINTS_A_AMELIORER: [liste des points à améliorer]`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      const data = await response.json();
      const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse the feedback
      const scoreMatch = feedback.match(/SCORE:\s*(\d+)/);
      const parsedScore = scoreMatch ? parseInt(scoreMatch[1]) : 75;
      setScore(parsedScore);

      setMessages((prev) => [...prev, { role: 'assistant', content: feedback }]);
      setErrorMessage(null);
    } catch (error) {
      console.error('Erreur lors de la génération du feedback:', error);
      setScore(75);
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);
      setErrorMessage(`Erreur IA (évaluation finale) : ${message}`);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setUserInput('');
    setQuizComplete(false);
    setScore(0);
    setQuestionsAsked(0);
    generateFirstQuestion();
  };

  if (loading && messages.length === 0) {
    return (
      <RequireAuth>
        <div className="flex min-h-screen items-center justify-center bg-black">
          <div className="text-center">
            <p className="text-lg font-semibold text-white">Chargement du quiz...</p>
          </div>
        </div>
      </RequireAuth>
    );
  }

  if (quizComplete) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-black px-6 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="rounded-full border border-gray-700 px-5 py-2 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-900"
              >
                ← Retour
              </button>
            </div>

            {/* Results Card */}
                <div className="relative h-32 w-32">
                  <Image
                    src="/images/manu.png"
                    alt="Instructeur"
                    fill
                    className=""
                  />

              <h1 className="text-4xl font-bold text-white mb-4">
                Bravo ! 🎉
              </h1>

              <div className="mb-8 rounded-2xl border border-gray-700 bg-gray-900 p-8">
                <p className="mb-2 text-lg text-gray-300">Votre score</p>
                <p className="text-6xl font-bold text-white mb-2">
                  {score}%
                </p>
              </div>

              {/* Feedback from AI */}
              <div className="mb-8 rounded-2xl border border-gray-700 bg-gray-900 p-6 text-left space-y-4">
                {messages[messages.length - 1]?.role === 'assistant' && (
                  <div className="text-sm text-gray-300 whitespace-pre-wrap">
                    {messages[messages.length - 1]?.content}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                >
                  Recommencer le quiz
                </button>
                <button
                  onClick={() => router.back()}
                  className="flex-1 rounded-full border border-gray-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-900"
                >
                  Retour au tutoriel
                </button>
              </div>
            </div>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Vérification de compréhension
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                {tutorial?.title}
              </h1>
            </div>
            <button
              onClick={() => router.back()}
              className="rounded-full border border-gray-700 px-5 py-2 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-900"
            >
              ← Retour
            </button>
          </div>

          {/* Progress */}
          <div className="mb-8 flex flex-wrap gap-4 text-sm text-gray-400">
            <span>Questions posées : {questionsAsked}</span>
            <span>Réponses fournies : {answeredCount}</span>
            <span>Objectif minimal : {MIN_QUESTION_COUNT}</span>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 md:grid-cols-[1fr_400px]">
            {/* Left: Large Instructor Image */}
            <div className="flex flex-col items-center justify-start">
              <div className="relative h-96 w-80 rounded-3xl overflow-hidden border-4 border-gray-700 shadow-2xl">
                <Image
                  src="/images/manu.png"
                  alt="Instructeur"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right: Chat Section */}
            <div className="rounded-3xl border border-gray-800 bg-gray-950 p-6 flex flex-col h-96 md:h-auto md:min-h-96">
              {errorMessage ? (
                <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {errorMessage}
                </div>
              ) : null}
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs rounded-2xl px-4 py-3 text-sm ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-800 text-gray-200'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmitAnswer} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Votre réponse..."
                    disabled={isSubmitting}
                    className="flex-1 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-white placeholder-gray-500 outline-none transition focus:border-gray-600 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !userInput.trim()}
                    className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
                  >
                    {isSubmitting ? '...' : 'Envoyer'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleFinishQuiz}
                  disabled={isSubmitting}
                  className="w-full rounded-full border border-gray-700 px-6 py-2 text-sm font-semibold text-white transition hover:border-gray-600 hover:bg-gray-900 disabled:opacity-50"
                >
                  Terminer l&apos;évaluation
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
