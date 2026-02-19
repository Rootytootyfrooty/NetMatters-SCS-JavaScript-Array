const photos = document.getElementsByClassName("photo");
const magnifier = document.getElementsByClassName("maximise-photo");
const slides = document.getElementsByClassName("slide");
const photoWrapper = document.getElementsByClassName("img-wrapper");
const addButton = document.getElementsByClassName("add-photo");
const albumSlide = document.getElementsByClassName("album-slide");
const album = document.getElementById("album");

//specific but random images

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

randomPhotoBtn.addEventListener("click", () => {
    randomisePhotos();
});

//list of photos in album, not yet tied to a user
const albumList = [];

//changes the src of the img depending on how long the albumList is

function populateAlbum() {
    for (let i = 0; i < albumList.length; i++) {
        albumPhotos[i].src = albumList[i];
    }
}
for (let i = 0; i < addButton.length; i++) {
    addButton[i].addEventListener("click", (target) => {
        albumList.push(photos[i].src);
        
        album.innerHTML += `
            <div class="album-slide album-slide-default">
                <img class="album-photo random-photo"
                   src="${photos[i].src}",
                    alt="Photo number ${i + 1} in your collection">
                <span class="maximise-photo">&#x1F50D;</span>
            </div>
        `;
        populateAlbum(photos[i].src);
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
const emailCont = document.getElementById("add-email");
const email = document.getElementById("email");
const form = document.getElementById("add-email");
const emailList = [];
const dropdown = document.getElementById("email-dropdown");
// const users = [];
let currentEmailValue = "";

//function to put the submitted email addresses into the dropdown
function populateDropdown(emailInput) {
    dropdown.innerHTML += `<option>${emailInput}</option>`;
}

//error function (after pressing submit)
const setError = (message) => {
  email.classList.add("error");
  email.classList.remove("success");
  email.placeholder = message;
};

// success function (after pressing submit)
const setSuccess = () => {
  email.classList.add("success");
  email.classList.remove("error");
}

const isValidEmail = emailin => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(emailin).toLowerCase());
}

const validateEmail = () => {
    if(currentEmailValue.trim === "") {
        setError("Please enter an email address");
    } else if (!isValidEmail(currentEmailValue.trim())) {
        setError("Please enter a valid email address");
    } else if (emailList.includes(currentEmailValue)){
        setError("Email already added");
    } else {
        setSuccess();
        // user emails added
        emailList.push(currentEmailValue);
        console.log("You just added: " + currentEmailValue);
        console.log("the current email list is: " + emailList);
        populateDropdown(currentEmailValue);
    }
}

form.addEventListener("submit", event => {
    currentEmailValue = email.value.trim();
    event.preventDefault(); 
    console.log("clicked");
    validateEmail(currentEmailValue);  
});

randomisePhotos();
