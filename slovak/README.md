# Ahoj! – Slovacco per italiani 🇸🇰🇮🇹

Corso gratuito di **slovacco (livello A1)** per studenti italiani principianti assoluti.
Interfaccia e spiegazioni in italiano, contenuti in slovacco.

Live (GitHub Pages): https://jicarosni.github.io/mr.pear/slovak/

## Cosa contiene
- **12 unità A1**: Alfabeto e pronuncia · Saluti e presentazioni · Numeri · Famiglia · Cibo e bevande / al ristorante · Colori e aggettivi · Giorni, mesi e ora · In città / direzioni · Verbi base · Genere e casi (intro) · Viaggiare e fare acquisti · Frasi utili.
  Ogni unità: lessico (slovacco, italiano, pronuncia per italiani), nota grammaticale contrastiva in italiano, dialogo con traduzione, esercizi e flashcard.
- **Esercizi**: scelta multipla SK→IT e IT→SK, scrittura (accetta le risposte senza accenti con l'avviso "Attenzione agli accenti!", tastiera con le lettere speciali), abbinamento a coppie, ascolto, costruzione di frasi con tessere.
- **Flashcard con ripetizione dilazionata** (sistema Leitner a 5 scatole: 1, 2, 4, 8, 16 giorni). Anche le risposte negli esercizi aggiornano le scatole.
- **Ripasso**: parole in scadenza + errori recenti.
- **Gamification**: XP, serie di giorni (streak), obiettivo giornaliero (50 XP), stelle per unità (≥50% ★, ≥75% ★★, ≥90% ★★★).
- **Alfabeto**: le 46 lettere, cliccabili, con parola d'esempio e paragone con i suoni italiani.
- Tema chiaro/scuro, mobile-first, nessun account: tutto è salvato in `localStorage` (chiave `ahoj-sk-v1`), con esporta/importa.

## Audio
Usa la Web Speech API (`speechSynthesis`, lingua `sk-SK`). Se il dispositivo non ha una voce slovacca,
l'app lo dice nelle Impostazioni e sostituisce gli esercizi di ascolto con altri esercizi
(si possono forzare con "Esercizi di ascolto: sempre"). Di solito la voce slovacca c'è su Android (Google TTS),
iOS/macOS (voce "Laura"); su Windows si aggiunge da Impostazioni › Ora e lingua › Voce.

## Struttura
```
index.html        guscio dell'app (routing con #hash, funziona in una sottocartella)
css/style.css     stile (variabili CSS, tema scuro)
js/data.js        contenuti del corso + alfabeto (modificare qui per correggere/aggiungere parole)
js/app.js         logica: router, esercizi, SRS, XP/streak, voce
favicon.svg
RESEARCH.md       breve ricerca su come insegnano Duolingo, Babbel, Memrise, Busuu, slovake.eu, SAS
```
Nessuna dipendenza, nessun build step, nessun CDN: basta servire la cartella in modo statico.

## Sviluppo locale
```
cd slovak && python3 -m http.server 8000
# apri http://localhost:8000/
```

## Aggiungere parole
In `js/data.js` ogni voce è `{ sk, it, pr, alt?, note? }`:
`pr` = pronuncia per italiani (MAIUSCOLO = sillaba accentata, aa/ii = vocale lunga, ts = c, kh = ch, gn = ň, tj/dj = ť/ď),
`alt` = altre risposte slovacche accettate negli esercizi di scrittura.
Attenzione: cambiare l'ordine delle parole in un'unità sposta i progressi delle flashcard (la chiave è `unità:indice`).
