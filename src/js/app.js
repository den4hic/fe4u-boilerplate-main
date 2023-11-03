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

  arrayUsers = [...validateUsers(newUsers)];

  return newUsers;
}


function isNeededString(str) {
  return typeof str === 'string' && str.at(0).toUpperCase() === str.at(0);
}

function validateUsers(users){
  return _.filter(users, user => validateObject(user))
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
function getAge(ageSelection){
  let minMax = {}
  if (ageSelection === "+"){
    minMax.min = 61;
    minMax.max = 1000;
  } else {
    minMax.min = ageSelection?.split('-')[0];
    minMax.max = ageSelection?.split('-')[1];
  }
  return minMax
}

function search(users, searchKey) {

  const name = searchKey.split(',')[0];
  const note = searchKey.split(',')[1];
  const age = searchKey.split(',')[2];

  if (Number(searchKey) - 1 === searchKey - 1) {
    return _.find(arrayUsers, { age: Number(searchKey)});
  }

  return _.find(arrayUsers, { full_name: name, note: note, age: Number(age)})
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
  form.addEventListener("submit", async function(event) {
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

    try {
      const response = await fetch('http://localhost:3000/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }

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
    const image = user.picture_large !== null ? user.picture_large : "images/photo1.jpg";
    teachersBlock.innerHTML += `
    <div class="teacher-card">
         <div class="teacher-photo-div">
            <div class="teacher-photo-scale">
               <img src="${image}" alt="No data" class="teacher-photo">
            </div>
            <div class="popup">
               
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
  const age = getAge(ageSelect.value)

  const users = _.filter(arrayUsers, user => getRegion(user.country) === regionSelect.value && user.age > age.min && user.age < age.max && user.favorite === onlyFavoritesCheckbox.checked && (user.picture_large !== null) === onlyWithPhotoCheckbox.checked && user.gender === sexSelect.value.toLowerCase());

  teachersBlock.innerHTML = "";
  popupID = 0;

  users.forEach(user => {
    addUser(user);
  });

  let i = 0;

  const teacherPhotoDiv = document.querySelectorAll('.popup');
  teacherPhotoDiv.forEach(popup => {
    const user = users[i];
    i++;
    let image = popup.parentNode.querySelector('.teacher-photo');
    image.addEventListener('click', () => {
      const userBirthday = dayjs(user.b_date).set('year', dayjs().year());
      let dayToBirthday = userBirthday.diff(dayjs(), 'day');
      if (dayToBirthday < 0) {
        dayToBirthday = 365 + dayToBirthday;
      }
      const img = user.picture_large !== null ? user.picture_large : "images/photo1.jpg";

      popup.innerHTML = `
              <div class="popup-content">
                <header class="popup-header">
                   <h2 class="popup-header-text">Teacher info</h2>
                   <button class="popup-close-button" onclick="closePopup(this.parentNode.parentNode.parentNode)">x</button>
                </header>
                <main class="popup-main">
                   <img src="${img}" alt="No data" class="popup-teacher-photo">
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
                   <p class="popup-footer-text">${user.note}
                   </p>
                   <p>Days until the birthday: ${dayToBirthday}</p>
                   <div style="height: 200px" id="map"></div>
                </footer>
             </div>`;

      const starIcon = document.createElement('img');
      starIcon.src = user.favorite ? '/src/images/star2.png' : '/src/images/star1.png';
      starIcon.className = 'star-fav';

      var map = L.map('map').setView([user.coordinates.latitude, user.coordinates.longitude], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      }).addTo(map);

      L.marker([user.coordinates.latitude, user.coordinates.longitude]).addTo(map);

      starIcon.addEventListener('click', () => {
        user.favorite = !user.favorite;
        addData();
        addFav();
      })

      popup.querySelector('.popup-main').appendChild(starIcon);
      const closeButton = popup.querySelector('.popup-close-button');
      closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
      });
      popup.style.display = 'flex';
    });
  });
}

let sortArray = []
let currentPieChart = null;

function makeTable() {

  const updatePieChart = (data) => {
    if (currentPieChart) {
      currentPieChart.destroy();
    }

    const ctx = document.getElementById("pieChart").getContext("2d");
    currentPieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: data.backgroundColor
        }]
      }
    });
  };
  const coursesData = {};
  const countriesData = {};
  const genderData = {};
  arrayUsers.forEach(user => {
      if (!coursesData[user.course]) {
        coursesData[user.course] = 1;
      } else {
        coursesData[user.course]++;
      }
      if(!countriesData[user.country]) {
        countriesData[user.country] = 1;
      } else {
        countriesData[user.country]++;
      }
      if(!genderData[user.gender]) {
        genderData[user.gender] = 1;
      } else {
        genderData[user.gender]++;
      }
  });

  const switchButtons = document.querySelectorAll('.switch-buttons button');
  const buttons = [...switchButtons]

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      buttons.forEach(function (buttonNew){
        buttonNew.className = ''
      });
      button.className = 'active-button'
      switch (button.textContent) {
        case "Gender":
          updatePieChart(pieChart3Data);
          break;
        case "Country":
          updatePieChart(pieChart2Data);
          break;
        case "Course":
          updatePieChart(pieChart1Data);
          break;
      }
    })
  });

  const pieChart1Data = {
    labels: Object.keys(coursesData),
    data: Object.values(coursesData),
  };

  const pieChart2Data = {
    labels: Object.keys(countriesData),
    data: Object.values(countriesData),
  };

  const pieChart3Data = {
    labels: Object.keys(genderData),
    data: Object.values(genderData),
  };

  updatePieChart(pieChart3Data)
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
               <img src="${photo}" alt="No data" class="teacher-photo">
            </div>
            <div class="popup">
               
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
  const fav = _.filter(arrayUsers, user => user.favorite === true);
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
  await makeUsers();
  addData();
  makeTable();
  addFav();
}
document.addEventListener('DOMContentLoaded', () => {
  main();
});
