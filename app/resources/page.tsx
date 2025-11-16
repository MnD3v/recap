'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HTMLTag {
  name: string;
  description: string;
  usage: string;
  example: string;
  svg: React.ReactNode;
  color: string;
}

const htmlTags: HTMLTag[] = [
  {
    name: '<div>',
    description: 'Conteneur de division',
    usage: 'La balise <div> est un conteneur bloc générique qui sert à regrouper et structurer d\'autres éléments HTML. Elle n\'a pas de signification sémantique particulière, mais elle est essentielle pour organiser votre page. Vous pouvez lui ajouter des attributs comme "class" (pour appliquer des styles CSS) ou "id" (pour identifier un élément unique). C\'est l\'une des balises les plus utilisées en HTML.',
    example: '<div class="container">\n  <p>Contenu ici</p>\n</div>\n\n<!-- class="container" est un attribut -->\n<!-- qui permet de cibler cet élément en CSS -->',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" />
      </svg>
    ),
    color: 'from-[#ff2600] to-[#ff4433]'
  },
  {
    name: '<p>',
    description: 'Paragraphe',
    usage: 'La balise <p> définit un paragraphe de texte. Elle crée automatiquement des espaces (marges) avant et après le texte pour le séparer des autres éléments. C\'est la balise standard pour tout contenu textuel. Les navigateurs appliquent par défaut un espacement vertical entre les paragraphes pour améliorer la lisibilité.',
    example: '<p>Ceci est un paragraphe de texte.</p>\n<p>Voici un second paragraphe.</p>\n\n<!-- Chaque <p> crée un bloc de texte -->\n<!-- avec des marges automatiques -->',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 4.5V20M14 4.5C14 3.12 12.88 2 11.5 2H6.5C5.12 2 4 3.12 4 4.5C4 5.88 5.12 7 6.5 7H14M14 4.5C14 5.88 15.12 7 16.5 7C17.88 7 19 5.88 19 4.5C19 3.12 17.88 2 16.5 2H14" />
        <line x1="10" y1="20" x2="18" y2="20" strokeLinecap="round" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: '<span>',
    description: 'Conteneur en ligne',
    usage: 'La balise <span> est un conteneur en ligne (inline) qui permet de styliser une portion de texte sans créer de nouvelle ligne ou de bloc. Contrairement à <div>, elle ne provoque pas de retour à la ligne. Elle est idéale pour appliquer des styles CSS à une partie spécifique d\'un texte, comme changer la couleur d\'un mot ou mettre en évidence une expression.',
    example: '<p>Texte avec <span class="highlight">mise en évidence</span></p>\n\n<!-- L\'attribut class="highlight" permet -->\n<!-- d\'appliquer un style CSS spécifique -->\n<!-- uniquement à ce mot -->',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
        <rect x="15" y="14" width="6" height="6" rx="1" fill="currentColor" opacity="0.3" />
      </svg>
    ),
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: '<h1> à <h6>',
    description: 'Titres hiérarchiques',
    usage: 'Définit les titres de niveau 1 à 6. h1 est le plus important, h6 le moins.',
    example: '<h1>Titre principal</h1>\n<h2>Sous-titre</h2>\n<h3>Section</h3>',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6v12M4 12h8M12 6v12" strokeLinecap="round" />
        <path d="M17 9v10M20 12v7" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    color: 'from-green-500 to-green-600'
  },
  {
    name: '<br>',
    description: 'Saut de ligne',
    usage: 'Insère un saut de ligne simple. Balise auto-fermante.',
    example: 'Première ligne<br>\nDeuxième ligne',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 6h18M3 12h12M3 18h18" strokeLinecap="round" />
        <path d="M15 15l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    name: '<a>',
    description: 'Lien hypertexte',
    usage: 'La balise <a> (anchor = ancre) crée un lien hypertexte cliquable. L\'attribut "href" (hypertext reference) est obligatoire et contient l\'URL de destination. Vous pouvez créer des liens vers d\'autres pages web, des fichiers, des emails (mailto:), ou même des sections de la même page (#section). L\'attribut "target" permet de contrôler où s\'ouvre le lien (par exemple target="_blank" pour un nouvel onglet).',
    example: '<a href="https://example.com">Cliquez ici</a>\n<a href="mailto:contact@site.com">Nous contacter</a>\n<a href="#section1">Aller à la section 1</a>\n\n<!-- href est l\'attribut qui définit -->\n<!-- la destination du lien -->',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    name: '<img>',
    description: 'Image',
    usage: 'La balise <img> insère une image dans votre page. C\'est une balise auto-fermante (pas besoin de </img>). L\'attribut "src" (source) est obligatoire et contient le chemin vers l\'image. L\'attribut "alt" (texte alternatif) est fortement recommandé : il décrit l\'image pour l\'accessibilité et s\'affiche si l\'image ne charge pas. Vous pouvez aussi utiliser "width" et "height" pour définir les dimensions.',
    example: '<img src="photo.jpg" alt="Description de l\'image">\n<img src="logo.png" alt="Logo" width="200">\n\n<!-- src = chemin de l\'image -->\n<!-- alt = description pour accessibilité -->',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-pink-500 to-pink-600'
  },
  {
    name: '<ul> <li>',
    description: 'Liste non ordonnée',
    usage: 'Crée une liste à puces. ul est le conteneur, li représente chaque élément.',
    example: '<ul>\n  <li>Premier élément</li>\n  <li>Deuxième élément</li>\n</ul>',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6" strokeLinecap="round" />
        <line x1="8" y1="12" x2="21" y2="12" strokeLinecap="round" />
        <line x1="8" y1="18" x2="21" y2="18" strokeLinecap="round" />
        <circle cx="4" cy="6" r="1" fill="currentColor" />
        <circle cx="4" cy="12" r="1" fill="currentColor" />
        <circle cx="4" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
    color: 'from-orange-500 to-orange-600'
  },
  {
    name: '<input>',
    description: 'Champ de saisie',
    usage: 'La balise <input> crée un champ de saisie interactif. C\'est une balise auto-fermante. L\'attribut "type" définit le type de données (text, email, password, number, date, etc.). L\'attribut "placeholder" affiche un texte d\'aide qui disparaît lors de la saisie. L\'attribut "name" identifie le champ lors de l\'envoi du formulaire. Vous pouvez aussi utiliser "required" pour rendre le champ obligatoire.',
    example: '<input type="text" name="nom" placeholder="Votre nom">\n<input type="email" name="email" required>\n<input type="password" name="mdp">\n\n<!-- type définit le type de saisie -->\n<!-- name identifie le champ -->',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="2" rx="1" />
        <path d="M7 11V9a2 2 0 012-2h6a2 2 0 012 2v2" strokeLinecap="round" />
      </svg>
    ),
    color: 'from-green-500 to-emerald-600'
  },
  {
    name: '<section>',
    description: 'Section thématique',
    usage: 'Définit une section thématique dans un document. Utilisé pour structurer le contenu de manière sémantique.',
    example: '<section>\n  <h2>Titre de section</h2>\n  <p>Contenu...</p>\n</section>',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="18" rx="1" />
      </svg>
    ),
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: '<form>',
    description: 'Formulaire',
    usage: 'La balise <form> est un conteneur qui regroupe des champs de saisie pour collecter des données utilisateur. L\'attribut "action" définit l\'URL où envoyer les données. L\'attribut "method" spécifie comment envoyer les données (GET ou POST). Tous les éléments <input>, <textarea>, <select> à l\'intérieur du formulaire seront envoyés ensemble lors de la soumission. C\'est essentiel pour créer des formulaires de contact, d\'inscription, de connexion, etc.',
    example: '<form action="/submit" method="POST">\n  <input type="text" name="nom">\n  <input type="email" name="email">\n  <button type="submit">Envoyer</button>\n</form>\n\n<!-- action = URL de destination -->\n<!-- method = GET ou POST -->',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 10h8M8 14h5" strokeLinecap="round" />
      </svg>
    ),
    color: 'from-purple-500 to-purple-600'
  }
];

const resources = [
  {
    id: 'html-basics',
    title: 'Les balises essentielles en HTML',
    description: 'Découvrez les balises HTML fondamentales avec des exemples pratiques',
    icon: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7l4-4 4 4M8 3v11" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="14" width="18" height="7" rx="1" />
        <path d="M7 17h.01M12 17h.01M17 17h.01" strokeLinecap="round" />
      </svg>
    ),
    category: 'HTML'
  },
  {
    id: 'css-fundamentals',
    title: 'Les fondamentaux CSS',
    description: 'Maîtrisez les bases du CSS pour styliser vos pages web',
    icon: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l9 4.5v7L12 22l-9-8.5v-7L12 2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V13.5M12 13.5L3 6.5M12 13.5l9-7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    category: 'CSS',
    comingSoon: true
  },
  {
    id: 'javascript-intro',
    title: 'Introduction à JavaScript',
    description: 'Apprenez les concepts de base de la programmation JavaScript',
    icon: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    category: 'JavaScript',
    comingSoon: true
  }
];

export default function ResourcesPage() {
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
          <div className="flex items-center gap-4">
            <div className="text-[#ff2600]">
              <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold">Ressources d'apprentissage</h1>
          </div>
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
              <div className="mb-4 text-gray-400">{resource.icon}</div>
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
              <div className="mb-4 flex items-center gap-4">
                <div className="text-[#ff2600]">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 7l4-4 4 4M8 3v11" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="3" y="14" width="18" height="7" rx="1" />
                    <path d="M7 17h.01M12 17h.01M17 17h.01" strokeLinecap="round" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">Les balises essentielles en HTML</h2>
              </div>
              <p className="text-gray-400">
                HTML (HyperText Markup Language) est le langage de balisage standard pour créer des pages web.
                Voici les balises fondamentales que tout développeur doit connaître.
              </p>
            </div>

            {/* Tags Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {htmlTags.map((tag, index) => (
                <Link
                  key={tag.name}
                  href={`/resources/${tag.name.replace(/[<>]/g, '')}`}
                  className="group relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 p-6 text-left transition hover:border-gray-600 hover:scale-105"
                  style={{
                    animation: `scale-in 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tag.color} opacity-0 transition group-hover:opacity-10`}></div>
                  <div className="relative">
                    <div className="mb-3 text-gray-400 group-hover:text-white transition">{tag.svg}</div>
                    <h3 className="mb-2 font-mono text-lg font-bold text-[#ff2600]">{tag.name}</h3>
                    <p className="text-sm text-gray-400">{tag.description}</p>
                  </div>
                </Link>
              ))}
            </div>

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
                          {tag.name.includes('div') || tag.name.includes('p') || tag.name.includes('h') || tag.name.includes('ul') || tag.name.includes('section') || tag.name.includes('form') ? 'Block' : 'Inline'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">{tag.description}</td>
                        <td className="px-4 py-4 text-sm">
                          {tag.name.includes('br') || tag.name.includes('img') || tag.name.includes('input') ? (
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

            {/* Other Important Tags */}
            <div className="mt-12 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <h3 className="mb-6 text-2xl font-bold">🔧 Autres balises importantes</h3>
              <p className="mb-8 text-gray-400">
                Ces balises complètent votre boîte à outils HTML et vous permettent de créer des pages web plus riches et interactives.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* Button */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-blue-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="8" width="18" height="8" rx="2" />
                        <path d="M12 12h.01" strokeLinecap="round" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;button&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Crée un bouton cliquable pour les interactions utilisateur.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;button&gt;Cliquez-moi&lt;/button&gt;</pre>
                </div>

                {/* Input */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-green-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="2" rx="1" />
                        <path d="M7 11V9a2 2 0 012-2h6a2 2 0 012 2v2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;input&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Champ de saisie pour collecter des données utilisateur.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;input type=&quot;text&quot; placeholder=&quot;Nom&quot;&gt;</pre>
                </div>

                {/* Form */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-purple-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <path d="M8 10h8M8 14h5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;form&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Conteneur pour regrouper des champs de formulaire.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;form action=&quot;/submit&quot;&gt;...&lt;/form&gt;</pre>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-orange-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;table&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Crée un tableau de données structuré.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;table&gt;&lt;tr&gt;&lt;td&gt;Cellule&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;</pre>
                </div>

                {/* Strong */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-red-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M6 12h12M12 6v12" strokeLinecap="round" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;strong&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Met en gras un texte important (importance sémantique).</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;strong&gt;Texte important&lt;/strong&gt;</pre>
                </div>

                {/* Em */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-yellow-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10 4l4 16M6 12h12" strokeLinecap="round" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;em&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Met en italique un texte pour l'emphase.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;em&gt;Texte en emphase&lt;/em&gt;</pre>
                </div>

                {/* Section */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-indigo-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="18" rx="1" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;section&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Définit une section thématique dans un document.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;section&gt;&lt;h2&gt;Titre&lt;/h2&gt;...&lt;/section&gt;</pre>
                </div>

                {/* Article */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-teal-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;article&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Contenu autonome et réutilisable (article, blog post).</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;article&gt;&lt;h2&gt;Article&lt;/h2&gt;...&lt;/article&gt;</pre>
                </div>

                {/* Header */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-pink-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="6" rx="1" />
                        <path d="M7 6v3M12 6v3M17 6v3" strokeLinecap="round" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;header&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">En-tête d'une page ou d'une section.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;header&gt;&lt;h1&gt;Titre&lt;/h1&gt;&lt;/header&gt;</pre>
                </div>

                {/* Footer */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-cyan-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="15" width="18" height="6" rx="1" />
                        <path d="M7 18v-3M12 18v-3M17 18v-3" strokeLinecap="round" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;footer&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Pied de page d'une page ou d'une section.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;footer&gt;&lt;p&gt;© 2024&lt;/p&gt;&lt;/footer&gt;</pre>
                </div>

                {/* Nav */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-lime-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                        <circle cx="7" cy="12" r="1" fill="currentColor" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;nav&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Section contenant les liens de navigation principaux.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;nav&gt;&lt;a href=&quot;#&quot;&gt;Accueil&lt;/a&gt;&lt;/nav&gt;</pre>
                </div>

                {/* Main */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="text-amber-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                        <path d="M6 10h12M10 6v12" />
                      </svg>
                    </div>
                    <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;main&gt;</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Contenu principal unique de la page.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
&lt;main&gt;&lt;article&gt;...&lt;/article&gt;&lt;/main&gt;</pre>
                </div>
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
    case '<input>':
      return (
        <div className="space-y-4 rounded-lg bg-green-500/10 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">Champ texte</label>
            <input
              type="text"
              placeholder="Entrez votre nom"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-[#ff2600] focus:ring-2 focus:ring-[#ff2600]/50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">Champ email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-[#ff2600] focus:ring-2 focus:ring-[#ff2600]/50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">Champ mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-[#ff2600] focus:ring-2 focus:ring-[#ff2600]/50"
            />
          </div>
        </div>
      );
    case '<section>':
      return (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-indigo-500 bg-indigo-500/10 p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Section 1</p>
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">À propos de nous</h3>
            <p className="text-sm text-gray-300">Contenu de la première section thématique...</p>
          </div>
          <div className="rounded-lg border-2 border-purple-500 bg-purple-500/10 p-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">Section 2</p>
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Nos services</h3>
            <p className="text-sm text-gray-300">Contenu de la deuxième section thématique...</p>
          </div>
        </div>
      );
    case '<form>':
      return (
        <div className="rounded-lg border-2 border-purple-500 bg-purple-500/10 p-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Nom complet</label>
              <input
                type="text"
                placeholder="Jean Dupont"
                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Email</label>
              <input
                type="email"
                placeholder="jean@example.com"
                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Message</label>
              <textarea
                placeholder="Votre message..."
                rows={3}
                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#ff2600] px-6 py-3 font-semibold text-white transition hover:bg-[#ff4433]"
            >
              Envoyer le formulaire
            </button>
          </form>
        </div>
      );
    default:
      return null;
  }
}

