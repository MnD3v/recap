'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface HTMLTag {
  name: string;
  description: string;
  usage: string;
  example: string;
  svg: React.ReactNode;
  color: string;
  mdnLink: string;
  w3schoolsLink?: string;
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
    name: '<a>',
    description: 'Lien hypertexte',
    usage: 'La balise <a> (anchor) crée un lien cliquable vers une autre page, un fichier, ou une section de la page. L\'attribut "href" (hypertext reference) est obligatoire et définit la destination du lien. Vous pouvez aussi utiliser "target=\"_blank\"" pour ouvrir le lien dans un nouvel onglet, et "rel=\"noopener noreferrer\"" pour des raisons de sécurité.',
    example: '<a href="https://example.com">Visitez notre site</a>\n\n<!-- href définit la destination -->\n<a href="https://example.com" target="_blank" rel="noopener">\n  Ouvrir dans un nouvel onglet\n</a>',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-green-500 to-green-600'
  },
  {
    name: '<img>',
    description: 'Image',
    usage: 'La balise <img> affiche une image sur votre page. C\'est une balise auto-fermante (pas besoin de </img>). L\'attribut "src" (source) est obligatoire et indique le chemin de l\'image. L\'attribut "alt" (texte alternatif) est crucial pour l\'accessibilité : il décrit l\'image pour les personnes malvoyantes et s\'affiche si l\'image ne charge pas. Vous pouvez aussi définir "width" et "height" pour les dimensions.',
    example: '<img src="photo.jpg" alt="Description de l\'image" />\n\n<!-- alt est essentiel pour l\'accessibilité -->\n<img \n  src="logo.png" \n  alt="Logo de l\'entreprise"\n  width="200"\n  height="100"\n/>',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
        <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    name: '<h1>',
    description: 'Titre principal',
    usage: 'La balise <h1> définit le titre le plus important de votre page (heading 1). Il ne devrait y avoir qu\'un seul <h1> par page, généralement le titre principal. Les balises de titre vont de <h1> (le plus important) à <h6> (le moins important). Elles créent une hiérarchie qui aide les utilisateurs et les moteurs de recherche à comprendre la structure de votre contenu.',
    example: '<h1>Titre principal de la page</h1>\n<h2>Sous-titre</h2>\n<h3>Section</h3>\n\n<!-- Un seul <h1> par page -->\n<!-- Utilisez <h2>, <h3>, etc. pour la hiérarchie -->',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 12h8m-8-6v12M20 12h-8m8-6v12M12 6v12" strokeLinecap="round" />
      </svg>
    ),
    color: 'from-red-500 to-red-600'
  },
  {
    name: '<ul>',
    description: 'Liste non ordonnée',
    usage: 'La balise <ul> (unordered list) crée une liste à puces. Chaque élément de la liste est défini par une balise <li> (list item). Les puces sont ajoutées automatiquement par le navigateur. Utilisez <ul> quand l\'ordre des éléments n\'est pas important (contrairement à <ol> pour les listes ordonnées).',
    example: '<ul>\n  <li>Premier élément</li>\n  <li>Deuxième élément</li>\n  <li>Troisième élément</li>\n</ul>\n\n<!-- Les puces sont automatiques -->\n<!-- <li> doit toujours être dans <ul> ou <ol> -->',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="5" cy="6" r="1.5" fill="currentColor" />
        <circle cx="5" cy="12" r="1.5" fill="currentColor" />
        <circle cx="5" cy="18" r="1.5" fill="currentColor" />
        <line x1="10" y1="6" x2="20" y2="6" strokeLinecap="round" />
        <line x1="10" y1="12" x2="20" y2="12" strokeLinecap="round" />
        <line x1="10" y1="18" x2="20" y2="18" strokeLinecap="round" />
      </svg>
    ),
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: '<input>',
    description: 'Champ de saisie',
    usage: 'La balise <input> crée un champ de saisie interactif. C\'est une balise auto-fermante. L\'attribut "type" définit le type de données (text, email, password, number, date, etc.). L\'attribut "name" identifie le champ lors de l\'envoi du formulaire. "placeholder" affiche un texte d\'aide, et "required" rend le champ obligatoire.',
    example: '<input type="text" name="username" placeholder="Nom d\'utilisateur" />\n\n<!-- Différents types d\'input -->\n<input type="email" name="email" required />\n<input type="password" name="password" />\n<input type="number" name="age" min="0" max="120" />',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="8" width="18" height="8" rx="2" />
        <path d="M7 12h.01M11 12h6" strokeLinecap="round" />
      </svg>
    ),
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    name: '<section>',
    description: 'Section thématique',
    usage: 'La balise <section> définit une section thématique de votre page. Contrairement à <div>, elle a une signification sémantique : elle indique que le contenu forme un groupe logique. Chaque <section> devrait généralement avoir un titre (<h1> à <h6>). Elle aide à structurer votre document de manière significative pour les moteurs de recherche et les lecteurs d\'écran.',
    example: '<section>\n  <h2>À propos de nous</h2>\n  <p>Notre histoire...</p>\n</section>\n\n<!-- Chaque section a un thème distinct -->\n<section>\n  <h2>Nos services</h2>\n  <p>Ce que nous offrons...</p>\n</section>',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18" />
      </svg>
    ),
    color: 'from-teal-500 to-teal-600'
  },
  {
    name: '<form>',
    description: 'Formulaire',
    usage: 'La balise <form> crée un formulaire pour collecter des données utilisateur. L\'attribut "action" définit où envoyer les données (URL du serveur). L\'attribut "method" définit comment les envoyer (GET ou POST). POST est recommandé pour les données sensibles. Le formulaire contient des éléments comme <input>, <textarea>, <select>, et un bouton <button type="submit"> pour l\'envoi.',
    example: '<form action="/submit" method="POST">\n  <input type="text" name="nom" required />\n  <input type="email" name="email" required />\n  <button type="submit">Envoyer</button>\n</form>\n\n<!-- method="POST" pour les données sensibles -->\n<!-- action définit la destination des données -->',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 8h10M7 12h10M7 16h6" strokeLinecap="round" />
      </svg>
    ),
    color: 'from-orange-500 to-orange-600'
  },
];

const renderTagDemo = (tagName: string) => {
  switch (tagName) {
    case '<div>':
      return (
        <div className="space-y-2">
          <div className="rounded border-2 border-dashed border-[#ff2600] bg-[#ff2600]/10 p-4">
            <p className="text-sm text-gray-300">Ceci est un conteneur div</p>
          </div>
        </div>
      );
    case '<p>':
      return (
        <div className="space-y-4">
          <p className="rounded bg-blue-500/10 p-3 text-gray-300">Premier paragraphe avec du texte.</p>
          <p className="rounded bg-blue-500/10 p-3 text-gray-300">Deuxième paragraphe séparé automatiquement.</p>
        </div>
      );
    case '<span>':
      return (
        <p className="text-gray-300">
          Texte normal avec <span className="rounded bg-purple-500/30 px-2 py-1 text-purple-300">texte stylisé en ligne</span> qui continue.
        </p>
      );
    case '<a>':
      return (
        <div className="space-y-2">
          <a href="#" className="block text-green-400 underline hover:text-green-300">
            Cliquez ici pour un lien
          </a>
          <a href="#" className="block text-green-400 underline hover:text-green-300">
            Un autre lien
          </a>
        </div>
      );
    case '<img>':
      return (
        <div className="flex items-center justify-center rounded bg-yellow-500/10 p-8">
          <div className="flex h-32 w-32 items-center justify-center rounded border-2 border-dashed border-yellow-500 bg-yellow-500/20">
            <span className="text-sm text-yellow-300">Image ici</span>
          </div>
        </div>
      );
    case '<h1>':
      return (
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-red-400">Titre H1</h1>
          <h2 className="text-2xl font-bold text-red-400/80">Titre H2</h2>
          <h3 className="text-xl font-bold text-red-400/60">Titre H3</h3>
        </div>
      );
    case '<ul>':
      return (
        <ul className="list-disc space-y-2 pl-6 text-gray-300">
          <li>Premier élément de la liste</li>
          <li>Deuxième élément</li>
          <li>Troisième élément</li>
        </ul>
      );
    case '<input>':
      return (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Entrez votre nom"
            className="w-full rounded border border-cyan-500 bg-cyan-500/10 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <input
            type="email"
            placeholder="Entrez votre email"
            className="w-full rounded border border-cyan-500 bg-cyan-500/10 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      );
    case '<section>':
      return (
        <div className="space-y-4">
          <section className="rounded border-2 border-dashed border-teal-500 bg-teal-500/10 p-4">
            <h3 className="mb-2 font-bold text-teal-400">Section 1</h3>
            <p className="text-sm text-gray-300">Contenu de la première section</p>
          </section>
          <section className="rounded border-2 border-dashed border-teal-500 bg-teal-500/10 p-4">
            <h3 className="mb-2 font-bold text-teal-400">Section 2</h3>
            <p className="text-sm text-gray-300">Contenu de la deuxième section</p>
          </section>
        </div>
      );
    case '<form>':
      return (
        <form className="space-y-3 rounded border-2 border-dashed border-orange-500 bg-orange-500/10 p-4">
          <input
            type="text"
            placeholder="Nom"
            className="w-full rounded border border-orange-500 bg-orange-500/10 px-3 py-2 text-white placeholder-gray-400"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border border-orange-500 bg-orange-500/10 px-3 py-2 text-white placeholder-gray-400"
          />
          <button
            type="button"
            className="w-full rounded bg-orange-500 px-4 py-2 font-semibold text-white hover:bg-orange-600"
          >
            Envoyer
          </button>
        </form>
      );
    default:
      return <p className="text-gray-400">Aperçu non disponible</p>;
  }
};

export default function TagDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tagParam = params.tag as string;
  
  // Decode the URL parameter and find the matching tag
  const decodedTag = decodeURIComponent(tagParam);
  const tag = htmlTags.find(t => t.name.replace(/[<>]/g, '') === decodedTag);

  if (!tag) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Balise non trouvée</h1>
            <Link href="/resources" className="text-[#ff2600] hover:underline">
              ← Retour aux ressources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/resources"
          className="mb-8 inline-flex items-center gap-2 text-gray-400 transition hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour aux ressources
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-center gap-6">
          <div className={`text-[#ff2600] [&>svg]:h-20 [&>svg]:w-20`}>
            {tag.svg}
          </div>
          <div>
            <h1 className="mb-2 font-mono text-4xl md:text-5xl font-bold text-[#ff2600]">
              {tag.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">{tag.description}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Usage */}
          <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
            <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold text-white">
              <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Utilisation
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">{tag.usage}</p>
          </div>

          {/* Example */}
          <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
            <h2 className="mb-4 flex items-center gap-3 text-2xl font-semibold text-white">
              <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Exemple de code
            </h2>
            <pre className="overflow-x-auto rounded-xl bg-gray-950 p-6 border border-gray-800">
              <code className="text-base text-green-400">{tag.example}</code>
            </pre>
          </div>

          {/* Visual Demo */}
          <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white">
              <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Aperçu visuel
            </h2>
            <div className="rounded-xl border border-dashed border-gray-700 bg-gray-950/50 p-8">
              {renderTagDemo(tag.name)}
            </div>
          </div>

          {/* External Resources */}
          <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white">
              <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Ressources externes
            </h2>
            <p className="mb-6 text-gray-400">
              Pour approfondir vos connaissances sur cette balise, consultez ces ressources officielles :
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {/* MDN Link */}
              <a
                href={tag.mdnLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-gray-700 bg-gray-900/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
              >
                <div className="flex-shrink-0">
                  <svg className="h-12 w-12 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold text-white group-hover:text-[#ff2600] transition">
                    MDN Web Docs
                  </h3>
                  <p className="text-sm text-gray-400">
                    Documentation officielle de Mozilla
                  </p>
                </div>
                <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {/* W3Schools Link */}
              {tag.w3schoolsLink && (
                <a
                  href={tag.w3schoolsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-xl border border-gray-700 bg-gray-900/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="flex-shrink-0">
                    <svg className="h-12 w-12 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 0h24v24H0V0zm6.168 20.172a6.77 6.77 0 002.518.476c1.694 0 2.864-.675 3.601-1.938.737-1.263 1.105-3.032 1.105-5.307 0-2.274-.368-4.044-1.105-5.306-.737-1.263-1.907-1.895-3.601-1.895a6.77 6.77 0 00-2.518.476V20.172zM7.5 9.5c.414 0 .75.336.75.75v7.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-7.5c0-.414.336-.75.75-.75zm9 0c.414 0 .75.336.75.75v7.5c0 .414-.336.75-.75.75s-.75-.336-.75-.75v-7.5c0-.414.336-.75.75-.75z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-white group-hover:text-[#ff2600] transition">
                      W3Schools
                    </h3>
                    <p className="text-sm text-gray-400">
                      Tutoriels et exemples interactifs
                    </p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

