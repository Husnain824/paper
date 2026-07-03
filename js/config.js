/* ═══════════════════════════════════════════════
   IlmAI — config.js
   Worker URL + all static reference data
   ═══════════════════════════════════════════════ */

// ── Cloudflare Worker endpoint (Groq + Gemini) ──
const WORKER_URL = 'https://check-ai.noorhusnain791.workers.dev';

// ── Classes ──
const CLASSES = [
  { id: '9',  nm: 'Class 9',  ds: 'Matric Part I',     ic: '📐', cl: 'c9'  },
  { id: '10', nm: 'Class 10', ds: 'Matric Part II',    ic: '🔬', cl: 'c10' },
  { id: '11', nm: 'Class 11', ds: 'First Year / FSc',  ic: '📚', cl: 'c11' },
  { id: '12', nm: 'Class 12', ds: 'Second Year / FSc', ic: '🎓', cl: 'c12' },
];

// ── Boards ──
const BOARDS = [
  { id:'punjab',nm:'Punjab Board',       short:'BISE-PB', province:'Punjab',              est:'1954',students:'2M+',  fl:'🟧',ic:'🏙️',clr:'#f97316',bg:'rgba(249,115,22,.13)',br:'rgba(249,115,22,.4)'},
  { id:'fbise', nm:'Federal Board',      short:'FBISE',   province:'Islamabad Capital',   est:'1975',students:'600K+',fl:'🇵🇰',ic:'🏛️',clr:'#22c55e',bg:'rgba(34,197,94,.13)', br:'rgba(34,197,94,.4)'},
  { id:'lahore',nm:'Lahore Board',       short:'BISE-LHR',province:'Lahore, Punjab',      est:'1954',students:'1.5M+',fl:'🔵',ic:'🕌',clr:'#3b82f6',bg:'rgba(59,130,246,.13)',br:'rgba(59,130,246,.4)'},
  { id:'rwp',   nm:'Rawalpindi Board',   short:'BISE-RWP',province:'Rawalpindi, Punjab',  est:'1977',students:'800K+',fl:'🟣',ic:'⚔️',clr:'#a855f7',bg:'rgba(168,85,247,.13)',br:'rgba(168,85,247,.4)'},
  { id:'fsd',   nm:'Faisalabad Board',   short:'BISE-FSD',province:'Faisalabad, Punjab',  est:'1977',students:'700K+',fl:'🔴',ic:'🏭',clr:'#ef4444',bg:'rgba(239,68,68,.13)', br:'rgba(239,68,68,.4)'},
  { id:'gujr',  nm:'Gujranwala Board',   short:'BISE-GRW',province:'Gujranwala, Punjab',  est:'1973',students:'900K+',fl:'🟠',ic:'🌾',clr:'#d97706',bg:'rgba(217,119,6,.13)', br:'rgba(217,119,6,.4)'},
  { id:'multan',nm:'Multan Board',       short:'BISE-MTN',province:'Multan, Punjab',      est:'1968',students:'750K+',fl:'🩷',ic:'🌹',clr:'#ec4899',bg:'rgba(236,72,153,.13)',br:'rgba(236,72,153,.4)'},
  { id:'sgd',   nm:'Sargodha Board',     short:'BISE-SGD',province:'Sargodha, Punjab',    est:'1968',students:'500K+',fl:'⚫',ic:'🌻',clr:'#64748b',bg:'rgba(100,116,139,.13)',br:'rgba(100,116,139,.4)'},
  { id:'kpk',   nm:'KPK Board',          short:'BISE-PES',province:'Peshawar, KPK',       est:'1961',students:'900K+',fl:'🟩',ic:'🌲',clr:'#10b981',bg:'rgba(16,185,129,.13)',br:'rgba(16,185,129,.4)'},
  { id:'sindh', nm:'Karachi Board',      short:'BISE-KHI',province:'Karachi, Sindh',      est:'1952',students:'1M+',  fl:'🟡',ic:'⚓',clr:'#eab308',bg:'rgba(234,179,8,.13)', br:'rgba(234,179,8,.4)'},
  { id:'hyd',   nm:'Hyderabad Board',    short:'BISE-HYD',province:'Hyderabad, Sindh',    est:'1975',students:'400K+',fl:'🩵',ic:'🌊',clr:'#06b6d4',bg:'rgba(6,182,212,.13)', br:'rgba(6,182,212,.4)'},
  { id:'baloch',nm:'Balochistan Board',  short:'BISE-BAL',province:'Quetta, Balochistan', est:'1978',students:'300K+',fl:'🟫',ic:'🏜️',clr:'#92400e',bg:'rgba(146,64,14,.13)', br:'rgba(146,64,14,.4)'},
  { id:'ajk',   nm:'AJK Board',          short:'BISE-AJK',province:'Muzaffarabad, AJK',   est:'1973',students:'250K+',fl:'🏔️',ic:'❄️',clr:'#8b5cf6',bg:'rgba(139,92,246,.13)',br:'rgba(139,92,246,.4)'},
  { id:'gb',    nm:'Gilgit-Baltistan Board',short:'BISE-GB',province:'Gilgit-Baltistan',  est:'2009',students:'150K+',fl:'🗻',ic:'🏔️',clr:'#0ea5e9',bg:'rgba(14,165,233,.13)',br:'rgba(14,165,233,.4)'},
];

// ── Groups (Class 9-10) ──
const G910 = [
  { id:'sci',nm:'Science Group', ic:'🔬',subs:['Physics','Chemistry','Biology','Mathematics','Computer Science','English','Urdu','Islamiat','Pak Studies']},
  { id:'art',nm:'Arts Group',    ic:'📜',subs:['English','Urdu','Islamiat','Pak Studies','General Math','General Science','History','Geography','Education']},
  { id:'com',nm:'Computer Group',ic:'💻',subs:['Computer Science','Mathematics','Physics','Chemistry','English','Urdu','Islamiat','Pak Studies']},
];

// ── Groups (Class 11-12) ──
const G1112 = [
  { id:'premed',nm:'Pre-Medical',    ic:'🩺',subs:['Physics','Chemistry','Biology','English','Urdu']},
  { id:'preeng',nm:'Pre-Engineering',ic:'⚙️',subs:['Physics','Chemistry','Mathematics','English','Urdu']},
  { id:'ics',   nm:'ICS',            ic:'💻',subs:['Physics','Mathematics','Computer Science','English','Urdu']},
  { id:'icom',  nm:'ICom',           ic:'📊',subs:['Accounting','Economics','Business Mathematics','English','Urdu']},
  { id:'fa',    nm:'FA (Arts)',      ic:'📖',subs:['Urdu','English','Islamiat','Pak Studies','Education','History']},
];

// ── Subject metadata (icons/colors) ──
const SMETA = {
  'Physics':          { ic:'⚡',clr:'#3b82f6',bg:'rgba(59,130,246,.13)' },
  'Chemistry':        { ic:'🧪',clr:'#10b981',bg:'rgba(16,185,129,.13)' },
  'Biology':          { ic:'🌿',clr:'#22c55e',bg:'rgba(34,197,94,.13)' },
  'Mathematics':      { ic:'📐',clr:'#8b5cf6',bg:'rgba(139,92,246,.13)' },
  'Computer Science': { ic:'💻',clr:'#06b6d4',bg:'rgba(6,182,212,.13)' },
  'English':          { ic:'📖',clr:'#f59e0b',bg:'rgba(245,158,11,.13)' },
  'Urdu':             { ic:'📜',clr:'#ef4444',bg:'rgba(239,68,68,.13)' },
  'Islamiat':         { ic:'☪️',clr:'#10b981',bg:'rgba(16,185,129,.13)' },
  'Pak Studies':      { ic:'🏔️',clr:'#0ea5e9',bg:'rgba(14,165,233,.13)' },
  'General Math':     { ic:'➗',clr:'#8b5cf6',bg:'rgba(139,92,246,.13)' },
  'General Science':  { ic:'🔬',clr:'#14b8a6',bg:'rgba(20,184,166,.13)' },
  'History':          { ic:'🏛️',clr:'#f97316',bg:'rgba(249,115,22,.13)' },
  'Geography':        { ic:'🌍',clr:'#22c55e',bg:'rgba(34,197,94,.13)' },
  'Education':        { ic:'🎓',clr:'#a855f7',bg:'rgba(168,85,247,.13)' },
  'Accounting':       { ic:'📊',clr:'#f59e0b',bg:'rgba(245,158,11,.13)' },
  'Economics':        { ic:'📈',clr:'#06b6d4',bg:'rgba(6,182,212,.13)' },
  'Business Mathematics': { ic:'🔢',clr:'#8b5cf6',bg:'rgba(139,92,246,.13)' },
};

// ── Chapters by Subject-Class ──
const CH = {
  'Physics-9':['Ch 1: Physical Quantities and Measurement','Ch 2: Kinematics','Ch 3: Dynamics','Ch 4: Turning Effect of Forces','Ch 5: Gravitation','Ch 6: Work and Energy','Ch 7: Properties of Matter','Ch 8: Thermal Properties of Matter','Ch 9: Transfer of Heat'],
  'Chemistry-9':['Ch 1: Fundamentals of Chemistry','Ch 2: Structure of Atoms','Ch 3: Periodic Table and Periodicity of Properties','Ch 4: Structure of Molecules','Ch 5: Physical States of Matter','Ch 6: Solutions','Ch 7: Electrochemistry','Ch 8: Chemical Reactivity'],
  'Biology-9':['Ch 1: Introduction to Biology','Ch 2: Solving a Biological Problem','Ch 3: Biodiversity','Ch 4: Cells and Cell Organelles','Ch 5: Cell Cycle','Ch 6: Enzymes','Ch 7: Bioenergetics','Ch 8: Nutrition','Ch 9: Transport'],
  'Mathematics-9':['Ch 1: Matrices and Determinants','Ch 2: Real and Complex Numbers','Ch 3: Logarithms','Ch 4: Algebraic Expressions and Formulas','Ch 5: Factorization','Ch 6: Algebraic Manipulation','Ch 7: Linear Equations and Inequalities','Ch 8: Linear Graphs and Their Application','Ch 9: Introduction to Coordinate Geometry','Ch 10: Congruent Triangles','Ch 11: Parallelograms and Triangles','Ch 12: Line Bisectors and Angle Bisectors','Ch 13: Sides and Angles of a Triangle','Ch 14: Ratio and Proportion','Ch 15: Pythagoras Theorem','Ch 16: Theorems Related with Area'],
  'Computer Science-9':['Ch 1: Introduction to Computer','Ch 2: Information Networks','Ch 3: Operating System','Ch 4: Fundamental of Programming','Ch 5: Algorithms','Ch 6: Flow Charts'],
  'English-9':['Unit 1: Boys Will Be Boys','Unit 2: The Jewel of the World','Unit 3: First Aid','Unit 4: The Gift of the Magi','Unit 5: The Gulistan of Sadi','Unit 6: A Dialogue Between a Teacher and Student','Unit 7: The Rain','Unit 8: Old Gateways of Lahore','Unit 9: Abdul Sattar Edhi','Unit 10: Mustard Fields','Unit 11: My Financial Career','Unit 12: Faith, Unity, Discipline'],
  'Urdu-9':['Sabaq 1: Hamd — Allah ki Shaan','Sabaq 2: Naat — Huzoor ki Shan','Sabaq 3: Nasr — Hamara Pakistan','Sabaq 4: Ghazal — Allama Iqbal','Sabaq 5: Ghazal — Faiz Ahmad Faiz','Sabaq 6: Nazm — Mitti ka Diya','Sabaq 7: Mazmoon — Ilm ki Ahmiyat','Sabaq 8: Kahani — Nek Niyati','Sabaq 9: Afsana','Sabaq 10: Khutoot aur Darkhwast','Sabaq 11: Qawaid aur Insha'],
  'Islamiat-9':['Ch 1: Quran Majeed — Talawat aur Tarjuma','Ch 2: Hadith aur Sunnat','Ch 3: Seerat-un-Nabi (SAW)','Ch 4: Islamic Aqaid','Ch 5: Ibadat — Namaz, Roza, Zakat, Hajj','Ch 6: Islamic Muashrat'],
  'Pak Studies-9':['Ch 1: Land and Geography of Pakistan','Ch 2: Natural Resources of Pakistan','Ch 3: People and Society','Ch 4: History — Advent of Islam','Ch 5: Pakistan Movement','Ch 6: Government of Pakistan','Ch 7: Economy of Pakistan','Ch 8: International Relations'],
  'General Science-9':['Ch 1: Matter and its Properties','Ch 2: Atoms and Molecules','Ch 3: Physical and Chemical Changes','Ch 4: Living World','Ch 5: Human Body Systems','Ch 6: Forces and Motion','Ch 7: Energy and its Forms','Ch 8: Light and Sound','Ch 9: Earth and Universe'],
  'General Math-9':['Ch 1: Number System','Ch 2: Algebra','Ch 3: Matrices','Ch 4: Geometry','Ch 5: Statistics','Ch 6: Mensuration'],
  'History-9':['Ch 1: Ancient Civilizations — Indus Valley','Ch 2: Medieval Period','Ch 3: Mughal Empire','Ch 4: British Rule in Subcontinent','Ch 5: War of Independence 1857','Ch 6: Muslim Revival Movement','Ch 7: Partition and Independence 1947'],
  'Geography-9':['Ch 1: Introduction to Geography','Ch 2: Map Work and Scale','Ch 3: Pakistan — Location and Size','Ch 4: Climate of Pakistan','Ch 5: Natural Regions of Pakistan','Ch 6: Rivers and Water Resources','Ch 7: Agriculture in Pakistan','Ch 8: Industries of Pakistan'],
  'Education-9':['Ch 1: Introduction to Education','Ch 2: Aims and Objectives of Education','Ch 3: Educational Psychology','Ch 4: Child Development','Ch 5: Teaching Methods','Ch 6: Curriculum','Ch 7: Evaluation and Assessment','Ch 8: Educational System of Pakistan'],
  'Physics-10':['Ch 10: Simple Harmonic Motion and Waves','Ch 11: Sound','Ch 12: Geometrical Optics','Ch 13: Electrostatics','Ch 14: Current Electricity','Ch 15: Electromagnetism','Ch 16: Basic Electronics','Ch 17: Information and Communication Technology','Ch 18: Atomic and Nuclear Physics'],
  'Chemistry-10':['Ch 9: Chemical Equilibrium','Ch 10: Acids, Bases and Salts','Ch 11: Organic Chemistry','Ch 12: Hydrocarbons','Ch 13: Alkyl Halides, Alcohols, Aldehydes','Ch 14: Carboxylic Acids','Ch 15: Macromolecules — Polymers and Proteins','Ch 16: The Atmosphere','Ch 17: Water','Ch 18: Chemical Industries in Pakistan'],
  'Biology-10':['Ch 10: Gaseous Exchange','Ch 11: Homeostasis','Ch 12: Coordination and Control','Ch 13: Support and Movement','Ch 14: Reproduction','Ch 15: Man and His Environment','Ch 16: Pharmacology','Ch 17: Biotechnology'],
  'Mathematics-10':['Ch 1: Quadratic Equations','Ch 2: Theory of Quadratic Equations','Ch 3: Variations','Ch 4: Partial Fractions','Ch 5: Sets and Functions','Ch 6: Basic Statistics','Ch 7: Introduction to Trigonometry','Ch 8: Projection of a Side of a Triangle','Ch 9: Chords of a Circle','Ch 10: Tangent to a Circle','Ch 11: Chords and Arcs','Ch 12: Angle in a Segment of a Circle','Ch 13: Practical Geometry'],
  'Computer Science-10':['Ch 1: Introduction to Database','Ch 2: Microsoft Access','Ch 3: Information Networks','Ch 4: Internet and Email','Ch 5: Microsoft Excel','Ch 6: Introduction to Programming','Ch 7: Microsoft Word — Advanced'],
  'English-10':['Unit 1: Television','Unit 2: The Explorer','Unit 3: Stock Exchange','Unit 4: My Tailor','Unit 5: Why Boys Fail in College','Unit 6: The Devoted Friend','Unit 7: Clearing in the Sky','Unit 8: I Have a Dream','Unit 9: Media and Its Impact','Unit 10: Population Growth','Unit 11: Village Cricket Match','Unit 12: Why Nations Fail'],
  'Urdu-10':['Sabaq 1: Hamd','Sabaq 2: Naat','Sabaq 3: Nasr — Urdu Meri Pehchan','Sabaq 4: Ghazal — Mir Taqi Mir','Sabaq 5: Ghazal — Ghalib','Sabaq 6: Nazm — Watan ki Mohabbat','Sabaq 7: Mazmoon — Science ki Taraqqi','Sabaq 8: Kahani — Imandari','Sabaq 9: Afsana — Dramati Kahani','Sabaq 10: Khutoot — Formal Letters','Sabaq 11: Qawaid — Grammar'],
  'Islamiat-10':['Ch 1: Quran Majeed — Selected Surahs','Ch 2: Ahadith — Selected Narrations','Ch 3: Seerat Sahaba Ikram (RA)','Ch 4: Islamic Aqaid aur Usool','Ch 5: Ibadat aur Muamlat','Ch 6: Islam aur Jadid Duniya'],
  'Pak Studies-10':['Ch 1: Constitutional Development in Pakistan','Ch 2: Judiciary System in Pakistan','Ch 3: Culture and Heritage of Pakistan','Ch 4: Economic System of Pakistan','Ch 5: Agriculture in Pakistan','Ch 6: Industry in Pakistan','Ch 7: Communication and Transport','Ch 8: Foreign Policy of Pakistan'],
  'General Science-10':['Ch 1: Coordination and Homeostasis','Ch 2: Reproduction in Living Things','Ch 3: Heredity and Evolution','Ch 4: Environment','Ch 5: Chemical Bonding','Ch 6: Biochemistry','Ch 7: Electricity and Magnetism','Ch 8: Electronics and Communication','Ch 9: Nuclear Energy'],
  'General Math-10':['Ch 1: Quadratic Equations','Ch 2: Simultaneous Equations','Ch 3: Trigonometry Basics','Ch 4: Circles and Theorems','Ch 5: Statistics and Probability','Ch 6: Financial Mathematics'],
  'History-10':['Ch 1: Pakistan Movement — Early Phase','Ch 2: Pakistan Resolution 1940','Ch 3: Creation of Pakistan 1947','Ch 4: Early Constitutional Problems','Ch 5: Ayub Khan Era','Ch 6: East Pakistan Separation 1971','Ch 7: Bhutto and Zia Era','Ch 8: Pakistan in the Modern World'],
  'Geography-10':['Ch 1: Population of Pakistan','Ch 2: Human Development Index','Ch 3: Urbanization in Pakistan','Ch 4: Transport and Communication','Ch 5: Trade and Commerce','Ch 6: Environmental Issues in Pakistan','Ch 7: Relationship with Neighboring Countries'],
  'Education-10':['Ch 1: Educational Technology','Ch 2: Guidance and Counseling','Ch 3: Special Education','Ch 4: Educational Administration','Ch 5: Islamic Education System','Ch 6: Comparative Education','Ch 7: Research in Education','Ch 8: Non-Formal Education'],
  'Physics-11':['Ch 1: Measurements','Ch 2: Vectors and Equilibrium','Ch 3: Motion and Force','Ch 4: Work and Energy','Ch 5: Circular Motion','Ch 6: Fluid Dynamics','Ch 7: Oscillations','Ch 8: Waves','Ch 9: Physical Optics','Ch 10: Thermodynamics','Ch 11: Electrostatics'],
  'Chemistry-11':['Ch 1: Basic Concepts of Chemistry','Ch 2: Experimental Techniques in Chemistry','Ch 3: Gases','Ch 4: Liquids and Solids','Ch 5: Atomic Structure','Ch 6: Chemical Bonding','Ch 7: Thermochemistry','Ch 8: Chemical Equilibrium','Ch 9: Solutions','Ch 10: Electrochemistry','Ch 11: Reaction Kinetics'],
  'Biology-11':['Ch 1: Cell Structure and Function','Ch 2: Biological Molecules','Ch 3: Enzymes','Ch 4: The Cell — Advanced','Ch 5: Variety of Life','Ch 6: Kingdom Prokaryotae (Monera)','Ch 7: Kingdom Protoctista','Ch 8: Kingdom Fungi','Ch 9: Kingdom Plantae','Ch 10: Kingdom Animalia','Ch 11: Bioenergetics','Ch 12: Nutrition'],
  'Mathematics-11':['Ch 1: Number Systems','Ch 2: Sets, Functions and Groups','Ch 3: Matrices and Determinants','Ch 4: Quadratic Equations','Ch 5: Partial Fractions','Ch 6: Sequences and Series','Ch 7: Permutations, Combinations and Probability','Ch 8: Mathematical Induction and Binomial Theorem'],
  'Computer Science-11':['Ch 1: Introduction to Computer Science','Ch 2: Computer Architecture','Ch 3: Operating Systems','Ch 4: Number Systems and Boolean Algebra','Ch 5: Problem Solving and Programming Concepts','Ch 6: Introduction to OOP','Ch 7: Algorithms and Flowcharts','Ch 8: Database Design — Introduction'],
  'English-11':['Unit 1: Prose — The Dying Sun','Unit 2: Prose — Using the Scientific Method','Unit 3: Prose — Why Boys Fail in College','Unit 4: Prose — On Destroying Books','Unit 5: Prose — The Man Who Was a Hospital','Unit 6: Poetry — The Daffodils','Unit 7: Poetry — The Feed','Unit 8: Poetry — In the Street of the Fruit Stalls','Unit 9: Novel — David Copperfield (Excerpts)','Unit 10: Grammar and Composition'],
  'Urdu-11':['Sabaq 1: Nasr — Afsana aur Mazmoon','Sabaq 2: Hamd o Naat','Sabaq 3: Ghazal — Classical Urdu Poetry','Sabaq 4: Nazm — Modern Urdu Poetry','Sabaq 5: Dastan Excerpts','Sabaq 6: Drama aur Khaka','Sabaq 7: Sahafati Urdu','Sabaq 8: Qawaid — Advanced Grammar'],
  'Accounting-11':['Ch 1: Introduction to Accounting','Ch 2: Accounting Equation and Concepts','Ch 3: Double Entry System','Ch 4: Books of Original Entry — Journal','Ch 5: Ledger','Ch 6: Cash Book and Petty Cash','Ch 7: Bank Reconciliation Statement','Ch 8: Bills of Exchange','Ch 9: Depreciation Methods','Ch 10: Trial Balance','Ch 11: Final Accounts — Sole Trader'],
  'Economics-11':['Ch 1: Introduction to Economics','Ch 2: Theory of Demand','Ch 3: Theory of Supply','Ch 4: Market Equilibrium','Ch 5: Elasticity of Demand and Supply','Ch 6: Consumer Theory — Utility','Ch 7: Production Theory','Ch 8: Cost Analysis','Ch 9: Market Structure — Perfect Competition','Ch 10: Monopoly and Oligopoly','Ch 11: National Income'],
  'Business Mathematics-11':['Ch 1: Arithmetic and Commercial Mathematics','Ch 2: Matrices and Determinants','Ch 3: Logarithms','Ch 4: Sequences and Series — Financial Use','Ch 5: Linear Programming','Ch 6: Statistics and Data Presentation','Ch 7: Index Numbers'],
  'Islamiat-11':['Ch 1: Quran Majeed — Advanced Tafseer','Ch 2: Hadith — Sahi Bukhari Excerpts','Ch 3: Aqeedah — Islamic Beliefs','Ch 4: Seerat — Prophet in Mecca','Ch 5: Seerat — Prophet in Medina','Ch 6: Khulafae Rashideen','Ch 7: Islamic Law — Fiqh Basics','Ch 8: Islam aur Muashrat'],
  'Pak Studies-11':['Ch 1: Ideology of Pakistan','Ch 2: Historical Background','Ch 3: Constitutional History','Ch 4: Political System','Ch 5: Economic Development','Ch 6: Social Development','Ch 7: Foreign Policy','Ch 8: National Security'],
  'Physics-12':['Ch 12: Electrostatics','Ch 13: Current Electricity','Ch 14: Electromagnetism','Ch 15: Electromagnetic Induction','Ch 16: Alternating Current','Ch 17: Physics of Solids','Ch 18: Electronics','Ch 19: Dawn of Modern Physics','Ch 20: Atomic Spectra','Ch 21: Nuclear Physics'],
  'Chemistry-12':['Ch 1: Periodic Classification of Elements','Ch 2: s-Block Elements','Ch 3: p-Block Elements','Ch 4: Carbon and Silicon','Ch 5: Transition Elements — d and f Block','Ch 6: Fundamental Principles of Organic Chemistry','Ch 7: Hydrocarbons','Ch 8: Alkyl Halides','Ch 9: Alcohols, Phenols and Ethers','Ch 10: Aldehydes and Ketones','Ch 11: Carboxylic Acids','Ch 12: Macromolecules — Polymers and Proteins','Ch 13: Common Chemical Industries in Pakistan','Ch 14: Environmental Chemistry'],
  'Biology-12':['Ch 13: Homeostasis','Ch 14: Support and Movement','Ch 15: Coordination and Control — Nervous System','Ch 16: Coordination — Hormones and Endocrine','Ch 17: Reproduction','Ch 18: Development and Growth','Ch 19: Inheritance — Mendelian Genetics','Ch 20: Variation and Genetics','Ch 21: Evolution','Ch 22: Man and His Environment','Ch 23: Man and His Health','Ch 24: Pharmacology and Addiction','Ch 25: Gene Therapy and Biotechnology'],
  'Mathematics-12':['Ch 1: Functions and Limits','Ch 2: Differentiation','Ch 3: Integration','Ch 4: Introduction to Analytic Geometry','Ch 5: Linear Inequalities and Linear Programming','Ch 6: Conic Sections','Ch 7: Vectors'],
  'Computer Science-12':['Ch 1: Object Oriented Programming — Advanced','Ch 2: GUI Programming','Ch 3: Arrays and Collections','Ch 4: File Handling','Ch 5: Database — SQL Basics','Ch 6: Internet and Web Technologies','Ch 7: Software Development Process','Ch 8: Computational Thinking'],
  'English-12':['Unit 1: Prose — Button Button','Unit 2: Prose — The Piece of String','Unit 3: Prose — God Be Thanked','Unit 4: Prose — China Way','Unit 5: Prose — Thank You Ma am','Unit 6: Poetry — Night Mail','Unit 7: Poetry — Time','Unit 8: Poetry — If','Unit 9: Novel — Old Man and the Sea (Excerpts)','Unit 10: Report and Essay Writing'],
  'Urdu-12':['Sabaq 1: Nasr — Classic Urdu Afsana','Sabaq 2: Hamd aur Naat — Advanced','Sabaq 3: Ghazal — Urdu Ghazal ki Riwayat','Sabaq 4: Nazm — Jadid Urdu Shayari','Sabaq 5: Novel aur Dastan Excerpts','Sabaq 6: Khaka Nigari aur Inshaye','Sabaq 7: Murasila Nigari — Letter Writing','Sabaq 8: Qawaid — Mushkil Alfaz'],
  'Accounting-12':['Ch 1: Partnership Accounts — Formation','Ch 2: Partnership — Admission and Retirement','Ch 3: Company Accounts — Share Capital','Ch 4: Company Accounts — Debentures','Ch 5: Analysis of Financial Statements','Ch 6: Cost Accounting — Basics','Ch 7: Budgeting and Budgetary Control','Ch 8: Government Accounting','Ch 9: Non-Profit Organizations Accounts'],
  'Economics-12':['Ch 1: Factor Markets — Land, Labour, Capital','Ch 2: Distribution of Income','Ch 3: Monetary Economics — Money and Banking','Ch 4: Banking System in Pakistan','Ch 5: Fiscal Policy — Government Budget','Ch 6: International Trade','Ch 7: Economic Development and Planning','Ch 8: Economic System of Islam','Ch 9: Pakistan Economy — Current Issues'],
  'Business Mathematics-12':['Ch 1: Insurance Mathematics','Ch 2: Interest and Annuity','Ch 3: Financial Mathematics — Investments','Ch 4: Index Numbers — Advanced','Ch 5: Regression and Correlation','Ch 6: Theory of Games','Ch 7: Network Analysis (PERT/CPM)'],
  'Islamiat-12':['Ch 1: Quran Majeed — Tafseer aur Tafheem','Ch 2: Hadith — Principles and Compilation','Ch 3: Seerat — Ghazwat aur Sariyyat','Ch 4: Khulafae Rashideen — Detailed','Ch 5: Islamic Civilization','Ch 6: Islamic Political System','Ch 7: Islamic Economic System','Ch 8: Islam aur Jadid Challenges'],
  'Pak Studies-12':['Ch 1: Land Reforms and Agriculture Policy','Ch 2: Industrial Policy of Pakistan','Ch 3: Education Policy','Ch 4: Health and Population Policy','Ch 5: Energy and Natural Resources','Ch 6: Defence Policy of Pakistan','Ch 7: Relations with Muslim World','Ch 8: Pakistan and Global Challenges'],
};

// ── Study Modes ──
const MODES = [
  { id:'mcq',    em:'🎯', nm:'MCQ Practice',    bx:'Most Popular',   mc:'rgba(0,212,170,.18)' },
  { id:'short',  em:'✍️', nm:'Short Questions', bx:'AI Checked',     mc:'rgba(139,92,246,.18)' },
  { id:'long',   em:'📝', nm:'Long Questions',  bx:'Board Pattern',  mc:'rgba(245,200,66,.14)' },
  { id:'summary',em:'🧠', nm:'AI Summary',      bx:'Smart Revision', mc:'rgba(236,72,153,.14)' },
  { id:'guess',  em:'🎰', nm:'AI Guess Paper',  bx:'Exam Prep',      mc:'rgba(59,130,246,.14)' },
  { id:'test',   em:'📋', nm:'Full Test',       bx:'Board Paper',    mc:'rgba(239,68,68,.16)' },
  { id:'scan',   em:'📷', nm:'Image Scanner',   bx:'OCR + AI',       mc:'rgba(0,212,170,.14)' },
  { id:'notes',  em:'📚', nm:'Notes & Books',   bx:'Free PDF',       mc:'rgba(0,212,170,.12)' },
  { id:'papers', em:'📄', nm:'Past Papers',     bx:'Board Exam',     mc:'rgba(239,68,68,.12)' },
];

// ── Board paper patterns per class (used by Full Test) ──
const BOARD_PATTERNS = {
  '9':  { mcq:15, short:6, long:3, totalMarks:75,  time:180 },
  '10': { mcq:15, short:6, long:3, totalMarks:75,  time:180 },
  '11': { mcq:20, short:8, long:4, totalMarks:100, time:195 },
  '12': { mcq:20, short:8, long:4, totalMarks:100, time:195 },
};
