'use client';

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (credential.user && name) {
        await updateProfile(credential.user, { displayName: name });
      }
      router.replace("/");
    } catch (error) {
      console.error(error);
      setError(
        "Impossible de créer votre compte. Vérifiez vos informations et réessayez.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 shadow-sm">
            Rejoindre la communauté Recap
          </div>
          <h1 className="text-4xl font-semibold text-white">
            Déployez une expérience tutorielle d&apos;excellence.
          </h1>
          <p className="max-w-lg text-sm text-gray-300">
            Centralisez vos vidéos, mesurez l&apos;attention de chaque étudiant et
            automatisez vos rappels. Recap associe rigueur analytique et
            élégance pédagogique pour soutenir vos promotions les plus ambitieuses.
          </p>
          <div className="rounded-3xl border border-gray-700 bg-gray-800/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur">
            <p className="text-sm font-semibold text-white">
              Vous possédez déjà un compte ?
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Connectez-vous pour rejoindre vos espaces de travail existants.
            </p>
            <Link
              href="/signin"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400"
            >
              Se connecter
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
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-[32px] border border-gray-700 bg-gray-900 p-10 shadow-[0_32px_80px_rgba(0,0,0,0.3)]"
          >
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Créer un compte
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Configurez votre espace Recap en quelques minutes.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="name">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="email">
                Email professionnel
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300" htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700"
              />
              <p className="text-xs text-gray-400">
                Combinez lettres, chiffres et symboles pour plus de sécurité.
              </p>
            </div>
            {error ? (
              <div className="rounded-2xl border border-rose-900 bg-rose-900/30 px-4 py-3 text-sm text-rose-400">
                {error}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

