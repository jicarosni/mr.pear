/* Ahoj! – Slovacco per italiani · contenuti del corso (livello A1)
   Ogni voce: sk = slovacco, it = italiano, pr = pronuncia per italiani
   (MAIUSCOLO = sillaba accentata, sempre la prima), alt = altre risposte accettate. */
window.COURSE = [
{
  id: 'alfabeto', emoji: '🔤', title: 'Alfabeto e pronuncia', sk: 'Abeceda a výslovnosť',
  desc: 'Le lettere con mäkčeň e dĺžeň, i suoni nuovi e l\'accento.',
  vocab: [
    { sk: 'čaj', it: 'tè', pr: 'ČAI' },
    { sk: 'šál', it: 'sciarpa', pr: 'ŠAAL' },
    { sk: 'žaba', it: 'rana', pr: 'ŽA-ba' },
    { sk: 'cukor', it: 'zucchero', pr: 'TSU-kor' },
    { sk: 'chlieb', it: 'pane', pr: 'KHLIEP' },
    { sk: 'hora', it: 'montagna', pr: 'HO-ra' },
    { sk: 'ťava', it: 'cammello', pr: 'TJA-va' },
    { sk: 'kôň', it: 'cavallo', pr: 'KUOGN' },
    { sk: 'mäso', it: 'carne', pr: 'ME-so' },
    { sk: 'ľad', it: 'ghiaccio', pr: 'GLIAT' },
    { sk: 'dzvon', it: 'campana', pr: 'DZVON' },
    { sk: 'džús', it: 'succo', pr: 'GIUUS' },
    { sk: 'syr', it: 'formaggio', pr: 'SIR' },
    { sk: 'vlk', it: 'lupo', pr: 'VLK' }
  ],
  grammar: `
<p><b>Buona notizia:</b> lo slovacco si legge quasi sempre <b>come si scrive</b>, proprio come l'italiano. Ogni lettera ha (quasi) un solo suono.</p>
<h4>1. L'accento: sempre sulla prima sillaba</h4>
<p>In italiano l'accento si sposta (<i>tàvolo, pàne, città</i>). In slovacco <b>no</b>: è sempre sulla <b>prima sillaba</b>: <b>DO</b>-brý, <b>ĎA</b>-ku-jem, <b>SLO</b>-ven-sko.</p>
<h4>2. Il dĺžeň ( ´ ) = vocale lunga, non accento!</h4>
<p>Il segno su <b>á é í ó ú ý ĺ ŕ</b> non indica l'accento ma la <b>durata</b>: la vocale si tiene circa il doppio. Per esempio <i>prosím</i> si legge PRO-siim: accento sulla prima sillaba, <i>i</i> lunga nella seconda.</p>
<h4>3. Il mäkčeň ( ˇ ) = suono "morbido"</h4>
<table>
<tr><th>Lettera</th><th>Suono</th><th>Come in italiano</th></tr>
<tr><td><b>č</b></td><td>[tʃ]</td><td>"ci" di <i>ciao</i></td></tr>
<tr><td><b>š</b></td><td>[ʃ]</td><td>"sc" di <i>scena</i></td></tr>
<tr><td><b>ž</b></td><td>[ʒ]</td><td>la "j" francese di <i>jour</i></td></tr>
<tr><td><b>dž</b></td><td>[dʒ]</td><td>"gi" di <i>giorno</i></td></tr>
<tr><td><b>ň</b></td><td>[ɲ]</td><td>"gn" di <i>gnocchi</i></td></tr>
<tr><td><b>ľ</b></td><td>[ʎ]</td><td>"gl" di <i>figlio</i> (più leggero)</td></tr>
<tr><td><b>ť, ď</b></td><td>[c], [ɟ]</td><td>t / d "bagnate", quasi "chi" / "ghi" di <i>chiesa</i>, <i>ghiaccio</i></td></tr>
</table>
<h4>4. Attenzione, falsi amici dei suoni</h4>
<ul>
<li><b>c</b> = sempre "zz" di <i>pizza</i> (mai "ci"!): <i>cukor</i> = TSU-kor.</li>
<li><b>ch</b> = suono aspirato come la "j" spagnola di <i>jamón</i> (mai "k"!): <i>chlieb</i>.</li>
<li><b>h</b> = si pronuncia sempre, è una h sonora: <i>hora</i>.</li>
<li><b>z</b> = "s" sonora di <i>rosa</i>; <b>s</b> = sempre "s" sorda di <i>sole</i>.</li>
<li><b>y</b> = come <b>i</b>; <b>ä</b> = come <b>e</b>; <b>ô</b> = "uo" di <i>uomo</i>.</li>
<li><b>j</b> = "i" di <i>ieri</i>; <b>ie, ia, iu</b> = dittonghi.</li>
<li>Le sillabe <b>de, te, ne, le, di, ti, ni, li</b> si pronunciano di solito morbide: <i>deti</i> = DJE-tji (eccezioni: <i>ten, jeden, teraz</i> e molte parole straniere).</li>
</ul>
<h4>5. Parole senza vocali?</h4>
<p><b>r</b> e <b>l</b> possono fare da vocale: <i>vlk</i> (lupo), <i>krk</i> (collo), <i>prst</i> (dito). C'è perfino una frase famosa: <i>Strč prst skrz krk!</i></p>
<h4>6. Consonanti finali</h4>
<p>A fine parola le consonanti sonore diventano sorde: <i>chlieb</i> → [chliep], <i>ľad</i> → [ľat], <i>muž</i> → [muš].</p>
<p class="legend"><b>Legenda della pronuncia nell'app:</b> MAIUSCOLO = sillaba accentata · aa, ii, uu… = vocale lunga · ts = c · kh = ch · gn = ň · tj/dj = ť/ď · č š ž = come sopra.</p>`,
  dialogue: [
    { who: 'Zuzana', sk: 'Ako sa voláš?', it: 'Come ti chiami?' },
    { who: 'Giulia', sk: 'Volám sa Giulia.', it: 'Mi chiamo Giulia.' },
    { who: 'Zuzana', sk: 'Ako sa to píše?', it: 'Come si scrive?' },
    { who: 'Giulia', sk: 'G – I – U – L – I – A.', it: 'G – I – U – L – I – A.' },
    { who: 'Zuzana', sk: 'Ďakujem. Ja som Zuzana, so „z“ na začiatku.', it: 'Grazie. Io sono Zuzana, con la "z" all\'inizio.' }
  ],
  sentences: [
    { sk: 'Ďakujem za čaj.', it: 'Grazie per il tè.' },
    { sk: 'Žaba je zelená.', it: 'La rana è verde.' },
    { sk: 'Kôň pije vodu.', it: 'Il cavallo beve acqua.' }
  ]
},
{
  id: 'saluti', emoji: '👋', title: 'Saluti e presentazioni', sk: 'Pozdravy a predstavenie',
  desc: 'Ahoj, Dobrý deň, presentarsi, tu e Lei.',
  vocab: [
    { sk: 'Ahoj!', it: 'Ciao!', pr: 'A-hoi', note: 'Informale. Si usa sia arrivando che andando via.' },
    { sk: 'Čau!', it: 'Ciao! (informale)', pr: 'ČAU', note: 'Viene proprio dall\'italiano "ciao"!' },
    { sk: 'Dobrý deň!', it: 'Buongiorno!', pr: 'DO-brii DJEGN', note: 'Formale, si usa tutto il giorno.' },
    { sk: 'Dobré ráno!', it: 'Buongiorno! (di mattina presto)', pr: 'DO-bree RAA-no' },
    { sk: 'Dobrý večer!', it: 'Buonasera!', pr: 'DO-brii VE-čer' },
    { sk: 'Dobrú noc!', it: 'Buonanotte!', pr: 'DO-bruu NOTS' },
    { sk: 'Dovidenia!', it: 'Arrivederci!', pr: 'DO-vi-dje-gnia' },
    { sk: 'Ďakujem.', it: 'Grazie.', pr: 'DJA-ku-iem' },
    { sk: 'Prosím.', it: 'Per favore. / Prego.', pr: 'PRO-siim' },
    { sk: 'Prepáčte.', it: 'Mi scusi.', pr: 'PRE-paač-tje', alt: ['Prepáč'] },
    { sk: 'Áno.', it: 'Sì.', pr: 'AA-no' },
    { sk: 'Nie.', it: 'No.', pr: 'NIE' },
    { sk: 'Ako sa máš?', it: 'Come stai?', pr: 'A-ko sa MAAŠ' },
    { sk: 'Mám sa dobre.', it: 'Sto bene.', pr: 'MAAM sa DO-bre' },
    { sk: 'Volám sa…', it: 'Mi chiamo…', pr: 'VO-laam sa' },
    { sk: 'Teší ma.', it: 'Piacere.', pr: 'TJE-šii ma' },
    { sk: 'Som z Talianska.', it: 'Vengo dall\'Italia.', pr: 'SOM s TA-lian-ska' }
  ],
  grammar: `
<h4>Tu o Lei? → <i>ty</i> o <i>Vy</i></h4>
<p>Come in italiano esiste la forma di cortesia, ma in slovacco si usa <b>Vy</b> (= "voi"), <b>non</b> la terza persona come il nostro "Lei".</p>
<table>
<tr><th></th><th>informale (ty)</th><th>formale (Vy)</th></tr>
<tr><td>Come stai / sta?</td><td>Ako sa <b>máš</b>?</td><td>Ako sa <b>máte</b>?</td></tr>
<tr><td>Come ti chiami / si chiama?</td><td>Ako sa <b>voláš</b>?</td><td>Ako sa <b>voláte</b>?</td></tr>
<tr><td>Di dove sei / è?</td><td>Odkiaľ <b>si</b>?</td><td>Odkiaľ <b>ste</b>?</td></tr>
<tr><td>Scusa / mi scusi</td><td>Prepáč</td><td>Prepáčte</td></tr>
</table>
<h4>Niente articoli!</h4>
<p>Lo slovacco <b>non ha articoli</b>: niente "il, la, un, una". <i>Som Talian</i> = (Io) sono italiano. Anche il pronome soggetto si omette spesso, come in italiano: <i>Volám sa Marco</i> = Mi chiamo Marco.</p>
<h4>"sa" = "si / mi / ti"</h4>
<p><i>Volám <b>sa</b></i> = mi chiamo, <i>voláš <b>sa</b></i> = ti chiami. La particella <b>sa</b> non cambia mai con la persona.</p>
<h4>Maschile e femminile</h4>
<p>Som Talian (m) · Som Talianka (f). Som Slovák (m) · Som Slovenka (f).</p>`,
  dialogue: [
    { who: 'Marco', sk: 'Dobrý deň! Ja som Marco.', it: 'Buongiorno! Io sono Marco.' },
    { who: 'Zuzana', sk: 'Dobrý deň! Volám sa Zuzana. Teší ma.', it: 'Buongiorno! Mi chiamo Zuzana. Piacere.' },
    { who: 'Marco', sk: 'Aj mňa teší.', it: 'Piacere mio.' },
    { who: 'Zuzana', sk: 'Odkiaľ ste?', it: 'Di dov\'è?' },
    { who: 'Marco', sk: 'Som z Talianska, z Milána.', it: 'Sono italiano, di Milano.' },
    { who: 'Zuzana', sk: 'Výborne! Vitajte na Slovensku!', it: 'Ottimo! Benvenuto in Slovacchia!' }
  ],
  sentences: [
    { sk: 'Dobrý deň, volám sa Zuzana.', it: 'Buongiorno, mi chiamo Zuzana.' },
    { sk: 'Mám sa dobre, ďakujem.', it: 'Sto bene, grazie.' },
    { sk: 'Som z Talianska.', it: 'Vengo dall\'Italia.' },
    { sk: 'Ako sa máte?', it: 'Come sta? (formale)' }
  ]
},
{
  id: 'numeri', emoji: '🔢', title: 'Numeri', sk: 'Čísla',
  desc: 'Contare, prezzi e "Koľko to stojí?".',
  vocab: [
    { sk: 'nula', it: 'zero (0)', pr: 'NU-la' },
    { sk: 'jeden', it: 'uno (1)', pr: 'IE-den' },
    { sk: 'dva', it: 'due (2)', pr: 'DVA' },
    { sk: 'tri', it: 'tre (3)', pr: 'TRI' },
    { sk: 'štyri', it: 'quattro (4)', pr: 'ŠTI-ri' },
    { sk: 'päť', it: 'cinque (5)', pr: 'PETJ' },
    { sk: 'šesť', it: 'sei (6)', pr: 'ŠESTJ' },
    { sk: 'sedem', it: 'sette (7)', pr: 'SE-dem' },
    { sk: 'osem', it: 'otto (8)', pr: 'O-sem' },
    { sk: 'deväť', it: 'nove (9)', pr: 'DJE-vetj' },
    { sk: 'desať', it: 'dieci (10)', pr: 'DJE-satj' },
    { sk: 'dvadsať', it: 'venti (20)', pr: 'DVA-tsatj' },
    { sk: 'sto', it: 'cento (100)', pr: 'STO' },
    { sk: 'tisíc', it: 'mille (1000)', pr: 'TJI-siits' },
    { sk: 'Koľko to stojí?', it: 'Quanto costa?', pr: 'KOĽ-ko to STO-jii' }
  ],
  grammar: `
<h4>Da 11 a 19: "-násť"</h4>
<p>jedenásť (11), dvanásť (12), trinásť (13), štrnásť (14), pätnásť (15), šestnásť (16), sedemnásť (17), osemnásť (18), devätnásť (19).</p>
<h4>Le decine: "-dsať" / "-desiat"</h4>
<p>dvadsať (20), tridsať (30), štyridsať (40), päťdesiat (50), šesťdesiat (60)… sto (100). Si costruiscono come in italiano: <i>dvadsaťjeden</i> = ventuno.</p>
<h4>1 e 2 cambiano col genere</h4>
<p><b>jeden</b> (m) · <b>jedna</b> (f) · <b>jedno</b> (n): <i>jeden čaj, jedna káva, jedno pivo</i>. Il 2: <b>dva</b> (m) · <b>dve</b> (f, n): <i>dva čaje, dve kávy</i>.</p>
<h4>Il sostantivo cambia dopo il numero (diverso dall'italiano!)</h4>
<table>
<tr><th>numero</th><th>forma</th><th>esempio</th></tr>
<tr><td>1</td><td>singolare</td><td>jedno euro</td></tr>
<tr><td>2, 3, 4</td><td>plurale</td><td>dve eurá</td></tr>
<tr><td>5 e oltre</td><td>genitivo plurale</td><td>päť eur</td></tr>
</table>
<p>Non serve impararlo subito a memoria: basta riconoscerlo quando lo senti al mercato! 😊</p>`,
  dialogue: [
    { who: 'Cliente', sk: 'Dobrý deň, koľko stoja jablká?', it: 'Buongiorno, quanto costano le mele?' },
    { who: 'Venditrice', sk: 'Kilo stojí dve eurá.', it: 'Un chilo costa due euro.' },
    { who: 'Cliente', sk: 'Dám si dve kilá, prosím.', it: 'Ne prendo due chili, per favore.' },
    { who: 'Venditrice', sk: 'Nech sa páči. Spolu štyri eurá.', it: 'Ecco a Lei. In tutto quattro euro.' },
    { who: 'Cliente', sk: 'Ďakujem, dovidenia!', it: 'Grazie, arrivederci!' }
  ],
  sentences: [
    { sk: 'Koľko to stojí?', it: 'Quanto costa?' },
    { sk: 'Kilo stojí dve eurá.', it: 'Un chilo costa due euro.' },
    { sk: 'Mám dvadsať rokov.', it: 'Ho vent\'anni.' }
  ]
},
{
  id: 'famiglia', emoji: '👨‍👩‍👧', title: 'Famiglia', sk: 'Rodina',
  desc: 'Parenti, "môj / moja / moje" e il verbo mať.',
  vocab: [
    { sk: 'rodina', it: 'famiglia', pr: 'RO-dji-na' },
    { sk: 'mama', it: 'mamma', pr: 'MA-ma' },
    { sk: 'otec', it: 'padre', pr: 'O-tets' },
    { sk: 'brat', it: 'fratello', pr: 'BRAT' },
    { sk: 'sestra', it: 'sorella', pr: 'SES-tra' },
    { sk: 'syn', it: 'figlio', pr: 'SIN' },
    { sk: 'dcéra', it: 'figlia', pr: 'TSEE-ra' },
    { sk: 'manžel', it: 'marito', pr: 'MAN-žel' },
    { sk: 'manželka', it: 'moglie', pr: 'MAN-žel-ka' },
    { sk: 'dieťa', it: 'bambino / bambina', pr: 'DJIE-tja' },
    { sk: 'deti', it: 'bambini / figli', pr: 'DJE-tji' },
    { sk: 'starý otec', it: 'nonno', pr: 'STA-rii O-tets', alt: ['dedo', 'dedko'] },
    { sk: 'stará mama', it: 'nonna', pr: 'STA-raa MA-ma', alt: ['babka', 'babička'] },
    { sk: 'súrodenci', it: 'fratelli e sorelle', pr: 'SUU-ro-djen-tsi' },
    { sk: 'priateľ', it: 'amico / fidanzato', pr: 'PRIA-tjeľ' }
  ],
  grammar: `
<h4>Tre generi: maschile, femminile e neutro</h4>
<p>Quasi sempre si capisce dalla fine della parola:</p>
<table>
<tr><th>genere</th><th>finisce in…</th><th>esempi</th></tr>
<tr><td>maschile</td><td>consonante</td><td>brat, syn, otec</td></tr>
<tr><td>femminile</td><td>-a</td><td>mama, sestra, rodina</td></tr>
<tr><td>neutro</td><td>-o, -e, -a</td><td>auto, more, dieťa</td></tr>
</table>
<h4>Mio, mia: môj / moja / moje</h4>
<p><b>môj</b> brat · <b>moja</b> sestra · <b>moje</b> dieťa. Niente articolo: "il mio fratello" = solo <i>môj brat</i>.</p>
<h4>Avere: mať + accusativo</h4>
<p>Dopo <i>mám</i> (ho) il nome può cambiare finale: <i>sestra → Mám sestr<b>u</b></i>, <i>brat → Mám brat<b>a</b></i>. È il caso <b>accusativo</b> (lo vedremo meglio nell'unità "Genere e casi").</p>
<h4>Negazione: ne- attaccato al verbo</h4>
<p><i>mám</i> (ho) → <i>nemám</i> (non ho). <i>Nemám deti.</i> = Non ho figli.</p>`,
  dialogue: [
    { who: 'Peter', sk: 'Máš súrodencov?', it: 'Hai fratelli o sorelle?' },
    { who: 'Chiara', sk: 'Áno, mám jedného brata a jednu sestru.', it: 'Sì, ho un fratello e una sorella.' },
    { who: 'Peter', sk: 'Ako sa volajú?', it: 'Come si chiamano?' },
    { who: 'Chiara', sk: 'Brat sa volá Luca a sestra sa volá Sara.', it: 'Mio fratello si chiama Luca e mia sorella si chiama Sara.' },
    { who: 'Peter', sk: 'A máš deti?', it: 'E hai figli?' },
    { who: 'Chiara', sk: 'Nie, nemám deti. Ale mám psa!', it: 'No, non ho figli. Ma ho un cane!' }
  ],
  sentences: [
    { sk: 'Mám brata a sestru.', it: 'Ho un fratello e una sorella.' },
    { sk: 'Moja mama sa volá Anna.', it: 'Mia mamma si chiama Anna.' },
    { sk: 'Nemám deti.', it: 'Non ho figli.' }
  ]
},
{
  id: 'cibo', emoji: '🍲', title: 'Cibo e bevande · al ristorante', sk: 'Jedlo a nápoje',
  desc: 'Ordinare, pagare e brindare: Na zdravie!',
  vocab: [
    { sk: 'voda', it: 'acqua', pr: 'VO-da' },
    { sk: 'káva', it: 'caffè', pr: 'KAA-va' },
    { sk: 'pivo', it: 'birra', pr: 'PI-vo' },
    { sk: 'víno', it: 'vino', pr: 'VII-no' },
    { sk: 'polievka', it: 'zuppa', pr: 'PO-lieu-ka' },
    { sk: 'ryba', it: 'pesce', pr: 'RI-ba' },
    { sk: 'zelenina', it: 'verdura', pr: 'ZE-le-gni-na' },
    { sk: 'ovocie', it: 'frutta', pr: 'O-vo-tsie' },
    { sk: 'jablko', it: 'mela', pr: 'IA-bl-ko' },
    { sk: 'jedálny lístok', it: 'menù', pr: 'IE-daal-ni LIIS-tok' },
    { sk: 'účet', it: 'conto', pr: 'UU-čet' },
    { sk: 'Dám si…', it: 'Prendo…', pr: 'DAAM si' },
    { sk: 'Dobrú chuť!', it: 'Buon appetito!', pr: 'DO-bruu KHUTJ' },
    { sk: 'Na zdravie!', it: 'Salute! (brindisi)', pr: 'NA-zdra-vie' },
    { sk: 'Chutí mi.', it: 'Mi piace (il sapore).', pr: 'KHU-tjii mi' }
  ],
  grammar: `
<h4>Ordinare: "Dám si…" + accusativo</h4>
<p>Le parole <b>femminili in -a</b> cambiano in <b>-u</b> quando sono l'oggetto:</p>
<table>
<tr><th>parola</th><th>ordinare</th></tr>
<tr><td>káva</td><td>Dám si káv<b>u</b>.</td></tr>
<tr><td>polievka</td><td>Dám si polievk<b>u</b>.</td></tr>
<tr><td>voda</td><td>Dám si vod<b>u</b>.</td></tr>
<tr><td>pivo, víno (neutro)</td><td>Dám si pivo. (non cambia)</td></tr>
<tr><td>čaj (maschile, cosa)</td><td>Dám si čaj. (non cambia)</td></tr>
</table>
<h4>Al bar e al ristorante</h4>
<ul>
<li><b>Čo si dáte?</b> = Cosa prende?</li>
<li><b>Zaplatím, prosím.</b> / <b>Účet, prosím.</b> = Il conto, per favore.</li>
<li><b>Nech sa páči.</b> = Ecco a Lei / Prego (quando si porge qualcosa).</li>
</ul>
<p>💡 Cultura: per brindare si dice <b>Na zdravie!</b> guardandosi negli occhi. Piatto nazionale: <i>bryndzové halušky</i> (gnocchetti con formaggio di pecora).</p>`,
  dialogue: [
    { who: 'Cameriere', sk: 'Dobrý večer. Čo si dáte?', it: 'Buonasera. Cosa prende?' },
    { who: 'Ospite', sk: 'Dám si polievku a rezeň.', it: 'Prendo una zuppa e una cotoletta.' },
    { who: 'Cameriere', sk: 'A na pitie?', it: 'E da bere?' },
    { who: 'Ospite', sk: 'Jedno pivo, prosím.', it: 'Una birra, per favore.' },
    { who: 'Cameriere', sk: 'Nech sa páči. Dobrú chuť!', it: 'Ecco a Lei. Buon appetito!' },
    { who: 'Ospite', sk: 'Zaplatím, prosím.', it: 'Il conto, per favore.' },
    { who: 'Cameriere', sk: 'Spolu dvanásť eur.', it: 'In tutto dodici euro.' }
  ],
  sentences: [
    { sk: 'Dám si kávu, prosím.', it: 'Prendo un caffè, per favore.' },
    { sk: 'Jedno pivo, prosím.', it: 'Una birra, per favore.' },
    { sk: 'Polievka je dobrá.', it: 'La zuppa è buona.' },
    { sk: 'Zaplatím, prosím.', it: 'Il conto, per favore.' }
  ]
},
{
  id: 'colori', emoji: '🎨', title: 'Colori e aggettivi', sk: 'Farby a prídavné mená',
  desc: 'červený, modrý, veľký, malý… e l\'accordo.',
  vocab: [
    { sk: 'červený', it: 'rosso', pr: 'ČER-ve-nii' },
    { sk: 'modrý', it: 'blu / azzurro', pr: 'MO-drii' },
    { sk: 'zelený', it: 'verde', pr: 'ZE-le-nii' },
    { sk: 'žltý', it: 'giallo', pr: 'ŽL-tii' },
    { sk: 'biely', it: 'bianco', pr: 'BIE-li' },
    { sk: 'čierny', it: 'nero', pr: 'ČIER-ni' },
    { sk: 'hnedý', it: 'marrone', pr: 'HGNE-dii' },
    { sk: 'sivý', it: 'grigio', pr: 'SI-vii' },
    { sk: 'ružový', it: 'rosa', pr: 'RU-žo-vii' },
    { sk: 'veľký', it: 'grande', pr: 'VEĽ-kii' },
    { sk: 'malý', it: 'piccolo', pr: 'MA-lii' },
    { sk: 'pekný', it: 'bello', pr: 'PEK-nii' },
    { sk: 'dobrý', it: 'buono', pr: 'DO-brii' },
    { sk: 'nový', it: 'nuovo', pr: 'NO-vii' },
    { sk: 'starý', it: 'vecchio', pr: 'STA-rii' }
  ],
  grammar: `
<h4>L'aggettivo va PRIMA del nome</h4>
<p>In italiano diciamo "una casa grande", in slovacco <b>veľký dom</b> (grande casa). L'aggettivo sta quasi sempre davanti.</p>
<h4>Accordo: -ý / -á / -é</h4>
<table>
<tr><th>maschile</th><th>femminile</th><th>neutro</th></tr>
<tr><td>veľk<b>ý</b> dom</td><td>veľk<b>á</b> taška</td><td>veľk<b>é</b> auto</td></tr>
<tr><td>červen<b>ý</b> šál</td><td>červen<b>á</b> taška</td><td>červen<b>é</b> víno</td></tr>
<tr><td>nov<b>ý</b> vlak</td><td>nov<b>á</b> kniha</td><td>nov<b>é</b> mesto</td></tr>
</table>
<p>Alcuni aggettivi "morbidi" hanno -y/-a/-e brevi dopo una sillaba lunga: <i>biely, biela, biele</i>; <i>čierny, čierna, čierne</i>. Nel dizionario trovi sempre la forma maschile.</p>
<h4>Domanda: "Aký?" = Che / quale?</h4>
<p><b>Aký</b> (m) · <b>Aká</b> (f) · <b>Aké</b> (n). <i>Aké je auto?</i> – <i>Auto je červené.</i></p>`,
  dialogue: [
    { who: 'Jana', sk: 'Aké tričko chceš?', it: 'Che maglietta vuoi?' },
    { who: 'Luca', sk: 'To modré. Alebo to červené?', it: 'Quella blu. O quella rossa?' },
    { who: 'Jana', sk: 'Červené je veľmi pekné!', it: 'Quella rossa è molto bella!' },
    { who: 'Luca', sk: 'Dobre, beriem červené.', it: 'Va bene, prendo quella rossa.' }
  ],
  sentences: [
    { sk: 'Auto je červené.', it: 'La macchina è rossa.' },
    { sk: 'Mám veľký dom.', it: 'Ho una casa grande.' },
    { sk: 'Taška je nová a pekná.', it: 'La borsa è nuova e bella.' }
  ]
},
{
  id: 'tempo', emoji: '📅', title: 'Giorni, mesi e ora', sk: 'Dni, mesiace a čas',
  desc: 'pondelok… nedeľa, oggi, domani e che ore sono.',
  vocab: [
    { sk: 'pondelok', it: 'lunedì', pr: 'PON-dje-lok' },
    { sk: 'utorok', it: 'martedì', pr: 'U-to-rok' },
    { sk: 'streda', it: 'mercoledì', pr: 'STRE-da' },
    { sk: 'štvrtok', it: 'giovedì', pr: 'ŠTVR-tok' },
    { sk: 'piatok', it: 'venerdì', pr: 'PIA-tok' },
    { sk: 'sobota', it: 'sabato', pr: 'SO-bo-ta' },
    { sk: 'nedeľa', it: 'domenica', pr: 'GNE-dje-ľa' },
    { sk: 'dnes', it: 'oggi', pr: 'DGNES' },
    { sk: 'zajtra', it: 'domani', pr: 'ZAI-tra' },
    { sk: 'včera', it: 'ieri', pr: 'FČE-ra' },
    { sk: 'ráno', it: 'mattina', pr: 'RAA-no' },
    { sk: 'večer', it: 'sera', pr: 'VE-čer' },
    { sk: 'týždeň', it: 'settimana', pr: 'TIIŽ-djegn' },
    { sk: 'mesiac', it: 'mese', pr: 'ME-siats' },
    { sk: 'Koľko je hodín?', it: 'Che ore sono?', pr: 'KOĽ-ko ie HO-djiin' }
  ],
  grammar: `
<h4>I giorni: si scrivono con la minuscola</h4>
<p>Come in italiano. Curiosità: <b>streda</b> = "il mezzo" (della settimana), <b>štvrtok</b> = il quarto giorno, <b>piatok</b> = il quinto, <b>nedeľa</b> = "non si lavora" (ne + dielo).</p>
<h4>"Lunedì" = <i>v</i> pondelok</h4>
<p>Per dire <i>quando</i> si usa <b>v / vo</b>: <i>v pondelok, v piatok, v sobotu, v nedeľu, vo štvrtok</i>. Attenzione: sobota → v sobot<b>u</b>, nedeľa → v nedeľ<b>u</b> (accusativo!).</p>
<h4>I mesi: facili per un italiano!</h4>
<p>január, február, marec, apríl, máj, jún, júl, august, september, október, november, december.</p>
<h4>Che ore sono?</h4>
<table>
<tr><th>ore</th><th>slovacco</th></tr>
<tr><td>1</td><td>Je jedna hodina.</td></tr>
<tr><td>2, 3, 4</td><td>Sú dve / tri / štyri hodiny.</td></tr>
<tr><td>5+</td><td>Je päť hodín.</td></tr>
</table>
<p>"A che ora?" = <b>O koľkej?</b> → <i>o jednej, o druhej, o tretej… o siedmej</i>.</p>`,
  dialogue: [
    { who: 'Tomáš', sk: 'Kedy máš čas?', it: 'Quando hai tempo?' },
    { who: 'Elena', sk: 'V piatok večer.', it: 'Venerdì sera.' },
    { who: 'Tomáš', sk: 'O koľkej?', it: 'A che ora?' },
    { who: 'Elena', sk: 'O siedmej.', it: 'Alle sette.' },
    { who: 'Tomáš', sk: 'Dobre, tak v piatok o siedmej!', it: 'Va bene, allora venerdì alle sette!' }
  ],
  sentences: [
    { sk: 'Dnes je pondelok.', it: 'Oggi è lunedì.' },
    { sk: 'Zajtra je sobota.', it: 'Domani è sabato.' },
    { sk: 'Je päť hodín.', it: 'Sono le cinque.' },
    { sk: 'V piatok mám čas.', it: 'Venerdì ho tempo.' }
  ]
},
{
  id: 'citta', emoji: '🏙️', title: 'In città · direzioni', sk: 'V meste',
  desc: 'Kde je…? A sinistra, a destra, dritto.',
  vocab: [
    { sk: 'mesto', it: 'città', pr: 'MES-to' },
    { sk: 'ulica', it: 'via / strada', pr: 'U-li-tsa' },
    { sk: 'námestie', it: 'piazza', pr: 'NAA-mes-tje' },
    { sk: 'stanica', it: 'stazione', pr: 'STA-gni-tsa' },
    { sk: 'obchod', it: 'negozio', pr: 'OB-khot' },
    { sk: 'lekáreň', it: 'farmacia', pr: 'LE-kaa-regn' },
    { sk: 'nemocnica', it: 'ospedale', pr: 'GNE-mots-gni-tsa' },
    { sk: 'kostol', it: 'chiesa', pr: 'KOS-tol' },
    { sk: 'hrad', it: 'castello', pr: 'HRAT' },
    { sk: 'doľava', it: 'a sinistra', pr: 'DO-ľa-va', alt: ['vľavo'] },
    { sk: 'doprava', it: 'a destra', pr: 'DO-pra-va', alt: ['vpravo'] },
    { sk: 'rovno', it: 'dritto', pr: 'ROU-no' },
    { sk: 'blízko', it: 'vicino', pr: 'BLIIS-ko' },
    { sk: 'ďaleko', it: 'lontano', pr: 'DJA-le-ko' },
    { sk: 'Kde je…?', it: 'Dov\'è…?', pr: 'GDE ie' }
  ],
  grammar: `
<h4>Chiedere la strada</h4>
<ul>
<li><b>Prepáčte, kde je stanica?</b> = Mi scusi, dov'è la stazione?</li>
<li><b>Je to ďaleko?</b> = È lontano?</li>
<li><b>Choďte rovno / doľava / doprava.</b> = Vada dritto / a sinistra / a destra.</li>
</ul>
<h4>"In" e "a": v / na + locativo</h4>
<p>Per dire <i>dove si trova</i> qualcosa si usano <b>v</b> (in) e <b>na</b> (su, a) e la parola cambia finale (caso locativo). Per ora imparale come frasi fatte:</p>
<table>
<tr><th>parola</th><th>dove?</th></tr>
<tr><td>mesto</td><td>v mest<b>e</b> (in città)</td></tr>
<tr><td>námestie</td><td>na námest<b>í</b> (in piazza)</td></tr>
<tr><td>stanica</td><td>na stanic<b>i</b> (in stazione)</td></tr>
<tr><td>Bratislava</td><td>v Bratislav<b>e</b> (a Bratislava)</td></tr>
</table>
<p>💡 <i>doprava</i> significa anche "trasporti": <i>verejná doprava</i> = trasporto pubblico.</p>`,
  dialogue: [
    { who: 'Turista', sk: 'Prepáčte, kde je stanica?', it: 'Mi scusi, dov\'è la stazione?' },
    { who: 'Signore', sk: 'Choďte rovno a potom doľava.', it: 'Vada dritto e poi a sinistra.' },
    { who: 'Turista', sk: 'Je to ďaleko?', it: 'È lontano?' },
    { who: 'Signore', sk: 'Nie, je to blízko. Asi päť minút pešo.', it: 'No, è vicino. Circa cinque minuti a piedi.' },
    { who: 'Turista', sk: 'Ďakujem pekne!', it: 'Grazie mille!' },
    { who: 'Signore', sk: 'Nie je za čo.', it: 'Di niente.' }
  ],
  sentences: [
    { sk: 'Kde je stanica?', it: 'Dov\'è la stazione?' },
    { sk: 'Choďte rovno a potom doľava.', it: 'Vada dritto e poi a sinistra.' },
    { sk: 'Lekáreň je blízko.', it: 'La farmacia è vicina.' }
  ]
},
{
  id: 'verbi', emoji: '🏃', title: 'Verbi base', sk: 'Základné slovesá',
  desc: 'byť, mať, ísť, chcieť… al presente.',
  vocab: [
    { sk: 'byť', it: 'essere', pr: 'BITJ' },
    { sk: 'mať', it: 'avere', pr: 'MATJ' },
    { sk: 'ísť', it: 'andare (a piedi)', pr: 'IISTJ' },
    { sk: 'chcieť', it: 'volere', pr: 'KHTSIETJ' },
    { sk: 'robiť', it: 'fare', pr: 'RO-bitj' },
    { sk: 'hovoriť', it: 'parlare', pr: 'HO-vo-ritj' },
    { sk: 'rozumieť', it: 'capire', pr: 'RO-zu-mietj' },
    { sk: 'bývať', it: 'abitare', pr: 'BII-vatj' },
    { sk: 'pracovať', it: 'lavorare', pr: 'PRA-tso-vatj' },
    { sk: 'piť', it: 'bere', pr: 'PITJ' },
    { sk: 'jesť', it: 'mangiare', pr: 'IESTJ' },
    { sk: 'učiť sa', it: 'studiare / imparare', pr: 'U-čitj sa' }
  ],
  grammar: `
<h4>Il presente: byť (essere) e mať (avere)</h4>
<table>
<tr><th></th><th>byť</th><th>mať</th><th>ísť</th><th>chcieť</th></tr>
<tr><td>ja (io)</td><td>som</td><td>mám</td><td>idem</td><td>chcem</td></tr>
<tr><td>ty (tu)</td><td>si</td><td>máš</td><td>ideš</td><td>chceš</td></tr>
<tr><td>on, ona, ono</td><td>je</td><td>má</td><td>ide</td><td>chce</td></tr>
<tr><td>my (noi)</td><td>sme</td><td>máme</td><td>ideme</td><td>chceme</td></tr>
<tr><td>vy (voi / Lei)</td><td>ste</td><td>máte</td><td>idete</td><td>chcete</td></tr>
<tr><td>oni, ony</td><td>sú</td><td>majú</td><td>idú</td><td>chcú</td></tr>
</table>
<h4>Tre modelli regolari</h4>
<p><b>-ám</b>: bývať → bývam, bývaš, býva… · <b>-ím</b>: robiť → robím, robíš, robí… · <b>-em / -iem</b>: rozumieť → rozumiem, rozumieš…; pracovať → pracujem, pracuješ…</p>
<h4>Come in italiano: il pronome si omette</h4>
<p><i>Bývam v Ríme.</i> = Abito a Roma. (<i>ja</i> si usa solo per enfasi.)</p>
<h4>Negazione</h4>
<p><b>ne-</b> si scrive attaccato: <i>nemám, nerozumiem, nechcem</i>. Eccezione: <b>nie som, nie si, nie je…</b></p>
<h4>L'aspetto (solo un assaggio)</h4>
<p>Molti verbi hanno due forme: <i>robiť</i> (fare, azione in corso) e <i>urobiť</i> (fare e finire). È una grande differenza rispetto all'italiano, ma al livello A1 basta riconoscerla.</p>`,
  dialogue: [
    { who: 'Mária', sk: 'Hovoríš po slovensky?', it: 'Parli slovacco?' },
    { who: 'Paolo', sk: 'Len trochu. Učím sa slovenčinu.', it: 'Solo un po\'. Sto imparando lo slovacco.' },
    { who: 'Mária', sk: 'Kde bývaš?', it: 'Dove abiti?' },
    { who: 'Paolo', sk: 'Bývam v Bratislave, ale som z Ríma.', it: 'Abito a Bratislava, ma sono di Roma.' },
    { who: 'Mária', sk: 'A čo robíš?', it: 'E che lavoro fai?' },
    { who: 'Paolo', sk: 'Pracujem v banke. Prepáč, nerozumiem všetko. Môžeš hovoriť pomalšie?', it: 'Lavoro in banca. Scusa, non capisco tutto. Puoi parlare più lentamente?' }
  ],
  sentences: [
    { sk: 'Hovorím trochu po slovensky.', it: 'Parlo un po\' di slovacco.' },
    { sk: 'Bývam v Bratislave.', it: 'Abito a Bratislava.' },
    { sk: 'Chcem ísť domov.', it: 'Voglio andare a casa.' },
    { sk: 'Nerozumiem, prepáčte.', it: 'Non capisco, mi scusi.' }
  ]
},
{
  id: 'casi', emoji: '🧩', title: 'Genere e casi (introduzione)', sk: 'Rod a pády',
  desc: 'Nominativo e accusativo senza paura.',
  vocab: [
    { sk: 'muž', it: 'uomo', pr: 'MUŠ' },
    { sk: 'žena', it: 'donna', pr: 'ŽE-na' },
    { sk: 'kamarát', it: 'amico', pr: 'KA-ma-raat' },
    { sk: 'kamarátka', it: 'amica', pr: 'KA-ma-raat-ka' },
    { sk: 'pes', it: 'cane', pr: 'PES' },
    { sk: 'mačka', it: 'gatto / gatta', pr: 'MAČ-ka' },
    { sk: 'kniha', it: 'libro', pr: 'KGNI-ha' },
    { sk: 'stôl', it: 'tavolo', pr: 'STUOL' },
    { sk: 'auto', it: 'macchina', pr: 'AU-to' },
    { sk: 'okno', it: 'finestra', pr: 'OK-no' },
    { sk: 'taška', it: 'borsa', pr: 'TAŠ-ka' },
    { sk: 'more', it: 'mare', pr: 'MO-re' },
    { sk: 'dom', it: 'casa', pr: 'DOM' }
  ],
  grammar: `
<h4>Perché le parole cambiano finale?</h4>
<p>L'italiano usa l'<b>ordine delle parole</b> e le preposizioni per dire chi fa cosa. Lo slovacco usa le <b>desinenze</b> (finali): sono i <b>casi</b>. Ce ne sono 6. Al livello A1 ne bastano due.</p>
<h4>Nominativo = il soggetto (Kto? Čo? – Chi? Cosa?)</h4>
<p><i><b>Kniha</b> je na stole.</i> = Il libro è sul tavolo.</p>
<h4>Accusativo = l'oggetto diretto (Koho? Čo? – Chi? Cosa?)</h4>
<table>
<tr><th>tipo</th><th>nominativo</th><th>accusativo</th></tr>
<tr><td>femminile -a</td><td>kniha, žena, mačka</td><td>Čítam knih<b>u</b>. Vidím žen<b>u</b>. Mám mačk<b>u</b>.</td></tr>
<tr><td>maschile animato (persone, animali)</td><td>brat, kamarát, pes</td><td>Mám brat<b>a</b>. Čakám kamarát<b>a</b>. Mám ps<b>a</b>.</td></tr>
<tr><td>maschile inanimato (cose)</td><td>stôl, dom</td><td>Mám dom. (uguale)</td></tr>
<tr><td>neutro</td><td>auto, okno, more</td><td>Mám auto. Vidím more. (uguale)</td></tr>
</table>
<p>Anche l'aggettivo si adegua: <i>Mám veľk<b>ú</b> tašk<b>u</b>.</i> = Ho una borsa grande.</p>
<p>💡 Trucco: se la parola è <b>femminile in -a</b>, come oggetto diventa quasi sempre <b>-u</b>. Questo da solo copre moltissime frasi!</p>`,
  dialogue: [
    { who: 'Katka', sk: 'Čo čítaš?', it: 'Cosa leggi?' },
    { who: 'Marco', sk: 'Čítam knihu o Slovensku.', it: 'Leggo un libro sulla Slovacchia.' },
    { who: 'Katka', sk: 'Máš doma zviera?', it: 'Hai un animale a casa?' },
    { who: 'Marco', sk: 'Áno, mám psa. Volá sa Rex. A ty?', it: 'Sì, ho un cane. Si chiama Rex. E tu?' },
    { who: 'Katka', sk: 'Ja mám mačku. Volá sa Micka.', it: 'Io ho una gatta. Si chiama Micka.' }
  ],
  sentences: [
    { sk: 'Čítam knihu.', it: 'Leggo un libro.' },
    { sk: 'Vidím ženu.', it: 'Vedo una donna.' },
    { sk: 'Mám psa a mačku.', it: 'Ho un cane e un gatto.' },
    { sk: 'Mám veľkú tašku.', it: 'Ho una borsa grande.' }
  ]
},
{
  id: 'viaggi', emoji: '🚆', title: 'Viaggiare e fare acquisti', sk: 'Cestovanie a nakupovanie',
  desc: 'Biglietti, hotel, pagare con carta.',
  vocab: [
    { sk: 'vlak', it: 'treno', pr: 'VLAK' },
    { sk: 'autobus', it: 'autobus', pr: 'AU-to-bus' },
    { sk: 'lietadlo', it: 'aereo', pr: 'LIE-tad-lo' },
    { sk: 'lístok', it: 'biglietto', pr: 'LIIS-tok' },
    { sk: 'letisko', it: 'aeroporto', pr: 'LE-tjis-ko' },
    { sk: 'batožina', it: 'bagaglio', pr: 'BA-to-ži-na' },
    { sk: 'izba', it: 'camera / stanza', pr: 'IZ-ba' },
    { sk: 'kľúč', it: 'chiave', pr: 'KĽUUČ' },
    { sk: 'peniaze', it: 'soldi', pr: 'PE-gnia-ze' },
    { sk: 'lacný', it: 'economico', pr: 'LATS-nii' },
    { sk: 'drahý', it: 'caro (di prezzo)', pr: 'DRA-hii' },
    { sk: 'Môžem platiť kartou?', it: 'Posso pagare con la carta?', pr: 'MUO-žem PLA-tjitj KAR-tou' },
    { sk: 'Chcel by som…', it: 'Vorrei… (detto da un uomo)', pr: 'KHTSEL bi som' },
    { sk: 'Chcela by som…', it: 'Vorrei… (detto da una donna)', pr: 'KHTSE-la bi som' }
  ],
  grammar: `
<h4>"Vorrei": cambia se sei uomo o donna!</h4>
<p>Il condizionale usa il passato del verbo + <b>by</b>, e il passato ha il genere:</p>
<table>
<tr><th>uomo</th><th>donna</th></tr>
<tr><td>Chcel by som kávu.</td><td>Chcela by som kávu.</td></tr>
<tr><td>Bol som v Bratislave. (sono stato)</td><td>Bola som v Bratislave. (sono stata)</td></tr>
</table>
<h4>"Per / a" una città: do + genitivo</h4>
<p><i>Jeden lístok <b>do</b> Bratislav<b>y</b> / do Košíc / do Žiliny.</i> Impara i nomi delle città più usate come frasi fatte.</p>
<h4>Parole utili al negozio</h4>
<ul>
<li><b>To je všetko.</b> = È tutto.</li>
<li><b>Je to príliš drahé.</b> = È troppo caro.</li>
<li><b>Hotovosťou alebo kartou?</b> = In contanti o con carta?</li>
</ul>`,
  dialogue: [
    { who: 'Viaggiatrice', sk: 'Dobrý deň, jeden lístok do Košíc, prosím.', it: 'Buongiorno, un biglietto per Košice, per favore.' },
    { who: 'Bigliettaio', sk: 'Jednosmerný alebo spiatočný?', it: 'Solo andata o andata e ritorno?' },
    { who: 'Viaggiatrice', sk: 'Spiatočný, prosím. Koľko stojí?', it: 'Andata e ritorno, per favore. Quanto costa?' },
    { who: 'Bigliettaio', sk: 'Tridsať eur.', it: 'Trenta euro.' },
    { who: 'Viaggiatrice', sk: 'Môžem platiť kartou?', it: 'Posso pagare con la carta?' },
    { who: 'Bigliettaio', sk: 'Áno, samozrejme. Šťastnú cestu!', it: 'Sì, certo. Buon viaggio!' }
  ],
  sentences: [
    { sk: 'Jeden lístok do Košíc, prosím.', it: 'Un biglietto per Košice, per favore.' },
    { sk: 'Môžem platiť kartou?', it: 'Posso pagare con la carta?' },
    { sk: 'Chcel by som izbu.', it: 'Vorrei una camera. (uomo)' },
    { sk: 'Vlak je lacný.', it: 'Il treno è economico.' }
  ]
},
{
  id: 'frasi', emoji: '💬', title: 'Frasi utili', sk: 'Užitočné frázy',
  desc: 'Per sopravvivere (e farsi voler bene) in Slovacchia.',
  vocab: [
    { sk: 'Nerozumiem.', it: 'Non capisco.', pr: 'GNE-ro-zu-miem' },
    { sk: 'Hovoríte po taliansky?', it: 'Parla italiano?', pr: 'HO-vo-rii-tje po TA-lian-ski' },
    { sk: 'Hovoríte po anglicky?', it: 'Parla inglese?', pr: 'HO-vo-rii-tje po AN-glits-ki' },
    { sk: 'Pomaly, prosím.', it: 'Piano, per favore.', pr: 'PO-ma-li PRO-siim' },
    { sk: 'Môžete to zopakovať?', it: 'Può ripetere?', pr: 'MUO-že-tje to ZO-pa-ko-vatj' },
    { sk: 'Čo to znamená?', it: 'Che cosa significa?', pr: 'ČO to ZNA-me-naa' },
    { sk: 'Ako sa povie po slovensky…?', it: 'Come si dice in slovacco…?', pr: 'A-ko sa PO-vie po SLO-ven-ski' },
    { sk: 'Nie je za čo.', it: 'Di niente.', pr: 'NIE ie ZA-čo' },
    { sk: 'Nech sa páči.', it: 'Prego / Ecco a Lei.', pr: 'GNEKH sa PAA-či' },
    { sk: 'Pomoc!', it: 'Aiuto!', pr: 'PO-mots' },
    { sk: 'Mám rád…', it: 'Mi piace… (detto da un uomo)', pr: 'MAAM RAAT' },
    { sk: 'Mám rada…', it: 'Mi piace… (detto da una donna)', pr: 'MAAM RA-da' },
    { sk: 'Ľúbim ťa.', it: 'Ti amo.', pr: 'ĽUU-bim tja' },
    { sk: 'Všetko najlepšie!', it: 'Tanti auguri!', pr: 'FŠET-ko NAI-lep-šie' },
    { sk: 'Veselé Vianoce!', it: 'Buon Natale!', pr: 'VE-se-lee VIA-no-tse' }
  ],
  grammar: `
<h4>"Mi piace": mám rád / mám rada</h4>
<p>Letteralmente "ho caro": <i>Mám rád pizzu.</i> (uomo) · <i>Mám rada pizzu.</i> (donna). L'oggetto va all'accusativo: pizza → pizz<b>u</b>.</p>
<h4>Le lingue: "po + -sky"</h4>
<p><i>po slovensky, po taliansky, po anglicky, po nemecky</i> (tedesco). <i>Hovorím po taliansky.</i> = Parlo italiano.</p>
<h4>Formale: le forme in -te</h4>
<p>Con <b>Vy</b> il verbo finisce in <b>-te</b>: <i>hovoríte, môžete, prepáčte</i>. Con gli sconosciuti usa sempre questa forma.</p>
<h4>💡 Cultura</h4>
<ul>
<li>Ci si toglie le scarpe entrando in casa: ti daranno le <i>papuče</i> (pantofole).</li>
<li>Gli slovacchi amano i diminutivi: <i>pivo → pivko, káva → kávička</i>.</li>
<li>Gli onomastici (<i>meniny</i>) si festeggiano quasi come i compleanni!</li>
</ul>`,
  dialogue: [
    { who: 'Turista', sk: 'Prepáčte, hovoríte po taliansky?', it: 'Mi scusi, parla italiano?' },
    { who: 'Pani', sk: 'Nie, len po slovensky a trochu po anglicky.', it: 'No, solo slovacco e un po\' d\'inglese.' },
    { who: 'Turista', sk: 'Hľadám lekáreň.', it: 'Cerco una farmacia.' },
    { who: 'Pani', sk: 'Lekáreň je hneď za rohom.', it: 'La farmacia è proprio dietro l\'angolo.' },
    { who: 'Turista', sk: 'Môžete to zopakovať? Pomaly, prosím.', it: 'Può ripetere? Piano, per favore.' },
    { who: 'Pani', sk: 'Hneď… za… rohom.', it: 'Proprio… dietro… l\'angolo.' },
    { who: 'Turista', sk: 'Ďakujem veľmi pekne!', it: 'Grazie mille!' },
    { who: 'Pani', sk: 'Nie je za čo.', it: 'Di niente.' }
  ],
  sentences: [
    { sk: 'Hovoríte po taliansky?', it: 'Parla italiano?' },
    { sk: 'Čo to znamená?', it: 'Che cosa significa?' },
    { sk: 'Mám rád slovenské pivo.', it: 'Mi piace la birra slovacca. (uomo)' },
    { sk: 'Nie je za čo.', it: 'Di niente.' }
  ]
}
];

/* Alfabeto slovacco: 46 lettere/digrammi */
window.ALPHABET = [
  ['A','a','auto','auto','"a" italiana'],
  ['Á','á','áno','sì','"a" lunga: aa'],
  ['Ä','ä','mäso','carne','oggi si dice come "e"'],
  ['B','b','brat','fratello','come in italiano'],
  ['C','c','cukor','zucchero','sempre "zz" di pizza (ts), mai "ci"'],
  ['Č','č','čaj','tè','"ci" di ciao'],
  ['D','d','dom','casa','come in italiano'],
  ['Ď','ď','ďakujem','grazie','d "bagnata", quasi "ghi" di ghiaccio'],
  ['Dz','dz','dzvon','campana','"z" sonora di zero'],
  ['Dž','dž','džús','succo','"gi" di giorno'],
  ['E','e','euro','euro','"e" italiana'],
  ['É','é','dobré','buono (n.)','"e" lunga: ee'],
  ['F','f','farba','colore','come in italiano'],
  ['G','g','gitara','chitarra','sempre "g" dura di gatto'],
  ['H','h','hora','montagna','h sonora, si pronuncia sempre'],
  ['Ch','ch','chlieb','pane','aspirata: la "j" spagnola di jamón'],
  ['I','i','pivo','birra','"i" italiana'],
  ['Í','í','víno','vino','"i" lunga: ii'],
  ['J','j','jablko','mela','"i" di ieri'],
  ['K','k','káva','caffè','sempre "k" dura, anche davanti a e, i'],
  ['L','l','les','bosco','come in italiano'],
  ['Ĺ','ĺ','vĺča','lupacchiotto','l lunga che fa da vocale'],
  ['Ľ','ľ','ľad','ghiaccio','"gl" di figlio (leggera)'],
  ['M','m','mama','mamma','come in italiano'],
  ['N','n','noc','notte','come in italiano'],
  ['Ň','ň','kôň','cavallo','"gn" di gnocchi'],
  ['O','o','okno','finestra','"o" italiana'],
  ['Ó','ó','gól','gol','"o" lunga: oo (rara)'],
  ['Ô','ô','stôl','tavolo','"uo" di uomo'],
  ['P','p','pes','cane','come in italiano'],
  ['Q','q','quiz','quiz','solo in parole straniere'],
  ['R','r','ryba','pesce','r vibrante, come in italiano'],
  ['Ŕ','ŕ','vŕba','salice','r lunga che fa da vocale'],
  ['S','s','syr','formaggio','sempre "s" sorda di sole'],
  ['Š','š','šál','sciarpa','"sc" di scena'],
  ['T','t','tri','tre','come in italiano'],
  ['Ť','ť','ťava','cammello','t "bagnata", quasi "chi" di chiesa'],
  ['U','u','ulica','via','"u" italiana'],
  ['Ú','ú','úsmev','sorriso','"u" lunga: uu'],
  ['V','v','voda','acqua','"v"; a fine sillaba quasi "u": pravda'],
  ['W','w','web','web','solo in parole straniere'],
  ['X','x','taxík','taxi','"ks"'],
  ['Y','y','syn','figlio','come "i"'],
  ['Ý','ý','dobrý','buono','"i" lunga: ii'],
  ['Z','z','zima','inverno','"s" sonora di rosa'],
  ['Ž','ž','žaba','rana','"j" francese di jour']
];
