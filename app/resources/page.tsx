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
    color: 'from-[#ff2600] to-[#ff4433]',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/div',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_div.asp'
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
    color: 'from-blue-500 to-blue-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/p',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_p.asp'
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
    color: 'from-purple-500 to-purple-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/span',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_span.asp'
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
    color: 'from-green-500 to-green-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/Heading_Elements',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_hn.asp'
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
    color: 'from-yellow-500 to-yellow-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/br',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_br.asp'
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
    color: 'from-cyan-500 to-cyan-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/a',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_a.asp'
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
    color: 'from-pink-500 to-pink-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/Img',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_img.asp'
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
    color: 'from-orange-500 to-orange-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/ul',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_ul.asp'
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
    color: 'from-green-500 to-emerald-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/Input',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_input.asp'
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
    color: 'from-indigo-500 to-indigo-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/section',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_section.asp'
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
    color: 'from-purple-500 to-purple-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/HTML/Element/form',
    w3schoolsLink: 'https://www.w3schools.com/tags/tag_form.asp'
  }
];

interface JSConcept {
  name: string;
  description: string;
  usage: string;
  example: string;
  svg: React.ReactNode;
  color: string;
  mdnLink: string;
}

const jsConcepts: JSConcept[] = [
  {
    name: 'Variables (let, const)',
    description: 'Déclarer des variables',
    usage: 'Les variables permettent de stocker des données en mémoire. "let" déclare une variable modifiable, "const" déclare une constante (non modifiable). Évitez d\'utiliser "var" qui est obsolète. Utilisez "const" par défaut, et "let" uniquement si vous devez modifier la valeur. Les noms de variables doivent être explicites et utiliser la camelCase (première lettre minuscule, puis majuscules pour chaque nouveau mot).',
    example: 'let age = 25;\nage = 26; // OK avec let\n\nconst nom = "Marie";\n// nom = "Julie"; // ERREUR avec const\n\nconst PI = 3.14159; // Constantes en MAJUSCULES',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
        <rect x="15" y="14" width="6" height="6" rx="1" />
      </svg>
    ),
    color: 'from-yellow-500 to-yellow-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/let'
  },
  {
    name: 'Fonctions',
    description: 'Créer des fonctions réutilisables',
    usage: 'Les fonctions sont des blocs de code réutilisables qui effectuent une tâche spécifique. Elles peuvent prendre des paramètres en entrée et retourner une valeur avec "return". Il existe plusieurs syntaxes : fonction classique, fonction fléchée (arrow function) qui est plus moderne. Les fonctions permettent d\'organiser votre code et d\'éviter les répétitions.',
    example: '// Fonction classique\nfunction saluer(nom) {\n  return `Bonjour ${nom}!`;\n}\n\n// Fonction fléchée (moderne)\nconst additionner = (a, b) => {\n  return a + b;\n};\n\n// Utilisation\nconst resultat = additionner(5, 3); // 8',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-blue-500 to-blue-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Functions'
  },
  {
    name: 'Événements (addEventListener)',
    description: 'Réagir aux actions utilisateur',
    usage: 'Les événements permettent de rendre votre site interactif en réagissant aux actions de l\'utilisateur. "addEventListener" attache un écouteur d\'événement à un élément HTML. Les événements courants incluent "click" (clic), "submit" (soumission de formulaire), "keydown" (touche pressée), "mouseover" (survol). La fonction callback reçoit un objet "event" avec des informations sur l\'événement.',
    example: 'const bouton = document.querySelector("#monBouton");\n\nbouton.addEventListener("click", (event) => {\n  console.log("Bouton cliqué!");\n  alert("Vous avez cliqué!");\n});\n\n// Événement de soumission de formulaire\nconst formulaire = document.querySelector("form");\nformulaire.addEventListener("submit", (e) => {\n  e.preventDefault(); // Empêche le rechargement\n  console.log("Formulaire soumis");\n});',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-purple-500 to-purple-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener'
  },
  {
    name: 'DOM (querySelector)',
    description: 'Manipuler les éléments HTML',
    usage: 'Le DOM (Document Object Model) représente la structure HTML de votre page. "querySelector" permet de sélectionner un élément HTML pour le manipuler en JavaScript. Vous pouvez ensuite modifier son contenu (textContent, innerHTML), ses attributs, ses styles CSS, ou même créer/supprimer des éléments. C\'est la base de l\'interactivité web.',
    example: '// Sélectionner un élément\nconst titre = document.querySelector("h1");\nconst bouton = document.querySelector("#monId");\nconst premier = document.querySelector(".maClasse");\n\n// Modifier le contenu\ntitre.textContent = "Nouveau titre";\n\n// Modifier le style\nbouton.style.backgroundColor = "blue";\nbouton.style.color = "white";\n\n// Ajouter/retirer une classe CSS\nbouton.classList.add("actif");\nbouton.classList.remove("desactive");',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3h18v18H3V3zm0 0l18 18M21 3l-18 18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-green-500 to-green-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/API/Document/querySelector'
  },
  {
    name: 'Conditions (if/else)',
    description: 'Exécuter du code conditionnellement',
    usage: 'Les conditions permettent d\'exécuter différents blocs de code selon certaines conditions. "if" vérifie une condition, "else if" vérifie une condition alternative, "else" s\'exécute si aucune condition n\'est vraie. Les opérateurs de comparaison incluent === (égal), !== (différent), >, <, >=, <=. Utilisez toujours === (égalité stricte) plutôt que == pour éviter les comportements imprévus.',
    example: 'const age = 18;\n\nif (age >= 18) {\n  console.log("Majeur");\n} else {\n  console.log("Mineur");\n}\n\n// Conditions multiples\nconst note = 15;\n\nif (note >= 16) {\n  console.log("Très bien");\n} else if (note >= 12) {\n  console.log("Bien");\n} else {\n  console.log("Passable");\n}',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-orange-500 to-orange-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/if...else'
  },
  {
    name: 'Boucles (for, forEach)',
    description: 'Répéter des actions',
    usage: 'Les boucles permettent de répéter du code plusieurs fois. "for" est la boucle classique avec un compteur. "forEach" est une méthode moderne pour parcourir un tableau. "while" répète tant qu\'une condition est vraie. Les boucles sont essentielles pour traiter des listes de données, créer des éléments répétitifs, ou effectuer des calculs multiples.',
    example: '// Boucle for classique\nfor (let i = 0; i < 5; i++) {\n  console.log(`Itération ${i}`);\n}\n\n// forEach pour les tableaux (moderne)\nconst fruits = ["pomme", "banane", "orange"];\n\nfruits.forEach((fruit, index) => {\n  console.log(`${index}: ${fruit}`);\n});\n\n// Boucle while\nlet compteur = 0;\nwhile (compteur < 3) {\n  console.log(compteur);\n  compteur++;\n}',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-cyan-500 to-cyan-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Loops_and_iteration'
  },
  {
    name: 'Tableaux (Array)',
    description: 'Stocker des listes de données',
    usage: 'Les tableaux (arrays) permettent de stocker plusieurs valeurs dans une seule variable. Ils sont indexés à partir de 0. Vous pouvez ajouter des éléments avec push(), les retirer avec pop(), filtrer avec filter(), transformer avec map(), et bien plus. Les méthodes modernes comme map(), filter(), find() sont préférables aux boucles for traditionnelles car elles sont plus lisibles.',
    example: '// Créer un tableau\nconst nombres = [1, 2, 3, 4, 5];\nconst noms = ["Alice", "Bob", "Charlie"];\n\n// Accéder aux éléments\nconsole.log(nombres[0]); // 1\nconsole.log(noms[2]); // "Charlie"\n\n// Méthodes utiles\nnombres.push(6); // Ajouter à la fin\nconst double = nombres.map(n => n * 2); // [2,4,6,8,10,12]\nconst pairs = nombres.filter(n => n % 2 === 0); // [2,4,6]\nconsole.log(nombres.length); // Taille du tableau',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-pink-500 to-pink-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array'
  },
  {
    name: 'Objets',
    description: 'Structurer des données complexes',
    usage: 'Les objets permettent de regrouper des données liées sous forme de paires clé-valeur. C\'est la structure de données fondamentale en JavaScript. Vous pouvez accéder aux propriétés avec la notation point (obj.nom) ou crochets (obj["nom"]). Les objets peuvent contenir des fonctions (appelées méthodes). C\'est idéal pour représenter des entités comme un utilisateur, un produit, une configuration.',
    example: '// Créer un objet\nconst personne = {\n  nom: "Dupont",\n  prenom: "Marie",\n  age: 28,\n  email: "marie@example.com",\n  // Méthode\n  sePresenter() {\n    return `Je suis ${this.prenom} ${this.nom}`;\n  }\n};\n\n// Accéder aux propriétés\nconsole.log(personne.nom); // "Dupont"\nconsole.log(personne["age"]); // 28\nconsole.log(personne.sePresenter()); // "Je suis Marie Dupont"',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-red-500 to-red-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object'
  },
  {
    name: 'Chaînes de caractères',
    description: 'Manipuler du texte',
    usage: 'Les chaînes de caractères (strings) représentent du texte. Utilisez des guillemets simples (\'\'), doubles (""), ou backticks (``) pour les template literals qui permettent d\'insérer des variables avec ${variable}. Les strings ont de nombreuses méthodes utiles : toUpperCase(), toLowerCase(), split(), trim(), includes(), replace(). Les template literals sont la méthode moderne pour construire des chaînes dynamiques.',
    example: '// Différentes syntaxes\nconst texte1 = \'Bonjour\';\nconst texte2 = "au revoir";\nconst nom = "Marie";\n\n// Template literals (moderne)\nconst message = `Bonjour ${nom}!`;\nconsole.log(message); // "Bonjour Marie!"\n\n// Méthodes utiles\nconst phrase = "  JavaScript  ";\nconsole.log(phrase.trim()); // "JavaScript"\nconsole.log(phrase.toUpperCase()); // "  JAVASCRIPT  "\nconsole.log(phrase.includes("Script")); // true',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-indigo-500 to-indigo-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String'
  },
  {
    name: 'Opérateurs',
    description: 'Effectuer des opérations',
    usage: 'Les opérateurs permettent d\'effectuer des calculs et comparaisons. Arithmétiques : +, -, *, /, % (modulo). Comparaison : === (égal), !== (différent), >, <, >=, <=. Logiques : && (ET), || (OU), ! (NON). Utilisez toujours === au lieu de == pour éviter la conversion de type automatique qui peut causer des bugs subtils. L\'opérateur ++ incrémente, -- décrémente.',
    example: '// Arithmétiques\nconst somme = 10 + 5; // 15\nconst produit = 4 * 3; // 12\nconst reste = 10 % 3; // 1 (modulo)\n\n// Comparaison (toujours ===)\nconsole.log(5 === 5); // true\nconsole.log(5 === "5"); // false\nconsole.log(10 > 5); // true\n\n// Logiques\nconst age = 20;\nif (age >= 18 && age < 65) {\n  console.log("Actif");\n}',
    svg: (
      <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'from-emerald-500 to-emerald-600',
    mdnLink: 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Expressions_and_Operators'
  }
];

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const resources: Resource[] = [
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
    category: 'CSS'
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
    category: 'JavaScript'
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
              onClick={() => setSelectedResource(resource.id)}
              className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition cursor-pointer ${selectedResource === resource.id
                  ? 'border-[#ff2600] bg-[#ff2600]/10'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                }`}
            >
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
                Cliquez sur une balise pour accéder à sa documentation complète sur MDN.
              </p>
            </div>

            {/* Tags Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {htmlTags.map((tag, index) => (
                <a
                  key={tag.name}
                  href={tag.mdnLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 p-6 text-left transition hover:border-[#ff2600] hover:scale-105"
                  style={{
                    animation: `scale-in 0.3s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tag.color} opacity-0 transition group-hover:opacity-10`}></div>
                  <div className="relative">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-gray-400 group-hover:text-white transition">{tag.svg}</div>
                      <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <h3 className="mb-2 font-mono text-lg font-bold text-[#ff2600]">{tag.name}</h3>
                    <p className="text-sm text-gray-400">{tag.description}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick Reference */}
            <div className="mt-12 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Référence rapide
              </h3>
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
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Autres balises importantes
              </h3>
              <p className="mb-8 text-gray-400">
                Ces balises complètent votre boîte à outils HTML. Cliquez sur une balise pour accéder à sa documentation complète sur MDN.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Button */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/HTML/Element/button"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="8" width="18" height="8" rx="2" />
                          <path d="M12 12h.01" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;button&gt;</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Crée un bouton cliquable pour les interactions utilisateur.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    &lt;button&gt;Cliquez-moi&lt;/button&gt;</pre>
                </a>

                {/* Table */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/HTML/Element/table"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-green-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M3 15h18M9 3v18" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;table&gt;</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Crée un tableau de données structuré.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    &lt;table&gt;&lt;tr&gt;&lt;td&gt;Cellule&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;</pre>
                </a>

                {/* Strong */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/HTML/Element/strong"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-red-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M6 12h12M12 6v12" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;strong&gt;</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Met en gras un texte important (importance sémantique).</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    &lt;strong&gt;Texte important&lt;/strong&gt;</pre>
                </a>

                {/* Em */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/HTML/Element/em"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 4l4 16M6 12h12" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;em&gt;</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Met en italique un texte pour l'emphase.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    &lt;em&gt;Texte en emphase&lt;/em&gt;</pre>
                </a>

                {/* Article */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/HTML/Element/article"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-teal-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="4" y="4" width="16" height="16" rx="2" />
                          <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;article&gt;</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Contenu autonome et réutilisable (article, blog post).</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    &lt;article&gt;&lt;h2&gt;Article&lt;/h2&gt;...&lt;/article&gt;</pre>
                </a>

                {/* Header */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/HTML/Element/header"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-pink-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="6" rx="1" />
                          <path d="M7 6v3M12 6v3M17 6v3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;header&gt;</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">En-tête d'une page ou d'une section.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    &lt;header&gt;&lt;h1&gt;Titre&lt;/h1&gt;&lt;/header&gt;</pre>
                </a>

                {/* Footer */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/HTML/Element/footer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-cyan-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="15" width="18" height="6" rx="1" />
                          <path d="M7 18v-3M12 18v-3M17 18v-3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;footer&gt;</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Pied de page d'une page ou d'une section.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    &lt;footer&gt;&lt;p&gt;© 2024&lt;/p&gt;&lt;/footer&gt;</pre>
                </a>

                {/* Nav */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/HTML/Element/nav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lime-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                          <circle cx="7" cy="12" r="1" fill="currentColor" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;nav&gt;</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Section contenant les liens de navigation principaux.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    &lt;nav&gt;&lt;a href=&quot;#&quot;&gt;Accueil&lt;/a&gt;&lt;/nav&gt;</pre>
                </a>

                {/* Main */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/HTML/Element/main"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-amber-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="6" y="6" width="12" height="12" rx="2" />
                          <path d="M6 10h12M10 6v12" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">&lt;main&gt;</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Contenu principal unique de la page.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    &lt;main&gt;&lt;article&gt;...&lt;/article&gt;&lt;/main&gt;</pre>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CSS Fundamentals Content */}
        {selectedResource === 'css-fundamentals' && (
          <div className="animate-fade-in">
            <div className="mb-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <div className="mb-4 flex items-center gap-4">
                <div className="text-[#ff2600]">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l9 4.5v7L12 22l-9-8.5v-7L12 2z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 22V13.5M12 13.5L3 6.5M12 13.5l9-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">Les fondamentaux CSS</h2>
              </div>
              <p className="text-gray-400">
                CSS (Cascading Style Sheets) permet de styliser vos pages HTML. Découvrez les propriétés essentielles pour créer des designs modernes et responsives.
              </p>
            </div>

            {/* CSS Properties Grid */}
            <div className="mb-12 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                Propriétés CSS essentielles
              </h3>
              <p className="mb-8 text-gray-400">
                Cliquez sur une propriété pour accéder à sa documentation complète sur MDN.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Color */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/color"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-red-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">color</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Définit la couleur du texte.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    color: #ff2600;
                    color: rgb(255, 38, 0);</pre>
                </a>

                {/* Background-color */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/background-color"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="4" y="4" width="16" height="16" rx="2" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">background-color</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Définit la couleur de fond d'un élément.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    background-color: #000;
                    background-color: transparent;</pre>
                </a>

                {/* Font-size */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/font-size"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-green-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 7V4h16v3M9 20h6M12 4v16" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">font-size</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Définit la taille de la police.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    font-size: 16px;
                    font-size: 1.5rem;</pre>
                </a>

                {/* Margin */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/margin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="8" y="8" width="8" height="8" />
                          <path d="M4 4h16v16H4z" strokeDasharray="2 2" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">margin</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Définit l'espace extérieur autour d'un élément.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    margin: 20px;
                    margin: 10px 20px;</pre>
                </a>

                {/* Padding */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/padding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-purple-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="6" y="6" width="12" height="12" />
                          <rect x="9" y="9" width="6" height="6" fill="currentColor" opacity="0.3" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">padding</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Définit l'espace intérieur d'un élément.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    padding: 15px;
                    padding: 10px 20px;</pre>
                </a>

                {/* Display */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/display"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-orange-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">display</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Définit le type d'affichage d'un élément.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    display: block;
                    display: flex;</pre>
                </a>

                {/* Width */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/width"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-pink-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="6" y="8" width="12" height="8" />
                          <path d="M3 12h3M18 12h3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">width</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Définit la largeur d'un élément.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    width: 300px;
                    width: 100%;</pre>
                </a>

                {/* Height */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/height"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-cyan-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="8" y="6" width="8" height="12" />
                          <path d="M12 3v3M12 18v3" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">height</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Définit la hauteur d'un élément.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    height: 200px;
                    height: auto;</pre>
                </a>

                {/* Border */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/border"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-teal-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <rect x="6" y="6" width="12" height="12" rx="1" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">border</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Définit la bordure d'un élément.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    border: 1px solid #000;
                    border-radius: 8px;</pre>
                </a>

                {/* Flexbox */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Flexible_Box_Layout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-indigo-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="6" width="4" height="12" />
                          <rect x="10" y="6" width="4" height="12" />
                          <rect x="17" y="6" width="4" height="12" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">flexbox</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Système de mise en page flexible et puissant.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    display: flex;
                    justify-content: center;</pre>
                </a>

                {/* Grid */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Grid_Layout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lime-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">grid</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Système de grille bidimensionnelle.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    display: grid;
                    grid-template-columns: 1fr 1fr;</pre>
                </a>

                {/* Position */}
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/CSS/position"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-amber-400">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="8" y="8" width="8" height="8" />
                          <path d="M4 4l4 4M20 4l-4 4M4 20l4-4M20 20l-4-4" strokeLinecap="round" />
                        </svg>
                      </div>
                      <code className="font-mono text-lg font-bold text-[#ff2600]">position</code>
                    </div>
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Contrôle le positionnement des éléments.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    position: relative;
                    position: absolute;</pre>
                </a>
              </div>
            </div>

            {/* CSS Selectors */}
            <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Sélecteurs CSS
              </h3>
              <p className="mb-8 text-gray-400">
                Les sélecteurs permettent de cibler les éléments HTML à styliser.
              </p>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <code className="font-mono text-lg font-bold text-[#ff2600]">Sélecteur d'élément</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Cible tous les éléments d'un type donné.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    p &#123;
                    color: blue;
                    &#125;</pre>
                </div>

                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <code className="font-mono text-lg font-bold text-[#ff2600]">Sélecteur de classe (.)</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Cible les éléments avec une classe spécifique.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    .ma-classe &#123;
                    font-size: 18px;
                    &#125;</pre>
                </div>

                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <div className="mb-3 flex items-center gap-3">
                    <code className="font-mono text-lg font-bold text-[#ff2600]">Sélecteur d'ID (#)</code>
                  </div>
                  <p className="mb-2 text-sm text-gray-300">Cible un élément avec un ID unique.</p>
                  <pre className="mt-3 overflow-x-auto rounded bg-gray-900 p-3 text-xs text-green-400">
                    #mon-id &#123;
                    background: red;
                    &#125;</pre>
                </div>
              </div>
            </div>

            {/* Other CSS Properties by Category */}
            <div className="mt-12 space-y-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold">
                <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Autres propriétés CSS par catégorie
              </h3>

              {/* Texte & Typographie */}
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
                <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#ff2600]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Texte & Typographie
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Text-align */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/text-align"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">text-align</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Alignement horizontal du texte</p>
                  </a>

                  {/* Font-weight */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/font-weight"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">font-weight</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Épaisseur de la police</p>
                  </a>

                  {/* Font-family */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/font-family"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">font-family</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Type de police de caractères</p>
                  </a>

                  {/* Line-height */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/line-height"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">line-height</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Hauteur de ligne</p>
                  </a>

                  {/* Text-decoration */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/text-decoration"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">text-decoration</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Décoration du texte</p>
                  </a>

                  {/* Text-transform */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/text-transform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">text-transform</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Transformation du texte</p>
                  </a>

                  {/* White-space */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/white-space"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">white-space</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Gestion des espaces blancs</p>
                  </a>

                  {/* Letter-spacing */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/letter-spacing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">letter-spacing</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Espacement entre lettres</p>
                  </a>

                  {/* Word-spacing */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/word-spacing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">word-spacing</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Espacement entre mots</p>
                  </a>
                </div>
              </div>

              {/* Dimensions & Tailles */}
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
                <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#ff2600]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Dimensions & Tailles
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Max-width */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/max-width"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">max-width</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Largeur maximale</p>
                  </a>

                  {/* Min-width */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/min-width"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">min-width</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Largeur minimale</p>
                  </a>

                  {/* Max-height */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/max-height"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">max-height</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Hauteur maximale</p>
                  </a>

                  {/* Min-height */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/min-height"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">min-height</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Hauteur minimale</p>
                  </a>

                  {/* Overflow */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/overflow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">overflow</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Gestion du débordement</p>
                  </a>
                </div>
              </div>

              {/* Positionnement */}
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
                <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#ff2600]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Positionnement & Empilement
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Z-index */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/z-index"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">z-index</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Ordre d'empilement</p>
                  </a>

                  {/* Visibility */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/visibility"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">visibility</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Visibilité d'un élément</p>
                  </a>

                  {/* Vertical-align */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/vertical-align"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">vertical-align</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Alignement vertical (inline)</p>
                  </a>
                </div>
              </div>

              {/* Flexbox Avancé */}
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
                <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#ff2600]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                  </svg>
                  Flexbox Avancé
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Align-items */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/align-items"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">align-items</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Alignement vertical</p>
                  </a>

                  {/* Justify-content */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/justify-content"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">justify-content</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Alignement horizontal</p>
                  </a>

                  {/* Flex-direction */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/flex-direction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">flex-direction</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Direction des éléments</p>
                  </a>

                  {/* Flex-wrap */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/flex-wrap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">flex-wrap</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Retour à la ligne</p>
                  </a>

                  {/* Gap */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/gap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">gap</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Espacement entre éléments</p>
                  </a>
                </div>
              </div>

              {/* Effets Visuels */}
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
                <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#ff2600]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Effets Visuels
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Opacity */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/opacity"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">opacity</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Transparence</p>
                  </a>

                  {/* Box-shadow */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/box-shadow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">box-shadow</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Ombre portée</p>
                  </a>

                  {/* Border-radius */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/border-radius"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">border-radius</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Coins arrondis</p>
                  </a>

                  {/* Cursor */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/cursor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">cursor</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Type de curseur</p>
                  </a>
                </div>
              </div>

              {/* Animations & Transformations */}
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
                <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#ff2600]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Animations & Transformations
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Transition */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/transition"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">transition</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Transitions fluides</p>
                  </a>

                  {/* Transform */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/transform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">transform</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Transformations 2D/3D</p>
                  </a>

                  {/* Animation */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/animation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">animation</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Animations CSS</p>
                  </a>
                </div>
              </div>

              {/* Médias & Images */}
              <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
                <h4 className="mb-6 flex items-center gap-2 text-xl font-bold text-[#ff2600]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Médias & Images
                </h4>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Object-fit */}
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/CSS/object-fit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-gray-700 bg-black/50 p-4 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <code className="font-mono text-sm font-bold text-[#ff2600]">object-fit</code>
                      <svg className="h-4 w-4 text-gray-400 group-hover:text-[#ff2600] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400">Ajustement d'image/vidéo</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JavaScript Content */}
        {selectedResource === 'javascript-intro' && (
          <div className="animate-fade-in">
            <div className="mb-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <div className="mb-4 flex items-center gap-4">
                <div className="text-[#ff2600]">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">Introduction à JavaScript</h2>
              </div>
              <p className="text-gray-400">
                JavaScript est le langage de programmation qui rend vos pages web interactives. Découvrez les concepts essentiels pour créer des applications web dynamiques.
              </p>
            </div>

            {/* JS Concepts Grid */}
            <div className="space-y-6">
              {jsConcepts.map((concept, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-black p-8 transition hover:border-[#ff2600]/50"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 rounded-xl bg-gradient-to-br ${concept.color} p-3 text-white`}>
                        {concept.svg}
                      </div>
                      <div>
                        <h3 className="mb-2 text-2xl font-bold text-white">{concept.name}</h3>
                        <p className="mb-3 text-sm font-semibold text-gray-400">{concept.description}</p>
                        <p className="text-sm leading-relaxed text-gray-300">{concept.usage}</p>
                      </div>
                    </div>
                    <a
                      href={concept.mdnLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-shrink-0 items-center gap-2 rounded-lg border border-gray-700 bg-black/50 px-4 py-2 text-sm font-semibold text-gray-300 transition hover:border-[#ff2600] hover:text-[#ff2600]"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Documentation MDN
                    </a>
                  </div>

                  {/* Code Example */}
                  <div className="rounded-xl border border-gray-700 bg-black p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Exemple de code</p>
                    </div>
                    <pre className="overflow-x-auto text-sm text-gray-300">
                      <code>{concept.example}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Examples Section */}
            <div className="mt-12 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white">
                <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Exemples interactifs
              </h3>
              <p className="mb-8 text-gray-400">
                Voici quelques exemples pratiques de JavaScript en action. Essayez les boutons pour voir le code s'exécuter !
              </p>

              <div className="space-y-6">
                {/* Example 1: Click Counter */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <h4 className="mb-4 text-lg font-bold text-white">Compteur de clics</h4>
                  <div className="mb-4 flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        const countElement = e.currentTarget.nextElementSibling;
                        if (countElement) {
                          const currentCount = parseInt(countElement.textContent || '0');
                          countElement.textContent = (currentCount + 1).toString();
                        }
                      }}
                      className="rounded-lg bg-[#ff2600] px-6 py-3 font-semibold text-white transition hover:bg-[#ff4433]"
                    >
                      Cliquez-moi !
                    </button>
                    <span className="text-2xl font-bold text-white">0</span>
                  </div>
                  <div className="rounded-lg bg-gray-900 p-4">
                    <pre className="overflow-x-auto text-xs text-gray-300">
                      <code>{`const bouton = document.querySelector("#bouton");
let compteur = 0;

bouton.addEventListener("click", () => {
  compteur++;
  document.querySelector("#compteur").textContent = compteur;
});`}</code>
                    </pre>
                  </div>
                </div>

                {/* Example 2: Text Change */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <h4 className="mb-4 text-lg font-bold text-white">Modifier du texte</h4>
                  <div className="mb-4">
                    <p id="text-demo" className="mb-4 text-lg text-gray-300">
                      Texte original
                    </p>
                    <button
                      onClick={(e) => {
                        const textElement = e.currentTarget.parentElement?.querySelector('#text-demo');
                        if (textElement) {
                          textElement.textContent = textElement.textContent === 'Texte original'
                            ? 'Texte modifié par JavaScript !'
                            : 'Texte original';
                        }
                      }}
                      className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Changer le texte
                    </button>
                  </div>
                  <div className="rounded-lg bg-gray-900 p-4">
                    <pre className="overflow-x-auto text-xs text-gray-300">
                      <code>{`const texte = document.querySelector("#texte");
const bouton = document.querySelector("#bouton");

bouton.addEventListener("click", () => {
  texte.textContent = "Texte modifié par JavaScript !";
});`}</code>
                    </pre>
                  </div>
                </div>

                {/* Example 3: Toggle Visibility */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <h4 className="mb-4 text-lg font-bold text-white">Afficher / Masquer</h4>
                  <div className="mb-4">
                    <div className="mb-4 rounded-lg bg-purple-900/30 p-4">
                      <p className="text-gray-300" id="toggle-demo">
                        Ce contenu peut être affiché ou masqué !
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        const contentElement = e.currentTarget.parentElement?.querySelector('#toggle-demo');
                        if (contentElement) {
                          const currentDisplay = window.getComputedStyle(contentElement).display;
                          (contentElement as HTMLElement).style.display = currentDisplay === 'none' ? 'block' : 'none';
                        }
                      }}
                      className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                    >
                      Basculer
                    </button>
                  </div>
                  <div className="rounded-lg bg-gray-900 p-4">
                    <pre className="overflow-x-auto text-xs text-gray-300">
                      <code>{`const contenu = document.querySelector("#contenu");
const bouton = document.querySelector("#bouton");

bouton.addEventListener("click", () => {
  if (contenu.style.display === "none") {
    contenu.style.display = "block";
  } else {
    contenu.style.display = "none";
  }
});`}</code>
                    </pre>
                  </div>
                </div>

                {/* Example 4: Change Colors */}
                <div className="rounded-xl border border-gray-700 bg-black/50 p-6">
                  <h4 className="mb-4 text-lg font-bold text-white">Changer les couleurs</h4>
                  <div className="mb-4">
                    <div
                      id="color-box"
                      className="mb-4 rounded-lg bg-gray-700 p-8 text-center font-bold text-white transition-colors"
                    >
                      Boîte colorée
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          const box = e.currentTarget.parentElement?.parentElement?.querySelector('#color-box') as HTMLElement;
                          if (box) box.style.backgroundColor = '#ff2600';
                        }}
                        className="flex-1 rounded-lg bg-[#ff2600] px-4 py-2 font-semibold text-white transition hover:bg-[#ff4433]"
                      >
                        Rouge
                      </button>
                      <button
                        onClick={(e) => {
                          const box = e.currentTarget.parentElement?.parentElement?.querySelector('#color-box') as HTMLElement;
                          if (box) box.style.backgroundColor = '#3b82f6';
                        }}
                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Bleu
                      </button>
                      <button
                        onClick={(e) => {
                          const box = e.currentTarget.parentElement?.parentElement?.querySelector('#color-box') as HTMLElement;
                          if (box) box.style.backgroundColor = '#10b981';
                        }}
                        className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700"
                      >
                        Vert
                      </button>
                    </div>
                  </div>
                  <div className="rounded-lg bg-gray-900 p-4">
                    <pre className="overflow-x-auto text-xs text-gray-300">
                      <code>{`const boite = document.querySelector("#boite");
const boutonRouge = document.querySelector("#rouge");
const boutonBleu = document.querySelector("#bleu");

boutonRouge.addEventListener("click", () => {
  boite.style.backgroundColor = "red";
});

boutonBleu.addEventListener("click", () => {
  boite.style.backgroundColor = "blue";
});`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources & Learning Links */}
            <div className="mt-12 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white">
                <svg className="h-6 w-6 text-[#ff2600]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Ressources pour aller plus loin
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <a
                  href="https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <h4 className="mb-2 text-lg font-bold text-white">MDN JavaScript Guide</h4>
                  <p className="text-sm text-gray-400">
                    Le guide complet et officiel de Mozilla pour apprendre JavaScript en profondeur.
                  </p>
                </a>
                <a
                  href="https://javascript.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <h4 className="mb-2 text-lg font-bold text-white">JavaScript.info</h4>
                  <p className="text-sm text-gray-400">
                    Un tutoriel moderne et détaillé couvrant tous les aspects de JavaScript.
                  </p>
                </a>
                <a
                  href="https://www.w3schools.com/js/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <h4 className="mb-2 text-lg font-bold text-white">W3Schools JavaScript</h4>
                  <p className="text-sm text-gray-400">
                    Des tutoriels interactifs avec des exercices pratiques pour débutants.
                  </p>
                </a>
                <a
                  href="https://eloquentjavascript.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-gray-700 bg-black/50 p-6 transition hover:border-[#ff2600] hover:bg-[#ff2600]/10"
                >
                  <h4 className="mb-2 text-lg font-bold text-white">Eloquent JavaScript</h4>
                  <p className="text-sm text-gray-400">
                    Un livre gratuit en ligne pour une introduction approfondie à la programmation JavaScript.
                  </p>
                </a>
              </div>
            </div>

            {/* Best Practices */}
            <div className="mt-12 rounded-2xl border border-yellow-800/50 bg-gradient-to-br from-yellow-900/20 to-black p-8">
              <div className="mb-4 flex items-center gap-3">
                <svg className="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-2xl font-bold text-yellow-500">Bonnes pratiques JavaScript</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Utilisez const par défaut</strong> : Déclarez vos variables avec <code className="rounded bg-gray-800 px-2 py-1 text-sm text-yellow-400">const</code> et utilisez <code className="rounded bg-gray-800 px-2 py-1 text-sm text-yellow-400">let</code> uniquement si vous devez modifier la valeur.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Nommez clairement</strong> : Utilisez des noms de variables explicites comme <code className="rounded bg-gray-800 px-2 py-1 text-sm text-yellow-400">userEmail</code> plutôt que <code className="rounded bg-gray-800 px-2 py-1 text-sm text-yellow-400">e</code>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Toujours === au lieu de ==</strong> : L'opérateur <code className="rounded bg-gray-800 px-2 py-1 text-sm text-yellow-400">===</code> compare sans conversion de type et évite les bugs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Fonctions fléchées modernes</strong> : Préférez <code className="rounded bg-gray-800 px-2 py-1 text-sm text-yellow-400">const maFonction = () =&gt; {'{}'}</code> pour une syntaxe plus concise.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Template literals</strong> : Utilisez les backticks <code className="rounded bg-gray-800 px-2 py-1 text-sm text-yellow-400">`Bonjour ${'{nom}'}`</code> pour insérer des variables dans les chaînes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Console.log pour débugger</strong> : Utilisez <code className="rounded bg-gray-800 px-2 py-1 text-sm text-yellow-400">console.log()</code> pour afficher des valeurs et comprendre votre code.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong>Commentez votre code</strong> : Ajoutez des commentaires <code className="rounded bg-gray-800 px-2 py-1 text-sm text-yellow-400">// comme ceci</code> pour expliquer les parties complexes.</span>
                </li>
              </ul>
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
          <a href="#" className="flex items-center gap-2 text-[#ff2600] underline transition hover:text-[#ff4433]">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Lien hypertexte cliquable
          </a>
          <a href="#" className="flex items-center gap-2 text-blue-400 underline transition hover:text-blue-300">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Lien vers une autre page
          </a>
          <a href="#" className="inline-flex items-center gap-2 text-green-400 underline transition hover:text-green-300">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Lien avec icône
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
              <div className="mb-3 flex h-32 w-32 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
                <svg className="h-16 w-16 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">Exemple d'image</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
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

