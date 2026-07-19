/* ============================================================
   CONFIG.JS
   ------------------------------------------------------------
   TOUT ce qui est personnalisable se trouve dans ce fichier.
   Tu peux modifier les textes, dates, questions, réponses,
   noms de fichiers etc. sans toucher au reste du code.
   ============================================================ */

const CONFIG = {

  // ------------------------------------------------------------
  // CODE SECRET (page 2)
  // ------------------------------------------------------------
  SECRET_CODE: "1009",

  LOCK_WRONG_MESSAGES: [
    "Ce n'est pas le bon code… réessaie 😉",
    "Presque ! Encore un essai…",
    "Hmm non, pas celui-là 🔒",
  ],

  // ------------------------------------------------------------
  // PAGE D'ACCUEIL — les 3 phrases (ordre = ordre d'affichage)
  // dir: "ltr" ou "rtl" — lang: code de langue pour la police
  // ------------------------------------------------------------
  HOME_PHRASES: [
    { lang: "fr", dir: "ltr", text: "Joyeux anniversaire Askim ❤️" },
    { lang: "tr", dir: "ltr", text: "İyi ki doğdun Aşkım ❤️" },
    { lang: "ar", dir: "rtl", text: "عيد ميلاد سعيد يا عشقي ❤️" },
  ],
  // Vitesse d'écriture (ms par caractère) et temps d'affichage (ms)
  HOME_TYPE_SPEED_MS: 85,
  HOME_HOLD_MS: 1700,
  HOME_FADE_MS: 600,

  // ------------------------------------------------------------
  // VIDEOS ET MUSIQUE — remplace simplement les fichiers dans
  // assets/video/ et assets/audio/ en gardant ces mêmes noms
  // (aucune modification de code nécessaire dans ce cas).
  // ------------------------------------------------------------
  MEDIA: {
    heroPhoto: "assets/images/hero-nous.jpg",
    videoIntro: "assets/video/message-intro.mp4",
    videoSurprise: "assets/video/surprise-finale.mp4",
    musique: "assets/audio/musique-souvenirs.mp3",
  },

  // Le morceau ne démarre (et ne reboucle) qu'à partir de ce moment,
  // pour sauter l'intro et lancer directement le meilleur passage.
  // Modifie juste ce nombre (en secondes) pour changer le point de départ.
  MUSIQUE_START_SECONDES: 63,

  // ------------------------------------------------------------
  // QUIZ — Partie 1 : Notre journée
  // correctIndex = position (0,1,2...) de la bonne réponse
  // ------------------------------------------------------------
  QUIZ_QUESTIONS: [
    {
      question: "Quel brunch allons-nous manger ?",
      answers: ["Brunch Turc", "Brunch Algérien", "Brunch normal"],
      correctIndex: 1,
    },
    {
      question: "Quelle activité allons-nous faire ?",
      answers: ["Atelier Parfum", "Atelier Poterie", "Atelier Peinture"],
      correctIndex: 0,
    },
    {
      question: "Quelle sera la prochaine étape ?",
      answers: ["Promenade à Strasbourg", "Cinéma", "Retour à la maison"],
      correctIndex: 0,
    },
    {
      question: "Dans quel type de restaurant allons-nous manger ?",
      answers: ["Restaurant Chinois", "Restaurant Indien", "Steak House", "Restaurant normal"],
      correctIndex: 2,
    },
  ],

  QUIZ_WRONG_MESSAGES: [
    "Raté ! Retente ta chance 😄",
    "Presque… mais non !",
    "Hihi non, pas ça 🙈",
    "Essaie encore, Askim !",
  ],

  QUIZ_FINAL_MESSAGE: "Bravo Askim, tu as trouvé le programme de notre journée ❤️",

  // ------------------------------------------------------------
  // NOS SOUVENIRS — Partie 2
  // Chaque entrée a un "type" :
  //   - "photo"  -> { type:"photo", date, img, caption }
  //   - "video"  -> { type:"video", date, video, poster, caption }
  //   - "moment" -> { type:"moment", date, caption }  (pas de média,
  //                  juste une petite carte avec une date/texte —
  //                  utile pour une période, "Aujourd'hui", etc.)
  // "img"/"video"/"poster" doivent correspondre à des fichiers dans
  // assets/images/ ou assets/video/ (une image de remplacement
  // s'affiche automatiquement si un fichier est introuvable).
  // Pour ajouter un souvenir : copie un bloc ci-dessous et modifie-le.
  // ------------------------------------------------------------
  MEMORIES: [
    { type: "photo", date: "10 septembre 2025", img: "assets/images/memory-01.png", caption: "Le tout premier message ✨" },
    { type: "photo", date: "28 octobre 2025", img: "assets/images/memory-02.jpg", caption: "" },
    { type: "photo", date: "28 octobre 2025", img: "assets/images/memory-03.jpg", caption: "" },
    { type: "photo", date: "28 octobre 2025", img: "assets/images/memory-04.jpg", caption: "" },
    { type: "photo", date: "21 novembre 2025", img: "assets/images/memory-05.jpg", caption: "" },

    { type: "moment", date: "1 janvier – 28 mars 2026", icon: "🤍", caption: "No contact" },

    { type: "photo", date: "28 mars 2026", img: "assets/images/memory-06.jpg", caption: "" },
    { type: "video", date: "28 mars 2026", video: "assets/video/memory-07.mp4", poster: "assets/images/memory-07-poster.jpg", caption: "" },
    { type: "photo", date: "28 mars 2026", img: "assets/images/memory-08.jpg", caption: "" },
    { type: "photo", date: "28 mars 2026", img: "assets/images/memory-09.jpg", caption: "" },
    { type: "video", date: "3 avril 2026", video: "assets/video/memory-10.mp4", poster: "assets/images/memory-10-poster.jpg", caption: "" },
    { type: "photo", date: "16 avril 2026", img: "assets/images/memory-11.jpg", caption: "" },
    { type: "photo", date: "21 avril 2026", img: "assets/images/memory-12.jpg", caption: "" },
    { type: "photo", date: "25 avril 2026", img: "assets/images/memory-13.jpg", caption: "" },
    { type: "photo", date: "25 avril 2026", img: "assets/images/memory-14.jpg", caption: "" },
    { type: "photo", date: "9 mai 2026", img: "assets/images/memory-15.jpg", caption: "" },
    { type: "photo", date: "21 juin 2026", img: "assets/images/memory-16.jpg", caption: "" },

    { type: "moment", date: "Aujourd'hui", caption: "Et ce n'est qu'un début ❤️" },
  ],

  // ------------------------------------------------------------
  // LA LETTRE — Partie 3
  // ⚠️ TEXTE TEMPORAIRE : remplace-le par ta propre lettre.
  // Les retours à la ligne (appuie sur Entrée) sont conservés.
  // ------------------------------------------------------------
  LETTER_TEXT:
`Mon Askim,

Remplace ce texte par ta propre lettre.

Ecris-lui ce que tu ressens vraiment : vos souvenirs, ce qu'elle
représente pour toi, ce que tu lui souhaites pour cette nouvelle
année. C'est cette page qui apparaît lentement, comme si elle
était écrite devant elle à cet instant précis.

Je t'aime.`,
  LETTER_TYPE_SPEED_MS: 30,

  // ------------------------------------------------------------
  // SURPRISE FINALE — Partie 4
  // ⚠️ A MODIFIER : date et heure exactes de déblocage.
  // Format : new Date("AAAA-MM-JJTHH:MM:SS")
  // ------------------------------------------------------------
  SURPRISE_UNLOCK_DATETIME: new Date("2026-08-01T20:00:00"),
  SURPRISE_LOCKED_MESSAGE: "Pas encore Askim… reviens un peu plus tard ❤️",
  SURPRISE_REVEAL_MESSAGE: "Il y a une surprise dans le coffre, va voir ❤️",
};
