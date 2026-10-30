# Ricerca – come insegnano le lingue i servizi affermati (riassunto)

Obiettivo: costruire "Ahoj! – Slovacco per italiani", un corso A1 per principianti assoluti italiani.

## Cosa fanno gli altri

| Servizio | Punti di forza per principianti | Cosa ne prendiamo |
|---|---|---|
| **Duolingo** | Lezioni brevissime, molto gamificate (XP, serie di giorni / streak, livelli, obiettivo giornaliero); molti tipi di esercizio (scelta multipla, traduzione scritta, ascolto, frasi con tessere). Debole nella grammatica esplicita. | XP, streak, obiettivo giornaliero, esercizi brevi e vari, costruzione di frasi con tessere |
| **Babbel** | Lezioni di 10–15 min, dialoghi realistici, spiegazioni grammaticali chiare nella lingua del discente, feedback immediato; poca gamification. | Nota grammaticale breve **in italiano** + dialogo per ogni unità |
| **Memrise** | Flashcard con ripetizione dilazionata (spaced repetition), audio di madrelingua, mnemotecniche. | Flashcard con ripetizione dilazionata e audio |
| **Busuu** | Corsi allineati al QCER (CEFR), esercizi vari, feedback di madrelingua. | Sillabo A1 secondo il QCER |
| **Anki / SM-2 / Leitner** | Leitner: scatole, una risposta giusta sposta la carta alla scatola successiva (ripasso meno frequente), una sbagliata la riporta alla scatola 1. SM-2 / Anki: intervalli moltiplicati da un "fattore di facilità". | Sistema Leitner a 5 scatole (semplice e trasparente) in localStorage; gli errori tornano subito nel Ripasso |
| **slovake.eu** | Corso di slovacco gratuito A1–B2 con interfaccia in 16 lingue (anche italiano): esercizi interattivi, test, aiuto grammaticale, audio, dizionario, cultura. | Interfaccia nella lingua del discente, temi di vita quotidiana, pagina di pronuncia |
| **Studia Academica Slovaca (Univ. Comenius) – e-slovak A1 / Krížom-krážom** | 10 unità tematiche: saluti, dati personali, casa, città, acquisti, cibo, colori, numeri, telefono; grammatica: nominativo e accusativo, genere, aggettivi, pronomi, numerali, verbi e negazione; alfabeto e pronuncia. | Struttura in ~12 unità e grammatica limitata a genere + nominativo/accusativo |
| **Standard A1 (SAS, "Témy a ciele jazykového kurzu A1")** | 8 aree: saluti e frasi, studio e lavoro, giornata e tempo libero, spazio intorno a noi, cibo, città e viaggi, istituzioni e servizi, la mia vita. | Temi: città/direzioni, viaggi/negozio, ora e giorni |

## Decisioni di design
1. **Unità brevi** (12–17 parole + grammatica + dialogo + 12 esercizi), stile Babbel/Duolingo.
2. **Grammatica contrastiva con l'italiano**: niente articoli, casi, aspetto verbale, il "Vy" di cortesia, accento sempre sulla prima sillaba, e paragoni di suoni (č = "ci" di *ciao*, š = "sc" di *scena*, c = "zz" di *pizza*).
3. **Tipi di esercizio**: scelta multipla SK→IT e IT→SK, scrittura (tollerante agli accenti mancanti, con avviso "attenzione agli accenti"), abbinamento a coppie, ascolto (Web Speech API, `sk-SK`), costruzione di frasi con tessere, flashcard.
4. **Ripetizione dilazionata** Leitner (5 scatole: 1, 2, 4, 8, 16 giorni) + coda degli errori → modalità **Ripasso**.
5. **Gamification leggera**: XP, streak giornaliera, obiettivo giornaliero, stelle per unità.
6. Funziona offline, senza account (tutto salvato in localStorage), mobile-first.

## Fonti
- slovake.eu – https://slovake.eu/ e https://studiogaus.com/projects/slovake
- Materiali per l'autoapprendimento (IOM, elenca slovake.eu con interfaccia in italiano) – https://mic.iom.sk/en/social-issues/education/498-learn-slovak-language-for-free.html
- e-slovak A1 (Studia Academica Slovaca) – https://www.e-slovak.sk/mod/page/view.php?id=2497
- Krížom-krážom A1–B2 – https://fphil.uniba.sk/en/departments-and-research-centres/studia-academica-slovaca/publications/krizom-krazom-a1-b2
- Témy a ciele jazykového kurzu A1 (PDF) – https://slovak-language.sk/public_files/3917b8f306bd8f1973281ea385148dbe.pdf
- Confronto Babbel / Memrise / Duolingo – https://doi.org/10.5430/jct.v13n2p197
- Valutazione di app per l'apprendimento linguistico (gamification, varietà di esercizi) – https://www.emerald.com/aaouj/article/21/2/178/1370209/Evaluating-mobile-language-learning-apps-for
- Guida alle app (2026) – https://www.olesentuition.co.uk/single-post/which-app-should-i-use-to-learn-a-language-duolingo-memrise-babbel-quizlet-busuu
- Algoritmo di Anki (SM-2 modificato) – https://docs.ankiweb.net/faqs/what-spaced-repetition-algorithm
- Leitner vs SM-2 vs FSRS – https://www.deckbase.co/docs/algorithms
