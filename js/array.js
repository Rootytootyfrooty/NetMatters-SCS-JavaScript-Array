const photos = document.getElementsByClassName("photo");
const magnifier = document.getElementsByClassName("maximise-photo");
const slides = document.getElementsByClassName("slide");
const photoWrapper = document.getElementsByClassName("img-wrapper");

const addButton = document.getElementsByClassName("add-photo");
const albumSlide = document.getElementsByClassName("album-slide");
const album = document.getElementById("album");


const emailCont = document.getElementById("add-email");
const email = document.getElementById("email");
const form = document.getElementById("add-email");
const emailList = [];
const dropdown = document.getElementById("email-dropdown");
const currentEmailDisplay = document.getElementById("current-email");

let currentUser = dropdown.value;
let newUser = "";
let userObjects = {};

//specific but random images, so they can be added to email photo arrays

const randomPhotoBtn = document.getElementById("randomiser");
const albumPhotos = document.getElementsByClassName("album-photo");

function rNG() {
    return Math.floor( Math.random() * 650 ) + 1;
}
function randomisePhotos() {
    for (let i = 0; i < 8; i++) {
        photos[i].src = `https://picsum.photos/id/${rNG()}/1000/800`;
    }
}

album.innerHTML = "";

//populate album with new added photos (should really change the name)
function populateAlbum(imgUrl) {
    album.innerHTML += `
            <div class="album-slide album-slide-default">
                <img class="album-photo random-photo"
                   src="${imgUrl}",
                    alt="Photo number  in your collection">
                <span class="maximise-photo">&#x1F50D;</span>
            </div>
        `;
}
//populate the album when switching to existing user
function populateAlbumUser() {
    for (let i = 0; i < userObjects[currentUser].length; i++) {
        console.log(userObjects[currentUser][i]);
        album.innerHTML += `
            <div class="album-slide album-slide-default">
                <img class="album-photo random-photo"
                   src="${userObjects[currentUser][i]}",
                    alt="Photo number  in your collection">
                <span class="maximise-photo">&#x1F50D;</span>
            </div>
        `;
    }
}


for (let i = 0; i < addButton.length; i++) {
    addButton[i].addEventListener("click", (target) => {
        if (currentUser) {
            console.log(photos[i].src);
            if (!userObjects[currentUser]) {
                userObjects[currentUser] = [];
            }
            userObjects[currentUser].push(photos[i].src)
            populateAlbum(photos[i].src);
            console.log(userObjects[currentUser].length);
        } else {
            setError("Please add or select an email address");
        }
    });
}
    


// for loop to maximise images on click
for ( let i = 0; i < photos.length; i++ ) {
    photos[i].addEventListener("click", (event) => {
        if (event.target.classList.contains("random-photo")) {
            event.target.classList.remove("random-photo");
            event.target.classList.add("random-photo-max");
            magnifier[i].classList.add("hidden");
            photoWrapper[i].classList.add("img-wrapper-click");
            photoWrapper[i].classList.remove("img-wrapper-default");
            slides[i].classList.add("slide-max");
            slides[i].classList.remove("slide-default");
            addButton[i].classList.add("add-large");
            addButton[i].classList.remove("add-default");
        } else {
            event.target.classList.add("random-photo");
            event.target.classList.remove("random-photo-max");
            magnifier[i].classList.remove("hidden");
            slides[i].classList.remove("slide-max");
            slides[i].classList.add("slide-default");
            photoWrapper[i].classList.remove("img-wrapper-click");
            photoWrapper[i].classList.add("img-wrapper-default");
            addButton[i].classList.remove("add-large");
            addButton[i].classList.add("add-default");
        }
    });
}

//email validation

let currentEmailValue = "";

//error function (after pressing submit)
const setError = (message) => {
    form.reset();
  email.classList.add("error");
  email.classList.remove("success");
  email.placeholder = message;
};

// success function (after pressing submit)
const setSuccess = () => {
  email.classList.add("success");
  email.classList.remove("error");
};

const isValidEmail = emailin => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(emailin).toLowerCase());
};

const validateEmail = () => {
    if(currentEmailValue.trim === "") {
        setError("Please enter an email address");
    } else if (!isValidEmail(currentEmailValue.trim())) {
        setError("Please enter a valid email address");
    } else if (emailList.includes(currentEmailValue)){
        setError("Email already added");
    } else {
        setSuccess();
        // user emails added to list to check for duplicates
        emailList.push(currentEmailValue);
        
    }
};

//validates submitted email, if valid
form.addEventListener("submit", event => {
    event.preventDefault(); 
    currentEmailValue = email.value.trim();
    validateEmail(currentEmailValue);
    addNewUser(currentEmailValue);
    currentUser = currentEmailValue;
    currentEmailDisplay.textContent = currentUser;
    album.innerHTML ="";
    populateAlbumUser();
    form.reset();
});

randomisePhotos();

dropdown.addEventListener("change", () => {
    album.innerHTML = "";
    currentUser = dropdown.value;
    currentEmailDisplay.textContent = currentUser;
    populateAlbumUser();
});

function addNewUser(user) {
    if (!userObjects[user]) {
        userObjects[user] = [];
    }
    const option = document.createElement("option");
    option.value = user;
    option.textContent= user;
    dropdown.appendChild(option);
}
randomPhotoBtn.addEventListener("click", () => {
    randomisePhotos();
});