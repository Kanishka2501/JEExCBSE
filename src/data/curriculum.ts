import { DayData, DayPhase, DayKind, TaskItem, SubjectKey } from '../types';

export const START_DATE = new Date(2026, 9, 24); // Saturday 24 October 2026
export const TOTAL_DAYS = 129;
export const EXAM_DATE = new Date(2027, 0, 22); // Friday 22 January 2027
export const BEXAM_DATE = new Date(2027, 2, 1); // Monday 1 March 2027
export const ONE_DAY_MS = 864e5;

export const pad = (n: number) => (n < 10 ? '0' : '') + n;

export const formatDate = (d: Date, options?: Intl.DateTimeFormatOptions) =>
  d.toLocaleDateString('en-GB', options);

export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export const dateOf = (n: number) => new Date(2026, 9, 24 + n - 1);

export const dayNum = (d: Date) =>
  Math.round(
    (new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() -
      START_DATE.getTime()) /
      ONE_DAY_MS
  ) + 1;

export interface Slot {
  name: string;
  part: number;
  of: number;
  kind: string;
}

const parseSlots = (str: string, defaultKind: string): Slot[] => {
  const result: Slot[] = [];
  str.split(';').forEach((chunk) => {
    const parts = chunk.split(':');
    const name = parts[0];
    const n = Number(parts[1]);
    const kind = parts[2] || defaultKind;
    for (let i = 0; i < n; i++) {
      result.push({ name, part: i + 1, of: n, kind });
    }
  });
  return result;
};

export const M_SLOTS = parseSlots(
  'Sets, relations & functions:2;Quadratic equations & complex numbers:3;Sequences & series:2;Permutations, combinations & binomial theorem:3;Matrices & determinants:3;Trigonometry & inverse trigonometry:3;Limits, continuity & differentiability:4;Applications of derivatives:3;Indefinite integrals:3;Definite integrals & area:3;Differential equations:2;Straight lines:2;Circles:2;Parabola, ellipse & hyperbola:5;Vectors:3;3D geometry:3;Probability:3;Statistics & mathematical reasoning:2',
  'math'
);

export const P_SLOTS = parseSlots(
  'Units, dimensions & errors:1;Kinematics:3;Laws of motion & friction:3;Work, energy & power:2;Centre of mass & collisions:2;Rotational motion:3;Gravitation:2;Properties of solids & fluids:3;Heat, kinetic theory & thermodynamics:4;Oscillations (SHM):2;Waves & sound:2;Electrostatics & capacitors:4;Current electricity:3;Magnetism & moving charges:3;EMI & alternating current:3;Ray optics:3;Wave optics & EM waves:2;Dual nature, atoms & nuclei:3;Semiconductors & experimental skills:3',
  'phys'
);

export const C_SLOTS = parseSlots(
  'Mole concept & stoichiometry:3:pc;Atomic structure:2:pc;Chemical bonding & molecular structure:3:pc;Chemical thermodynamics:3:pc;Chemical & ionic equilibrium:4:pc;Redox & electrochemistry:3:pc;Solutions:2:pc;Chemical kinetics:2:pc;Periodic table & periodicity:2:inorg;s-block & p-block elements:4:inorg;d- and f-block elements:2:inorg;Coordination compounds:3:inorg;Salt analysis & practical chemistry:2:inorg;General organic chemistry:3:org;Hydrocarbons:2:org;Haloalkanes & haloarenes:2:org;Alcohols, phenols & ethers:2:org;Aldehydes, ketones & carboxylic acids:3:org;Amines & biomolecules:2:org;Name reactions & conversions:2:org',
  'chem'
);

export const M_CL = [
  'Algebra: sets, functions, quadratics, complex numbers, sequences',
  'Counting, binomial theorem, matrices, determinants, probability',
  'Trigonometry, vectors and 3D geometry',
  'Limits, continuity and applications of derivatives',
  'Integrals and differential equations',
  'Coordinate geometry: lines, circles, conics',
];

export const P_CL = [
  'Mechanics I: kinematics, laws of motion, energy',
  'Mechanics II: rotation, gravitation, solids and fluids',
  'Heat, thermodynamics and kinetic theory',
  'Oscillations and waves',
  'Electrostatics, current, magnetism, EMI and AC',
  'Optics and modern physics',
];

export const C_CL = [
  'Mole concept, atomic structure and bonding',
  'Thermodynamics, equilibrium and electrochemistry',
  'Solutions, kinetics and the periodic table',
  'p-, d- and f-block elements and coordination compounds',
  'General organic chemistry, hydrocarbons and halides',
  'Alcohols, carbonyls, amines and name reactions',
];

export const SUBJ_NAMES: Record<SubjectKey | string, string> = {
  math: 'Maths',
  phys: 'Physics',
  chem: 'Chemistry',
  delay: '1-3-7 Revision',
  board: 'Board Maths',
  mock: 'Weekly test',
  review: 'Detect',
  log: 'Error log',
  rest: 'Rest',
  plan: 'Setup',
  mix: 'Practice set',
};

export const PHASE_NAMES: Record<DayPhase, string> = {
  learn: 'Learn and practise',
  revise: 'Revise with PYQs',
  mocks: 'Mock sprint',
  window: 'JEE Session 1 window',
  bsweep: 'Board Maths chapter sweep',
  bpaper: 'Board paper practice',
  bexam: 'Board exam day',
};

export const BUCKETS = [
  'Sure but wrong',
  'Unsure but correct',
  'Guessed but correct',
  'Wrong and unaware',
];

export const BOARD_MAPPING: Record<string, string> = {
  'Sets, relations & functions': 'Ch 1 Relations and Functions',
  'Trigonometry & inverse trigonometry': 'Ch 2 Inverse Trigonometric Functions',
  'Matrices & determinants': 'Ch 3 Matrices and Ch 4 Determinants',
  'Limits, continuity & differentiability': 'Ch 5 Continuity and Differentiability',
  'Applications of derivatives': 'Ch 6 Applications of Derivatives',
  'Indefinite integrals': 'Ch 7 Integrals',
  'Definite integrals & area': 'Ch 7 Definite Integrals and Ch 8 Applications of Integrals',
  'Differential equations': 'Ch 9 Differential Equations',
  'Vectors': 'Ch 10 Vector Algebra',
  '3D geometry': 'Ch 11 Three Dimensional Geometry',
  'Probability': 'Ch 13 Probability',
  'Straight lines': 'Ch 12 Linear Programming (board only)',
};

export const B_CL = [
  'Ch 1 Relations and Functions',
  'Ch 3 Matrices, Ch 4 Determinants and Ch 13 Probability',
  'Ch 2 Inverse Trigonometry, Ch 10 Vectors and Ch 11 3D Geometry',
  'Ch 5 Continuity and Differentiability, Ch 6 Applications of Derivatives',
  'Ch 7 Integrals, Ch 8 Applications of Integrals and Ch 9 Differential Equations',
  'Ch 12 Linear Programming and your weakest board chapter',
];

export const CARD_STYLE: Record<string, string> = {
  math: 'formula plus one shortcut',
  phys: 'formulas only, derivation only if it repeats',
  pc: 'formulas only',
  inorg: 'pointers, with exceptions listed separately',
  org: 'reaction, exceptions and mechanism',
};

let spN = 0;
export const resetSpCount = () => { spN = 0; };

export const createBPaperTask = (numOverride?: number): TaskItem => {
  if (numOverride !== undefined) {
    return {
      id: 'q',
      subj: 'board',
      tag: 'Oswaal sample paper ' + numOverride + ' of 15',
      title: 'Sample paper ' + numOverride + ', 3 hours',
      detail:
        'From Oswaal 15 Sample Papers. 80 marks, handwritten in full steps, exam timing, no phone. Check it against the marking scheme and log it in the board paper log.',
      time: '3 h',
    };
  }
  spN++;
  return {
    id: 'q',
    subj: 'board',
    tag: 'Oswaal sample paper ' + spN + ' of 15',
    title: 'Sample paper ' + spN + ', 3 hours',
    detail:
      'From Oswaal 15 Sample Papers. 80 marks, handwritten in full steps, exam timing, no phone. Check it against the marking scheme and log it in the board paper log.',
    time: '3 h',
  };
};

export const DIV: [string, string][] = [
  [
    'Direct set',
    '25 direct questions on recent formulas from your Sri Chaitanya module. Checks basics and baseline speed.',
  ],
  [
    'Mixed set',
    '20 questions combining 2 to 3 chapters from the harder sections of your Sri Chaitanya module. Tricky, indirect.',
  ],
  [
    'PYQ set',
    '30 PYQs from the last 10 years on finished chapters, filtered by chapter on Examside (use Newton School of Technology for extra sets).',
  ],
  [
    'Timed set',
    '30 mixed PYQs from Examside or Newton School of Technology, 60 minutes, strict timer, no pausing.',
  ],
];

export const GAPS: [number, string, string][] = [
  [1, 'recall', 'Close the book and write what you remember. Tick what you know, restudy the rest.'],
  [3, 'notes', 'Go through your cards, flowcharts and short notes.'],
  [7, 're-read + mini-test', 'Fast re-read, then a 10-question mini-test. Redo what you got wrong.'],
  [17, 'spaced round', 'Flip the cards, solve 5 questions.'],
  [32, 'spaced round', 'Flip the cards, solve 5 questions.'],
];

export const logItem = (): TaskItem => ({
  id: 'e',
  subj: 'log',
  tag: 'Detect',
  title: 'Error log, four buckets, formulas from memory',
  detail:
    "Add every wrong or skipped question to the error log. Sure-but-wrong and wrong-and-unaware go in red. Write the day's formulas or reactions from memory.",
  time: '30 min',
});

function studyItems(n: number, k: number) {
  const learn: string[] = [];
  const mk = (id: string, subj: SubjectKey, list: Slot[]): TaskItem => {
    const s = list[k];
    learn.push(s.name);
    const last = s.part === s.of;
    const core =
      (s.part === 1
        ? 'Watch the Vora Classes lecture on this chapter (YouTube), pausing to note only the gaps. Then solve the basic-level questions from your Sri Chaitanya module (Class 11 or 12, whichever holds the chapter).'
        : last
        ? "Mixed-level problems from your Sri Chaitanya module, then this chapter's PYQs of the last 10 years on Examside (or Newton School of Technology)."
        : 'Continue the next Vora Classes lecture or topic, then JEE Main level problems and the harder exercises from your Sri Chaitanya module.') +
      (s.part === 1 && last
        ? " Finish with this chapter's PYQs on Examside (or Newton School of Technology)."
        : '');
    return {
      id,
      subj,
      tag: SUBJ_NAMES[subj] + (s.of > 1 ? ', part ' + s.part + ' of ' + s.of : ''),
      title: s.name,
      detail:
        (s.part === 1 ? 'Diagnose: 10 questions before the lecture (15 min). ' : '') +
        core +
        '\nDistil: one 2-minute card per concept, 3 to 4 trigger words. Card style: ' +
        CARD_STYLE[s.kind] +
        '.',
      time: '2 h',
    };
  };

  const items: TaskItem[] = [mk('m', 'math', M_SLOTS), mk('p', 'phys', P_SLOTS), mk('c', 'chem', C_SLOTS)];
  const d = DIV[(n - 1) % 4];
  items.push({
    id: 'q',
    subj: 'mix',
    tag: 'Diversify: ' + d[0],
    title: d[0],
    detail: d[1] + ' Mark your guesses.',
    time: '1 h',
  });

  const bs = M_SLOTS[k];
  const bn = BOARD_MAPPING[bs.name];
  if (bn) {
    items.splice(3, 0, {
      id: 'b',
      subj: 'board',
      tag: 'Board Maths',
      title: bn,
      detail:
        (bs.part === 1
          ? 'Open Oswaal One for All: read the NCERT solved examples, then do the exercise questions, writing each answer step by step and checking it against the book.'
          : bs.part === bs.of
          ? 'NCERT miscellaneous exercise in One for All, then 3 questions of 3 and 5 marks on this chapter from the Oswaal Question Bank, in full steps.'
          : 'Continue the NCERT exercises in One for All in full steps, plus one case-based question from the Question Bank.') +
        ' Skip any question marked as deleted from the syllabus. Add board-only formulas and standard results to your cards.',
      time: '45 min',
    });
  }

  return { items, learn };
}

function reviseItems(k: number): TaskItem[] {
  const ci = Math.min(5, Math.floor((k * 6) / 17));
  const T =
    'Skim your cards and formula sheet, solve 40 PYQs from this cluster on Examside or Newton School of Technology against the clock, then redo every open error-log item for it.';
  return [
    { id: 'm', subj: 'math', tag: 'Maths revision', title: M_CL[ci], detail: T, time: '2 h' },
    { id: 'p', subj: 'phys', tag: 'Physics revision', title: P_CL[ci], detail: T, time: '2 h' },
    { id: 'c', subj: 'chem', tag: 'Chemistry revision', title: C_CL[ci], detail: T, time: '2 h' },
    {
      id: 'b',
      subj: 'board',
      tag: 'Board Maths revision',
      title: B_CL[ci],
      detail:
        "Redo the NCERT questions you marked in One for All, then 3 questions (3 and 5 marks) and one case-based question from this cluster's chapters in the Oswaal Question Bank, in full steps.",
      time: '45 min',
    },
    k % 4 === 3
      ? createBPaperTask()
      : {
          id: 'q',
          subj: 'mix',
          tag: 'Timed section test',
          title: 'Timed section test',
          detail: '45 mixed PYQs, 15 per subject, from Examside or Newton School of Technology, 60 minutes. Mark your guesses.',
          time: '1 h',
        },
  ];
}

const sundayItems = (phase: DayPhase): TaskItem[] => {
  const l = phase === 'learn';
  return [
    {
      id: 't',
      subj: 'mock',
      tag: 'Weekly test',
      title: l ? 'Part test, 3 hours' : 'Full-syllabus mock, 3 hours',
      detail: l
        ? '75 questions from chapters finished so far (a part test or PYQ set from Examside or Newton School of Technology), timed, no phone. Log it in the mock log.'
        : 'Full JEE Main paper from Examside or Newton School of Technology: 75 questions, 300 marks, timed. Log it in the mock log.',
      time: '3 h',
    },
    {
      id: 'a',
      subj: 'review',
      tag: 'Detect',
      title: 'Sort every question into the four buckets',
      detail: 'Sure but wrong, unsure but correct, guessed but correct, wrong and unaware. Re-solve the red ones without looking.',
      time: '90 min',
    },
    {
      id: 'e',
      subj: 'log',
      tag: 'Error log',
      title: 'Update the error log',
      detail: 'Add the misses. Mark an old entry fixed only if you solved it cleanly this week.',
      time: '30 min',
    },
    {
      id: 'r',
      subj: 'rest',
      tag: 'Rest',
      title: 'Take the evening off',
      detail: 'Sleep is part of the plan.',
      time: '',
    },
  ];
};

const day1Items = (): TaskItem[] => [
  {
    id: 't',
    subj: 'mock',
    tag: 'D1 Diagnose',
    title: 'Take a full JEE Main paper, 3 hours',
    detail:
      'A full JEE Main paper from Examside (or Newton School of Technology) under exam conditions: timer on, phone away, no pausing. The score does not matter today. Log it in the mock log.',
    time: '3 h',
  },
  {
    id: 'a',
    subj: 'review',
    tag: 'D5 Detect',
    title: 'Sort every question into the four buckets',
    detail: 'Sure but wrong, unsure but correct, guessed but correct, wrong and unaware. Add the misses to the error log.',
    time: '2 h',
  },
  {
    id: 'w',
    subj: 'plan',
    tag: 'D1 Diagnose',
    title: 'Find what repeats and name your five weakest chapters',
    detail:
      'Use Examside to filter the last 10 years of JEE Main PYQs by chapter and see which chapters and formulas repeat. If a weak chapter sits far down this plan, pull it forward.',
    time: '40 min',
  },
  {
    id: 's',
    subj: 'plan',
    tag: 'D2 Setup',
    title: 'Build your card kit and lock in your resources',
    detail:
      'Buy small paper slips, a black pen, a red pen and a box. Your resources are fixed: Vora Classes on YouTube for lectures, your Sri Chaitanya Class 11 and 12 modules for practice, Examside and Newton School of Technology for PYQs, and the three Oswaal books for board Maths. Do not add more. Choose a wake-up time you can keep every day.',
    time: '30 min',
  },
];

const day2Items = (): TaskItem[] => [
  {
    id: 'm',
    subj: 'plan',
    tag: 'Setup',
    title: 'Map your material to the plan',
    detail:
      'For each chapter in this plan, note the matching Vora Classes playlist on YouTube and the page range in your Sri Chaitanya Class 11 and 12 modules. Save the playlists per subject and test that your Examside and Newton School of Technology logins work.',
    time: '1.5 h',
  },
  {
    id: 'o',
    subj: 'board',
    tag: 'Board Maths setup',
    title: 'Walk through your three Oswaal books',
    detail:
      'In One for All, find the solved NCERT and Exemplar sections. In the Question Bank, find the chapter-wise question lists. In the 15 Sample Papers, read the paper design table: 38 questions, 80 marks, Sections A to E, with a new figure-based question in Section C. Slip a marker at the start of each chapter.',
    time: '1 h',
  },
  {
    id: 'r',
    subj: 'rest',
    tag: 'Rest',
    title: 'Take the evening off',
    detail: 'Tomorrow the chapter work begins. Sleep early.',
    time: '',
  },
];

function mockItems(n: number): TaskItem[] {
  const md: Record<number, number> = { 81: 1, 82: 2, 84: 3, 86: 4, 88: 5, 89: 6 };
  if (md[n]) {
    const r = n === 89;
    return [
      {
        id: 't',
        subj: 'mock',
        tag: 'Full mock ' + md[n],
        title: r ? 'Exam-day rehearsal, 3 hours' : 'Full JEE Main paper, 3 hours',
        detail: r
          ? 'Same start time as Session 1, same breakfast, phone out of the room. Log the score.'
          : 'Full paper from Examside or Newton School of Technology. 75 questions, 300 marks, timed. Log it in the mock log.',
        time: '3 h',
      },
      {
        id: 'a',
        subj: 'review',
        tag: 'Detect',
        title: 'Sort every question into the four buckets',
        detail: 'Spend longer on this than on the paper. Re-solve each red question cold.',
        time: '2 h',
      },
      {
        id: 'e',
        subj: 'log',
        tag: 'Error log',
        title: 'Update the error log',
        detail: 'Mark entries fixed only after a clean solve.',
        time: '30 min',
      },
    ];
  }

  if (n === 83 || n === 87) {
    const rep = (id: string, s: SubjectKey): TaskItem => ({
      id,
      subj: s,
      tag: SUBJ_NAMES[s] + ' repair',
      title: 'Fix your most-missed chapter',
      detail: 'Pick the chapter that costs you the most marks from the error log. Relearn it, then solve 20 fresh questions.',
      time: '2 h',
    });
    return [
      rep('m', 'math'),
      rep('p', 'phys'),
      rep('c', 'chem'),
      n === 83
        ? createBPaperTask()
        : {
            id: 'q',
            subj: 'mix',
            tag: 'Timed',
            title: 'Timed section test',
            detail: '45 mixed questions, 60 minutes.',
            time: '1 h',
          },
      logItem(),
    ];
  }

  if (n === 85) {
    const f = (id: string, s: SubjectKey): TaskItem => ({
      id,
      subj: s,
      tag: SUBJ_NAMES[s],
      title: 'Formula and reaction sheet',
      detail: 'Write the whole sheet from memory, check it, rewrite what you missed.',
      time: '2 h',
    });
    return [
      f('m', 'math'),
      f('p', 'phys'),
      f('c', 'chem'),
      {
        id: 'q',
        subj: 'mix',
        tag: 'PYQ',
        title: '60 mixed PYQs',
        detail: 'One timed set of 60 PYQs from Examside or Newton School of Technology, 90 minutes.',
        time: '90 min',
      },
      logItem(),
    ];
  }

  return [
    {
      id: 'f',
      subj: 'mix',
      tag: 'Light revision',
      title: 'Skim cards, formula sheets and the error log',
      detail: 'No new topics. Read, do not grind.',
      time: '2 h',
    },
    {
      id: 'n',
      subj: 'plan',
      tag: 'Admin',
      title: 'Check registration, admit card dates and exam city',
      detail: 'Confirm your form on jeemain.nta.nic.in and note when the Session 1 admit card is due.',
      time: '30 min',
    },
    {
      id: 'z',
      subj: 'rest',
      tag: 'Rest',
      title: 'Sleep early',
      detail: 'The JEE mock sprint ends today. Session 1 is tentatively 22 January 2027, tomorrow. Confirm the date with NTA.',
      time: '',
    },
  ];
}

export const BCH = [
  'Ch 1 Relations and Functions',
  'Ch 2 Inverse Trigonometric Functions',
  'Ch 3 Matrices',
  'Ch 4 Determinants',
  'Ch 5 Continuity and Differentiability',
  'Ch 6 Applications of Derivatives',
  'Ch 7 Integrals',
  'Ch 8 Applications of Integrals',
  'Ch 9 Differential Equations',
  'Ch 10 Vector Algebra',
  'Ch 11 Three Dimensional Geometry',
  'Ch 12 Linear Programming',
  'Ch 13 Probability',
];

export const PAPERS: Record<number, number> = {
  116: 1,
  117: 2,
  118: 3,
  119: 4,
  120: 5,
  121: 6,
  122: 7,
  124: 8,
  126: 9,
};

function boardItems(n: number): TaskItem[] {
  const L = logItem();
  if (n <= 100) {
    const it: TaskItem[] = [
      {
        id: 'b',
        subj: 'board',
        tag: 'Board Maths, light',
        title: BCH[(n - 91) % 13],
        detail:
          'Rapid NCERT revision in Oswaal One for All: solved examples, then only the exercise questions you marked, in full steps. Keep it calm in this window.',
        time: '1.5 h',
      },
      {
        id: 'f',
        subj: 'mix',
        tag: 'D2 Distil',
        title: 'Flip your cards for 20 minutes',
        detail: 'Formulas, trigger words and diagrams. On your JEE paper day, do only this and sleep early.',
        time: '20 min',
      },
    ];
    if (n === 91) {
      it.unshift({
        id: 'n',
        subj: 'plan',
        tag: 'Admin',
        title: 'Check your Session 1 admit card, centre and what to carry',
        detail: 'Confirm the details on jeemain.nta.nic.in and pack your documents tonight.',
        time: '30 min',
      });
    }
    return it.concat([L]);
  }

  if (n === 101) {
    return [
      {
        id: 'a',
        subj: 'review',
        tag: 'D5 Detect',
        title: 'Sort your JEE Session 1 questions into the four buckets',
        detail:
          'Use your memory of the paper and your own working. Add misses to the error log. Then decide calmly whether to plan for Session 2 (expected April).',
        time: '2 h',
      },
      L,
      {
        id: 'r',
        subj: 'rest',
        tag: 'Rest',
        title: 'Take the rest of the day off',
        detail: 'The board sweep starts tomorrow.',
        time: '',
      },
    ];
  }

  if (n <= 114) {
    const ch = BCH[n - 102];
    return [
      {
        id: 'b',
        subj: 'board',
        tag: 'Board Maths sweep',
        title: ch,
        detail:
          'In Oswaal One for All, read the NCERT solved examples fast, then redo every exercise question you marked. Write each solution in full steps: formula, substitution, working, conclusion.',
        time: '2 h',
      },
      {
        id: 'k',
        subj: 'board',
        tag: 'D4 Diversify',
        title: '20 board-style questions on ' + ch.slice(ch.indexOf(' ', 4) + 1),
        detail:
          'Use the chapter-wise and topic-wise section of the Oswaal Question Bank (solved papers 2017 to 2026): a mix of 1, 2, 3 and 5-mark questions plus one case-based question. Time yourself at about one minute per mark, then check against the solutions.',
        time: '1.5 h',
      },
      {
        id: 'c',
        subj: 'board',
        tag: 'D2 Distil',
        title: "Rewrite this chapter's cards",
        detail: 'One card per concept, 3 to 4 trigger words, one diagram where it helps. 2 minutes each.',
        time: '30 min',
      },
      {
        id: 'j',
        subj: 'mix',
        tag: 'JEE upkeep',
        title: 'Physics and Chemistry upkeep',
        detail:
          'Flip your cards and solve 20 mixed PYQs so the JEE work stays fresh for Session 2 (expected April).',
        time: '1 h',
      },
      L,
    ];
  }

  if (n === 115) {
    return [
      {
        id: 'b',
        subj: 'board',
        tag: 'Board Maths repair',
        title: 'Repair your three weakest board chapters',
        detail:
          'Pick them from the error log and your sweep results. Relearn each from One for All, then solve 15 fresh questions per chapter from the Oswaal Question Bank in full steps.',
        time: '3 h',
      },
      L,
    ];
  }

  if (PAPERS[n]) {
    const q = createBPaperTask();
    q.tag = 'Board paper ' + PAPERS[n] + ' of 9, ' + q.tag;
    return [
      q,
      {
        id: 'a',
        subj: 'review',
        tag: 'D5 Detect',
        title: 'Check every lost mark',
        detail:
          'Sort misses into concept gap, calculation slip, steps not written and time pressure. Redo each red question cold.',
        time: '90 min',
      },
      L,
    ];
  }

  if (n === 123 || n === 125) {
    return [
      {
        id: 'b',
        subj: 'board',
        tag: 'Board Maths repair',
        title: 'Formula sheet from memory, then fix the gaps',
        detail:
          'Write every board formula and standard result from memory, check it, rewrite what you missed. Then redo the open error-log items, using One for All for the gaps.',
        time: '2 h',
      },
      {
        id: 'f',
        subj: 'mix',
        tag: 'D2 Distil',
        title: 'Flip your cards',
        detail: 'All 13 chapters, quickly.',
        time: '30 min',
      },
      L,
    ];
  }

  if (n === 127) {
    return [
      {
        id: 'b',
        subj: 'board',
        tag: 'Light revision',
        title: 'Skim solved examples of your three weakest chapters in One for All',
        detail: 'No new papers today. Read, do not grind.',
        time: '2 h',
      },
      {
        id: 'f',
        subj: 'mix',
        tag: 'D2 Distil',
        title: 'Flip your cards',
        detail: 'Formulas, diagrams and trigger words.',
        time: '30 min',
      },
    ];
  }

  if (n === 128) {
    return [
      {
        id: 'b',
        subj: 'board',
        tag: 'Light revision',
        title: 'Handwritten formula sheet and card flip',
        detail:
          'One clean page per group of chapters, then flip your cards for 30 minutes. Pack your admit card, geometry box and pens, and check the exam centre route tonight.',
        time: '1.5 h',
      },
      {
        id: 'z',
        subj: 'rest',
        tag: 'Rest',
        title: 'Sleep early',
        detail: 'You have done the work. Lights out by 22:00.',
        time: '',
      },
    ];
  }

  return [
    {
      id: 'x',
      subj: 'board',
      tag: 'Exam day',
      title: 'CBSE Class 12 Maths board exam (tentative date)',
      detail:
        'Reach early. Spend the first 15 minutes reading the whole paper, attempt in order of confidence, write every step, keep 10 minutes to check.',
      time: '3 h',
    },
  ];
}

export function buildAllDays(): (DayData | null)[] {
  resetSpCount();
  const days: (DayData | null)[] = [null];
  let lk = 0;
  let rk = 0;

  for (let n = 1; n <= TOTAL_DAYS; n++) {
    const date = dateOf(n);
    const dow = date.getDay();
    const phase: DayPhase =
      n <= 61
        ? 'learn'
        : n <= 80
        ? 'revise'
        : n <= 90
        ? 'mocks'
        : n <= 100
        ? 'window'
        : n <= 115
        ? 'bsweep'
        : n <= 128
        ? 'bpaper'
        : 'bexam';

    let kind: DayKind = 'study';
    let items: TaskItem[];
    let learn: string[] | null = null;
    let bch: string[] | null = null;

    if (n === 1) {
      kind = 'diagnostic';
      items = day1Items();
    } else if (n === 2) {
      kind = 'setup';
      items = day2Items();
    } else if (n >= 91) {
      kind = 'board';
      items = boardItems(n);
      bch = n >= 102 && n <= 114 ? [BCH[n - 102]] : null;
    } else if (phase === 'mocks') {
      kind = 'mock';
      items = mockItems(n);
    } else if (dow === 0) {
      kind = 'test';
      items = sundayItems(phase);
    } else if (phase === 'learn') {
      const r = studyItems(n, lk++);
      items = r.items;
      learn = r.learn;
    } else {
      items = reviseItems(rk++);
    }

    days.push({ n, date, dow, phase, kind, items, learn, bch });
  }

  // Inject 1-3-7 delay revision queue
  for (let n = 2; n <= 127; n++) {
    const D = days[n];
    if (!D || D.kind === 'mock') continue;

    const lines: string[] = [];
    GAPS.forEach((g) => {
      const sourceDay = days[n - g[0]];
      if (n - g[0] >= 2 && sourceDay && (sourceDay.learn || sourceDay.bch)) {
        lines.push(
          '+' +
            g[0] +
            ' days, ' +
            g[1] +
            ': ' +
            (sourceDay.learn || sourceDay.bch)!.join('; ') +
            '\n    ' +
            g[2]
        );
      }
    });

    if (lines.length) {
      const it: TaskItem = {
        id: 'd',
        subj: 'delay',
        tag: 'D3 Delay: 1-3-7 revision',
        title: lines.length + ' revision round' + (lines.length > 1 ? 's' : '') + ' due today',
        detail: lines.join('\n'),
        time: '45 min',
      };
      const at = D.kind === 'study' ? 4 : D.kind === 'board' ? 1 : 0;
      D.items.splice(at, 0, it);
    }

    if (D.kind === 'study' || D.kind === 'diagnostic') continue;
  }

  // Add error log item to study days
  days.forEach((D) => {
    if (D && D.kind === 'study' && D.n > 1) {
      D.items.push(logItem());
    }
  });

  return days;
}

export const ALL_DAYS = buildAllDays();
