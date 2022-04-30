function searchPlayer(event){
    //Impedisco il submit del form
    event.preventDefault();
    //Leggo il valore del campo di testo
    const player_input = document.querySelector("#player");
    const player_value = encodeURIComponent(player_input.value);
    console.log("Eseguo ricerca: " + player_value);
    //Preparo la richiesta
    rest_url = 'https://www.balldontlie.io/api/v1/players?search=' + player_value;
    console.log("URL giocatore: " + rest_url);
    //Eseguo la fetch
    fetch(rest_url).then(onResponse).then(onJson);    
}

function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
}

function onJson(json) {
    console.log('Json ricevuto');
    console.log(json);
    //Svuoto il div dove spunteranno i giocatori
    const players = document.querySelector('#players-view');
    players.innerHTML = '';
    //Uso il for nel caso ci dovessero essere più giocatori con stesso nome e cognome
    for(let i=0; i<json.data.length; i++){
        const nome = 'Nome: ' + json.data[i].first_name;
        const cognome = 'Cognome: ' + json.data[i].last_name;
        const altezza = 'Altezza: ' + json.data[i].height_feet + ' piedi';
        const posizione = 'Posizione: ' + json.data[i].position;
        const squadra = 'Squadra: ' + json.data[i].team.full_name;
        const girone = 'Girone: ' + json.data[i].team.conference;
        const divisione = 'Divisione: ' + json.data[i].team.division;

        const player = document.createElement('div');
        player.classList.add('player');

        const name = document.createElement('span');
        name.textContent = nome;
        const last_name = document.createElement('span');
        last_name.textContent = cognome;
        const height = document.createElement('span');
        height.textContent = altezza;
        const position = document.createElement('span');
        position.textContent = posizione;
        const team = document.createElement('span');
        team.textContent = squadra;
        const conference = document.createElement('span');
        conference.textContent = girone;
        const division = document.createElement('span');
        division.textContent = divisione;

        player.appendChild(name);
        player.appendChild(last_name);
        player.appendChild(height);
        player.appendChild(position);
        player.appendChild(team);
        player.appendChild(conference);
        player.appendChild(division);

        players.appendChild(player);
    }
    
}

//OAuth 2.0: due richieste fetch
//1° per ottenere il token
//2° per fare la richiesta effettiva

const client_id = '2d5bf0ebc21f44158b516fea48814fff';
const client_secret = '96560a6294e742899b4448d25d7e6ef8';
let token;

//RICHIESTA TOKEN
//All'apertura della pagina richiedo il token
fetch("https://accounts.spotify.com/api/token",
    {
        method: "post",
        body: 'grant_type=client_credentials',
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        }
    }).then(onResponse).then(onTokenJson);

function onTokenJson(json)
{
    token = json.access_token;
}

//RICHIESTA CANZONE
function searchAlbum(event){
// Impedisci il submit del form
event.preventDefault();
// Leggi valore del campo di testo

const album_input = document.querySelector('#album');
const album_value = encodeURIComponent(album_input.value);
console.log('Eseguo ricerca: ' + album_value);
// Esegui la richiesta
fetch("https://api.spotify.com/v1/search?type=album&q=" + album_value,
  {
    headers:
    {
      'Authorization': 'Bearer ' + token
    }
  }).then(onResponse).then(onAlbumJson);
}

function onAlbumJson(json)
{
    console.log('Json ricevuto');
    console.log(json);
    //Svuoto la libreria
    const library = document.querySelector('#album-view');
    library.innerHTML='';
    //Leggo il numero di risultati di Spotify
    const results = json.albums.items;
    let n_results = results.length;
    //Limito il numero di risultati a 5
    if(n_results > 5)
        n_results = 5;

    for(let i=0; i<n_results; i++)
    {
        const album_data = results[i];
        const title = album_data.name;
        const img = album_data.images[0].url;

        const album = document.createElement('div');
        album.classList.add('album');
        const copertina = document.createElement('img');
        copertina.src = img;
        const caption = document.createElement('span');
        caption.textContent = title;

        album.appendChild(copertina);
        album.appendChild(caption);

        library.appendChild(album);        
    }

}



const search_player = document.querySelector("#cerca_giocatore");
search_player.addEventListener("submit", searchPlayer);

const search_album = document.querySelector("#spotify");
search_album.addEventListener("submit", searchAlbum);