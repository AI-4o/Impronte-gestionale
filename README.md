# Impronte gestionale

Gestionale per l'azienda 'ImpronteSafari'.

# Utente di prova 

mail: impronte@esempio.safari
pass: 2NkS$ncXs



### safari gestionale
- [] migrazione a nuovo db e deploy
SAFARI 
- [x] 
      - [x] migrazione
      - [ ] !! FIX: vedere preventivo_al_cliente non viene creato/recuperato correttamente 
      - [ ] !! deploy
      - [ ] sfondo celestiale disattivare al login
      - [x] !! pagina contratto
      - [ ] vedere perché fornitore, se si inserisce il suggerimento del browser, non aggiorna l’input value -> meglio disattivcare suggerimento del browser?
            idem valuta
      - [ ] aggiungere campo ***note_operative*** al preventivo,
            questo campo non si vede in interfaccia preventivo, ma solo nella tabella. Verrà modificato dalla tabella. Serve tenere delle note direttamente nella tabella a livello delle righe.
      - [ ] quali colonne deve avere la tabella:
            - nome e cognome
            - telefono
            - email
            - ***destinazione*** (quella del preventivo)
            - adulti (quella del preventivo)
            - Bambini (quella del preventivo)
            - data partenza (quella del preventivo)
            - ***tipo_viaggio*** (quella del preventivo)
            - note (quella del preventivo)
            - operatore
            - data (quella del preventivo, chiamata anche ‘data di ricezione’)
            - stato (quella del preventivo)
            - numero preventivo
            - ***note_operative***

      —
      - [ ] tabella :
            - [ ] filtrare per brand
            filtrare per nome e cognome
            per operatore

            ```
                  Stato: priorità da fare  > trattativa > confermato > inviato
            
                  destinazione
            
            ```
      - [ ] !! FEATURE: duplicazione preventivo → sistemare create preventivo nel form preventivo risultante click btn “vedi”
      - [ ] creare nuova pagina con dentro  interfaccia contratto 

      —
      - [ ] creare sistema di preferenze utente loggato:

      vogliamo che il singolo utente possa impostare un sistema di preferenze su come mostrare la tabella
      - preferenza tabella: 
        1. filtrare per brand
