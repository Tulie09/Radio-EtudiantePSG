document.getElementById('file1').addEventListener('change', function(event) {
    loadAudio(event.target.files[0], 'audio1');
});

document.getElementById('file2').addEventListener('change', function(event) {
    loadAudio(event.target.files[0], 'audio2');
});

function loadAudio(file, audioId) {
    const audio = document.getElementById(audioId);
    const reader = new FileReader();

    reader.onload = function(e) {
        audio.src = e.target.result;
        audio.load();
    };

    reader.readAsDataURL(file);
}

document.getElementById('volume1').addEventListener('input', function(event) {
    document.getElementById('audio1').volume = event.target.value;
});

document.getElementById('volume2').addEventListener('input', function(event) {
    document.getElementById('audio2').volume = event.target.value;
});
