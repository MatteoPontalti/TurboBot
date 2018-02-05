var fetch = require('node-fetch');

var domanda = function(domanda) {
    return fetch('https://unitnturbobot.herokuapp.com/api/'+ domanda, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
};


test('Domanda: Quando sono da pagare le tasse?', function(done) {
    domanda('Quando sono da pagare le tasse?')
        .then(function(response) {
            expect(response.status).toBe(200);
            return response.json();
        }).then(function(data) {
        expect(data.Risposta).toBe('Rate e scadenze\n\nLe tasse saranno pagate in tre rate:\n\n- 1 rata: importo fisso per tutti gli studenti, scadenza 30/09/2017 (per gli studenti che si immatricolano ad una Laurea Magistrale, la scadenza della prima rata è entro 7 giorni dalla data di immatricolazione)\n- 2 rata: il 70% dei contributi quota variabile dovuti in base all’ISEE università, scadenza 30/11/2017\n- 3 rata: il 30% dei contributi quota variabile dovuti in base all’ISEE università, scadenza 31/3/2018.\nNei casi in cui la quota variabile dei contributi sia uguale o inferiore a € 500,00, le tasse saranno pagate per intero nella prima e seconda rata: non ci sarà la terza rata tasse.');
        done();
    });
});


test('Domanda: Come posso iscrivermi all\'università?', function(done) {
    domanda('Come posso iscrivermi all\'università?')
        .then(function(response) {
            expect(response.status).toBe(200);
            return response.json();
        }).then(function(data) {
        expect(data.Risposta).toBe('Per iscriversi ai corsi di Laurea in Fisica, Matematica, Informatica, Ingegneria dell’Informazione e delle Comunicazioni, Ingegneria dell’Informazione e Organizzazione d’impresa è necessario sostenere una prova selettiva di ammissione. Sono disponibili una sessione primaverile  ed estiva solitamente ad aprile ed agosto.');
        done();
    });
});
