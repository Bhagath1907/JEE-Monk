export type Subject = 'Physics' | 'Chemistry' | 'Math';
export type ClassTag = '12th PUC Sync' | '11th High-ROI';
export type DayMode = 'home' | 'college';
export type ViewId = 'focus' | 'mindmap' | 'decoder' | 'bugs';

export type BugCategory =
  | '🧩 Twist Misread'
  | '🧠 Formula Forgotten'
  | '📘 NCERT Exception'
  | '🔢 Calculation Bug';

export interface Chapter {
  id: string;
  subject: Subject;
  classTag: ClassTag;
  marks: number;
  prereq: string | null;
  chain: string;
  title: string;
  boardTwist: string;
  fastQuery: string;
  pyqQuery: string;
  fullQuery: string;
}

export interface ChapterProgress {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  pinnedVideoUrl?: string;
  notes?: string;
}

export interface BugItem {
  id: string;
  chapterId: string;
  category: BugCategory;
  triggerFix: string;
  createdAt: string;
  resolved?: boolean;
}

export interface MonkAppState {
  activeChapterId: string;
  dayMode: DayMode;
  progress: Record<string, ChapterProgress>;
  commits: string[]; // Array of YYYY-MM-DD strings
  bugs: BugItem[];
}

export const STORAGE_KEY = 'jee_monk_studio_v2';
export const TARGET_EXAM_DATE = '2027-01-20T09:00:00+05:30';
export const TOTAL_MAX_MARKS = 220;
export const TARGET_98_PERCENTILE_MARKS = 160;

export const CHAPTERS: Chapter[] = [
  {
    id: 'p1',
    subject: 'Physics',
    classTag: '12th PUC Sync',
    marks: 12,
    prereq: null,
    chain: 'Physics 1: Modern Physics & Semiconductors (16M)',
    title: 'Modern Physics (Dual Nature, Atoms, Nuclei)',
    boardTwist:
      'PUC asks direct definitions or de-Broglie calculations. JEE combines Stopping Potential graphs with wavelength ratios, or compares Bohr radius/velocity/energy across H, He+, and Li2+ ions. Use shortcut hc = 12400 eV·Å!',
    fastQuery: 'Eduniti Modern Physics Dual Nature Atoms Nuclei JEE Main revision',
    pyqQuery: 'Eduniti Modern Physics Top PYQs JEE Main',
    fullQuery: 'PW Manzil Modern Physics One Shot JEE Main',
  },
  {
    id: 'p2',
    subject: 'Physics',
    classTag: '12th PUC Sync',
    marks: 4,
    prereq: 'p1',
    chain: 'Physics 1: Modern Physics & Semiconductors (16M)',
    title: 'Semiconductors, Diodes & Logic Gates',
    boardTwist:
      'PUC asks rectifier theory. JEE asks 1 guaranteed question on either Truth Table / Boolean circuit of NAND/NOR gates OR Forward/Reverse bias diode circuits where a reverse-biased diode acts as an open switch.',
    fastQuery: 'Eduniti Semiconductors Logic Gates JEE Main revision',
    pyqQuery: 'Eduniti Semiconductors PYQs JEE Main',
    fullQuery: 'PW Manzil Semiconductors One Shot JEE Main',
  },
  {
    id: 'p3',
    subject: 'Physics',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: null,
    chain: 'Physics 2: Class 12 Electromagnetism Core (36M)',
    title: 'Current Electricity & Measuring Instruments',
    boardTwist:
      'PUC asks Kirchhoff derivations. JEE twists this into Wheatstone/symmetry networks, Meter Bridge balance-point shifts when shunted, and Galvanometer to Ammeter/Voltmeter conversion numericals.',
    fastQuery: 'Eduniti Current Electricity JEE Main revision',
    pyqQuery: 'Eduniti Current Electricity Top PYQs JEE Main',
    fullQuery: 'PW Manzil Current Electricity One Shot JEE Main',
  },
  {
    id: 'p4',
    subject: 'Physics',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'p3',
    chain: 'Physics 2: Class 12 Electromagnetism Core (36M)',
    title: 'Electrostatics & Capacitors',
    boardTwist:
      'PUC asks Gauss Law derivations. JEE asks electric dipole torque/energy in uniform field, concentric shell potentials, and Capacitor dielectric insertion with battery connected vs disconnected.',
    fastQuery: 'Eduniti Electrostatics and Capacitors JEE Main revision',
    pyqQuery: 'Eduniti Electrostatics Capacitors Top PYQs JEE Main',
    fullQuery: 'PW Manzil Electrostatics One Shot JEE Main',
  },
  {
    id: 'p5',
    subject: 'Physics',
    classTag: '11th High-ROI',
    marks: 4,
    prereq: 'p4',
    chain: 'Physics 2: Class 12 Electromagnetism Core (36M)',
    title: 'Gravitation (Formula Twin of Electrostatics)',
    boardTwist:
      'Do immediately after Electrostatics! Replace kq1q2 with Gm1m2. JEE asks variation of g with height/depth, escape vs orbital velocity ratios, and Kepler 3rd Law (T² ∝ R³).',
    fastQuery: 'Eduniti Gravitation JEE Main revision',
    pyqQuery: 'Eduniti Gravitation Top PYQs JEE Main',
    fullQuery: 'PW Manzil Gravitation One Shot JEE Main',
  },
  {
    id: 'p6',
    subject: 'Physics',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'p3',
    chain: 'Physics 2: Class 12 Electromagnetism Core (36M)',
    title: 'Moving Charges & Magnetism',
    boardTwist:
      'PUC asks Biot-Savart for a circular coil. JEE combines straight wires + circular arcs at center O, circular path of charged particles in B-field (r = mv/qB), and force between parallel currents.',
    fastQuery: 'Eduniti Moving Charges and Magnetism JEE Main revision',
    pyqQuery: 'Eduniti Moving Charges Magnetism Top PYQs JEE Main',
    fullQuery: 'PW Manzil Moving Charges and Magnetism One Shot',
  },
  {
    id: 'p7',
    subject: 'Physics',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'p6',
    chain: 'Physics 2: Class 12 Electromagnetism Core (36M)',
    title: 'EMI, Alternating Current (AC) & EM Waves',
    boardTwist:
      'JEE asks motional EMF of rotating rod (e = ½BωL²), series LCR resonance (XL = XC), power factor cosφ, and E₀/B₀ = c with wave direction via E × B in EM Waves.',
    fastQuery: 'Eduniti Alternating Current EMI EM Waves JEE Main revision',
    pyqQuery: 'Eduniti Alternating Current EMI PYQs JEE Main',
    fullQuery: 'PW Manzil Alternating Current One Shot JEE Main',
  },
  {
    id: 'p8',
    subject: 'Physics',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: null,
    chain: 'Physics 3: Optics, Thermal & Mechanics Boosters (28M)',
    title: 'Ray Optics & Wave Optics (YDSE)',
    boardTwist:
      'Focus on Prism minimum deviation & TIR, Lens Maker formula in liquid, lens+mirror combinations, and Young Double Slit (YDSE) fringe width shift when a thin slab is inserted.',
    fastQuery: 'Eduniti Ray Optics and Wave Optics JEE Main revision',
    pyqQuery: 'Eduniti Ray Optics Top PYQs JEE Main',
    fullQuery: 'PW Manzil Ray Optics One Shot JEE Main',
  },
  {
    id: 'p9',
    subject: 'Physics',
    classTag: '11th High-ROI',
    marks: 8,
    prereq: null,
    chain: 'Physics 3: Optics, Thermal & Mechanics Boosters (28M)',
    title: 'Thermodynamics & Kinetic Theory of Gases (KTG)',
    boardTwist:
      'Super scoring! JEE asks P-V cycle work done (area), Adiabatic vs Isothermal processes, Carnot efficiency, and degrees of freedom (f) to find Cp, Cv, and γ of gas mixtures.',
    fastQuery: 'Eduniti Thermodynamics and KTG JEE Main revision',
    pyqQuery: 'Eduniti Thermodynamics KTG Top PYQs JEE Main',
    fullQuery: 'PW Manzil Thermodynamics Physics One Shot JEE Main',
  },
  {
    id: 'p10',
    subject: 'Physics',
    classTag: '11th High-ROI',
    marks: 4,
    prereq: null,
    chain: 'Physics 3: Optics, Thermal & Mechanics Boosters (28M)',
    title: 'Units, Dimensions, Errors & Vectors',
    boardTwist:
      '1 guaranteed question! JEE asks dimensions of unknown constants in equations, percentage error propagation, and Screw Gauge / Vernier Callipers readings with zero error.',
    fastQuery: 'Eduniti Units and Dimensions Errors JEE Main revision',
    pyqQuery: 'Eduniti Units Dimensions Errors PYQs JEE Main',
    fullQuery: 'PW Manzil Units and Measurements One Shot',
  },
  {
    id: 'p11',
    subject: 'Physics',
    classTag: '11th High-ROI',
    marks: 4,
    prereq: 'p10',
    chain: 'Physics 3: Optics, Thermal & Mechanics Boosters (28M)',
    title: 'Kinematics (1D, Graphs & Projectile Motion)',
    boardTwist:
      'Instead of direct equations, JEE gives v-t or a-x graphs (use a = v·dv/dx) and Projectile Motion ratios of Max Height to Range or complementary angles.',
    fastQuery: 'Eduniti Kinematics 1D Projectile Motion JEE Main revision',
    pyqQuery: 'Eduniti Kinematics Top PYQs JEE Main',
    fullQuery: 'PW Manzil Kinematics One Shot JEE Main',
  },
  {
    id: 'p12',
    subject: 'Physics',
    classTag: '11th High-ROI',
    marks: 4,
    prereq: 'p11',
    chain: 'Physics 3: Optics, Thermal & Mechanics Boosters (28M)',
    title: 'Laws of Motion, Friction & Work-Power-Energy',
    boardTwist:
      'Focus on pulley-block constraints, pseudo force on inclines, two-block friction, and Work-Energy Theorem (Total Work = ΔKE) with variable forces.',
    fastQuery: 'Eduniti Laws of Motion and Work Power Energy JEE Main revision',
    pyqQuery: 'Eduniti Laws of Motion Work Energy PYQs JEE Main',
    fullQuery: 'PW Manzil Laws of Motion One Shot JEE Main',
  },
  {
    id: 'c1',
    subject: 'Chemistry',
    classTag: '11th High-ROI',
    marks: 4,
    prereq: null,
    chain: 'Chemistry 1: Inorganic Dependency Pipeline (24M)',
    title: 'Periodic Table & Periodicity',
    boardTwist:
      'Start Chemistry here! JEE asks Ionization Enthalpy exceptions (Be>B, N>O), Electron Gain Enthalpy order (Cl>F>Br>I), and Isoelectronic ionic radii order.',
    fastQuery: 'Sakshi Vora Bounceback Periodic Table JEE Main',
    pyqQuery: 'DexterChem Periodic Table PYQs JEE Main',
    fullQuery: 'PW Manzil Periodic Table One Shot Om Pandey',
  },
  {
    id: 'c2',
    subject: 'Chemistry',
    classTag: '11th High-ROI',
    marks: 8,
    prereq: 'c1',
    chain: 'Chemistry 1: Inorganic Dependency Pipeline (24M)',
    title: 'Chemical Bonding & Molecular Structure',
    boardTwist:
      'Backbone of Inorganic! Master VSEPR lone-pair counting & shapes (XeF4, SF4, ClF3), Dipole Moment comparisons, Hydrogen bonding, and MOT bond order & paramagnetism of O2/N2 species.',
    fastQuery: 'Sakshi Vora Bounceback Chemical Bonding JEE Main',
    pyqQuery: 'DexterChem Chemical Bonding Top PYQs JEE Main',
    fullQuery: 'PW Manzil Chemical Bonding One Shot Om Pandey',
  },
  {
    id: 'c3',
    subject: 'Chemistry',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'c2',
    chain: 'Chemistry 1: Inorganic Dependency Pipeline (24M)',
    title: 'Coordination Compounds',
    boardTwist:
      '2-3 questions guaranteed! JEE twists PUC basics into Crystal Field Splitting (strong vs weak ligands: CO/CN- vs Halogens), Spin-only magnetic moment √(n(n+2)) BM, and Octahedral/Square-planar isomerism.',
    fastQuery: 'Sakshi Vora Bounceback Coordination Compounds JEE Main',
    pyqQuery: 'DexterChem Coordination Compounds Top PYQs JEE Main',
    fullQuery: 'PW Manzil Coordination Compounds One Shot',
  },
  {
    id: 'c4',
    subject: 'Chemistry',
    classTag: '12th PUC Sync',
    marks: 4,
    prereq: 'c3',
    chain: 'Chemistry 1: Inorganic Dependency Pipeline (24M)',
    title: 'd & f Block Elements',
    boardTwist:
      'Read NCERT lines! Focus on KMnO4 & K2Cr2O7 oxidizing reactions in acidic/basic media, Lanthanoid contraction (Zr/Hf size similarity), and 3d ion colors/magnetic moments.',
    fastQuery: 'Sakshi Vora Bounceback d and f Block Elements JEE Main',
    pyqQuery: 'DexterChem d and f block PYQs JEE Main',
    fullQuery: 'PW Manzil d and f Block One Shot JEE Main',
  },
  {
    id: 'c5',
    subject: 'Chemistry',
    classTag: '11th High-ROI',
    marks: 4,
    prereq: null,
    chain: 'Chemistry 2: Physical Chemistry Numericals (32M)',
    title: 'Mole Concept, Concentration Terms & Redox',
    boardTwist:
      'Master Molarity, Molality, Mole Fraction, Limiting Reagent, and n-factor calculation here—Solutions, Electrochemistry, and Kinetics all depend on this!',
    fastQuery: 'DexterChem Mole Concept and Redox JEE Main revision',
    pyqQuery: 'DexterChem Mole Concept PYQs JEE Main',
    fullQuery: 'PW Manzil Mole Concept One Shot Faisal Sir',
  },
  {
    id: 'c6',
    subject: 'Chemistry',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'c5',
    chain: 'Chemistry 2: Physical Chemistry Numericals (32M)',
    title: 'Liquid Solutions & Colligative Properties',
    boardTwist:
      "PUC asks simple colligative formulas. JEE ALWAYS inserts the Van't Hoff factor (i) for dissociation/association (e.g., K4[Fe(CN)6] or acetic acid dimerization in benzene)!",
    fastQuery: 'Sakshi Vora Bounceback Liquid Solutions JEE Main',
    pyqQuery: 'DexterChem Liquid Solutions Top PYQs JEE Main',
    fullQuery: 'PW Manzil Solutions One Shot JEE Main',
  },
  {
    id: 'c7',
    subject: 'Chemistry',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'c6',
    chain: 'Chemistry 2: Physical Chemistry Numericals (32M)',
    title: 'Electrochemistry',
    boardTwist:
      'Focus on Nernst Equation numericals (E = E° - (0.059/n)logQ), ΔG° = -nFE°, Kohlrausch Law for weak electrolytes, and Faraday Laws of Electrolysis.',
    fastQuery: 'Sakshi Vora Bounceback Electrochemistry JEE Main',
    pyqQuery: 'DexterChem Electrochemistry Top PYQs JEE Main',
    fullQuery: 'PW Manzil Electrochemistry One Shot JEE Main',
  },
  {
    id: 'c8',
    subject: 'Chemistry',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'c5',
    chain: 'Chemistry 2: Physical Chemistry Numericals (32M)',
    title: 'Chemical Kinetics',
    boardTwist:
      '90% of JEE questions test First Order Integrated Rate Law, half-life relation (t99.9% = 10 × t50%), and Arrhenius Equation (log(k2/k1) = Ea/2.303R [1/T1 - 1/T2]).',
    fastQuery: 'Sakshi Vora Bounceback Chemical Kinetics JEE Main',
    pyqQuery: 'DexterChem Chemical Kinetics Top PYQs JEE Main',
    fullQuery: 'PW Manzil Chemical Kinetics One Shot JEE Main',
  },
  {
    id: 'c9',
    subject: 'Chemistry',
    classTag: '11th High-ROI',
    marks: 4,
    prereq: null,
    chain: 'Chemistry 2: Physical Chemistry Numericals (32M)',
    title: 'Atomic Structure & Chemical Thermodynamics',
    boardTwist:
      "Since you did Modern Physics, Atomic Structure is 70% done! Focus on Quantum Numbers (n, l, m, s), radial/angular nodes, Hess's Law, and ΔG = ΔH - TΔS.",
    fastQuery: 'DexterChem Atomic Structure and Thermodynamics JEE Main',
    pyqQuery: 'DexterChem Atomic Structure PYQs JEE Main',
    fullQuery: 'PW Manzil Atomic Structure One Shot JEE Main',
  },
  {
    id: 'c10',
    subject: 'Chemistry',
    classTag: '11th High-ROI',
    marks: 8,
    prereq: 'c2',
    chain: 'Chemistry 3: Organic Chemistry Pipeline (32M - Strict Order)',
    title: 'General Organic Chemistry (GOC) & Isomerism',
    boardTwist:
      'DO NOT TOUCH CLASS 12 ORGANIC BEFORE THIS! Master +I/-I/+M/-M/Hyperconjugation stability of intermediates, Aromaticity (Huckel 4n+2), and Acidic/Basic strength orders.',
    fastQuery: 'Sakshi Vora Bounceback GOC General Organic Chemistry JEE Main',
    pyqQuery: 'DexterChem GOC Top PYQs JEE Main',
    fullQuery: 'PW Manzil GOC One Shot Rohit Agarwal RA Sir',
  },
  {
    id: 'c11',
    subject: 'Chemistry',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'c10',
    chain: 'Chemistry 3: Organic Chemistry Pipeline (32M - Strict Order)',
    title: 'Hydrocarbons + Haloalkanes & Haloarenes',
    boardTwist:
      'PUC asks isolated named reactions. JEE links them into A ➔ B ➔ C roadmaps and tests Markovnikov/Anti-Markovnikov, Ozonolysis, and SN1 vs SN2 reactivity & stereochemistry.',
    fastQuery: 'DexterChem Hydrocarbons Haloalkanes Haloarenes JEE Main revision',
    pyqQuery: 'DexterChem Haloalkanes Hydrocarbons PYQs JEE Main',
    fullQuery: 'PW Manzil Haloalkanes and Haloarenes One Shot RA Sir',
  },
  {
    id: 'c12',
    subject: 'Chemistry',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'c11',
    chain: 'Chemistry 3: Organic Chemistry Pipeline (32M - Strict Order)',
    title: 'Alcohols, Phenols, Ethers, Aldehydes & Ketones',
    boardTwist:
      'Focus on Reimer-Tiemann, Kolbe, Aldol Condensation, Cannizzaro, Tollens/Fehling tests, and Iodoform test. JEE loves testing selective oxidizing/reducing reagents (NaBH4 vs LiAlH4 vs PCC).',
    fastQuery: 'DexterChem Alcohols Phenols Aldehydes Ketones JEE Main revision',
    pyqQuery: 'DexterChem Aldehydes Ketones Alcohols PYQs JEE Main',
    fullQuery: 'PW Manzil Aldehydes Ketones Carboxylic Acids One Shot',
  },
  {
    id: 'c13',
    subject: 'Chemistry',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'c12',
    chain: 'Chemistry 3: Organic Chemistry Pipeline (32M - Strict Order)',
    title: 'Amines & Biomolecules (NCERT Goldmine)',
    boardTwist:
      'Amines: Gabriel Phthalimide, Hoffmann Bromamide, Carbylamine, Hinsberg test, Diazonium coupling. Biomolecules: Memorize NCERT tables on Vitamins, DNA/RNA, Amino Acids, and Glucose reactions!',
    fastQuery: 'Sakshi Vora Bounceback Amines and Biomolecules JEE Main',
    pyqQuery: 'DexterChem Amines Biomolecules PYQs JEE Main',
    fullQuery: 'PW Manzil Amines and Biomolecules One Shot',
  },
  {
    id: 'm1',
    subject: 'Math',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: null,
    chain: 'Math 1: Linear Algebra & 3D Vector Space (20M - #1 Priority)',
    title: 'Matrices & Determinants',
    boardTwist:
      "PUC asks simple 3x3 inverse. JEE asks Cayley-Hamilton theorem for A⁵/A⁻¹, Adjoint properties |adj(adj A)| = |A|^((n-1)²), and Cramer's Rule for No Solution / Infinite Solutions.",
    fastQuery: 'NV Sir Bounceback Matrices and Determinants JEE Main',
    pyqQuery: 'Neha Agrawal Matrices and Determinants Top PYQs JEE Main',
    fullQuery: 'PW Manzil Matrices and Determinants One Shot',
  },
  {
    id: 'm2',
    subject: 'Math',
    classTag: '12th PUC Sync',
    marks: 12,
    prereq: 'm1',
    chain: 'Math 1: Linear Algebra & 3D Vector Space (20M - #1 Priority)',
    title: 'Vectors & 3D Geometry (Highest Weightage in JEE Math)',
    boardTwist:
      'Guaranteed 3-4 questions! Master Dot/Cross/Scalar Triple Product, Shortest Distance between skew lines (formula-based!), Foot of perpendicular / Image of a point in a line.',
    fastQuery: 'NV Sir Bounceback Vectors and 3D Geometry JEE Main',
    pyqQuery: 'Neha Agrawal Vectors and 3D Geometry Top PYQs JEE Main',
    fullQuery: 'PW Manzil Vector and 3D Geometry One Shot',
  },
  {
    id: 'm3',
    subject: 'Math',
    classTag: '11th High-ROI',
    marks: 8,
    prereq: null,
    chain: 'Math 2: High-ROI Algebra & Coordinate Boosters (20M)',
    title: 'Statistics & Binomial Theorem',
    boardTwist:
      'Statistics gives 1 guaranteed question on Variance/Mean (especially corrected observations). Binomial Theorem: focus on General Term Tr+1, term independent of x, and Remainder problems.',
    fastQuery: 'NV Sir Bounceback Statistics and Binomial Theorem JEE Main',
    pyqQuery: 'Neha Agrawal Statistics Binomial Theorem PYQs JEE Main',
    fullQuery: 'PW Manzil Statistics and Binomial Theorem One Shot',
  },
  {
    id: 'm4',
    subject: 'Math',
    classTag: '11th High-ROI',
    marks: 8,
    prereq: null,
    chain: 'Math 2: High-ROI Algebra & Coordinate Boosters (20M)',
    title: 'Sequence & Series + Quadratic Equations',
    boardTwist:
      "Focus on AP/GP properties, AM ≥ GM inequality, Telescoping sums, and Newton's Formula for sum of powers of roots (Sn = α^n + β^n) in Quadratic Equations.",
    fastQuery: 'NV Sir Bounceback Sequence and Series Quadratic JEE Main',
    pyqQuery: 'Neha Agrawal Sequence and Series Quadratic PYQs JEE Main',
    fullQuery: 'PW Manzil Sequence and Series One Shot JEE Main',
  },
  {
    id: 'm5',
    subject: 'Math',
    classTag: '11th High-ROI',
    marks: 4,
    prereq: null,
    chain: 'Math 2: High-ROI Algebra & Coordinate Boosters (20M)',
    title: 'Straight Lines & Circles',
    boardTwist:
      'Focus on Orthocentre/Centroid/Circumcentre properties, image of a point in a line, family of lines (L1 + λL2 = 0), and chord/tangent conditions of a Circle.',
    fastQuery: 'NV Sir Bounceback Straight Lines and Circles JEE Main',
    pyqQuery: 'Neha Agrawal Straight Lines Circles PYQs JEE Main',
    fullQuery: 'PW Manzil Straight Lines and Circles One Shot',
  },
  {
    id: 'm6',
    subject: 'Math',
    classTag: '12th PUC Sync',
    marks: 4,
    prereq: null,
    chain: 'Math 3: Targeted Class 12 Calculus (20M)',
    title: 'Sets, Relations & Functions',
    boardTwist:
      'PUC asks simple equivalence checks. JEE asks counting Equivalence Relations on a set, Domain & Range tricks, Composite functions, and Functional Equations.',
    fastQuery: 'NV Sir Bounceback Relations and Functions JEE Main',
    pyqQuery: 'Neha Agrawal Sets Relations Functions PYQs JEE Main',
    fullQuery: 'PW Manzil Relations and Functions One Shot',
  },
  {
    id: 'm7',
    subject: 'Math',
    classTag: '12th PUC Sync',
    marks: 4,
    prereq: 'm6',
    chain: 'Math 3: Targeted Class 12 Calculus (20M)',
    title: 'Limits, Continuity, Differentiability & AOD',
    boardTwist:
      "Master L'Hospital Rule, 1^∞ standard limits, Taylor series expansions (sin x, cos x, e^x, ln(1+x)), piecewise continuity/differentiability, and Maxima/Minima.",
    fastQuery: 'NV Sir Bounceback Limits Continuity Differentiability JEE Main',
    pyqQuery: 'Neha Agrawal Limits Continuity Differentiability PYQs',
    fullQuery: 'PW Manzil Limits Continuity Differentiability One Shot',
  },
  {
    id: 'm8',
    subject: 'Math',
    classTag: '12th PUC Sync',
    marks: 8,
    prereq: 'm7',
    chain: 'Math 3: Targeted Class 12 Calculus (20M)',
    title: 'Definite Integration (King Rule) & Area Under Curves',
    boardTwist:
      'Skip heavy indefinite integration! 80% of JEE Definite Integration uses King Property ∫f(x)dx = ∫f(a+b-x)dx, periodic properties, or Leibniz Rule. Area Under Curve gives 1 guaranteed parabola+line question.',
    fastQuery: 'NV Sir Bounceback Definite Integration Area Under Curve JEE Main',
    pyqQuery: 'Neha Agrawal Definite Integration Area PYQs JEE Main',
    fullQuery: 'PW Manzil Definite Integration One Shot JEE Main',
  },
  {
    id: 'm9',
    subject: 'Math',
    classTag: '12th PUC Sync',
    marks: 4,
    prereq: 'm8',
    chain: 'Math 3: Targeted Class 12 Calculus (20M)',
    title: 'Differential Equations',
    boardTwist:
      '1 guaranteed question! 90% are Linear Differential Equations (dy/dx + Py = Q with Integrating Factor IF = e^(∫Pdx)) or Homogeneous/Variable Separable forms.',
    fastQuery: 'NV Sir Bounceback Differential Equations JEE Main',
    pyqQuery: 'Neha Agrawal Differential Equations Top PYQs JEE Main',
    fullQuery: 'PW Manzil Differential Equations One Shot JEE Main',
  },
  {
    id: 'p13',
    subject: 'Physics',
    classTag: '11th High-ROI',
    marks: 4,
    prereq: 'p12',
    chain: 'Physics 3: Optics, Thermal & Mechanics Boosters (28M)',
    title: 'Center of Mass, Momentum & Collisions',
    boardTwist:
      'Focus on Center of Mass of cavity/composite bodies, Conservation of Linear Momentum (explosion/recoil), and 1D Elastic vs Inelastic Collisions (coefficient of restitution e).',
    fastQuery: 'Eduniti Center of Mass and Collisions JEE Main revision',
    pyqQuery: 'Eduniti Center of Mass Collisions PYQs JEE Main',
    fullQuery: 'PW Manzil Center of Mass One Shot JEE Main',
  },
];

export const DEFAULT_APP_STATE: MonkAppState = {
  activeChapterId: 'p1',
  dayMode: 'home',
  progress: {},
  commits: [],
  bugs: [
    {
      id: 'seed-bug-1',
      chapterId: 'p1',
      category: '🧩 Twist Misread',
      triggerFix: 'When Stopping Potential V0 is plotted vs 1/λ, slope is hc/e — always convert Å to eV using hc = 12400 eV·Å first.',
      createdAt: '2026-10-27',
      resolved: false,
    },
    {
      id: 'seed-bug-2',
      chapterId: 'c6',
      category: '🧠 Formula Forgotten',
      triggerFix: 'Never apply ΔTb = Kb·m without checking solute dissociation/dimerization: multiply by Van’t Hoff factor i.',
      createdAt: '2026-10-26',
      resolved: false,
    },
  ],
};
