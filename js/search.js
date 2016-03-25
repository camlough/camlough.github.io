// After the API loads, call a function to enable the search box.
function handleAPILoaded() {
    $('#search-button').attr('disabled', false);
}

var resp = [],
    songIndex = 0,
    nextPagToken='',
    currentArtist;


// Search for a specified string.
function search(artist, token) {
    var tok = token ? token : '';
    songIndex = 0;

    // var q = $('#query').val();
    // if(!q){
    //     q = artist;
    // }

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
        nextSong();
        return;
    }
    player.loadVideoById(resp[songIndex].id.videoId, 30);
}

function nextSong(){
    songIndex++;
    if(songIndex === 5){
        nextRequest();
        return;
    }
    playSong();
}

function nextRequest(){
    songIndex = 0;
    search(currentArtist, nextPageToken);
}




// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

    event.target.playVideo();

    $('#play').click(function(){
        event.target.playVideo();
    })

    $('#pause').click(function(){
        event.target.pauseVideo();
    })
    $('.skipControl__next').click(function(){
        nextSong();
    })
    $('.image-map area').click(function(){
        var artist = $(this).attr('alt');
        search(artist);
        // console.log($(this).attr('alt'))
    })


}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        // setTimeout(stopVideo, 6000);
        done = true;
    }
}
function stopVideo() {
    player.stopVideo();
}