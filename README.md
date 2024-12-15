# Impronte gestionale

Gestionale per l'azienda 'ImpronteSafari'.
# Workflow
1. arriva richiesta -> si registra il cliente, si registra il preventivio da fare
2. eventuali modifiche a mano delle tabelle
3. il cliente da approvazione per preventivo
4. 

# PREVENTIVI

## tabella preventivi
id
id_cliente
email
numero di telefono
id_fornitore
note
adulti
bambini
riferimento (str)
data partenza
operatore 
feedback
stato (1-da fare/2-in trattativa/3-confermato/4-inviato)
data
numero preventivo (formato AAAA brand numero-progressivo esempio: 2024IWS 001, quando il preventivo è confermato il numero progressivo cambia nel seguente modo: 
dalla data di partenza otteniamo mese mm e giorno gg
li usiamo per ottenere
mmggAAAAbrand numero-progressivo
esempio: 2024IWS 001 -> 01202024IWS 001 n   , <  p87 >
)
confermato (booleano -> preventivo/confermato)

- nota: quando confermato vale 'confermato' la casella assume bordo verde

-  possibilità di aggiungere un nuovo preventivo a mano, partendo da un preventivo già esistente
-  all'inserimento di un preventivo fare controlli per eventualmente aggiungere righe a tabelle opportune collegate a preventivo



## servizi a terra
## tabella preventivi-destinazioni --> ognuno si collega ad un preventivo (many-to-one)
## interessa calcolo di 'tot euro' = (totale/cambio) + (totale/cambio)*(parametro_inserito_da_FE)
id
id_preventivo
destinazione
id_fornitore
descrizione
data
numero-notti (int)
totale  (float)
valuta (float)
cambio
ricarico (float)
servizio aggiuntivi (booleano)


mostrare 
ricarico = totale/cambio * percentuale_ricarico
tot_euro = totale/cambio + ricarico

## voli -> interessa calcolo di 'tot euro' = (totale /cambio) + ricarico
id
id_preventivo
id_fornitore
compagnia aerea
descrizione
data partenza 
data arrivo
totale (float)
valuta (float)
cambio 
ricarico (float)


## assicurazioni -> interessa calcolo 'tot euro' = netto + ricarico
id
id_preventivo
id_fornitore
assicurazione
netto (float)
ricarico (float)


# tabella preventivo da mostrare al cliente  (PC)
id
id_preventivo
destinazione (nomi predefiniti da cercare in file da ricevere)
descrizione
tipo (destinazione/volo/assicurazione)
costo individuale -> (somma dei (tot_eur) relativi alla pratica, tabella servizi a terra, che hanno la destinazione == destinazione di questa riga)/(adulti + bambini)
importo di vendita (lo inserisce FE)
totale (lo inserisce FE)

-  aggiungere una riga alla tabella (chiunque)
-  modificare una riga della tabella (chiunque)
-  eliminare una riga della tabella (chiunque)

- note: per ogni destinazione si fa una riga di questa tabella; mentre per voli (e assicurazioni ) una riga si ottiene facendo la somma di tutti i voli
->  interessa calcolare per ogni riga 'totale' = (importo di vendita) *(adulti + bambini)
-> interessa calcolare:
1. somma totali individuali (senza riga assicurazione)
2. somma totali individuali (con riga assicurazione)

# tabella partecipanti, collegata a (PC)
id
id_preventivo
nome 
cognome 
tot_quota (scrive il FE)

-  aggiungere una riga alla tabella (chiunque)
-  modificare una riga della tabella (chiunque)
-  eliminare una riga della tabella (chiunque)

# tabella incassi partecipanti -> pagamenti fatti dai partecipanti
id
id_partecipante
importo
data scadenza
banca
data_incasso

-  aggiungere una riga alla tabella (chiunque)
-  modificare una riga della tabella (chiunque)
-  eliminare una riga della tabella (chiunque)

- note: a fe vogliamo motrare tabella partecipanti con accanto, per ogni partecipante, le caselle collegate alle righe della tabella incassi del partecipante (per ogni riga della tabella incassi)
  questa casella è tale che: 
  - mostra una stringa con la data di scadenza
  - quando la clicchi si apre una modale che permette di modificare la riga di tabella incassi
  - se l'incasso ha una data precedente alla data corrente, la casella ha bordo verde
dopo le suddette caselle, vogliamo mostrare il numero: tot_quota - (somma importi delle righe tabella incassi legate al partecipante)

# fornitori
id 
nome
valuta

-  aggiungere una riga alla tabella (chiunque)
-  modificare una riga della tabella (chiunque)
-  eliminare una riga della tabella (superutente)


# tabella pagamenti serivizi a terra
id
id_fornitore
id_servizio_a_terra
banca (numero fisso di possibilità da lista che si riceverà)
importo
data scadenza
data_incasso

- note: da mostrare accanto a tabella servizi a terra come per tabella partecipanti e tabella incassi partecipanti

# tabella pagamenti voli
id_fornitore
id_volo
banca (numero fisso di possibilità da lista che si riceverà)
importo
data scadenza
data_incasso

- note: da mostrare accanto a tabella voli come per tabella partecipanti e tabella incassi partecipanti

# tabella pagamenti assicurazioni
id_fornitore
id_assicurazione
banca (numero fisso di possibilità da lista che si riceverà)
importo
data scadenza
data_incasso

- note: da mostrare accanto a tabella assicurazioni come per tabella partecipanti e tabella incassi partecipanti
  
# CLIENTI
## db clienti
nome 
cognome 
tel  
email
tipo (PRIVATO/AGENZIA VIAGGI/ AZIENDA)
provenienza (Passaparola/Sito IWS/Sito INO/Telefono/Email Diretta/Sito ISE)
collegato (str)
città
note (str)
data di nascita

## pratiche
id
id_preventivo
id_cliente // remove
data conferma
data di partenza
data di rientro
note
numero dei passeggeri
totale pratica


# nice to have
- alcune celle possono essere modificate solo da alcuni utenti
- mettere controllo all'inserimento di clienti o fornitori in modo che non si aggiungano doppioni (controllo da fare su nome e cognome)



## NICE TO HAVE 
* [] fix auth error -> maybe connected to cookies?
* [] NTA -> script transforming .xlsx to .json
* [] implement table rows custom ordering

# todo
• fare in modo che nella tabella clienti possano essercxi clienti con nome e cognome uguali, ma ogni riga deve avere email diversa
• quando si cancella un'entità, mandare un'avviso 'sei sicuro di voler cancellare....' che indica anche le entità collegate





# todo nuovi
general interface → 
-ogni input group occupa una sola riga (e.g. ogni servizio a terra occupa una riga)
- btn + e - → fare in modo che si possa cancellare la riga che si sceglie, non l’ultima

-servizi a terra → manca fornitore e destinazione nei form di g.i.
- idem per il fornitore per voli e assicurazioni 
- per modificare g.i. si ricerca con nome o cognome cliente  → compaiono tutti i preventivi del cliente con:
data di partenza
riferimento
- fare vedere tot_euro somma sui servizi a terra e tot_euro somma sui servizi aggiuntivi
- inserire input numerico per un campo chiamato percentuale_ricarico, se viene usata per calcolare tot_euro e ricarico (ricarico viene calcolato automaticamente e mostrato)

fare in modo che mentre si aggiornano gli input vengano mostrati:
- per ogni sezione calcolare totale (servizi a terra, voli assicurazioni, servizi supplementari) campo  *tot_euro*
- totale generale che somma tutti i totali 