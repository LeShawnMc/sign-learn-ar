import type { Lesson, Sign } from '../types';

const HS = (p: string) => `https://www.handspeak.com/word/${p}`;

function s(
  id: string, word: string, desc: string,
  cat: string, diff: Sign['difficulty'], vid?: string,
): Sign {
  return { id, word, description: desc, category: cat, difficulty: diff, videoUrl: vid };
}

function lesson(
  id: string, title: string, description: string,
  signs: Sign[], duration: string, difficulty: Lesson['difficulty'],
  isPremium = false,
): Lesson {
  return { id, title, description, signs, progress: 0, duration, difficulty, isPremium };
}

// ── Alphabet ──────────────────────────────────────────────────────────────────
const A = s('alp-a','A','Closed fist with thumb resting on the side of your bent index finger.','Alphabet','beginner');
const B = s('alp-b','B','Four fingers straight up and together, thumb tucked flat across your palm.','Alphabet','beginner');
const C = s('alp-c','C','Curve all fingers and thumb to form the shape of the letter C.','Alphabet','beginner');
const D = s('alp-d','D','Index finger points up, other fingers curve to touch thumb, forming a circle.','Alphabet','beginner');
const E = s('alp-e','E','All fingers bent at the knuckles, thumb tucked underneath.','Alphabet','beginner');
const F = s('alp-f','F','Index and thumb touch to form a circle; other three fingers extend up.','Alphabet','beginner');
const G = s('alp-g','G','Index finger and thumb point sideways horizontally (like pointing right).','Alphabet','beginner');
const H = s('alp-h','H','Index and middle fingers point sideways together horizontally.','Alphabet','beginner');
const I = s('alp-i','I','Only the pinky finger is raised; all other fingers curl into the palm.','Alphabet','beginner');
const J = s('alp-j','J','Raise your pinky and trace a J shape downward and curving left in the air.','Alphabet','beginner');
const K = s('alp-k','K','Index finger points up, middle finger angles out, thumb is placed between them.','Alphabet','beginner');
const L = s('alp-l','L','Index finger points up while thumb extends out, forming an L shape.','Alphabet','beginner');
const M = s('alp-m','M','Three fingers (index, middle, ring) fold over the tucked thumb; pinky curled.','Alphabet','beginner');
const N = s('alp-n','N','Two fingers (index, middle) fold over the tucked thumb.','Alphabet','beginner');
const O = s('alp-o','O','All fingers and thumb curve together to form an O shape.','Alphabet','beginner');
const P = s('alp-p','P','Like K rotated downward — index points down, middle angles out, thumb between.','Alphabet','beginner');
const Q = s('alp-q','Q','Like G rotated downward — index and thumb point toward the floor.','Alphabet','beginner');
const R = s('alp-r','R','Cross your index finger over your middle finger.','Alphabet','beginner');
const SS = s('alp-s','S','Fist with thumb wrapped over the front of all curled fingers.','Alphabet','beginner');
const T = s('alp-t','T','Thumb tucked between index and middle fingers in a fist.','Alphabet','beginner');
const U = s('alp-u','U','Index and middle fingers held straight up and pressed together.','Alphabet','beginner');
const V = s('alp-v','V','Index and middle fingers spread apart — a peace or victory sign.','Alphabet','beginner');
const W = s('alp-w','W','Index, middle, and ring fingers spread apart to form a W.','Alphabet','beginner');
const X = s('alp-x','X','Index finger bent into a hook shape; other fingers curled.','Alphabet','beginner');
const Y = s('alp-y','Y','Thumb and pinky extend out, middle three fingers curled — "hang loose" sign.','Alphabet','beginner');
const Z = s('alp-z','Z','Index finger extended; trace a Z shape in the air.','Alphabet','beginner');

// ── Numbers ───────────────────────────────────────────────────────────────────
const NUM1  = s('num-1', '1',  'Index finger extended upward; all other fingers curled into palm.','Numbers','beginner');
const NUM2  = s('num-2', '2',  'Index and middle fingers extended and slightly spread (like a peace sign).','Numbers','beginner');
const NUM3  = s('num-3', '3',  'Thumb, index, and middle fingers extended; ring and pinky curled.','Numbers','beginner');
const NUM4  = s('num-4', '4',  'All four fingers extended upward and spread; thumb curled into palm.','Numbers','beginner');
const NUM5  = s('num-5', '5',  'Open hand with all five fingers spread wide apart.','Numbers','beginner');
const NUM6  = s('num-6', '6',  'Touch pinky tip to thumb tip while holding the other three fingers up.','Numbers','beginner');
const NUM7  = s('num-7', '7',  'Touch ring-finger tip to thumb tip while holding other fingers up.','Numbers','beginner');
const NUM8  = s('num-8', '8',  'Touch middle-finger tip to thumb tip while holding other fingers up.','Numbers','beginner');
const NUM9  = s('num-9', '9',  'Touch index-finger tip to thumb tip, forming a small circle.','Numbers','beginner');
const NUM10 = s('num-10','10', 'Make an A-fist and shake or wiggle your thumb side to side.','Numbers','beginner');
const NUM11 = s('num-11','11', 'Bent index finger flicks upward twice from a starting position.','Numbers','beginner');
const NUM12 = s('num-12','12', 'Bent index and middle fingers both flick upward twice.','Numbers','beginner');
const NUM20 = s('num-20','20', 'L-hand (index and thumb out), snap index finger down to touch thumb twice.','Numbers','intermediate');
const NUM50 = s('num-50','50', 'Form 5 (open hand) then move to 0 (O shape) — five-zero.','Numbers','intermediate');
const NUM100= s('num-100','100','Sign 1 (index up) then form a C shape — one hundred.','Numbers','intermediate');

// ── Greetings ─────────────────────────────────────────────────────────────────
const HELLO      = s('gr-hello',    'Hello',          'Open hand at forehead, palm out, move forward in a gentle salute-like wave.','Greetings','beginner',HS('h/hel/hello.mp4'));
const GOODBYE    = s('gr-goodbye',  'Goodbye',        'Open hand facing person, fold fingers down and up repeatedly in a wave.','Greetings','beginner',HS('g/goo/goodbye.mp4'));
const PLEASE     = s('gr-please',   'Please',         'Open hand flat on chest, move it in a slow clockwise circle.','Greetings','beginner',HS('p/ple/please.mp4'));
const THANKYOU   = s('gr-thankyou', 'Thank You',      'Fingertips touch chin, then hand moves forward and downward — like blowing appreciation.','Greetings','beginner',HS('t/tha/thank-you.mp4'));
const SORRY      = s('gr-sorry',    'Sorry',          'A-fist rubs in a slow circle on the center of your chest.','Greetings','beginner',HS('s/sor/sorry.mp4'));
const WELCOME    = s('gr-welcome',  "You're Welcome", 'Open hand near chin, sweep it outward and slightly down with palm facing up.','Greetings','beginner');
const NICETOMEET = s('gr-nice',     'Nice to Meet You','Sign NICE (flat hand slides across other open palm) then point between you and the other person.','Greetings','beginner');
const GOODMORNING= s('gr-morning',  'Good Morning',   'Sign GOOD (hand from chin moves forward), then forearm rises upward like the rising sun.','Greetings','beginner',HS('m/mor/morning.mp4'));
const GOODNIGHT  = s('gr-night',    'Good Night',     'Sign GOOD, then bent wrist arcs over the other forearm — the sun going down.','Greetings','beginner',HS('n/nig/night.mp4'));
const HOWAREYOU  = s('gr-how',      'How Are You?',   'Sign HOW (knuckles together, rotate both hands forward) then point to the person.','Greetings','beginner');
const WHATSNAME  = s('gr-wname',    "What's Your Name?",'Sign WHAT (wiggle fingers with palms up), YOUR (palm push toward person), NAME (H-fingers tap on other H-fingers).','Greetings','beginner');
const MYNAMEIS   = s('gr-myname',   'My Name Is',     'Palm to chest (MY), then H-fingers tap (NAME), then point to yourself.','Greetings','beginner',HS('n/nam/name.mp4'));

// ── Colors ────────────────────────────────────────────────────────────────────
const RED    = s('col-red',   'Red',    'Index finger touches lips and moves slightly downward — the color of lips.','Colors','beginner',HS('r/red/red.mp4'));
const BLUE   = s('col-blue',  'Blue',   'B-hand (four fingers together upright) shakes slightly side to side at the wrist.','Colors','beginner',HS('b/blu/blue.mp4'));
const GREEN  = s('col-green', 'Green',  'G-hand (pinched index and thumb) shakes loosely at the wrist.','Colors','beginner',HS('g/gre/green.mp4'));
const YELLOW = s('col-yellow','Yellow', 'Y-hand (thumb and pinky extended) shakes side to side at the wrist.','Colors','beginner',HS('y/yel/yellow.mp4'));
const WHITE  = s('col-white', 'White',  '5-hand on chest, pull fingers inward and away as if pulling fluff off a white shirt.','Colors','beginner',HS('w/whi/white.mp4'));
const BLACK  = s('col-black', 'Black',  'Index finger slides across the forehead from one side to the other.','Colors','beginner',HS('b/bla/black.mp4'));
const PURPLE = s('col-purple','Purple', 'P-hand (fingers hooked downward) shakes loosely side to side.','Colors','beginner',HS('p/pur/purple.mp4'));
const ORANGE = s('col-orange','Orange', 'S-hand near chin; open and close fingers repeatedly like squeezing an orange.','Colors','beginner',HS('o/ora/orange.mp4'));

// ── Food & Dining ─────────────────────────────────────────────────────────────
const WATER      = s('fd-water',  'Water',      'W-handshape (3 fingers up) taps against chin twice.','Food','beginner',HS('w/wat/water.mp4'));
const FOOD       = s('fd-food',   'Food',        'Flat-O hand (fingertips pinched) brought to mouth twice.','Food','beginner',HS('f/foo/food.mp4'));
const EAT        = s('fd-eat',    'Eat',         'Flat-O hand (fingertips pinched) brought to mouth once.','Food','beginner',HS('e/eat/eat.mp4'));
const DRINK      = s('fd-drink',  'Drink',       'C-hand (curved like holding a cup) tilts toward mouth as if drinking.','Food','beginner',HS('d/dri/drink.mp4'));
const COFFEE     = s('fd-coffee', 'Coffee',      'Stack two S-fists; grind the top fist in circles like a hand coffee grinder.','Food','beginner',HS('c/cof/coffee.mp4'));
const TEA        = s('fd-tea',    'Tea',         'G-hand (pinched index and thumb) dips into an O-hand "cup" — like dipping a tea bag.','Food','beginner',HS('t/tea/tea.mp4'));
const BREAKFAST  = s('fd-bkfast', 'Breakfast',   'Sign EAT then MORNING — the meal of the morning.','Food','beginner',HS('b/bre/breakfast.mp4'));
const LUNCH      = s('fd-lunch',  'Lunch',       'L-hand near elbow, rotate forearm using elbow as a pivot.','Food','beginner',HS('l/lun/lunch.mp4'));
const DINNER     = s('fd-dinner', 'Dinner',      'D-hand near elbow similar to LUNCH; also sign EAT to clarify.','Food','intermediate',HS('d/din/dinner.mp4'));
const RESTAURANT = s('fd-rest',   'Restaurant',  'R-hand slides from one side of the chin to the other.','Food','intermediate',HS('r/res/restaurant.mp4'));
const HUNGRY     = s('fd-hungry', 'Hungry',      'C-hand on upper chest moves downward once — feeling emptiness inside.','Food','beginner',HS('h/hun/hungry.mp4'));
const THIRSTY    = s('fd-thrsty', 'Thirsty',     'Index finger traces down the throat from chin to chest.','Food','beginner',HS('t/thi/thirsty.mp4'));
const MENU       = s('fd-menu',   'Menu',        'M-hand on flat palm slides down like turning the pages of a menu.','Food','intermediate');
const DELICIOUS  = s('fd-yummy',  'Delicious',   'Middle finger touches lips then twists forward off the lips with a pleased expression.','Food','beginner',HS('d/del/delicious.mp4'));
const COOK       = s('fd-cook',   'Cook',        'Flat hand flips over on top of the other flat palm — like flipping a pancake.','Food','intermediate',HS('c/coo/cook.mp4'));

// ── Travel ────────────────────────────────────────────────────────────────────
const AIRPORT     = s('tr-airport', 'Airport',     'ILY-hand (index, pinky, thumb extended) swoops forward and upward — like a plane taking off.','Travel','intermediate',HS('a/air/airport.mp4'));
const HOTEL       = s('tr-hotel',   'Hotel',       'H-fingers rest on top of the other hand\'s index finger and pivot slightly.','Travel','intermediate',HS('h/hot/hotel.mp4'));
const FLIGHT      = s('tr-flight',  'Flight',      'Y-hand (shaped like a plane with wings) swoops forward smoothly through the air.','Travel','intermediate',HS('f/fli/fly.mp4'));
const TICKET      = s('tr-ticket',  'Ticket',      'Bent V-fingers press into the edge of the other open palm like punching a ticket.','Travel','intermediate',HS('t/tic/ticket.mp4'));
const PASSPORT    = s('tr-passport','Passport',    'P-hand swings open on the other flat palm — like opening a passport booklet.','Travel','intermediate');
const LUGGAGE     = s('tr-luggage', 'Luggage',     'S-fist moves straight downward — the weight of carrying heavy luggage.','Travel','intermediate',HS('l/lug/luggage.mp4'));
const TAXI        = s('tr-taxi',    'Taxi',         'T-hand taps on flat palm once or twice.','Travel','intermediate',HS('t/tax/taxi.mp4'));
const TRAIN       = s('tr-train',   'Train',        'H-fingers slide back and forth on top of other H-fingers — wheels on tracks.','Travel','beginner',HS('t/tra/train.mp4'));
const BUS         = s('tr-bus',     'Bus',           'B-hands pull apart and move slightly forward — like a long bus driving away.','Travel','beginner',HS('b/bus/bus.mp4'));
const LEFT        = s('tr-left',    'Left',          'L-hand moves to the left.','Travel','beginner',HS('l/lef/left.mp4'));
const RIGHT       = s('tr-right',   'Right',         'R-hand moves to the right.','Travel','beginner',HS('r/rig/right.mp4'));
const STRAIGHT    = s('tr-straight','Straight',     'Flat hand pushes directly forward from in front of the chest.','Travel','beginner',HS('s/str/straight.mp4'));
const STOP        = s('tr-stop',    'Stop',          'Flat hand chops sharply into the other flat open palm — like a stop sign.','Travel','beginner',HS('s/sto/stop.mp4'));
const RESERVATION = s('tr-reserv', 'Reservation',  'V-hand curves over the other flat palm then presses down — reserving a spot.','Travel','intermediate');
const MUSEUM      = s('tr-museum',  'Museum',        'M-hands frame the sides of a rectangular space — like walls of a museum.','Travel','intermediate');
const TOUR        = s('tr-tour',    'Tour',          'T-hand moves in a wide horizontal circle — going around on a guided tour.','Travel','intermediate');
const SIGHTSEEING = s('tr-sight',   'Sightseeing',  'V-hand (like eyes) near face, sweep outward — seeing all the sights.','Travel','intermediate');

// ── Medical ───────────────────────────────────────────────────────────────────
const DOCTOR      = s('med-doc',    'Doctor',      'D-hand taps fingertips on the inside of the opposite wrist — like taking a pulse.','Medical','beginner',HS('d/doc/doctor.mp4'));
const HOSPITAL    = s('med-hosp',   'Hospital',    'H-fingers draw a small cross on the upper arm.','Medical','beginner',HS('h/hos/hospital.mp4'));
const HELP        = s('med-help',   'Help',         'Flat palm lifts a closed fist from below — one hand supporting and lifting the other.','Medical','beginner',HS('h/hel/help.mp4'));
const PAIN        = s('med-pain',   'Pain',         'Index fingers point toward each other and twist in opposite directions near the area of pain.','Medical','beginner',HS('p/pai/pain.mp4'));
const MEDICINE    = s('med-meds',   'Medicine',    'Middle finger circles in the center of the other open palm.','Medical','intermediate',HS('m/med/medicine.mp4'));
const EMERGENCY   = s('med-emrg',   'Emergency',   'E-hand shakes urgently back and forth — communicating urgency and crisis.','Medical','intermediate',HS('e/eme/emergency.mp4'));
const SICK        = s('med-sick',   'Sick',         'Middle finger touches forehead while the other middle finger touches the stomach — feeling ill throughout.','Medical','beginner',HS('s/sic/sick.mp4'));
const HURT        = s('med-hurt',   'Hurt',         'Index fingers point toward each other and twist — same motion as PAIN near the injured area.','Medical','beginner',HS('h/hur/hurt.mp4'));
const HEADACHE    = s('med-head',   'Headache',    'Index fingers circle near both temples simultaneously.','Medical','intermediate');
const STOMACH     = s('med-stom',   'Stomach',     'Flat hand placed on the stomach area — indicating the location of discomfort.','Medical','beginner',HS('s/sto/stomach.mp4'));
const HEART       = s('med-heart',  'Heart',        'Middle finger taps on the left side of the chest at the heart\'s location twice.','Medical','beginner',HS('h/hea/heart.mp4'));
const ALLERGY     = s('med-allg',   'Allergy',     'Index finger touches the nose then pulls away sharply — a reaction sign.','Medical','intermediate');
const NURSE       = s('med-nurse',  'Nurse',        'N-fingers tap on the inside of the opposite wrist — similar to DOCTOR.','Medical','beginner',HS('n/nur/nurse.mp4'));
const AMBULANCE   = s('med-amb',    'Ambulance',   'A-hand rotates in a circle on top of the other fist — like emergency lights spinning.','Medical','intermediate',HS('a/amb/ambulance.mp4'));
const SURGERY     = s('med-surg',   'Surgery',     'Thumb of A-hand slides down the center of the other open palm — like making an incision.','Medical','advanced');
const PRESCRIPTION= s('med-rx',     'Prescription','P-hand writes across the other open palm — like a doctor writing a prescription.','Medical','advanced');
const APPOINTMENT = s('med-appt',   'Appointment', 'A-hand circles above the wrist of the other hand — a scheduled time.','Medical','intermediate',HS('a/app/appointment.mp4'));
const FEVER       = s('med-fever',  'Fever',        'Index finger presses on forehead, then pulls away slowly — feeling the heat of a fever.','Medical','intermediate',HS('f/fev/fever.mp4'));
const BLOOD       = s('med-blood',  'Blood',        'Index finger touches the inside wrist then "drips" downward with wiggling fingers.','Medical','intermediate',HS('b/blo/blood.mp4'));
const DIAGNOSIS   = s('med-diag',   'Diagnosis',   'D-hand moves down the other palm — like a doctor writing a diagnosis note.','Medical','advanced');

// ── Business ──────────────────────────────────────────────────────────────────
const WORK        = s('biz-work',   'Work',         'S-fists: dominant hand taps its wrist on top of the other S-fist wrist.','Business','beginner',HS('w/wor/work.mp4'));
const MEETING     = s('biz-meet',   'Meeting',      'Flat hands face each other; fingers curve inward until they touch — people coming together.','Business','intermediate',HS('m/mee/meeting.mp4'));
const OFFICE      = s('biz-office', 'Office',       'O-hands outline the shape of a rectangular room — defining the office space.','Business','intermediate',HS('o/off/office.mp4'));
const MANAGER     = s('biz-mgr',    'Manager',      'Bent hands alternate moving forward — directing and managing.','Business','intermediate',HS('m/man/manager.mp4'));
const PROJECT     = s('biz-proj',   'Project',      'P-hands sweep forward from the chin — presenting a project idea.','Business','intermediate');
const DEADLINE    = s('biz-dead',   'Deadline',     'Sign TIME then D-hand cuts sharply across the other palm — a hard cutoff.','Business','advanced');
const INTERVIEW   = s('biz-intv',   'Interview',    'I-hands alternate in a conversation rhythm — a formal exchange of questions.','Business','intermediate');
const EMAIL       = s('biz-email',  'Email',        'E-hand index finger slides forward like typing @ on a keyboard.','Business','intermediate',HS('e/ema/email.mp4'));
const MONEY       = s('biz-money',  'Money',        'Flat-O hand taps the open palm twice — like counting coins.','Business','beginner',HS('m/mon/money.mp4'));
const BANK        = s('biz-bank',   'Bank',         'B-hand taps on the other B-hand twice.','Business','intermediate',HS('b/ban/bank.mp4'));
const COMPUTER    = s('biz-comp',   'Computer',     'C-hand circles near the temple — computing in your head.','Business','beginner',HS('c/com/computer.mp4'));
const PHONE       = s('biz-phone',  'Phone',        'Y-hand (pinky and thumb extended) held to ear — like holding a phone.','Business','beginner',HS('p/pho/phone.mp4'));
const SALARY      = s('biz-sal',    'Salary',       'S-hand slides across the open palm — like counting a paycheck.','Business','intermediate',HS('s/sal/salary.mp4'));
const REPORT      = s('biz-rpt',    'Report',       'R-fingers tap chin, then sign PAPER — a written summary.','Business','advanced');
const PRESENTATION= s('biz-pres',   'Presentation', 'P-hands move outward from the mouth — presenting ideas to an audience.','Business','advanced');

// ── Education ─────────────────────────────────────────────────────────────────
const SCHOOL      = s('edu-school', 'School',       'Flat hands clap together twice — the clapping sound calling class to order.','Education','beginner',HS('s/sch/school.mp4'));
const TEACHER     = s('edu-tchr',   'Teacher',      'O-hands at temples, push forward — projecting knowledge from your mind.','Education','beginner',HS('t/tea/teacher.mp4'));
const STUDENT     = s('edu-stu',    'Student',      'Open hand scoops from the palm then rises to the forehead — receiving and absorbing knowledge.','Education','beginner',HS('s/stu/student.mp4'));
const LEARN       = s('edu-learn',  'Learn',         'Open hand scoops from palm, rises to forehead — acquiring new knowledge.','Education','beginner',HS('l/lea/learn.mp4'));
const STUDY       = s('edu-study',  'Study',         'Fingers wiggle toward the flat palm held in front — quickly scanning pages.','Education','beginner',HS('s/stu/study.mp4'));
const BOOK        = s('edu-book',   'Book',          'Flat hands together open outward like the cover of a book opening.','Education','beginner',HS('b/boo/book.mp4'));
const WRITE       = s('edu-write',  'Write',         'Pinched index and middle fingers write across the open palm — writing on paper.','Education','beginner',HS('w/wri/write.mp4'));
const READ        = s('edu-read',   'Read',          'V-hand (two fingers spread) scans down the open palm — like eyes reading a page.','Education','beginner',HS('r/rea/read.mp4'));
const CLASS       = s('edu-class',  'Class',         'C-hands circle each other and come together — a group forming a class.','Education','beginner',HS('c/cla/class.mp4'));
const TEST        = s('edu-test',   'Test',          'Both X-fingers unfurl at the top of the chest and move downward — like writing questions on a test.','Education','intermediate',HS('t/tes/test.mp4'));
const UNIVERSITY  = s('edu-univ',   'University',   'U-hand circles in a small circle on the other palm then rises upward — beyond college.','Education','intermediate',HS('u/uni/university.mp4'));
const GRADUATE    = s('edu-grad',   'Graduate',     'G-hand arcs across from one side to the other — receiving a diploma.','Education','intermediate',HS('g/gra/graduate.mp4'));
const HOMEWORK    = s('edu-hw',     'Homework',     'H-hand taps the palm twice — work done at home.','Education','beginner',HS('h/hom/homework.mp4'));
const EXAM        = s('edu-exam',   'Exam',          'X-fingers curve, then both hands sweep downward — a formal test.','Education','intermediate',HS('e/exa/exam.mp4'));
const CAMPUS      = s('edu-camp',   'Campus',        'C-hand sweeps in a wide arc — navigating around a campus.','Education','intermediate');
const DEGREE      = s('edu-deg',    'Degree',        'D-hand and flat palm face each other — like holding a diploma.','Education','advanced');
const SCHOLARSHIP = s('edu-schol',  'Scholarship',  'S-hand at forehead then opens outward — rewarded knowledge.','Education','advanced');

// ── Family & Social ───────────────────────────────────────────────────────────
const FAMILY   = s('fam-fam',   'Family',     'F-hands form a circular motion together — representing a unit.','Family','beginner',HS('f/fam/family.mp4'));
const MOTHER   = s('fam-mom',   'Mother',     '5-hand with thumb touching chin taps twice — the thumb represents the female chin dimple.','Family','beginner',HS('m/mot/mother.mp4'));
const FATHER   = s('fam-dad',   'Father',     '5-hand with thumb touching forehead taps twice — the upper face sign for male.','Family','beginner',HS('f/fat/father.mp4'));
const BROTHER  = s('fam-bro',   'Brother',    'Sign BOY (L-hand at forehead) then bring both L-hands together.','Family','beginner',HS('b/bro/brother.mp4'));
const SISTER   = s('fam-sis',   'Sister',     'Sign GIRL (A-thumb slides down cheek) then bring both L-hands together.','Family','beginner',HS('s/sis/sister.mp4'));
const FRIEND   = s('fam-frnd',  'Friend',     'Hook index fingers together, then switch which finger is on top — interlocked friendship.','Family','beginner',HS('f/fri/friend.mp4'));
const LOVE     = s('fam-love',  'Love',       'Cross both arms over your chest — like wrapping yourself in a hug.','Family','beginner',HS('l/lov/love.mp4'));
const MARRIED  = s('fam-marr',  'Married',    'C-hands come together from each side — two wedding rings joining.','Family','intermediate',HS('m/mar/married.mp4'));
const BABY     = s('fam-baby',  'Baby',       'Arms cradle and rock gently side to side — holding a newborn.','Family','beginner',HS('b/bab/baby.mp4'));
const CHILDREN = s('fam-kids',  'Children',  'Flat hands pat gently at different heights — patting children on the head.','Family','beginner',HS('c/chi/children.mp4'));
const BOYFRIEND= s('fam-bf',    'Boyfriend',  'Sign BOY (brim of cap), then FRIEND (hooked index fingers).','Family','intermediate');
const GIRLFRIEND= s('fam-gf',   'Girlfriend', 'Sign GIRL (thumb slides down cheek), then FRIEND (hooked index fingers).','Family','intermediate');
const HUSBAND  = s('fam-husb',  'Husband',    'Sign MAN (forehead then chest), then MARRIED (C-hands join).','Family','intermediate');
const WIFE     = s('fam-wife',  'Wife',       'Sign WOMAN (chin then chest), then MARRIED (C-hands join).','Family','intermediate');

// ── Daily Life ────────────────────────────────────────────────────────────────
const HOME     = s('dl-home',  'Home',      'Flat-O hand touches cheek near mouth (eating), then moves up to touch cheek near eye (sleeping) — where you eat and sleep.','Daily Life','beginner',HS('h/hom/home.mp4'));
const STORE    = s('dl-store', 'Store',     'Flat-O hands flick wrists forward twice — putting items out on a display.','Daily Life','beginner',HS('s/sto/store.mp4'));
const LIBRARY  = s('dl-lib',   'Library',   'L-hand moves in a small circle — L stands for Library.','Daily Life','beginner',HS('l/lib/library.mp4'));
const PARK     = s('dl-park',  'Park',      'P-hand taps its thumb on the chin — like P for Park.','Daily Life','beginner',HS('p/par/park.mp4'));
const GYM      = s('dl-gym',   'Gym',       'Both arms perform bicep curls simultaneously — the universal gym motion.','Daily Life','intermediate',HS('g/gym/gym.mp4'));
const MORNING  = s('dl-morn',  'Morning',   'Forearm rises upward like the sun appearing on the horizon at dawn.','Daily Life','beginner',HS('m/mor/morning.mp4'));
const NIGHT    = s('dl-night', 'Night',     'Bent wrist (curved hand) arcs over the other forearm — the sun disappearing at night.','Daily Life','beginner',HS('n/nig/night.mp4'));
const TODAY    = s('dl-today', 'Today',     'Y-hands together drop downward twice — happening now, in the present.','Daily Life','beginner',HS('t/tod/today.mp4'));
const TOMORROW = s('dl-tmrw',  'Tomorrow',  'A-thumb rests on cheek, then rotates forward once — moving into the future.','Daily Life','beginner',HS('t/tom/tomorrow.mp4'));
const YESTERDAY= s('dl-yest',  'Yesterday', 'A-thumb on cheek rotates backward once — looking back to the past.','Daily Life','beginner',HS('y/yes/yesterday.mp4'));
const WEEK     = s('dl-week',  'Week',      'Index finger slides across the length of the other open palm — one week passing by.','Daily Life','beginner',HS('w/wee/week.mp4'));

// ── Hobbies & Sports ──────────────────────────────────────────────────────────
const SPORTS   = s('hb-sport', 'Sports',      'S-fists rotate alternately in front of body — competitive athletic action.','Hobbies','beginner',HS('s/spo/sport.mp4'));
const PLAY     = s('hb-play',  'Play',         'Y-hands (thumb and pinky out) shake loosely back and forth.','Hobbies','beginner',HS('p/pla/play.mp4'));
const RUN      = s('hb-run',   'Run',           'L-hands side by side move forward; index fingers briefly hook around each other.','Hobbies','beginner',HS('r/run/run.mp4'));
const SWIM     = s('hb-swim',  'Swim',          'Both hands perform breaststroke swimming motions simultaneously.','Hobbies','beginner',HS('s/swi/swim.mp4'));
const BASKETBALL= s('hb-bball','Basketball',   'Both hands shoot a basketball in an arc — like launching a jump shot.','Hobbies','intermediate',HS('b/bas/basketball.mp4'));
const SOCCER   = s('hb-soccer','Soccer',        'Flat hand swings and hits the bottom of the other fist — like kicking a ball.','Hobbies','intermediate',HS('s/soc/soccer.mp4'));
const MUSIC    = s('hb-music', 'Music',         'Flat hand waves rhythmically back and forth over the forearm — conducting music.','Hobbies','beginner',HS('m/mus/music.mp4'));
const DANCE    = s('hb-dance', 'Dance',         'V-hand swings back and forth over the open palm — legs dancing over a dance floor.','Hobbies','beginner',HS('d/dan/dance.mp4'));
const SING     = s('hb-sing',  'Sing',           'Hand waves back and forth near the mouth — projecting music outward.','Hobbies','beginner',HS('s/sin/sing.mp4'));
const ART      = s('hb-art',   'Art',            'Pinky finger wiggles and curves down the palm — drawing an artistic flowing line.','Hobbies','beginner',HS('a/art/art.mp4'));
const PHOTO    = s('hb-photo', 'Photography',   'C-hands frame a shot; index finger presses down like pressing a camera shutter.','Hobbies','intermediate');


// ── Course Lessons Map ────────────────────────────────────────────────────────
export const COURSE_LESSONS: Record<string, Lesson[]> = {

  // ─── Basics ──────────────────────────────────────────────────────────────────

  'basics-1': [
    lesson('b1-l1','Letters A–E','Start your ASL alphabet journey with the first five letters.',[A,B,C,D,E],'8 min','beginner'),
    lesson('b1-l2','Letters F–J','Continue building your alphabet skills with F through J.',[F,G,H,I,J],'8 min','beginner'),
    lesson('b1-l3','Letters K–O','Master the middle section of the alphabet.',[K,L,M,N,O],'8 min','beginner'),
    lesson('b1-l4','Letters P–T','Keep going — P through T coming up.',[P,Q,R,SS,T],'8 min','beginner'),
    lesson('b1-l5','Letters U–Z','Complete the alphabet with the final six letters.',[U,V,W,X,Y,Z],'10 min','beginner'),
  ],

  'basics-2': [
    lesson('b2-l1','Numbers 1–5','The foundational numbers for everyday counting.',[NUM1,NUM2,NUM3,NUM4,NUM5],'6 min','beginner'),
    lesson('b2-l2','Numbers 6–10','Continue building your number vocabulary.',[NUM6,NUM7,NUM8,NUM9,NUM10],'8 min','beginner'),
    lesson('b2-l3','Numbers 11–12 & Larger','Double digits and round numbers.',[NUM11,NUM12,NUM20,NUM50,NUM100],'10 min','beginner'),
    lesson('b2-l4','Numbers in Context','Apply numbers to real-world situations: time, money, and quantities.',[NUM1,NUM5,NUM10,MONEY,WEEK],'12 min','beginner'),
  ],

  'basics-3': [
    lesson('b3-l1','First Greetings','The essential signs for any first encounter.',[HELLO,GOODBYE,GOODMORNING,GOODNIGHT],'8 min','beginner'),
    lesson('b3-l2','Polite Phrases','Courtesy and manners expressed in ASL.',[PLEASE,THANKYOU,SORRY,WELCOME],'8 min','beginner'),
    lesson('b3-l3','Introductions','Introduce yourself and learn others\' names.',[NICETOMEET,WHATSNAME,MYNAMEIS,HOWAREYOU],'10 min','beginner'),
    lesson('b3-l4','Full Conversation','Put it all together in a natural introduction.',[HELLO,NICETOMEET,MYNAMEIS,HOWAREYOU,GOODBYE],'12 min','beginner'),
  ],

  'basics-4': [
    lesson('b4-l1','Warm Colors','Red, orange, and yellow — the warm side of the spectrum.',[RED,ORANGE,YELLOW],'6 min','beginner',true),
    lesson('b4-l2','Cool Colors','Blue, green, and purple — cool and calming.',[BLUE,GREEN,PURPLE],'6 min','beginner',true),
    lesson('b4-l3','Neutrals & Descriptions','White, black, and using colors in sentences.',[WHITE,BLACK,RED,BLUE,GREEN],'10 min','beginner',true),
  ],

  // ─── Travel ──────────────────────────────────────────────────────────────────

  'travel-1': [
    lesson('t1-l1','At the Airport','Navigate check-in, security, and gates.',[AIRPORT,FLIGHT,TICKET,PASSPORT],'10 min','intermediate',true),
    lesson('t1-l2','Luggage & Boarding','Handling bags and getting on the plane.',[LUGGAGE,TICKET,HELP,STOP],'10 min','intermediate',true),
    lesson('t1-l3','Airport Directions','Find your way around any terminal.',[LEFT,RIGHT,STRAIGHT,BUS,STOP],'10 min','intermediate',true),
  ],

  'travel-2': [
    lesson('t2-l1','Hotel Arrival','Signs for check-in and your first moments at the hotel.',[HOTEL,RESERVATION,TICKET,THANKYOU],'10 min','intermediate',true),
    lesson('t2-l2','Room Requests','Ask for anything you need in your room.',[HELP,PHONE,WATER,PLEASE],'8 min','intermediate',true),
    lesson('t2-l3','Hotel Services','Amenities, dining, and checkout.',[FOOD,DRINK,MONEY,THANKYOU,GOODBYE],'10 min','intermediate',true),
  ],

  'travel-3': [
    lesson('t3-l1','Cardinal Directions','Left, right, straight — the basis of all navigation.',[LEFT,RIGHT,STRAIGHT,STOP],'8 min','intermediate',true),
    lesson('t3-l2','Public Transport','Buses, trains, and taxis explained.',[BUS,TRAIN,TAXI,TICKET,MONEY],'10 min','intermediate',true),
    lesson('t3-l3','Asking for Help','Get assistance when you\'re lost.',[HELP,STOP,LEFT,RIGHT,THANKYOU],'8 min','intermediate',true),
  ],

  'travel-4': [
    lesson('t4-l1','Sightseeing Vocabulary','Museums, tours, and tourist spots.',[MUSEUM,TOUR,SIGHTSEEING,PARK],'10 min','intermediate',true),
    lesson('t4-l2','On the Tour','Communicate during guided activities.',[HELP,STOP,THANKYOU,PLEASE,HOWAREYOU],'8 min','intermediate',true),
    lesson('t4-l3','Booking Activities','Reserve tours and activities in advance.',[RESERVATION,MONEY,TICKET,TOMORROW],'10 min','intermediate',true),
  ],

  // ─── Medical ─────────────────────────────────────────────────────────────────

  'medical-1': [
    lesson('m1-l1','Emergency Basics','The most critical signs for urgent situations.',[HELP,EMERGENCY,PAIN,HURT],'10 min','advanced',true),
    lesson('m1-l2','Calling for Help','Summon immediate medical assistance.',[HELP,DOCTOR,HOSPITAL,AMBULANCE],'10 min','advanced',true),
    lesson('m1-l3','Describing What Happened','Communicate the nature of the emergency.',[PAIN,HURT,SICK,BLOOD,HEART],'12 min','advanced',true),
    lesson('m1-l4','Medical Responses','Understand what emergency staff will sign back.',[DOCTOR,NURSE,MEDICINE,STOP,HELP],'10 min','advanced',true),
  ],

  'medical-2': [
    lesson('m2-l1','Head & Chest','Upper body parts and common conditions.',[HEART,HEADACHE,SICK,DOCTOR],'10 min','intermediate',true),
    lesson('m2-l2','Abdomen & Body','Torso and general body vocabulary.',[STOMACH,HURT,PAIN,NURSE],'10 min','intermediate',true),
    lesson('m2-l3','Describing Symptoms','Pinpoint pain and illness with precision.',[PAIN,HURT,FEVER,SICK,ALLERGY],'12 min','intermediate',true),
    lesson('m2-l4','At the Doctor','Navigate a complete medical consultation.',[DOCTOR,APPOINTMENT,MEDICINE,PRESCRIPTION,THANKYOU],'12 min','advanced',true),
  ],

  'medical-3': [
    lesson('m3-l1','Pharmacy Basics','Walk into any pharmacy with confidence.',[MEDICINE,PRESCRIPTION,HELP,PLEASE],'8 min','intermediate',true),
    lesson('m3-l2','Talking About Medications','Describe your prescriptions clearly.',[MEDICINE,DOCTOR,PRESCRIPTION,ALLERGY],'10 min','intermediate',true),
    lesson('m3-l3','Pharmacy Interactions','Ask all the questions you need.',[HELP,MEDICINE,MONEY,THANKYOU],'10 min','intermediate',true),
  ],

  'medical-4': [
    lesson('m4-l1','Scheduling an Appointment','Book a medical visit smoothly.',[APPOINTMENT,DOCTOR,TODAY,TOMORROW,PHONE],'10 min','advanced',true),
    lesson('m4-l2','The Consultation','Communicate your health concerns clearly.',[DOCTOR,PAIN,SICK,MEDICINE,ALLERGY],'12 min','advanced',true),
    lesson('m4-l3','Diagnosis & Treatment','Understand the doctor\'s recommendations.',[DIAGNOSIS,MEDICINE,SURGERY,HOSPITAL,PRESCRIPTION],'12 min','advanced',true),
    lesson('m4-l4','Follow-Up Care','Ongoing communication after your visit.',[APPOINTMENT,MEDICINE,HELP,THANKYOU,GOODBYE],'10 min','advanced',true),
  ],

  // ─── Education ───────────────────────────────────────────────────────────────

  'education-1': [
    lesson('e1-l1','Classroom Essentials','The core vocabulary of any school setting.',[SCHOOL,TEACHER,STUDENT,BOOK],'8 min','beginner'),
    lesson('e1-l2','Classroom Actions','What you do in class every day.',[LEARN,STUDY,WRITE,READ],'8 min','beginner'),
    lesson('e1-l3','Schoolwork','Signs for assignments, tests, and studying.',[HOMEWORK,TEST,BOOK,WRITE],'10 min','beginner'),
    lesson('e1-l4','Classroom Communication','Talk to your teacher and classmates effectively.',[TEACHER,STUDENT,HELP,PLEASE,THANKYOU],'10 min','beginner'),
  ],

  'education-2': [
    lesson('e2-l1','Academic Vocabulary','Words used in formal educational settings.',[LEARN,STUDY,CLASS,TEST],'10 min','intermediate',true),
    lesson('e2-l2','Assignments & Exams','Navigate schoolwork deadlines and assessments.',[HOMEWORK,EXAM,TEST,WRITE,READ],'10 min','intermediate',true),
    lesson('e2-l3','Study Groups','Collaborate with classmates productively.',[STUDENT,CLASS,LEARN,HELP,FRIEND],'10 min','intermediate',true),
  ],

  'education-3': [
    lesson('e3-l1','Opening the Conference','Start the parent-teacher meeting confidently.',[TEACHER,STUDENT,SCHOOL,HELLO],'8 min','intermediate',true),
    lesson('e3-l2','Discussing Progress','Talk about performance and areas to improve.',[LEARN,TEST,HOMEWORK,HELP,BOOK],'10 min','intermediate',true),
    lesson('e3-l3','Setting Goals','Create action plans and follow-up commitments.',[STUDY,LEARN,HOME,TOMORROW,THANKYOU],'10 min','intermediate',true),
  ],

  'education-4': [
    lesson('e4-l1','University Life','Navigate the college campus experience.',[UNIVERSITY,CAMPUS,CLASS,STUDENT],'10 min','advanced',true),
    lesson('e4-l2','Academic Achievement','Signs for exams, grades, and accomplishments.',[EXAM,TEST,DEGREE,SCHOLARSHIP,GRADUATE],'12 min','advanced',true),
    lesson('e4-l3','Campus Relationships','Interact with faculty, advisors, and peers.',[TEACHER,STUDENT,FRIEND,MEETING,HELP],'10 min','advanced',true),
    lesson('e4-l4','Graduation Day','Celebrate the biggest milestone.',[GRADUATE,DEGREE,FAMILY,FRIEND,LOVE],'10 min','advanced',true),
  ],

  // ─── Business ────────────────────────────────────────────────────────────────

  'business-1': [
    lesson('bz1-l1','Workplace Essentials','The core signs for any office environment.',[WORK,OFFICE,COMPUTER,PHONE],'10 min','intermediate',true),
    lesson('bz1-l2','Roles & Colleagues','Talk about your team and management.',[MANAGER,WORK,MEETING,HELP],'10 min','intermediate',true),
    lesson('bz1-l3','Daily Communication','Email, calls, and everyday interactions.',[MEETING,EMAIL,PHONE,COMPUTER,THANKYOU],'10 min','intermediate',true),
    lesson('bz1-l4','Tasks & Priorities','Discuss projects, deadlines, and reports.',[WORK,PROJECT,DEADLINE,REPORT,HELP],'12 min','intermediate',true),
  ],

  'business-2': [
    lesson('bz2-l1','Meeting Preparation','Set up a productive business meeting.',[MEETING,OFFICE,TODAY,PHONE,EMAIL],'10 min','advanced',true),
    lesson('bz2-l2','Leading Discussions','Present ideas and lead conversations.',[PRESENTATION,REPORT,MANAGER,WORK,HELP],'12 min','advanced',true),
    lesson('bz2-l3','Meeting Follow-Up','Next steps, deadlines, and accountability.',[WORK,PROJECT,DEADLINE,EMAIL,TOMORROW],'10 min','advanced',true),
  ],

  'business-3': [
    lesson('bz3-l1','Interview Preparation','Get ready to present your best self.',[INTERVIEW,WORK,MANAGER,SCHOOL],'10 min','advanced',true),
    lesson('bz3-l2','The Interview Conversation','Signs for answering common interview questions.',[WORK,LEARN,MANAGER,SALARY,HELP],'12 min','advanced',true),
    lesson('bz3-l3','Offer & Follow-Up','Thank-you notes and accepting a position.',[THANKYOU,EMAIL,PHONE,MONEY,TOMORROW],'10 min','advanced',true),
  ],

  'business-4': [
    lesson('bz4-l1','Greeting Customers','Make every customer feel welcome.',[HELLO,HELP,PLEASE,THANKYOU,STORE],'8 min','intermediate',true),
    lesson('bz4-l2','Handling Requests','Address customer needs professionally.',[HELP,PHONE,EMAIL,MONEY,SORRY],'10 min','intermediate',true),
    lesson('bz4-l3','Completing a Sale','Close with gratitude and professionalism.',[MONEY,STORE,THANKYOU,GOODBYE,PHONE],'10 min','intermediate',true),
  ],

  // ─── Social ──────────────────────────────────────────────────────────────────

  'social-1': [
    lesson('sc1-l1','Immediate Family','The most important signs in family vocabulary.',[FAMILY,MOTHER,FATHER,BROTHER,SISTER],'10 min','beginner'),
    lesson('sc1-l2','Extended Relationships','More family members and bonds.',[BABY,CHILDREN,MARRIED,HUSBAND,WIFE],'10 min','beginner'),
    lesson('sc1-l3','Friends & Love','Signs for the people you care about most.',[FRIEND,LOVE,BOYFRIEND,GIRLFRIEND,FAMILY],'10 min','beginner'),
    lesson('sc1-l4','Talking About Family','Use family signs in natural conversation.',[MOTHER,FATHER,FAMILY,LOVE,CHILDREN],'12 min','beginner'),
  ],

  'social-2': [
    lesson('sc2-l1','Romantic Vocabulary','Signs for dating and expressing affection.',[LOVE,FRIEND,BOYFRIEND,GIRLFRIEND],'8 min','intermediate',true),
    lesson('sc2-l2','Expressing Feelings','Tell someone how you feel authentically.',[LOVE,SORRY,PLEASE,THANKYOU,HELLO],'10 min','intermediate',true),
    lesson('sc2-l3','Making Plans Together','Ask someone out and coordinate plans.',[TODAY,TOMORROW,MORNING,NIGHT,PHONE],'10 min','intermediate',true),
  ],

  'social-3': [
    lesson('sc3-l1','Party & Celebration','Signing at parties, birthdays, and gatherings.',[FRIEND,FAMILY,LOVE,DANCE,MUSIC],'10 min','intermediate',true),
    lesson('sc3-l2','Inviting Others','Send invitations and plan events together.',[TODAY,TOMORROW,PHONE,PLEASE,THANKYOU],'8 min','intermediate',true),
    lesson('sc3-l3','At the Event','Mingle, celebrate, and connect at social events.',[HELLO,GOODBYE,NICETOMEET,FRIEND,DANCE],'10 min','intermediate',true),
  ],

  'social-4': [
    lesson('sc4-l1','Hobby Signs','Share what you love to do in your free time.',[MUSIC,ART,SPORTS,READ,COOK],'10 min','beginner'),
    lesson('sc4-l2','Active Hobbies','Sports, dance, and physical activities.',[DANCE,SING,SWIM,SPORTS,PLAY],'10 min','beginner'),
    lesson('sc4-l3','Weekend Plans','Talk about what you enjoy on your days off.',[TODAY,TOMORROW,PARK,MUSIC,FRIEND],'10 min','beginner'),
  ],

  // ─── Daily Life ───────────────────────────────────────────────────────────────

  'daily-1': [
    lesson('dl1-l1','Food & Drink Basics','The essential vocabulary for meals and drinks.',[FOOD,WATER,EAT,DRINK,HUNGRY],'8 min','beginner'),
    lesson('dl1-l2','Meals of the Day','Breakfast, lunch, dinner, and cooking.',[BREAKFAST,LUNCH,DINNER,COOK,DELICIOUS],'10 min','beginner'),
    lesson('dl1-l3','At the Restaurant','Order, ask questions, and enjoy your meal.',[RESTAURANT,MENU,FOOD,DRINK,THANKYOU],'10 min','beginner'),
    lesson('dl1-l4','Food Preferences','Express what you like and what you need.',[HUNGRY,THIRSTY,DELICIOUS,COFFEE,TEA],'10 min','beginner'),
  ],

  'daily-2': [
    lesson('dl2-l1','Shopping Basics','Navigate any store with ease.',[STORE,MONEY,HELP,PLEASE],'8 min','beginner'),
    lesson('dl2-l2','Finding Items','Ask for help locating products.',[HELP,STOP,LEFT,RIGHT,THANKYOU],'8 min','beginner'),
    lesson('dl2-l3','Checkout & Payment','Complete your transaction confidently.',[MONEY,THANKYOU,GOODBYE,STORE,HELP],'8 min','beginner'),
  ],

  'daily-3': [
    lesson('dl3-l1','Home Vocabulary','Signs for home, rooms, and daily routines.',[HOME,MORNING,NIGHT,FAMILY,COOK],'10 min','intermediate',true),
    lesson('dl3-l2','Daily Routines','Communicate about everyday home activities.',[MORNING,NIGHT,EAT,DRINK,TODAY],'10 min','intermediate',true),
    lesson('dl3-l3','Household Requests','Ask for things you need at home.',[HELP,PLEASE,WATER,FOOD,THANKYOU],'8 min','intermediate',true),
  ],

  'daily-4': [
    lesson('dl4-l1','Weather Basics','Common signs for everyday weather talk.',[TODAY,MORNING,WEEK,TOMORROW,YESTERDAY],'8 min','beginner'),
    lesson('dl4-l2','Planning Around Weather','Adjust plans based on the forecast.',[TODAY,TOMORROW,MORNING,NIGHT,WEEK],'8 min','beginner'),
    lesson('dl4-l3','Weather Conversations','Chat naturally about weather conditions.',[TODAY,TOMORROW,MORNING,FRIEND,GOODBYE],'8 min','beginner'),
  ],

  // ─── Hobbies ─────────────────────────────────────────────────────────────────

  'hobbies-1': [
    lesson('hb1-l1','Sport Basics','The core vocabulary for talking about sports.',[SPORTS,PLAY,RUN,SWIM],'8 min','intermediate',true),
    lesson('hb1-l2','Team Sports','Basketball, soccer, and competitive games.',[BASKETBALL,SOCCER,SPORTS,FRIEND,PLAY],'10 min','intermediate',true),
    lesson('hb1-l3','Fitness & Training','Gym, workouts, and staying active.',[GYM,RUN,SWIM,SPORTS,HELP],'10 min','intermediate',true),
  ],

  'hobbies-2': [
    lesson('hb2-l1','Music Vocabulary','Signs for music, instruments, and performance.',[MUSIC,SING,DANCE,PLAY],'8 min','intermediate',true),
    lesson('hb2-l2','At a Concert','Experience live music as a signing fan.',[MUSIC,FRIEND,TODAY,NIGHT,LOVE],'10 min','intermediate',true),
    lesson('hb2-l3','Music Preferences','Discuss what genres and artists you love.',[MUSIC,SING,DANCE,LOVE,FRIEND],'8 min','intermediate',true),
  ],

  'hobbies-3': [
    lesson('hb3-l1','Visual Arts','Painting, drawing, and photography.',[ART,WRITE,PHOTO,BOOK],'8 min','beginner',true),
    lesson('hb3-l2','Performing Arts','Music, dance, theater, and singing.',[MUSIC,DANCE,SING,LOVE],'8 min','beginner',true),
    lesson('hb3-l3','Sharing Creative Work','Talk about your art with others.',[ART,MUSIC,FRIEND,LOVE,THANKYOU],'8 min','beginner',true),
  ],

  'hobbies-4': [
    lesson('hb4-l1','Tech Vocabulary','Signs for devices, apps, and digital life.',[COMPUTER,PHONE,EMAIL,WORK],'8 min','intermediate',true),
    lesson('hb4-l2','Gaming & Social Media','Online life and gaming vocabulary.',[PLAY,COMPUTER,PHONE,FRIEND],'8 min','intermediate',true),
    lesson('hb4-l3','Digital Communication','Connect with friends in the digital world.',[EMAIL,PHONE,FRIEND,THANKYOU,GOODBYE],'8 min','intermediate',true),
  ],
};
