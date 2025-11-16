'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HTMLTag {
  name: string;
  description: string;
  usage: string;
  example: string;
  icon: string;
  color: string;
}

const htmlTags: HTMLTag[] = [
  {
    name: '<div>',
    description: 'Conteneur de division',
    usage: 'Utilisé pour regrouper et structurer des éléments. C\'est un conteneur bloc générique.',
    example: '<div class="container">\n  <p>Contenu ici</p>\n</div>',
    icon: '📦',
    color: 'from-[#ff2600] to-[#ff4433]'
  },
  {
    name: '<p>',
    description: 'Paragraphe',
    usage: 'Définit un paragraphe de texte. Crée automatiquement des marges avant et après.',
    example: '<p>Ceci est un paragraphe de texte.</p>',
    icon: '📝',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: '<span>',
    description: 'Conteneur en ligne',
    usage: 'Conteneur inline pour styliser une partie de texte sans créer de nouvelle ligne.',
    example: '<p>Texte avec <span class="highlight">mise en évidence</span></p>',
    icon: '✨',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: '<h1> à <h6>',
    description: 'Titres hiérarchiques',
    usage: 'Définit les titres de niveau 1 à 6. h1 est le plus important, h6 le moins.',
    example: '<h1>Titre principal</h1>\n<h2>Sous-titre</h2>\n<h3>Section</h3>',
    icon: '📌',
    color: 'from-green-500 to-green-600'
  },
  {
    name: '<br>',
    description: 'Saut de ligne',
    usage: 'Insère un saut de ligne simple. Balise auto-fermante.',
    example: 'Première ligne<br>\nDeuxième ligne',
    icon: '↵',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    name: '<a>',
    description: 'Lien hypertexte',
    usage: 'Crée un lien cliquable vers une autre page ou ressource.',
    example: '<a href="https://example.com">Cliquez ici</a>',
    icon: '🔗',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    name: '<img>',
    description: 'Image',
    usage: 'Insère une image. Nécessite l\'attribut src. Balise auto-fermante.',
    example: '<img src="photo.jpg" alt="Description">',
    icon: '🖼️',
    color: 'from-pink-500 to-pink-600'
  },
  {
    name: '<ul> <li>',
    description: 'Liste non ordonnée',
    usage: 'Crée une liste à puces. ul est le conteneur, li représente chaque élément.',
    example: '<ul>\n  <li>Premier élément</li>\n  <li>Deuxième élément</li>\n</ul>',
    icon: '📋',
    color: 'from-orange-500 to-orange-600'
  }
];

const resources = [
  {
    id: 'html-basics',
    title: 'Les balises essentielles en HTML',
    description: 'Découvrez les balises HTML fondamentales avec des exemples pratiques',
    icon: '🏷️',
    category: 'HTML'
  },
  {
    id: 'css-fundamentals',
    title: 'Les fondamentaux CSS',
    description: 'Maîtrisez les bases du CSS pour styliser vos pages web',
    icon: '🎨',
    category: 'CSS',
    comingSoon: true
  },
  {
    id: 'javascript-intro',
    title: 'Introduction à JavaScript',
    description: 'Apprenez les concepts de base de la programmation JavaScript',
    icon: '⚡',
    category: 'JavaScript',
    comingSoon: true
  }
];

export default function ResourcesPage() {
  const [selectedTag, setSelectedTag] = useState<HTMLTag | null>(null);
  const [selectedResource, setSelectedResource] = useState<string>('html-basics');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-black">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold">📚 Ressources d'apprentissage</h1>
          <p className="mt-3 text-lg text-gray-400">
            Des guides et tutoriels pour maîtriser le développement web
          </p>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <button
              key={resource.id}
              onClick={() => !resource.comingSoon && setSelectedResource(resource.id)}
              disabled={resource.comingSoon}
              className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition ${
                selectedResource === resource.id
                  ? 'border-[#ff2600] bg-[#ff2600]/10'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              } ${resource.comingSoon ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              {resource.comingSoon && (
                <span className="absolute right-4 top-4 rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-400">
                  Bientôt
                </span>
              )}
              <div className="mb-4 text-4xl">{resource.icon}</div>
              <h3 className="mb-2 text-xl font-bold">{resource.title}</h3>
              <p className="text-sm text-gray-400">{resource.description}</p>
              <span className="mt-4 inline-block rounded-full bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-300">
                {resource.category}
              </span>
            </button>
          ))}
        </div>

        {/* HTML Basics Content */}
        {selectedResource === 'html-basics' && (
          <div className="animate-fade-in">
            <div className="mb-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <h2 className="mb-4 text-3xl font-bold">🏷️ Les balises essentielles en HTML</h2>
              <p className="text-gray-400">
                HTML (HyperText Markup Language) est le langage de balisage standard pour créer des pages web.
                Voici les balises fondamentales que tout développeur doit connaître.
              </p>
            </div>

            {/* Tags Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {htmlTags.map((tag, index) => (
                <button
                  key={tag.name}
                  onClick={() => setSelectedTag(tag)}
                  className="group relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 p-6 text-left transition hover:border-gray-600 hover:scale-105"
                  style={{
                    animation: `scale-in 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tag.color} opacity-0 transition group-hover:opacity-10`}></div>
                  <div className="relative">
                    <div className="mb-3 text-4xl">{tag.icon}</div>
                    <h3 className="mb-2 font-mono text-lg font-bold text-[#ff2600]">{tag.name}</h3>
                    <p className="text-sm text-gray-400">{tag.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Tag Detail */}
            {selectedTag && (
              <div className="mt-8 animate-fade-in rounded-2xl border border-[#ff2600] bg-gradient-to-br from-[#ff2600]/10 to-transparent p-8">
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{selectedTag.icon}</div>
                    <div>
                      <h3 className="mb-1 font-mono text-3xl font-bold text-[#ff2600]">
                        {selectedTag.name}
                      </h3>
                      <p className="text-xl text-gray-300">{selectedTag.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="rounded-full p-2 transition hover:bg-gray-800"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Usage */}
                  <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                      <svg className="h-5 w-5 text-[#ff2600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Utilisation
                    </h4>
                    <p className="text-gray-300">{selectedTag.usage}</p>
                  </div>

                  {/* Example */}
                  <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                    <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                      <svg className="h-5 w-5 text-[#ff2600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Exemple de code
                    </h4>
                    <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4">
                      <code className="text-sm text-green-400">{selectedTag.example}</code>
                    </pre>
                  </div>
                </div>

                {/* Visual Demo */}
                <div className="mt-6 rounded-xl border border-gray-700 bg-black/50 p-6">
                  <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <svg className="h-5 w-5 text-[#ff2600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Aperçu visuel
                  </h4>
                  <div className="rounded-lg border border-dashed border-gray-600 bg-gray-900/50 p-6">
                    {renderTagDemo(selectedTag.name)}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Reference */}
            <div className="mt-12 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <h3 className="mb-6 text-2xl font-bold">📖 Référence rapide</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Balise</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Auto-fermante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {htmlTags.map((tag, index) => (
                      <tr
                        key={tag.name}
                        className="border-b border-gray-800/50 transition hover:bg-gray-900/50"
                      >
                        <td className="px-4 py-4">
                          <code className="font-mono text-[#ff2600]">{tag.name}</code>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-400">
                          {tag.name.includes('div') || tag.name.includes('p') || tag.name.includes('h') || tag.name.includes('ul') ? 'Block' : 'Inline'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">{tag.description}</td>
                        <td className="px-4 py-4 text-sm">
                          {tag.name.includes('br') || tag.name.includes('img') ? (
                            <span className="inline-flex items-center gap-1 text-green-400">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Oui
                            </span>
                          ) : (
                            <span className="text-gray-500">Non</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function renderTagDemo(tagName: string) {
  switch (tagName) {
    case '<div>':
      return (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-[#ff2600] bg-[#ff2600]/10 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#ff2600]">DIV Container</p>
            <div className="rounded border border-gray-600 bg-gray-800 p-3">
              <p className="text-sm text-gray-300">Élément enfant 1</p>
            </div>
            <div className="mt-2 rounded border border-gray-600 bg-gray-800 p-3">
              <p className="text-sm text-gray-300">Élément enfant 2</p>
            </div>
          </div>
        </div>
      );
    case '<p>':
      return (
        <div className="space-y-3">
          <p className="rounded-lg bg-blue-500/10 p-4 text-gray-300">
            Ceci est un premier paragraphe avec du texte. Les paragraphes créent automatiquement des espaces avant et après.
          </p>
          <p className="rounded-lg bg-blue-500/10 p-4 text-gray-300">
            Voici un deuxième paragraphe. Notez l'espace entre les deux paragraphes.
          </p>
        </div>
      );
    case '<span>':
      return (
        <p className="rounded-lg bg-purple-500/10 p-4 text-gray-300">
          Ceci est un texte normal avec{' '}
          <span className="rounded bg-[#ff2600] px-2 py-1 font-bold text-white">
            une partie mise en évidence
          </span>{' '}
          grâce à la balise span.
        </p>
      );
    case '<h1> à <h6>':
      return (
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">Titre H1</h1>
          <h2 className="text-2xl font-bold text-gray-200">Titre H2</h2>
          <h3 className="text-xl font-bold text-gray-300">Titre H3</h3>
          <h4 className="text-lg font-bold text-gray-400">Titre H4</h4>
          <h5 className="text-base font-bold text-gray-500">Titre H5</h5>
          <h6 className="text-sm font-bold text-gray-600">Titre H6</h6>
        </div>
      );
    case '<br>':
      return (
        <div className="rounded-lg bg-yellow-500/10 p-4">
          <p className="text-gray-300">
            Première ligne de texte
            <br />
            <span className="text-[#ff2600]">← Saut de ligne ici</span>
            <br />
            Deuxième ligne de texte
            <br />
            Troisième ligne de texte
          </p>
        </div>
      );
    case '<a>':
      return (
        <div className="space-y-3 rounded-lg bg-cyan-500/10 p-4">
          <a href="#" className="block text-[#ff2600] underline transition hover:text-[#ff4433]">
            🔗 Lien hypertexte cliquable
          </a>
          <a href="#" className="block text-blue-400 underline transition hover:text-blue-300">
            🔗 Lien vers une autre page
          </a>
          <a href="#" className="inline-flex items-center gap-2 text-green-400 underline transition hover:text-green-300">
            🔗 Lien avec icône
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      );
    case '<img>':
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center rounded-lg bg-pink-500/10 p-6">
            <div className="text-center">
              <div className="mb-3 flex h-32 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-6xl">
                🖼️
              </div>
              <p className="text-sm text-gray-400">Exemple d'image</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-3xl">
              🌄
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 text-3xl">
              🏔️
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-3xl">
              🌅
            </div>
          </div>
        </div>
      );
    case '<ul> <li>':
      return (
        <div className="rounded-lg bg-orange-500/10 p-4">
          <ul className="space-y-2">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff2600] text-xs font-bold text-white">
                1
              </span>
              Premier élément de la liste
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff2600] text-xs font-bold text-white">
                2
              </span>
              Deuxième élément de la liste
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff2600] text-xs font-bold text-white">
                3
              </span>
              Troisième élément de la liste
            </li>
          </ul>
        </div>
      );
    default:
      return null;
  }
}

