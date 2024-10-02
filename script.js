var player1, player2;
var nextPageToken = '';
var prevPageToken = '';

function handleKeyUp(event) {
    if (event.key === 'Enter') {
        searchYouTube();
    }
}

function searchYouTube(pageToken = '') {
    const query = document.getElementById('searchQuery').value;
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=AIzaSyAmeYQOPIriT_f3jLMvtoIBVxoRCOHaFV4&pageToken=${pageToken}&maxResults=3`)
        .then(response => response.json())
        .then(data => {
            nextPageToken = data.nextPageToken || '';
            prevPageToken = data.prevPageToken || '';

            data.items.forEach(item => {
                const videoId = item.id.videoId;
                const title = item.snippet.title;
                const thumbnail = item.snippet.thumbnails.default.url;

                const result = document.createElement('div');
                result.className = 'result';
                result.innerHTML = `
                    <img src="${thumbnail}" alt="${title}">
                    <button onclick="setVideoUrl('${videoId}', 'player1')">1</button>
                    <button onclick="setVideoUrl('${videoId}', 'player2')">2</button>
                    <p>${title}</p>
                `;
                searchResults.appendChild(result);
            });

            document.getElementById('nextPage').disabled = !nextPageToken;
            document.getElementById('prevPage').disabled = !prevPageToken;
        });
}

function nextPage() {
    searchYouTube(nextPageToken);
}

function prevPage() {
    searchYouTube(prevPageToken);
}

function setVideo(playerId) {
    const url = document.getElementById('urlInput').value;
    const videoId = url.split('v=')[1];
    setVideoUrl(videoId, playerId);
}

function setVideoUrl(videoId, playerId) {
    const player = document.getElementById(playerId);
    player.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    document.getElementById('searchResults').innerHTML = ''; // Clear search results
}

function onYouTubeIframeAPIReady() {
    player1 = new YT.Player('player1', {
        events: {
            'onStateChange': onPlayerStateChange,
            'onReady': onPlayerReady
        }
    });
    player2 = new YT.Player('player2', {
        events: {
            'onStateChange': onPlayerStateChange,
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    setInterval(() => {
        checkVideoTime(player1, 'player1');
        checkVideoTime(player2, 'player2');
    }, 1000);
}

function checkVideoTime(player, playerId) {
    if (player && player.getDuration) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        if (duration - currentTime <= 1) {
            document.getElementById(playerId).src = ''; // Clear the player 1 second before the end
        }
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        const playerId = event.target.getIframe().id;
        document.getElementById(playerId).src = ''; // Clear the player
    }
}

