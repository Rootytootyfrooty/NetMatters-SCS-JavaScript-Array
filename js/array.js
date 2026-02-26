const photos = document.getElementsByClassName("photo");
const magnifier = document.getElementsByClassName("maximise-photo");
const slides = document.getElementsByClassName("slide");
const photoWrapper = document.getElementsByClassName("img-wrapper");

const addButton = document.getElementsByClassName("add-photo");

const albumSlide = document.getElementsByClassName("album-slide");
const album = document.getElementById("album");
const albumPhoto = document.getElementsByClassName("album-photo");


const emailCont = document.getElementById("add-email");
const email = document.getElementById("email");
const form = document.getElementById("add-email");
const emailList = [];
const dropdown = document.getElementById("email-dropdown");
const currentEmailDisplay = document.getElementById("current-email");
const errorDisplay = document.getElementById("popup");

let currentUser = dropdown.value;
let newUser = "";
let userObjects = {};

//specific but random images, so they can be added to email photo arrays

const randomPhotoBtn = document.getElementById("randomiser");
const albumPhotos = document.getElementsByClassName("album-photo");

function rNG() {
    return Math.floor( Math.random() * 1080 ) + 1;
}
//There's ~1,000 images that are 1,000px by 1,000px
//But some of them don't exist any more and just 404
//checks to see if RNG link image actually loads/exists, if not, tries again
function checkImage(image) {
    return new Promise(resolve =>{
        const testImage = new Image();
        const randomID = `https://picsum.photos/id/${rNG()}/1000`;

        testImage.onload = function() {
            resolve(randomID);
        }
        testImage.onerror = function() {
            resolve(checkImage());
        }
        testImage.src = randomID;
    });
}
//async function so that all photos are generated at once instead of in sequence.
async function randomisePhotos() {
    const promises = [];
    for (let i = 0; i < 8; i++) {
        promises.push(checkImage(photos[i]));
    }
    const urls = await Promise.all(promises);
    for (let i = 0; i < 8; i++) {
        photos[i].src = urls[i]
    }
}

album.innerHTML = "";

//populate album with newly added photos (should really change the name)
function populateAlbum(imgUrl) {
    userObjects[currentUser].push(imgUrl);
    populateAlbumUser();
    // album.insertAdjacentHTML("beforeend",  `
    //         <div class="album-slide album-slide-default" data-index="${indexP}">
    //             <img class="album-photo random-photo"
    //                src="${imgUrl}"
    //                 alt="${imgUrl}">
    //             <button class="remove-photo remove-default">Remove Photo from Album</button>
    //         </div>
    //         <span class="maximise-photo">&#x1F50D;</span>
    //     `);
    // //remove button functionality for newly added photos
    //     const slideList = album.querySelectorAll(".album-slide");
    //     const newSlide = slideList[slideList.length - 1];
    //     const removeButton = newSlide.querySelector(".remove-photo");

    //     removeButton.addEventListener("click", () => { 
    //         const index = parseInt(newSlide.dataset.index);
    //         slideList[index].remove();
    //         userObjects[currentUser].splice(index, 1);
    //     });
}

//function for delete

album.addEventListener("click", (e) => {
    if (!e.target.classList.contains("remove-photo")) return;
    const slide = e.target.closest(".album-slide");
    const index = parseInt(slide.dataset.index);
    userObjects[currentUser].splice(index, 1);
    populateAlbumUser();
    storeUsers();
});


//populate the album when switching to existing user
function populateAlbumUser() {
    let html = "";
    for (let i = 0; i < userObjects[currentUser].length; i++) {
        html += `
<div class="album-slide album-slide-default" data-index="${i}">
    <img class="album-photo random-photo"
        src="${userObjects[currentUser][i]}"
        alt="${userObjects[currentUser][i]}">
    <button class="remove-photo remove-default">Remove Photo from Album</button>
    <span class="maximise-photo">&#x1F50D;</span>
</div>
        `;
    }
    album.innerHTML = html;
//remove button functionality added when album populated switching users
    // const removeButton = document.getElementsByClassName("remove-photo");

    // const slideList = album.querySelectorAll(".album-slide");
    // for (let i = 0; i < removeButton.length; i++) {
    //     removeButton[i].addEventListener("click", () => {
    //         const index = parseInt(albumSlide[0].dataset.index);
    //         slideList[index].remove();
    //         });
    //     }
}

//add photo button

for (let i = 0; i < addButton.length; i++) {
    addButton[i].addEventListener("click", function () {
        if (!currentUser) {
                setError("Please add or select an email address");
                return
        }
        populateAlbum(photos[i].src);
        storeUsers();
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

//error popup function

function errorPopup(message) {
    errorDisplay.classList.add("popup-error");
    errorDisplay.classList.remove("popup-default");
    errorDisplay.textContent = message;
    setTimeout(() => {
        errorDisplay.classList.remove("popup-error");
        errorDisplay.classList.add("popup-default");
    }, 3000);
}

//error function (after pressing submit)
const setError = (message) => {
    form.reset();
  email.classList.add("error");
  email.classList.remove("success");
  email.placeholder = message;
  errorPopup(message);
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
    currentEmailDisplay.textContent = currentUser + "'s Photo Album";
    album.innerHTML ="";
    storeUsers();
    populateAlbumUser();
    form.reset();
});

randomisePhotos();

dropdown.addEventListener("change", () => {
    album.innerHTML = "";
    setCurrentUser(dropdown.value);
    populateAlbumUser();
});

//adds new user using input email address if not duplicate and adds a dropdown option
function addNewUser(user) {
    if (!userObjects[user]) {
        userObjects[user] = [];
        const option = document.createElement("option");
        option.value = user;
        option.textContent= user;
        dropdown.appendChild(option);
        currentEmailDisplay.textContent = user + "'s Photo Album";
    } 
    dropdown.value = user;
    //makes sure the new user is now the current selection in the dropdown menu
    dropdown.dispatchEvent(new Event("change"));
}
randomPhotoBtn.addEventListener("click", () => {
    randomisePhotos();
});


//locally store userObjects (i.e. user emails and image arrays) so info stays on refresh
function storeUsers() {
    localStorage.setItem("users", JSON.stringify(userObjects));
}
//retrieve user data from local storage, parses from JSON
function retrieveUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
}

function setCurrentUser(user) {
    if (!user || user.trim === "") return;
    currentUser = user;
    currentEmailDisplay.textContent = currentUser + "'s Photo Album";
    storeUsers();
}

//gets and sets after page refresh
window.addEventListener("load", () => {
    userObjects = retrieveUsers();
    const emails = Object.keys(userObjects);
        for ( let i = 0; i < emails.length; i++) {
            const option = document.createElement("option");
            option.value = emails[i];
            option.textContent= emails[i];
            dropdown.appendChild(option);
        }
    setCurrentUser(emails[0]);
    populateAlbumUser();
});
