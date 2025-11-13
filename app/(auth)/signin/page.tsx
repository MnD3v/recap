'use client';

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const SignInPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const redirectTo = searchParams.get("redirect") ?? "/";
      router.replace(redirectTo);
    } catch (error) {
      console.error(error);
      setError(
        "Impossible de vous connecter. Vérifiez vos identifiants ou réessayez plus tard.",
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
            Recap — Portail Enseignant
          </div>
          <h1 className="text-4xl font-semibold text-white">
            Rejoignez vos cohortes et pilotez l&apos;engagement en temps réel.
          </h1>
          <p className="max-w-lg text-sm text-gray-300">
            Retrouvez vos tutoriels, vos tableaux de bord d’attention, et les
            bilans hebdomadaires. Identifiez les étudiants investis et ceux qui
            requièrent un accompagnement renforcé avant même votre prochaine
            séance.
          </p>
          <div className="rounded-3xl border border-gray-700 bg-gray-800/50 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur">
            <p className="text-sm font-semibold text-white">
              Nouveau sur Recap ?
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Créez un compte pour configurer votre premier parcours pédagogique.
            </p>
            <Link
              href="/signup"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400"
            >
              S&apos;inscrire
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
                Connexion
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Accédez à votre espace Recap sécurisé.
              </p>
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
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300" htmlFor="password">
                  Mot de passe
                </label>
                <Link
                  href="#"
                  className="text-xs font-semibold text-gray-400 hover:text-gray-300"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-600 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700"
              />
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
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

