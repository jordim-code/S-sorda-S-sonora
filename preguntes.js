const ACTIVITAT_1 = [
  {
    tipus: "arrossegar",
    categoria: "Classifica segons el so",
    pregunta: "Arrossega cada paraula al grup correcte: S sonora o S sorda.",
    centre: [
      "casa",
      "caçador",
      "rossa",
      "dotze",
      "promesa",
      "dessuadora",
      "desig",
      "cançoner",
      "visita",
      "feliç"
    ],
    s_sonora: [
      "casa",
      "dotze",
      "promesa",
      "desig",
      "visita"
    ],
    s_sorda: [
      "caçador",
      "rossa",
      "dessuadora",
      "cançoner",
      "feliç"
    ]
  }
];

const ACTIVITAT_2 = [
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["onze", "onse"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["pisçina", "piscina"],
    correcta: 1
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["zona", "ssona"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["decembre", "desembre"],
    correcta: 1
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["cel", "sel"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["cosina", "cossina"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["cebra", "zebra"],
    correcta: 1
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["infució", "infusió"],
    correcta: 1
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["seguir", "zeguir"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["raça", "raca"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["glaçó", "glasó"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["passió", "pasió"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["esmorsar", "esmorzar"],
    correcta: 1
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["tassa", "taça"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["llisó", "lliçó"],
    correcta: 1
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["zentir", "sentir"],
    correcta: 1
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["tristessa", "tristesa"],
    correcta: 1
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["música", "mússica"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["pisarra", "pissarra"],
    correcta: 1
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["zero", "cero"],
    correcta: 0
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["llencol", "llençol"],
    correcta: 1
  },
  {
    tipus: "opcions",
    categoria: "Tria l'opció correcta",
    pregunta: "Quina és la forma correcta?",
    opcions: ["pèzol", "pèsol"],
    correcta: 1
  }
];

const ACTIVITAT_3 = [
  {
    tipus: "dictat",
    categoria: "Dictat de frases",
    pregunta: "Escolta l’àudio i escriu la frase exacta.",
    frase: "A la plaça hi ha onze cases de pisos.",
    audio: "frase1.mp3"
  },
  {
    tipus: "dictat",
    categoria: "Dictat de frases",
    pregunta: "Escolta l’àudio i escriu la frase exacta.",
    frase: "Dissabte farem arròs a la cassola amb pèsols i trossets de conill.",
    audio: "frase2.mp3"
  },
  {
    tipus: "dictat",
    categoria: "Dictat de frases",
    pregunta: "Escolta l’àudio i escriu la frase exacta.",
    frase: "L'Ignasi pensa passar les vacances a França.",
    audio: "frase3.mp3"
  },
  {
    tipus: "dictat",
    categoria: "Dictat de frases",
    pregunta: "Escolta l’àudio i escriu la frase exacta.",
    frase: "Aquestes panses són massa dolces.",
    audio: "frase4.mp3"
  }
];

const PREGUNTES = [
  ...ACTIVITAT_1,
  ...ACTIVITAT_2,
  ...ACTIVITAT_3
];
