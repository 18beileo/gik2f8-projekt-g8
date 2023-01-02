uploadForm.addEventListener('submit', onSubmit);

uploadForm.title.addEventListener('input', (e) => validateField(e.target));
uploadForm.title.addEventListener('blur', (e) => validateField(e.target));

uploadForm.artist.addEventListener('input', (e) => validateField(e.target));
uploadForm.artist.addEventListener('blur', (e) => validateField(e.target));

uploadForm.user.addEventListener('input', (e) => validateField(e.target));
uploadForm.user.addEventListener('blur', (e) => validateField(e.target));

uploadForm.song.addEventListener('input', (e) => validateField(e.target));

let titleValid = true;
let artistValid = true;
let userValid = true;
let songValid = true;

const api = new Api("localhost:5000/tasks");

function validateField(field) {

    let validationMessage="";

    switch(field.name){
        case 'title':{
            if(field.value.length < 1){
                titleValid = false;
                validationMessage = "Song title must be at least 1 character"
            }else{
                titleValid = true;
            }
            break;
        }
        case 'artist':{
            if(field.value.length < 1){
                artistValid = false;
                validationMessage = "Artist name must be at least 1 character"
            }else{
                artistValid = true;
            }
            break;
        }
        case 'user':{
            if(field.value.length < 1){
                userValid = false;
                validationMessage = "Username must be at least 1 character"
            }else{
                userValid = true;
            }
            break;
        }
        case 'song':{
            if(field.value.split('.').pop() != "mp3"){
                songValid = false;
                validationMessage = "The file format must be mp3"
            }
            else{
                songValid = true;
            }
            break;
        }
    }

    field.nextElementSibling.innerHTML = validationMessage;
    field.nextElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
    e.preventDefault();

    if(titleValid && artistValid && userValid && songValid){
        saveSong();
    }

    function saveSong() {
        const song = {
            title: uploadForm.title.value,
            artist: uploadForm.artist.value,
            user: uploadForm.user.value,
            fileName: uploadForm.song.value.split('fakepath\\').pop()
        }

        console.log(song)

        api.create(song);
    }
}

