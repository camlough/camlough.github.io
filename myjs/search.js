// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
    $('#search-button').attr('disabled', false);
}

var resp = [],
    songIndex = 0,
    currentArtist,
    shuffleOn=false,
    posterId = 'coachella';


var artistArray = ["LCD Soundsystem","Ellie Goulding","Sufjan Stevens","Jack U","M83","Underworld","The Kills","Foals","Of Monsters And Men","G-Eazy","Purity Ring","Rae Sremmurd","Volbeat","2manydjs","Lord Huron","St. Germain","Savages","The Last Shadow Puppets","Joey Bada$$","DJ Mustard","BORNS","Christine And The Queens","Snakehips","Robert DeLong","Bob Moses","Ibeyi","Marco Carola","Parov Stelar","Black Coffee","Years & Years","Nicole Moudaber & Skin","Lido","HEALTH band","Mavis Staples","Sasha","Goldroom","Carla Morrison","Nic Fanciulli","The Front Bottoms","Skepta","Sam Feldt","Lemaitre","Louis The Child","Frances","George FitzGerald","DJ EZ","Gallant","HAELOS","Lapsley","Miami Horror","SG Lewis","Sheer MaG","Mbongwana Star","Nina Las Vegas","Nora En Pure","Masha","Guns N’ Roses","Ice Cube","Disclosure","Zedd","A$AP Rocky","CHVRCHES","Halsey","James Bay","Grimes","Courtney Barnett","Run The Jewels","The Arcs","RL Grime","Gary Clark Jr.","Silversun Pickups","Lush","ZHU","Deerhunter","Unknown Mortal Orchestra","Rhye","Bat For Lashes","The Damned","Vince Staples","Tchami","Nina Kraviz","Snails","RUFUS DU SOL","Lost Frequencies","Chronixx","Vanic","Justin Martin","AlunaGeorge","Mano Le Tough","Shamir","DJ Koze","BADBADNOTGOOD","Moon Taxi","SZA","Ex Hex","Mr. Carmack","SOPHIE","Protjoe","Alvvays","Zella Day","Dubfire","Matthew Dear","DMA’s","Matoma","Algiers","GoGo Penguin","The Black Madonna","Cloves","Strangers You Know","Amine Edge & DANCE","Phases","The Dead Ships","Calvin Harris","Sia","Major Lazer","Flume","Beach House","The 1975","Rancid","Miike Snow","Edward Sharpe And The Magnetic Zeros","Matt And Kim","Chris Stapleton","Cold War Kids","Death Grips","The Chainsmokers","Maceo Plex","Baauer","KSHMR","Nathaniel Rateliff & The Night Sweats","Adam Beyer & Ida Engberg","Wolf Alice","Pete Yorn","Hudson Mohawke","Kamasi Washington","Claptone","TOKiMONSTA","Melody’s Echo Chamber","Autolux","John Digweed","Thomas Jack","Anderson .Paak","Nosaj Thing","Deafheaven","Epik High","Tensnake","Alessia Cara","Crystal Fighters","The Vandals","Joywave","PRAYERS","Young Fathers","The Heavy","Tei Shi","Meg Meyers","Soul Clap","Cassy","De Lux","Girlpool","Fur Coat","AC Slater"]

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
        var artist = randomArtist(posterId);
        search(artist);
        unselectAll();
        var elem = $("area[alt='"+artist+"']");
        var data = mapHighlightConfig();
        data.alwaysOn = true;
        elem.data('maphilight', data).trigger('alwaysOn.maphilight');
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

function randomArtist(poster){
    var artistArray = $('.'+ poster +'-map area').toArray();
    var min = 0, max = artistArray.length;
    var rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return artistArray[rand].alt;

}

// function getRandomIntInclusive(min, max) {
//     var rand = Math.floor(Math.random() * (max - min + 1)) + min;
//     return artistArray[rand];
// }

function unselectAll(){
    $('.image-map area').each(function(i,obj){
        $(obj).data('maphilight', {alwaysOn:false}).trigger('alwaysOn.maphilight');
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

    // event.target.playVideo();
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

    $('.image-map area').click(function(e){
        unselectAll();
        var data = mapHighlightConfig();
        $(this).data('maphilight', data).trigger('alwaysOn.maphilight');
        var artist = $(this).attr('alt');
        search(artist);
    })

    $('#shuffle-button').click(function(){
        $(this).toggleClass('active');
        $(this).removeClass('coachella');
        $(this).removeClass('dolab');
        $(this).addClass(posterId);
        shuffleOn = !shuffleOn;
        $('[data-toggle="tooltip"]').tooltip('hide');
        console.log(posterId);
    })


    var firstScroll = true;
    var height = $(window).height() - 51;
    function scrollWatch(ev){
        if(isScrolledIntoView($('#dolab-section'))){
            posterId = 'dolab';
        }else{
            posterId = 'coachella';
        }
        console.log(posterId);
        $('#shuffle-button').attr('data-original-title','shuffle ' + posterId + ' artists');

        if(window.pageYOffset>height && firstScroll){
            firstScroll = false;
            $('.player-controls-bar').addClass('visible');

            setTimeout(function(){
                $('.show-video-button').addClass('visible');
                if ($.cookie('playvideo') == null) {
                    $('.show-video-button').click();
                    player.playVideo();
                    $.cookie('playvideo', 'done', 365);
                }
            },1000);
        };
    }
    window.onscroll=scrollWatch;

}


function isScrolledIntoView(elem)
{
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemTop-50) <= docViewTop);
}


// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
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

function mapHighlightConfig(){
    var data = {};
    data.alwaysOn = true;
    data.fillOpacity = .2;
    data.strokeWidth = 2;
    data.strokeColor = 'FFFFFF';
    return data;
}

function stopVideo() {
    player.stopVideo();
}