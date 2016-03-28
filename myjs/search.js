// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
    $('#search-button').attr('disabled', false);
}

var resp = [],
    songIndex = 0,
    currentArtist,
    shuffleOn=false;

var artistArray = ["LCD Soundsystem","Ellie Goulding","Sufjan Stevens","Jack Ü","M83","Underworld","The Kills","Foals","Of Monsters And Men","G-Eazy","Purity Ring","Rae Sremmurd","Volbeat","2manydjs","Lord Huron","St Germain","Savages","The Last Shadow Puppets","Joey Bada$$","DJ Mustard","BØRNS","Christine And The Queens","Snakehips","Robert DeLong","Bob Moses","Ibeyi","Marco Carola","Parov Stelar","Black Coffee","Years & Years","Nicole Moudaber & Skin","Lido","HEALTH","Mavis Staples","Sasha","Goldroom","Carla Morrison","Nic Fanciulli","The Front Bottoms","Skepta","Sam Feldt","Lemaitre","Louis The Child","Frances","George FitzGerald","DJ EZ","Gallant","HÆLOS","Låpsley","Miami Horror","SG Lewis","Sheer MaG","Mbongwana Star","Nina Las Vegas","Nora En Pure","Masha","Guns N’ Roses","Ice Cube","Disclosure","Zedd","A$AP Rocky","CHVRCHES","Halsey","James Bay","Grimes","Courtney Barnett","Run The Jewels","The Arcs","RL Grime","Gary Clark Jr.","Silversun Pickups","Lush","ZHU","Deerhunter","Unknown Mortal Orchestra","Rhye","Bat For Lashes","The Damned","Vince Staples","Tchami","Nina Kraviz","Snails","RÜFÜS DU SOL","Lost Frequencies","Chronixx","Vanic","Justin Martin","AlunaGeorge","Mano Le Tough","Shamir","DJ Koze","BADBADNOTGOOD","Moon Taxi","SZA","Ex Hex","Mr. Carmack","SOPHIE","Protjoe","Alvvays","Zella Day","Dubfire","Matthew Dear","DMA’s","Matoma","Algiers","GoGo Penguin","The Black Madonna","Cloves","Strangers You Know","Amine Edge & DANCE","Phases","The Dead Ships","Calvin Harris","Sia","Major Lazer","Flume","Beach House","The 1975","Rancid","Miike Snow","Edward Sharpe And The Magnetic Zeros","Matt And Kim","Chris Stapleton","Cold War Kids","Death Grips","The Chainsmokers","Maceo Plex","Baauer","KSHMR","Nathaniel Rateliff & The Night Sweats","Adam Beyer & Ida Engberg","Wolf Alice","Pete Yorn","Hudson Mohawke","Kamasi Washington","Claptone","TOKiMONSTA","Melody’s Echo Chamber","Autolux","John Digweed","Thomas Jack","Anderson .Paak","Nosaj Thing","Deafheaven","Epik High","Tensnake","Alessia Cara","Crystal Fighters","The Vandals","Joywave","PRAYERS","Young Fathers","The Heavy","Tei Shi","Meg Meyers","Soul Clap","Cassy","De Lux","Girlpool","Fur Coat","AC Slater"]

// Search for a specified string.
function search(artist, token) {
    var tok = token ? token : '';
    songIndex = 0;
    currentArtist = artist;

    var request = gapi.client.youtube.search.list({
        q: artist,
        part: 'snippet',
        pageToken:tok
    });

    request.execute(function(response) {
        var str = JSON.stringify(response.result);
        nextPageToken = response.result.nextPageToken;
        console.log(response.result);
        resp = response.result.items;
        playSong();
    });
}

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '290',
        width: '560',
        videoId: 'vn2mfDELAv4',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function playSong() {
    if(resp[songIndex].id.kind !== 'youtube#video'){
        nextSong(true);
        return;
    }
    player.loadVideoById(resp[songIndex].id.videoId, 30);

    $('.song-info-container').empty().append('<div>'+ resp[songIndex].snippet.title+ '</div>');
    $('#play-button').addClass('hidden');
    $('#pause-button').removeClass('hidden');
}

function nextSong(skip){
    songIndex++;
    if(shuffleOn && skip !== true){
        var artist = randomArtist();
        search(artist);
        return;
    }
    if(songIndex === 5) {
        nextRequest();
        return;
    }
    playSong();
}

function nextRequest(){
    songIndex = 0;
    search(currentArtist, nextPageToken);
}

function randomArtist(){
    return getRandomIntInclusive(0, artistArray.length);

}

function getRandomIntInclusive(min, max) {
    var rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return artistArray[rand];
}



// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    $('.song-info-container').empty().append('<div>Coachella 2015: Thank You</div>');

    $('#play-button').click(function(){
        event.target.playVideo();
        $('#play-button').addClass('hidden');
        $('#pause-button').removeClass('hidden');
    });

    $('#pause-button').click(function(){
        event.target.pauseVideo();
        $('#pause-button').addClass('hidden');
        $('#play-button').removeClass('hidden');
    });

    $('#next-button').click(function(){
        nextSong();
    });

    $('.image-map area').click(function(){
        var artist = $(this).attr('alt');
        search(artist);
        console.log($(this).attr('alt'))
    })

    $('#shuffle-button').click(function(){
        $(this).toggleClass('active');
        shuffleOn = !shuffleOn;
    })


}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        $('#play-button').addClass('hidden');
        $('#pause-button').removeClass('hidden');
    }

    if(event.data== YT.PlayerState.PAUSED){
        $('#pause-button').addClass('hidden');
        $('#play-button').removeClass('hidden');
    }

    if(event.data== YT.PlayerState.ENDED){
        nextSong();
    }
}
function stopVideo() {
    player.stopVideo();
}