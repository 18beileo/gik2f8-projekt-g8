window.addEventListener("load", renderMaps);

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

const api = new Api("http://localhost:5000/maps");

const mapList = document.getElementById("mapList");

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

    const files = document.getElementById('song');
    const title = document.getElementById('title');
    const artist = document.getElementById('artist');
    const user = document.getElementById('user');

    const formData = new FormData();

    formData.append("files", files.files);
    formData.append("title", title.value);
    formData.append("artist", artist.value);
    formData.append("user", user.value);
    
    fetch("http://localhost:5000/upload_files", {
        method: 'POST',
        body: formData,
        headers: {
          
        }
    })
        .then((res) => console.log(res))
        .catch((err) => ("Error occured", err));

    /*
    if(titleValid && artistValid && userValid && songValid){
        saveMap();
    }

    function saveMap() {
        const map = {
            title: uploadForm.title.value,
            artist: uploadForm.artist.value,
            user: uploadForm.user.value,
            fileName: uploadForm.song.value.split('fakepath\\').pop()
        }



        api.create(map).then((map) => {
            if(map){
                renderMaps();
            }
        });
    }
    */
}

function renderMaps(){
    api.getAll().then((maps) => {
        mapList.innerHTML="";

        if (maps && maps.length > 0) {
            maps.forEach((map) => {
                mapList.insertAdjacentHTML('beforeend', renderMap(map));
            });
        }
    });
}

function renderMap({id, title, artist, user, song}){
    let html = `
    <div id="${id}" class="text-white bg-gray-700 h-[7rem] w-2/5 mx-10 flex my-5 rounded-xl overflow-hidden">
        <div class="h-full bg-pink-300 w-1/4 mr-7 text-white flex pt-8 text-4xl justify-center pointer-events-none">Osu!</div>
        <div class="w-full mt-1">
            <h1 class="text-3xl">${title}</h1>
            <h2 class="text-xl">By ${artist}</h2>
            <p class="text-xs my-2">Mapped by ${user}</p>
        </div>
        <button onclick="deleteTask(${id})" class="bg-red-600 h-1/4 text-xs my-2 mr-1 rounded-lg p-1">Delete</p>
    </div>`;

    return html;
}

function deleteTask(id) {  
    api.remove(id).then((result) => {
      renderMaps();
    });
}
