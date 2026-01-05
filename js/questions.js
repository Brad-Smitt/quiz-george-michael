/**
 * Base de données des questions du quiz George Michael
 * 
 * Types supportés:
 * - "mcq" : QCM (une seule réponse)
 * - "truefalse" : Vrai/Faux
 * - "short" : réponse courte (texte, insensible à la casse et aux accents de base)
 * - "fill" : texte à trous
 * - "order" : remettre dans l'ordre
 */
const QUESTIONS = [
  // ===== FACILE (10) =====
  {
    id: "F1",
    difficulty: "facile",
    type: "mcq",
    prompt: "Quel est le vrai nom de George Michael ?",
    options: [
      "David Robert Jones",
      "Georgios Kyriacos Panayiotou",
      "Gordon Matthew Sumner",
      "Reginald Kenneth Dwight"
    ],
    answer: 1,
    hint: "Indice : son prénom commence par « G » et il est d'origine grecque.",
    explanation: "Son nom de naissance est Georgios Kyriacos Panayiotou."
  },
  {
    id: "F2",
    difficulty: "facile",
    type: "mcq",
    prompt: "Dans quel duo George Michael s'est-il fait connaître au début des années 1980 ?",
    options: ["Erasure", "Wham!", "Tears for Fears", "Pet Shop Boys"],
    answer: 1,
    hint: "Indice : duo pop formé avec Andrew Ridgeley, connu pour « Last Christmas ».",
    explanation: "Il forme Wham! avec Andrew Ridgeley."
  },
  {
    id: "F3",
    difficulty: "facile",
    type: "mcq",
    prompt: "Quel est le prénom du partenaire de George Michael dans Wham! ?",
    options: ["Andrew", "Simon", "Nick", "Bono"],
    answer: 0,
    hint: "Indice : son prénom commence par un A et se termine par « ew ».",
    explanation: "Wham! = George Michael + Andrew Ridgeley."
  },
  {
    id: "F4",
    difficulty: "facile",
    type: "truefalse",
    prompt: "George Michael est né en 1963.",
    answer: true,
    hint: "Indice : il est né la même année que Whitney Houston.",
    explanation: "Date de naissance : 25 juin 1963."
  },
  {
    id: "F5",
    difficulty: "facile",
    type: "mcq",
    prompt: "Quel album solo (1987) a fortement marqué sa carrière ?",
    options: ["Faith", "Bad", "Purple Rain", "Like a Virgin"],
    answer: 0,
    hint: "Indice : le titre signifie « foi » en anglais.",
    explanation: "Son album solo emblématique : Faith (1987)."
  },
  {
    id: "F6",
    difficulty: "facile",
    type: "truefalse",
    prompt: "George Michael est décédé le 25 décembre 2016.",
    answer: true,
    hint: "Indice : il est mort le jour de Noël 2016.",
    explanation: "Il est décédé le jour de Noël 2016."
  },
  {
    id: "F7",
    difficulty: "facile",
    type: "fill",
    prompt: "Texte à trous : Le duo ______! a été formé en 1981.",
    answerText: "wham",
    hint: "Indice : nom du duo avec un point d'exclamation.",
    explanation: "Wham! est formé en 1981."
  },
  {
    id: "F8",
    difficulty: "facile",
    type: "short",
    prompt: "Réponse courte : Dans quel pays est-il né ?",
    answerText: "angleterre",
    hint: "Indice : pays constitutif du Royaume-Uni, capitale Londres.",
    explanation: "Né à East Finchley (Londres), en Angleterre."
  },
  {
    id: "F9",
    difficulty: "facile",
    type: "mcq",
    prompt: "Quelle chanson est souvent associée à Wham! et sortie en 1984 à Noël ?",
    options: [
      "Last Christmas",
      "Wonderwall",
      "Billie Jean",
      "Smells Like Teen Spirit"
    ],
    answer: 0,
    hint: "Indice : classique de Noël qui parle d'un cadeau amoureux perdu.",
    explanation: "« Last Christmas » (Wham!) est devenue un classique de Noël."
  },
  {
    id: "F10",
    difficulty: "facile",
    type: "truefalse",
    prompt: "George Michael a aussi été producteur, pas seulement chanteur.",
    answer: true,
    hint: "Indice : il a co-écrit et produit plusieurs de ses chansons.",
    explanation: "Il est crédité comme auteur-compositeur et producteur."
  },

  // ===== MOYEN (10) =====
  {
    id: "M1",
    difficulty: "moyen",
    type: "mcq",
    prompt: "En quelle année Wham! est-il formé (selon les biographies) ?",
    options: ["1979", "1981", "1984", "1986"],
    answer: 1,
    hint: "Indice : début des années 1980, deux ans avant la sortie de « Last Christmas ».",
    explanation: "Wham! est formé en 1981."
  },
  {
    id: "M2",
    difficulty: "moyen",
    type: "mcq",
    prompt: "Quel prix majeur a remporté l'album Faith aux Grammy Awards ?",
    options: [
      "Record of the Year",
      "Song of the Year",
      "Album of the Year",
      "Best New Artist"
    ],
    answer: 2,
    hint: "Indice : prix décerné à l'ensemble d'un disque (album).",
    explanation: "Faith a remporté le Grammy de l'Album de l'année."
  },
  {
    id: "M3",
    difficulty: "moyen",
    type: "truefalse",
    prompt:
      "Le titre « Faith » (single) a atteint la 1re place du Billboard Hot 100 aux États-Unis.",
    answer: true,
    hint: "Indice : cette chanson-titre est restée en tête du classement américain.",
    explanation: "La chanson « Faith » a été n°1 aux US."
  },
  {
    id: "M4",
    difficulty: "moyen",
    type: "short",
    prompt:
      "Réponse courte : Comment s'appelle le coéquipier de George Michael dans Wham! (nom de famille) ?",
    answerText: "ridgeley",
    hint: "Indice : son nom de famille commence par R et se termine par « ley ».",
    explanation: "Andrew Ridgeley."
  },
  {
    id: "M5",
    difficulty: "moyen",
    type: "mcq",
    prompt: "Dans quel domaine George Michael est-il le plus connu ?",
    options: ["Football", "Musique pop", "Peinture", "Astronomie"],
    answer: 1,
    hint: "Indice : il a vendu des millions de disques à travers le monde.",
    explanation: "Il est une figure majeure de la pop."
  },
  {
    id: "M6",
    difficulty: "moyen",
    type: "fill",
    prompt: "Texte à trous : Son album solo « ______ » est sorti en 1987.",
    answerText: "faith",
    hint: "Indice : titre anglais signifiant « foi », album aux airs rock 'n' roll.",
    explanation: "Faith est sorti en 1987."
  },
  {
    id: "M7",
    difficulty: "moyen",
    type: "truefalse",
    prompt: "George Michael a été membre de Wham! puis a eu une carrière solo.",
    answer: true,
    hint: "Indice : Wham! d'abord, puis album solo primé.",
    explanation: "D'abord Wham!, puis une carrière solo majeure."
  },
  {
    id: "M8",
    difficulty: "moyen",
    type: "mcq",
    prompt: "Où Wham! est-il originaire, selon les fiches de groupe ?",
    options: [
      "Manchester",
      "Bushey (Hertfordshire)",
      "Liverpool",
      "Birmingham"
    ],
    answer: 1,
    hint: "Indice : cette ville se situe dans le comté de Hertfordshire (Angleterre).",
    explanation: "Wham! est associé à Bushey (Hertfordshire)."
  },
  {
    id: "M9",
    difficulty: "moyen",
    type: "short",
    prompt: "Réponse courte : En quelle année George Michael est-il décédé ?",
    answerText: "2016",
    hint: "Indice : même année que la disparition de Prince et David Bowie.",
    explanation: "Décès : 2016."
  },
  {
    id: "M10",
    difficulty: "moyen",
    type: "truefalse",
    prompt:
      "George Michael est considéré comme l'un des artistes aux plus fortes ventes mondiales.",
    answer: true,
    hint: "Indice : il a vendu des dizaines de millions d'albums.",
    explanation:
      "Il fait partie des artistes très largement vendus à l'échelle mondiale."
  },

  // ===== DIFFICILE (10) =====
  {
    id: "D1",
    difficulty: "difficile",
    type: "mcq",
    prompt:
      "Quel est le lieu de naissance indiqué dans les biographies (au Royaume-Uni) ?",
    options: [
      "East Finchley (Middlesex/Londres)",
      "Dublin",
      "Cardiff",
      "Glasgow"
    ],
    answer: 0,
    hint: "Indice : un quartier du nord de Londres situé dans le borough de Barnet.",
    explanation: "Né à East Finchley (Middlesex/Grand Londres)."
  },
  {
    id: "D2",
    difficulty: "difficile",
    type: "mcq",
    prompt: "Quel jour (date) est associé à son décès ?",
    options: ["24 décembre", "25 décembre", "31 décembre", "1er janvier"],
    answer: 1,
    hint: "Indice : c'est un jour férié célébré le lendemain du Réveillon.",
    explanation: "Décès le 25 décembre (Noël)."
  },
  {
    id: "D3",
    difficulty: "difficile",
    type: "order",
    prompt:
      "Remets ces étapes dans l'ordre (écris un ordre du type 2-1-3-4) :\n1) Carrière solo majeure\n2) Formation de Wham!\n3) Sortie de l'album Faith\n4) Décès",
    items: [
      "1) Carrière solo majeure",
      "2) Formation de Wham!",
      "3) Sortie de l'album Faith",
      "4) Décès"
    ],
    answerOrder: [2, 3, 1, 4],
    hint: "Indice : le duo précède l'album, la carrière solo suit l'album, puis vient le décès.",
    explanation:
      "Wham! (1981) → Faith (1987) → carrière solo (ensuite) → décès (2016)."
  },
  {
    id: "D4",
    difficulty: "difficile",
    type: "short",
    prompt: "Réponse courte : Donne l'année de sortie de l'album Faith.",
    answerText: "1987",
    hint: "Indice : année où Michael Jackson sort Bad.",
    explanation: "Faith est sorti en 1987."
  },
  {
    id: "D5",
    difficulty: "difficile",
    type: "mcq",
    prompt:
      "Quel rôle (en plus de chanteur) est explicitement mentionné dans les biographies ?",
    options: [
      "Chef cuisinier",
      "Pilote de ligne",
      "Record producer (producteur)",
      "Architecte"
    ],
    answer: 2,
    hint: "Indice : il est aussi responsable de la production de ses albums.",
    explanation: "Il est aussi producteur."
  },
  {
    id: "D6",
    difficulty: "difficile",
    type: "truefalse",
    prompt:
      "Wham! a eu une période d'activité principale indiquée comme 1981–1986 dans les fiches de groupe.",
    answer: true,
    hint: "Indice : le duo s'est séparé avant la sortie de l'album Faith en 1987.",
    explanation:
      "Les années actives principales de Wham! sont souvent données 1981–1986."
  },
  {
    id: "D7",
    difficulty: "difficile",
    type: "mcq",
    prompt:
      "Quel cimetière est mentionné comme lieu d'inhumation dans certaines biographies ?",
    options: [
      "Père-Lachaise",
      "Highgate Cemetery",
      "Arlington",
      "Recoleta"
    ],
    answer: 1,
    hint: "Indice : cimetière victorien situé dans le nord de Londres.",
    explanation: "Highgate Cemetery (Londres) est mentionné."
  },
  {
    id: "D8",
    difficulty: "difficile",
    type: "fill",
    prompt:
      "Texte à trous : Son nom de naissance commence par « ______ » (prénom).",
    answerText: "georgios",
    hint: "Indice : prénom grec commençant par Geo…",
    explanation: "Georgios Kyriacos Panayiotou."
  },
  {
    id: "D9",
    difficulty: "difficile",
    type: "mcq",
    prompt:
      "Quel site officiel est associé à George Michael (biographie/FAQ) ?",
    options: [
      "georgemichael.com",
      "beatles.com",
      "u2.com",
      "madonna.com"
    ],
    answer: 0,
    hint: "Indice : l'URL reprend son nom complet.",
    explanation: "Le site officiel : georgemichael.com."
  },
  {
    id: "D10",
    difficulty: "difficile",
    type: "truefalse",
    prompt:
      "La formation de Wham! est généralement située à Bushey (Hertfordshire).",
    answer: true,
    hint: "Indice : cette localité est située à quelques kilomètres de Londres.",
    explanation: "Les fiches de groupe indiquent Bushey comme origine."
  }
];





