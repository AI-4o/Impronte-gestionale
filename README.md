# Impronte gestionale

Gestionale per l'azienda 'ImpronteSafari'.

## Segnalazioni
- [ ] User friendly edits: 
      - [ ] feat: add btn ‘pulisci’ which cleans the data in the cliente form
      - [ ] when the user clicks on create preventivo btn → rimane il form compilato, ma adesso pronto con btn updatePreventivo
      - [ ] possibilità di updatePreventivo consecutivi senza bug
- [ ] vedere come collegarsi ad un’API che fornisca province comuni CAP, in modo da avere questa situazione:
      - input lookup per inserire il comune 
      - provincia e CAP calcolati di conseguenza 
- [ ] Layout
      - [ ] quando cambiano le cifre non si spostano tot euro, ricarico, e i numeri allineati a sinistra
      - [ ] fare in modo che le somme dei tot compaiano in colonna sotto i tot 
      - [ ] tutti i numeri visualizzati o anche negli input devono e0ssere mostrati con due cifre decimali (quando sono interi si mostra ,00)
      - [ ] mostrare anche il punto es.: 10.000,00 diecimila
      - [ ] nel caso di ripetizioni di input-group, mostrare le labels solo nel primo gruppo ( tipo intestazione tabella)
- [ ] pagamenti
- [ ] incassi
- [ ] preventivo mostrare cliente
- [ ] duplicazione preventivo → permettere di creare un nuovo preventivo partendo dai dati di un preventivo esistente, e poter assegnare questo nuovo preventivo ad un cliente anche diverso da quello di partenza


## NICE TO HAVE 
* [] NTA -> script transforming .xlsx to .json
* [] implement table rows custom ordering
