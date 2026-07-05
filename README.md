# Fossacava Quiz — Il Quizzone di Roma Antica

Webapp statica (HTML/CSS/JS puro, nessuna build necessaria) con quiz a tre livelli di
difficoltà (10–13, 14–16, 17–18 anni) e quattro modalità di gioco:

- Risposta multipla (4 opzioni)
- Vero o Falso
- Indovina l'immagine (foto della cava romana di Fossacava e di Luni)
- Mix: 20 domande pescate dalle tre modalità precedenti (7 multipla + 7 vero/falso
  + 6 immagine), sempre filtrate per la fascia d'età selezionata

I contenuti uniscono la storia generale di Roma antica (re, imperatori, battaglie,
istituzioni, monumenti) con i temi specifici della cava romana di Fossacava (Carrara)
e della colonia di Luni, tratti dalla documentazione dei pannelli informativi del sito.

## Struttura del progetto

```
index.html            punto di ingresso dell'app
css/style.css          stile (palette terrosa/marmorea)
js/questions.js         banca dati delle domande
js/app.js               logica dell'applicazione
assets/img/             foto del sito + texture marmorea SVG generata
Immagini/                foto originali (non usate direttamente dall'app)
fossacava_pannelli.docx  documentazione di partenza dei pannelli del tour
```

## Pubblicare su GitHub Pages

1. Crea un repository su GitHub e carica tutto il contenuto di questa cartella
   (assicurati che `index.html` sia nella radice del repository).
2. Nel repository vai su **Settings → Pages**.
3. In "Source" seleziona il branch principale (es. `main`) e la cartella `/ (root)`.
4. Salva: dopo qualche minuto il sito sarà raggiungibile all'indirizzo
   `https://<tuo-utente>.github.io/<nome-repo>/`.

Non serve alcuna build: essendo HTML/CSS/JS statico, GitHub Pages lo serve così com'è.

## Aggiungere nuove domande

Basta modificare `js/questions.js`: ogni livello (`junior`, `medio`, `senior`) contiene
tre array (`multipla`, `vf`, `immagine`). Per le domande a risposta multipla e a
immagine l'ordine delle opzioni viene mescolato automaticamente ad ogni partita, quindi
non è necessario preoccuparsi della posizione della risposta corretta nei dati.
