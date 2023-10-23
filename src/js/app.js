const apiUrl = 'https://randomuser.me/api/?results=100';

async function getRandomUser() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.results;
}

const courses = [
  'Mathematics',
  'Physics',
  'English',
  'Computer Science',
  'Dancing',
  'Chess',
  'Biology',
  'Chemistry',
  'Law',
  'Art',
  'Medicine',
  'Statistics',
];

const regions = {
  Asia: ["Iran", "Turkey"],
  Europe: ["Germany", "Ireland", "Netherlands", "Switzerland", "France", "Denmark", "Norway", "Spain", "Finland", "Ukraine"],
  Pacific: ["Australia", "New Zealand"],
  Americas: ["United States", "Canada"]
};

let arrayUsers = []

async function makeUsers() {
  const users = await getRandomUser();
  // const users = randomUserMock;
  const newUsers = [];

  users.forEach((user) => {
    const newUser = {
      id: user.id.name + user.id.value,
      gender: user.gender,
      title: user.name.title,
      full_name: `${user.name.first} ${user.name.last}`,
      city: user.location.city,
      state: user.location.state,
      country: user.location.country,
      course: courses[Math.floor(Math.random() * courses.length)],
      favorite: Math.random() < 0.5,
      postcode: user.location.postcode,
      coordinates: user.location.coordinates,
      timezone: user.location.timezone,
      email: user.email,
      b_date: user.dob.date,
      age: user.dob.age,
      bg_color: `#${Math.floor(Math.random() * 256).toString(16)}${Math.floor(Math.random() * 256).toString(16)}${Math.floor(Math.random() * 256).toString(16)}`,
      phone: user.phone,
      picture_large: user.picture.large,
      picture_thumbnail: user.picture.thumbnail,
      note: 'My notes',
    };

    newUsers.push(newUser);
  });

  arrayUsers = [...newUsers];
  return newUsers;
}


function isNeededString(str) {
  return typeof str === 'string' && str.at(0).toUpperCase() === str.at(0);
}

function validateObject(user) {
  if ((/[A-Z][a-z]*\s[A-Z][a-z]*$/.test(user.full_name) || isNeededString(user.full_name))
    && (/[A-Z][a-z]*$/.test(user.state) || isNeededString(user.state))
    && (/([A-Z][a-z]*)|([A-Z][a-z]*(\s[A-Z][a-z]*)*)$/.test(user.country) || isNeededString(user.country))
    && (/([A-Z][a-z]*)|([A-Z][a-z]*(\s[A-Z][a-z]*)*)$/.test(user.city) || isNeededString(user.city))
    && /[a-z]*$/.test(user.gender)
    && (/([A-Z][a-z]*)|([A-Z][a-z]*(\s[A-Z][a-z]*)*)$/.test(user.note) || isNeededString(user.note))
    && /([A-Za-z0-9_-]+\.)*[A-Za-z0-9_-]+@[a-z]+\.[a-z]+$/.test(user.email)
    && (/\+38\d{10}$/.test(user.phone) // UA
      || /\d{4}-\d{7}$/.test(user.phone) // DE
      || /\d{3}-\d{8}$/.test(user.phone) // IR
      || /\d{2}-\d{4}-\d{4}$/.test(user.phone) // AU
      || /\(\d{3}\)-\d{3}-\d{4}$/.test(user.phone) // US TR NZ NL
      || /\d{2}-\d{3}-\d{3}$/.test(user.phone) // FI
      || /\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/.test(user.phone) // FR
      || /\d{3}-\d{3}-\d{3}$/.test(user.phone) // ES
      || /\d{8}$/.test(user.phone) // NO DK
      || /\d{3}\s\d{3}\s\d{2}\s\d{2}$/.test(user.phone) // CH
      || /\d{3}-\d{3}-\d{4}$/.test(user.phone)) // IE CA
    && typeof user.age === 'number') {
    return true;
  }

  return false;
}

function getRegion(country) {
  if(regions.Asia.indexOf(country) !== -1)
    return "Asia";

  if(regions.Europe.indexOf(country) !== -1)
    return "Europe";

  if(regions.Americas.indexOf(country) !== -1)
    return "Americas";

  if(regions.Pacific.indexOf(country) !== -1)
    return "Pacific";
}

function filtration(users, filtrationKey) {
  const resUsers = [];
  let min, max;
  filtrationKey.age = filtrationKey.age === undefined ? "0-100" : filtrationKey.age;
  if (filtrationKey.age[filtrationKey.age.length - 1] === "+"){
    min = 61;
    max = 1000;
  } else {
    min = filtrationKey.age?.split('-')[0];
    max = filtrationKey.age?.split('-')[1];
  }

  users.forEach((user) => {
    const isPhoto = user.picture_large !== null;

    if ((getRegion(user.country) === filtrationKey.region || filtrationKey.region === undefined)
      && ((user.age >= min && user.age <= max) || filtrationKey.age === undefined)
      && (user.gender === filtrationKey.gender || filtrationKey.gender === undefined)
      && (isPhoto === filtrationKey.photo || filtrationKey.photo === undefined)
      && (user.favorite === filtrationKey.favorite || filtrationKey.favorite === undefined)) {
      resUsers.push(user);
    }
  });

  return resUsers;
}

function search(users, searchKey) {
  if (Number(searchKey) - 1 === searchKey - 1) {
    return users.find((user) => user.age === Number(searchKey));
  }

  const name = searchKey.split(',')[0];
  const note = searchKey.split(',')[1];
  const age = searchKey.split(',')[2];

  return users.find((user) => ((user.full_name === name || name === undefined) && (user.note === note || note === undefined) && (user.age === Number(age) || age === undefined)));
}

function sort(users, key, flag) {
  const sortUsers = [...users];
  switch (key) {
    case 'Name':
      if (flag) {
        sortUsers.sort((a, b) => a.full_name.localeCompare(b.full_name));
      } else {
        sortUsers.sort((a, b) => b.full_name.localeCompare(a.full_name));
      }
      break;
    case 'Age':
      if (flag) {
        sortUsers.sort((a, b) => a.age - b.age);
      } else {
        sortUsers.sort((a, b) => b.age - a.age);
      }
      break;
    case 'Gender':
      if (flag) {
        sortUsers.sort((a, b) => a.gender.localeCompare(b.gender));
      } else {
        sortUsers.sort((a, b) => b.gender.localeCompare(a.gender));
      }
      break;
    case 'Nationality':
      if (flag) {
        sortUsers.sort((a, b) => a.country.localeCompare(b.country));
      } else {
        sortUsers.sort((a, b) => b.country.localeCompare(a.country));
      }
      break;
    case 'Speciality':
      if (flag) {
        sortUsers.sort((a, b) => a.course.localeCompare(b.course));
      } else {
        sortUsers.sort((a, b) => b.course.localeCompare(a.course));
      }
      break;
    default:
      console.log('Wrong sort key');
  }

  return sortUsers;
}

function countPercents(users, percentKey) {
  const filterUsers = filtration(users, percentKey);

  return (filterUsers.length / users.length) * 100;
}

let id = 0;
const openPopupButton = document.getElementsByClassName('add-teacher-button');
const popupContainer = document.getElementsByClassName('popup-add-teacher');
const closePopupButton = document.getElementsByClassName('popup-add-teacher-button');

for (let i = 0; i < 2; i++) {
  openPopupButton[i].addEventListener('click', () => {
    popupContainer[i].style.display = 'flex';
  });

  closePopupButton[i].addEventListener('click', () => {
    popupContainer[i].style.display = 'none';
  });

  const form = popupContainer[i].querySelector(".form");
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    let name = form.querySelector(".input-name").value;
    let selectedGender = form.querySelector('input[name="gender"]:checked').value;
    let city = form.querySelector('input[name="city"]').value;
    let phone = form.querySelector('input[name="phone"]').value;
    let email = form.querySelector('input[name="email"]').value;
    let date = form.querySelector('input[name="date"]').value;
    let color = form.querySelector('input[name="color"]').value;
    let country = form.querySelector('.select-country-option').value;
    let course = form.querySelector('.select-speciality-option').value;
    let notes = form.querySelector('.textarea').value;

    let userInputDate = new Date(date);
    let currentDate = new Date();
    let ageDifferenceInMilliseconds = currentDate - userInputDate;
    let ageDifferenceInYears = ageDifferenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    ageDifferenceInYears = Math.floor(ageDifferenceInYears);

    const newUser = {
      id: id++,
      gender: selectedGender,
      title: selectedGender === 'male' ? "Mr" : "Ms",
      full_name: `${name.split(' ')[0]} ${name.split(' ')[1]}`,
      city: city,
      state: "State",
      country: country,
      course: course,
      favorite: false,
      postcode: null,
      coordinates: null,
      timezone: null,
      email: email,
      b_date: date,
      age: ageDifferenceInYears,
      bg_color: color,
      phone: phone,
      picture_large: null,
      picture_thumbnail: null,
      note: notes === '' ? "My notes" : notes,
    };

    arrayUsers.push(newUser);
    sortArray.push(newUser);
    makeTable();

    addUser(newUser);
    addData();
  });
}

let popupID = 0
const teachersBlock = document.querySelector(".teachers-div");
function addUser(user) {
  if(validateObject(user)){
    const photo = user.picture_large !== null ? user.picture_large : "images/photo1.jpg";
    teachersBlock.innerHTML += `
    <div class="teacher-card">
         <div class="teacher-photo-div">
            <div class="teacher-photo-scale">
               <img src="${photo}" alt="No data" class="teacher-photo" onclick="togglePopupVisibility(this.parentNode.parentNode.querySelector('.popup'))">
            </div>
            <div class="popup" id="popup${popupID}">
               <div class="popup-content">
                  <header class="popup-header">
                     <h2 class="popup-header-text">Teacher info</h2>
                     <button class="popup-close-button" onclick="closePopup(this.parentNode.parentNode.parentNode)">x</button>
                  </header>
                  <main class="popup-main">
                     <img src="${photo}" alt="No data" class="popup-teacher-photo">
                     <div class="popup-info">
                        <p class="popup-name">${user.full_name}</p>
                        <p class="popup-subject"><b>${user.course}</b></p>
                        <p class="popup-country">${user.city}, ${user.country}</p>
                        <p class="popup-sex">${user.age}, ${user.gender}</p>
                        <p class="popup-email">${user.email}</p>
                        <p class="popup-number">${user.phone}</p>
                     </div>
                  </main>
                  <footer class="popup-footer">
                     <p class="popup-footer-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                     </p>
                     <p class="popup-map-text">toggle map</p>
                  </footer>
               </div>
            </div>
         </div>
         <div class="teacher-info">
            <p class="name"><b>${user.full_name.split(' ')[0]}</b></p>
            <p class="surname"><b>${user.full_name.split(' ')[1]}</b></p>
            <p class="subject">${user.course}</p>
            <p class="country">${user.country}</p>
         </div>
      </div>
    `;

    const starIcon = document.createElement('img');
    starIcon.src = user.favorite ? '/src/images/star2.png' : '/src/images/star1.png';
    starIcon.className = 'star-fav';

    const popup = document.getElementById("popup" + popupID);
    popupID++;

    popup.querySelector('.popup-main').appendChild(starIcon);
    popupAddFunc(popup);
  }
}

const ageSelect = document.getElementById('age');
const regionSelect = document.getElementById('region');
const sexSelect = document.getElementById('sex');

ageSelect.addEventListener('change', function() {
  addData()
});

regionSelect.addEventListener('change', function() {
  addData()
});

sexSelect.addEventListener('change', function() {
  addData()
});

const onlyWithPhotoCheckbox = document.querySelector('input[name="only-with-photo"]');
const onlyFavoritesCheckbox = document.querySelector('input[name="only-favorites"]');

onlyWithPhotoCheckbox.addEventListener('change', function() {
  addData()
});

onlyFavoritesCheckbox.addEventListener('change', function() {
  addData()
});


function addData() {

  const filtrationKey = {age:ageSelect.value, gender: sexSelect.value.toLowerCase(), favorite: onlyFavoritesCheckbox.checked, region: regionSelect.value, photo: onlyWithPhotoCheckbox.checked}

  const users = filtration(arrayUsers, filtrationKey);

  teachersBlock.innerHTML = "";
  popupID = 0;

  users.forEach(user => {
    addUser(user);
  });
  const stars = document.querySelectorAll('.star-fav');

  var i = 0;
  users.forEach(user => {
    stars[i].addEventListener('click', () => {
      user.favorite = !user.favorite;
      addData();
      addFav();
    });
    i++;
  });
}

function popupAddFunc(p){

  const photo = p.parentNode.querySelector(".teacher-photo");
  const closeButton = p.querySelector('.popup-close-button');
  photo.addEventListener('click', () => {
    p.style.display = 'flex';
  });

  closeButton.addEventListener('click', () => {
    p.style.display = 'none';
  });

}
let sortArray = []

async function makeTable() {

  sortArray = []

  arrayUsers.forEach(user => {

    if(validateObject(user)){
      sortArray.push(user)
    }
  });
  const table = document.querySelector('tbody');
  table.innerHTML = ``;

  for(let i = 0; i < 10; i++){
    table.innerHTML += `
    <tr>
        <td class="td-name">${sortArray[i].full_name}</td>
        <td>${sortArray[i].course}</td>
        <td>${sortArray[i].age}</td>
        <td>${sortArray[i].gender[0].toUpperCase() + sortArray[i].gender.slice(1)}</td>
        <td>${sortArray[i].country}</td>
    </tr>
    `;
  }

  const pagesAmount = Math.ceil(sortArray.length / 10);
  const statButtonsDiv = document.querySelector('.statistic-buttons');
  if(pagesAmount < 3) {
    for (let i = 0; i < pagesAmount; i++){
      statButtonsDiv.innerHTML += `
         <button>${i+1}</button>
    `;
    }
  } else if(pagesAmount === 4) {
    statButtonsDiv.innerHTML = `
         <button class="active-button">1</button>
         <button>2</button>
         <button>3</button>
         <button>4</button>
    `;
  } else {
    statButtonsDiv.innerHTML = `
         <button class="active-button">1</button>
         <button>2</button>
         <button>3</button>
         <button class="extension-button">...</button>
         <button>${pagesAmount}</button>
    `;
  }

  const extensionButton = document.querySelector('.extension-button');

  const buttonsNew = document.querySelectorAll('.statistic-buttons button');
  const buttons = [...buttonsNew]

  extensionButton.addEventListener('click', function (){
    for (let i = pagesAmount - 1; i >= 4; i--) {
      const newButton = document.createElement('button');
      newButton.textContent = i;
      buttons.push(newButton);

      newButton.addEventListener('click', () => {
        if(newButton.textContent !== "..."){
          newButton.addEventListener('click', function() {
            buttons.forEach(function(btn) {
              btn.classList.remove('active-button');
            });

            newButton.classList.add('active-button');
            remakeTable(newButton.textContent);
          });
        }
      });
      extensionButton.insertAdjacentElement('afterend', newButton);
    }
    extensionButton.style.display = 'none';
  });

  buttons.forEach(function(button) {
    if(button.textContent !== "..."){
      button.addEventListener('click', function() {
        buttons.forEach(function(btn) {
          btn.classList.remove('active-button');
        });

        button.classList.add('active-button');
        remakeTable(button.textContent);
      });
    }
  });
}

function remakeTable(currentPage) {
  const table = document.querySelector('tbody');
  table.innerHTML = ``;
  for (let i = (currentPage - 1) * 10; i < currentPage * 10; i++) {
    table.innerHTML += `
    <tr>
  <td class="td-name">${sortArray[i].full_name}</td>
  <td>${sortArray[i].course}</td>
  <td>${sortArray[i].age}</td>
  <td>${sortArray[i].gender[0].toUpperCase() + sortArray[i].gender.slice(1)}</td>
  <td>${sortArray[i].country}</td>
</tr>
    `;
  }
}

const sortColumnAsc = document.querySelectorAll('th');
//const sortColumnDes = document.querySelectorAll('.th-sort-asc');

sortColumnAsc.forEach(function (column) {
  recStat(column)
});

function recStat(column) {
  column.addEventListener('click', function () {
    if(column.className === 'th-sort'){
      sortColumnAsc.forEach(function (column2) {
        column2.className = 'th-sort';
      });
      column.className = 'th-sort-asc';
      sortArray = [...sort(sortArray, column.textContent, true)];
      remakeTable(1);
    } else {
      sortColumnAsc.forEach(function (column2) {
        column2.className = 'th-sort';
      });
      column.className = 'th-sort';
      recStat(column)
      sortArray = [...sort(sortArray, column.textContent, false)];
      remakeTable(1);
    }
  })
}



const searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', function (){
  const searchArea = document.querySelector('.search');
  const user = search(arrayUsers, searchArea.value);
  const photo = user.picture_large !== null ? user.picture_large : "images/photo1.jpg";

  teachersBlock.innerHTML = `
    <div class="teacher-card">
         <div class="teacher-photo-div">
            <div class="teacher-photo-scale">
               <img src="${photo}" alt="No data" class="teacher-photo" onclick="togglePopupVisibility(this.parentNode.parentNode.querySelector('.popup'))">
            </div>
            <div class="popup" id="popup${popupID}">
               <div class="popup-content">
                  <header class="popup-header">
                     <h2 class="popup-header-text">Teacher info</h2>
                     <button class="popup-close-button" onclick="closePopup(this.parentNode.parentNode.parentNode)">x</button>
                  </header>
                  <main class="popup-main">
                     <img src="${photo}" alt="No data" class="popup-teacher-photo">
                     <div class="popup-info">
                        <p class="popup-name">${user.full_name}</p>
                        <p class="popup-subject"><b>${user.course}</b></p>
                        <p class="popup-country">${user.city}, ${user.country}</p>
                        <p class="popup-sex">${user.age}, ${user.gender}</p>
                        <p class="popup-email">${user.email}</p>
                        <p class="popup-number">${user.phone}</p>
                     </div>
                  </main>
                  <footer class="popup-footer">
                     <p class="popup-footer-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                     </p>
                     <p class="popup-map-text">toggle map</p>
                  </footer>
               </div>
            </div>
         </div>
         <div class="teacher-info">
            <p class="name"><b>${user.full_name.split(' ')[0]}</b></p>
            <p class="surname"><b>${user.full_name.split(' ')[1]}</b></p>
            <p class="subject">${user.course}</p>
            <p class="country">${user.country}</p>
         </div>
      </div>
    `;
});

function addFav() {
  const fav = filtration(arrayUsers, {favorite: true});
  const favMain = document.querySelector('.favorites-main');

  favMain.innerHTML = ``;
  for (let i = 0; i < 5; i++){
    const user = fav[i];
    const photo = user.picture_large !== null ? user.picture_large : "images/photo1.jpg";
    favMain.innerHTML += `
    <div class="teacher-card">
      <div class="teacher-photo-div">
        <div class="teacher-photo-scale">
          <img src="${photo}" alt="No data" class="teacher-photo">
        </div>
      </div>
      <div class="teacher-info">
            <p class="name"><b>${user.full_name.split(' ')[0]}</b></p>
            <p class="surname"><b>${user.full_name.split(' ')[1]}</b></p>
            <p class="subject">${user.course}</p>
            <p class="country">${user.country}</p>
         </div>
    </div>
    `;

  }
}

async function main() {
  await getRandomUser(); // Отримати випадкових користувачів
  await makeUsers(); // Створити користувачів на основі отриманих даних
  addData(); // Додати дані на сторінку
  await makeTable(); // Створити таблицю на основі користувачів
  addFav(); // Додати улюблених користувачів на сторінку
}
document.addEventListener('DOMContentLoaded', () => {
  main();
});
// getRandomUser();
// makeUsers()
// addData();
// makeTable();
// addFav();
