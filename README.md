# PastryShop
Il progetto si compone di un server REST Node (cartella rest-backend) e un front-end SPA React (cartella pastry-shop).


Configurazione:
1) Installare MongoDB in locale
2) Configurare rest-backend\nodemon.json con i parametri relativi al DB
3) In rest-backend eseguire npm install e npm start (necessario nodemon)
4) Configurare eventualmente pastry-shop\.env.test.local
5) In pastry-shop eseguire npm install e npm start

Una volta avviato il server crea in automatico alcuni dati di prova nel DB in modo da mostrare subito qualcosa.

Per accedere come Luana o Maria (le amministratrici della pasticceria) seguono le credenziali degli utenti di prova.

Credenziali di Luana:
- luana@pastryshop.it
- Luanapsw

Credenziali di Maria:
- maria@pastryshop.it
- Mariapsw



==================TRACCIA==================

Sito web pasticceria
Realizzare il sito web di una pasticceria rispettando le seguenti specifiche.
1. La pasticceria vende dolci che hanno un nome ed un prezzo.
2. Ogni dolce è composto da una lista di ingredienti.
3. Opzionale: indicare di ogni ingrediente quantità e unità di misura.
4. La gestione della pasticceria è in mano a Luana e Maria che vogliono avere il proprio
account per poter accedere all'area di backoffice tramite email e password.
5. Nell’area di backoffice si possono gestire (CRUD) i dolci e metterli in vendita con una
certa disponibilità (esempio: 3 Torte paradiso in vendita).
6. Opzionale: permettere di caricare una o più foto del dolce.
7. I dolci in vendita invecchiano ed in base al tempo trascorso dalla loro messa in vendita
hanno prezzi diversi: il primo giorno prezzo pieno, il secondo giorno costano l’80%, il
terzo giorno il 20%.
Il quarto giorno non sono commestibili e devono essere ritirati dalla vendita.
8. Realizzare una pagina vetrina dove tutti possono vedere la lista di dolci disponibili e il
prezzo relativo.
9. Opzionale: realizzare la pagina del dettaglio del dolce (a sé stante o visualizzabile
tramite overlay), in cui sono visualizzati gli ingredienti indicati dalla ricetta.

===========================================
