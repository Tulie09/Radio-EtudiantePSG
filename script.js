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

    // Remplacez `YOUR_API_KEY` par votre véritable clé API
    const apiKey = 'AIzaSyAmeYQOPIriT_f3jLMvtoIBVxoRCOHaFV4'; 

    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${apiKey}&pageToken=${pageToken}&maxResults=3`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur de réseau: ${response.statusText}`);
            }
            return response.json();
        })
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
                    <p class="result-title">${title}</p>
                    <div class="result-buttons">
                        <button onclick="setVideoUrl('${videoId}', 'player1')">1</button>
                        <button onclick="setVideoUrl('${videoId}', 'player2')">2</button>
                    </div>
                `;
                searchResults.appendChild(result);
            });

            document.getElementById('nextPage').disabled = !nextPageToken;
            document.getElementById('prevPage').disabled = !prevPageToken;
        })
        .catch(error => {
            console.error('Erreur lors de la recherche:', error);
            alert('Une erreur s\'est produite lors de la recherche de vidéos. Vérifiez la clé API et votre connexion.');
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
    const videoId = extractVideoId(url);
    setVideoUrl(videoId, playerId);
}

function extractVideoId(url) {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
}

function setVideoUrl(videoId, playerId) {
    const player = document.getElementById(playerId);
    player.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
}

function onYouTubeIframeAPIReady() {
    player1 = new YT.Player('player1', {
        height: '225',
        width: '400',
        videoId: '',
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'enablejsapi': 1,
            'vq': 'small'
        },
        events: {
            'onStateChange': onPlayerStateChange,
            'onReady': onPlayerReady
        }
    });

    player2 = new YT.Player('player2', {
        height: '225',
        width: '400',
        videoId: '',
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'enablejsapi': 1,
            'vq': 'small'
        },
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
            document.getElementById(playerId).src = '';
        }
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        const playerId = event.target.getIframe().id;
        if (playerId === 'player1') {
            const videoId = player2.getVideoData().video_id;
            if (videoId) {
                setVideoUrl(videoId, 'player2');
            }
        } else if (playerId === 'player2') {
            const videoId = player1.getVideoData().video_id;
            if (videoId) {
                setVideoUrl(videoId, 'player1');
            }
        }
    }
}

function closeSearchResults() {
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchQuery').value = '';
}
