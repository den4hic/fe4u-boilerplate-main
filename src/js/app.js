import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';

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

function makeUsers() {
  const users = randomUserMock;
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

  additionalUsers.forEach((user) => {
    if (!newUsers.find((newUser) => newUser.id === user.id)) {
      newUsers.push(user);
    }
  });

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

function filtration(users, filtrationKey) {
  const resUsers = [];

  const min = filtrationKey.age?.split('-')[0];
  const max = filtrationKey.age?.split('-')[1];

  users.forEach((user) => {
    if ((user.country === filtrationKey.country || filtrationKey.country === undefined)
      && ((user.age >= min && user.age <= max) || filtrationKey.age === undefined)
      && (user.gender === filtrationKey.gender || filtrationKey.gender === undefined)
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
    case 'full_name':
      if (flag) {
        sortUsers.sort((a, b) => a.full_name.localeCompare(b.full_name));
      } else {
        sortUsers.sort((a, b) => b.full_name.localeCompare(a.full_name));
      }
      break;
    case 'age':
      if (flag) {
        sortUsers.sort((a, b) => a.age - b.age);
      } else {
        sortUsers.sort((a, b) => b.age - a.age);
      }
      break;
    case 'b_day':
      if (flag) {
        sortUsers.sort((a, b) => a.localeCompare(b));
      } else {
        sortUsers.sort((a, b) => b.localeCompare(a));
      }
      break;
    case 'country':
      if (flag) {
        sortUsers.sort((a, b) => a.localeCompare(b));
      } else {
        sortUsers.sort((a, b) => b.localeCompare(a));
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

// const popup = document.getElementById('popup');
// const imageContainer = document.querySelector('.teacher-photo');
// const closeButton = document.querySelector('.popup-close-button');
//
// imageContainer.addEventListener('click', () => {
//   popup.style.display = 'flex';
// });
//
// closeButton.addEventListener('click', () => {
//   popup.style.display = 'none';
// });
//
const openPopupButton = document.getElementsByClassName('add-teacher-button');
const popupContainer = document.getElementsByClassName('popup-add-teacher');
const closePopupButton = document.getElementsByClassName('popup-add-teacher-button');
console.log(popupContainer);
for (let i = 0; i < 2; i++) {
  openPopupButton[i].addEventListener('click', () => {
    popupContainer[i].style.display = 'flex';
  });

  closePopupButton[i].addEventListener('click', () => {
    popupContainer[i].style.display = 'none';
  });

  const addButton = popupContainer[i].querySelector(".submit-button");

  addButton.addEventListener('click', () => {

  });
}
// openPopupButton[0].addEventListener('click', () => {
//   popupContainer[0].style.display = 'flex';
// });
//


function addData() {
  const users = makeUsers();
  const teachersBlock = document.querySelector(".teachers-div");
  users.forEach(user => {
    if(validateObject(user)){
      teachersBlock.innerHTML += `
    <div class="teacher-card">
         <div class="teacher-photo-div">
            <div class="teacher-photo-scale">
               <img src="${user.picture_large}" alt="No data" class="teacher-photo">
            </div>
            <div class="popup" id="popup">
               <div class="popup-content">
                  <header class="popup-header">
                     <h2 class="popup-header-text">Teacher info</h2>
                     <button class="popup-close-button">x</button>
                  </header>
                  <main class="popup-main">
                     <img src="${user.picture_large}" alt="No data" class="popup-teacher-photo">
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
    }
  });
}

addData();

const popup = document.getElementsByClassName("popup");

Array.prototype.forEach.call(popup, function(p) {
  const photo = p.parentNode.querySelector(".teacher-photo");
  const closeButton = p.querySelector('.popup-close-button');
  photo.addEventListener('click', () => {
    p.style.display = 'flex';
  });

  closeButton.addEventListener('click', () => {
    p.style.display = 'none';
  })
});
