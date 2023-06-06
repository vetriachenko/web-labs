// const testModules = require('./test-module');
// import { capitalize, isUpperCase } from './str-utils';
// import {
//   getPersonBirthDate,
//   getPersonLocation,
//   getPersonName,
//   getRandomCourse,
//   idToString,
// } from './people-utils';

// const {
//   additionalUsers,
//   randomUserMock,
// } = require('./FE4U-Lab3-mock');
// require('../css/app.css');
// require('../scss/style.scss');

// /** ******** Your code here! *********** */

// console.log(testModules.hello);
// const peopleComparator = (field, ascending) => (a, b) => {
//   if (a[field] > b[field]) {
//     return ascending;
//   }
//   if (a[field] < b[field]) {
//     return -ascending;
//   }
//   return 0;
// };

// function fetchData() {
//   const data = [...randomUserMock];
//   const ids = new Set();
//   data.forEach((user) => {
//     const id = idToString(user.id);
//     ids.add(id);
//   });
//   additionalUsers.forEach((user) => {
//     const id = idToString(user.id);
//     if (!ids.has(id)) {
//       data.push(user);
//       ids.add(id);
//     }
//   });
//   return data;
// }

// function extractPersonFromResource(resource) {
//   const name = getPersonName(resource);
//   const location = getPersonLocation(resource);
//   const birthDate = getPersonBirthDate(resource);
//   return {
//     gender: capitalize(resource.gender),
//     title: capitalize(name.title),
//     fullName: name.fullName,
//     city: capitalize(location.city),
//     state: capitalize(location.state),
//     country: capitalize(location.country),
//     postcode: location.postcode,
//     coordinates: location.coordinates,
//     timezone: location.timezone,
//     email: resource.email ? resource.email : null,
//     birthDate: birthDate.date,
//     age: birthDate.age,
//     phone: resource.phone ? resource.phone : null,
//     pictureLarge: resource.picture_large ? resource.picture_large : null,
//     pictureThumbnail: resource.picture_thumbnail ? resource.picture_thumbnail : null,
//     id: idToString(resource.id),
//     favorite: resource.favorite === true,
//     backgroundColor: resource.bg_color ? resource.bg_color : '#fff',
//     note: capitalize(resource.note ? resource.note : ''),
//     course: resource.course ? capitalize(resource.course) : getRandomCourse(),
//   };
// }

// export function getData() {
//   const fetchedData = fetchData();
//   return fetchedData.map((person) => extractPersonFromResource(person));
// }

// function validatePerson(person, phoneRegex) {
//   const ageIsNumeric = person.age === null || typeof person.age === 'number';
//   const fullNameIsValid = typeof person.fullName === 'string' && isUpperCase(person.fullName.charAt(0));
//   const genderIsValid = typeof person.gender === 'string' && isUpperCase(person.gender.charAt(0));
//   const noteIsValid = typeof person.note === 'string' && (person.note.length === 0 || isUpperCase(person.note.charAt(0)));
//   const stateIsValid = person.state === null || (typeof person.state === 'string' && isUpperCase(person.state.charAt(0)));
//   const countryIsValid = person.country === null || (typeof person.country === 'string' && isUpperCase(person.country.charAt(0)));
//   const phoneIsValid = person.phone === null || phoneRegex.test(person.phone);
//   const emailIsValid = person.email === null || (typeof person.email === 'string' && person.email.includes('@'));
//   const isValid = ageIsNumeric
//     && fullNameIsValid
//     && genderIsValid
//     && noteIsValid
//     && stateIsValid
//     && countryIsValid
//     && phoneIsValid
//     && emailIsValid;
//   if (!isValid) {
//     console.dir({
//       ageIsNumeric,
//       fullNameIsValid,
//       genderIsValid,
//       noteIsValid,
//       stateIsValid,
//       countryIsValid,
//       phoneIsValid,
//       emailIsValid,
//     });
//   }
//   return isValid;
// }

// export function filterPeople(data, filter) {
//   let results = data;
//   if (filter.country) {
//     results = results.filter((person) => person.country === filter.country);
//   }
//   if (filter.age) {
//     if (typeof filter.age === 'number') {
//       results = results.filter((person) => person.age === filter.age);
//     } else if (typeof filter.age === 'object') {
//       if (filter.age.min) {
//         results = results.filter((person) => person.age >= filter.age.min);
//       }
//       if (filter.age.max) {
//         results = results.filter((person) => person.age < filter.age.max);
//       }
//     }
//   }
//   if (filter.gender) {
//     results = results.filter((person) => person.gender === filter.gender);
//   }
//   if (typeof filter.favorite === 'boolean') {
//     results = results.filter((person) => person.favorite === filter.favorite);
//   }
//   return results;
// }

// export function sortPeople(data, opts) {
//   let sortingField;
//   let ascending = 1;
//   if (typeof opts === 'string') {
//     sortingField = opts;
//   } else if (typeof opts === 'object') {
//     sortingField = opts.field;
//     if (opts.ascending !== null && opts.ascending !== undefined) {
//       ascending = opts.ascending;
//     }
//   }
//   return data.sort(peopleComparator(sortingField, ascending));
// }

// export function search(data, query) {
//   if (typeof query === 'object') {
//     let results = data;
//     if (query.name) {
//       results = results.filter((person) => person.fullName.startsWith(query.name));
//     }
//     if (query.age) {
//       results = results.filter((person) => person.age === query.age);
//     }
//     if (query.note) {
//       results = results.filter((person) => person.note && person.note.includes(query.note));
//     }
//     return results;
//   }
//   return [];
// }

// export function getPercentageForSearch(data, query) {
//   const searchResults = search(data, query);
//   return (searchResults.length / data.length) * 100;
// }

// const users = getData();
// users.forEach((person) => {
//   const isValid = validatePerson(person, /[0-9-+]+/);
//   if (!isValid) {
//     console.log(`${person.fullName}: ${isValid}`);
//   }
// });

// const filter = {
//   country: "Norway",
//   age: {
//     min: 10,
//     max: 80
//   },
//   gender: "Female",
//   favorite: null
// };

// const sortFilter = {
//   field: "fullName",
//   ascending: -1
// };

// const searchFilter = {
//   name: null,
//   age: null,
//   note: "lady"
// };

// const filtered = filterPeople(users, filter);
// const sorted = sortPeople(users, sortFilter);
// const searched = search(users, searchFilter);
// const percentage = getPercentageForSearch(users, searchFilter);

// console.dir({users, filtered, sorted, searched, percentage});

import {
  getUserInitials,
  search,
  filterPeople,
  getUsers,
  sortPeople,
} from './people-utils';

const testModules = require('./test-module');

require('../css/app.css');
require('../scss/style.scss');

/** ******** Your code here! *********** */

console.log(testModules.hello);

const users = getUsers();

const filter = {};
const sortFilter = {};
let searchFilter = '';

const teacherCardModal = document.querySelector('#teacher-modal');
const closeTeacherForm = document.querySelector('#close-teacher-modal');
closeTeacherForm.onclick = () =>
  teacherCardModal.classList.add('modal_close');

function openTeacherForm(user) {
  const userPhoto = user.pictureLarge || user.pictureThumbnail;

  const teacherForm = document.querySelector('#teacher-modal');
  teacherForm.classList.remove('modal_close');
  const teacherName = teacherForm.querySelector('.teacher-card__name');
  const teacherAvatar = teacherForm.querySelector('.teacher-card__avatar');
  const teacherSpeciality = teacherForm.querySelector(
    '.teacher-card__speciality'
  );
  const teacherLocation = teacherForm.querySelector('.teacher-card__location');
  const teacherPersonInfo = teacherForm.querySelector(
    '.teacher-card__person-info'
  );
  const teacherPersonEmail = teacherForm.querySelector('.teacher-card__email');
  const teacherPersonPhone = teacherForm.querySelector('.teacher-card__phone');
  const teacherPersonDescribe = teacherForm.querySelector(
    '.teacher-card__describe'
  );

  const teacherPersonFavorite = teacherForm.querySelector(
    '.teacher-card__favorite'
  );

  teacherAvatar.src = userPhoto;
  teacherName.innerText = user.fullName;
  teacherSpeciality.innerText = user.course;
  teacherLocation.innerText = `${user.city || ''}, ${user.country || ''}`;
  teacherPersonInfo.innerText = `${user.age || ''}, ${user.gender || ''}`;
  teacherPersonEmail.innerText = user.email;
  teacherPersonPhone.innerText = user.phone;
  teacherPersonDescribe.innerText = user.note;
  teacherPersonFavorite.innerText = user.favorite ? '❤️' : '🖤';

  teacherPersonFavorite.onclick = () => {
    user.favorite = !user.favorite;
    teacherPersonFavorite.innerText = user.favorite ? '❤️' : '🖤';
    renderTeachers();
    renderFavoriteTeachers()
  };
}

const getTeacherBlock = (teacher) => {
  const teacherPhoto = teacher.pictureLarge || teacher.pictureThumbnail;
  return `
      <div class="teacher-avatar">
      ${
        teacherPhoto
          ? `<img
              class="teacher-avatar__img"
              src="${teacherPhoto}"
              alt="Teacher photo"
            />`
          : `<h3 class="teacher-avatar__placeholder">
              ${getUserInitials(teacher)}
            </h3>`
      }
    </div>
    <p class="teacher-compact-info__name">${teacher.fullName}</p>
    <p class="teacher-compact-info__specialty">${teacher.course}</p>
    <p class="teacher-compact-info__nationality">${teacher.country}</p>
  `;
};

const teachersList = document.querySelector('.teachers-list');

function renderTeachers() {
  const searchedUsers = search(users, searchFilter);
  const filteredUsers = filterPeople(searchedUsers, filter);
  teachersList.innerHTML = '';

  filteredUsers.forEach((user) => {
    const teacher = document.createElement('div');
    teacher.classList.add('teacher-compact-info');
    if (user.favorite) teacher.classList.add('teacher-compact-info--favorite');
    teacher.onclick = () => openTeacherForm(user);
    teacher.innerHTML += getTeacherBlock(user);
    teachersList.appendChild(teacher);
  });
}

const filtersRow = document.querySelector('.teachers__filters-row');
const filterByAge = filtersRow.querySelector('#filter-age');
const agesFilters = ['any', '10-20', '20-30', '30+'];

agesFilters.forEach((ageFilter) => {
  const newAgeFilter = document.createElement('option');
  newAgeFilter.value = ageFilter;
  newAgeFilter.innerText = ageFilter;
  filterByAge.appendChild(newAgeFilter);
});

filterByAge.onchange = (e) => {
  const { value } = e.target;
  const age = {
    any: null,
    '10-20': { min: 10, max: 20 },
    '20-30': { min: 20, max: 30 },
    '30+': { min: 30 },
  };
  filter.age = age[value];
  renderTeachers();
};

renderTeachers();

const filterByCountry = filtersRow.querySelector('#filter-region');
const countries = users.map(({ country }) => country);
const uniqCountries = Array.from(new Set(countries));

const countryFilters = ['any', ...uniqCountries];

countryFilters.forEach((country) => {
  const newCountryFilter = document.createElement('option');
  newCountryFilter.value = country;
  newCountryFilter.innerText = country;
  filterByCountry.appendChild(newCountryFilter);
});

filterByCountry.onchange = (e) => {
  const { value } = e.target;
  filter.country = value === 'any' ? null : value;
  renderTeachers();
};

const filterByGender = filtersRow.querySelector('#filter-sex');
const genders = users.map(({ gender }) => gender);
const uniqGenders = Array.from(new Set(genders));

const genderFilters = ['any', ...uniqGenders];

genderFilters.forEach((gender) => {
  const newGenderFilter = document.createElement('option');
  newGenderFilter.value = gender;
  newGenderFilter.innerText = gender;
  filterByGender.appendChild(newGenderFilter);
});

filterByGender.onchange = (e) => {
  const { value } = e.target;
  filter.gender = value === 'any' ? null : value;
  renderTeachers();
};

const withPhotoFilter = filtersRow.querySelector('#filter-withPhoto');
withPhotoFilter.onchange = () => {
  filter.withPhoto = !filter.withPhoto;
  renderTeachers();
};

const favoriteFilter = filtersRow.querySelector('#filter-isFavorite');
favoriteFilter.onchange = () => {
  filter.favorite = !filter.favorite;
  renderTeachers();
};

const statisticsTable = document.querySelector('.stats-table');
const sortByName = statisticsTable.querySelector('#stats-table__name-sort');
const sortByAge = statisticsTable.querySelector('#stats-table__age-sort');
const sortByGender = statisticsTable.querySelector('#stats-table__gender-sort');
const sortByNationality = statisticsTable.querySelector(
  '#stats-table__nationality-sort'
);

function renderStatisticsTable() {
  const statisticsTableBody = statisticsTable.querySelector('tbody');
  const sortedTeachers = sortPeople(users, sortFilter);
  statisticsTableBody.innerHTML = '';
  sortedTeachers.forEach((teacher) => {
    statisticsTableBody.innerHTML += `
    <tr>
      <td>${teacher.fullName}</td>
      <td>${teacher.course}</td>
      <td>${teacher.age}</td>
      <td>${teacher.gender}</td>
      <td>${teacher.country}</td>
    </tr>
  `;
  });
}

const sortByCourse = statisticsTable.querySelector('#stats-table__course-sort');

const allSortHeaders = [
  {
    node: sortByName,
    key: 'fullName',
  },
  {
    node: sortByCourse,
    key: 'course',
  },
  {
    node: sortByAge,
    key: 'age',
  },
  {
    node: sortByGender,
    key: 'gender',
  },
  {
    node: sortByNationality,
    key: 'country',
  },
];

function resetSortHeaders() {
  allSortHeaders.forEach(({ node }) =>
    node.classList.remove('stats-table__header--active')
  );
}

allSortHeaders.forEach(({ node, key }) => {
  node.onclick = () => {
    resetSortHeaders();

    node.classList.add('stats-table__header--active');
    const directionIcon = node.querySelector('.stats-table__header-icon');

    const currentDirection =
      sortFilter.field === key ? -sortFilter.direction || 1 : 1;

    directionIcon.innerText = currentDirection === 1 ? '↑' : '↓';

    sortFilter.field = key;
    sortFilter.direction = currentDirection;

    renderStatisticsTable();
  };
});

const favoriteTeachers = document.querySelector('.favorite-teachers');

const renderFavoriteTeachers = () => {
  favoriteTeachers.innerHTML = ''
  const currentFavoriteTeachers = filterPeople(users, { favorite: true });
  currentFavoriteTeachers.forEach((teacher) => {
    const teacherContainer = document.createElement('div');
    teacherContainer.classList.add('teacher-compact-info');
    teacherContainer.classList.add('teacher-compact-info--favorite');
    teacherContainer.onclick = () => openTeacherForm(teacher);
    teacherContainer.innerHTML += getTeacherBlock(teacher);
    favoriteTeachers.appendChild(teacherContainer);
  });
};

const findInputForm = document.querySelector('#find-teacher');
findInputForm.onsubmit = (e) => {
  e.preventDefault();
  const input = findInputForm.querySelector('input');
  const searchValue = input.value;
  searchFilter = searchValue;
  renderTeachers();
};

const addTeacherFormModal = document.querySelector('#add-teacher-modal');
const addTeacherForm = document.querySelector('#add-teacher-form');
const openAddTeacherFormBtns = document.querySelectorAll('.add-teacher__btn');
openAddTeacherFormBtns.forEach((btn) => {
  btn.onclick = () => {
    addTeacherFormModal.classList.remove('modal_close');
  };
});

const closeAddTeacherFormModal = () => {
  addTeacherFormModal.classList.add('modal_close');
};

const closeIcon = document.querySelector('#close-add-teacher-modal');
closeIcon.onclick = closeAddTeacherFormModal;

const addTeacher = () => {
  const { elements } = addTeacherForm;
  const newUser = {};
  for (let i = 0; i < elements.length; i++) {
    const item = elements.item(i);
    newUser[item.name] = item.value;
  }
  const birthYear = Number(newUser.birthDate.substring(0, 4));
  const currentYear = new Date().getFullYear();
  newUser.age = currentYear - birthYear;
  newUser.id = Date.now();
  users.push(newUser);
  console.log(newUser);
  console.log(users);
  renderTeachers();
  renderStatisticsTable();
  closeAddTeacherFormModal();
};

addTeacherForm.onsubmit = (e) => {
  e.preventDefault();
  addTeacher();
};

renderTeachers();
renderStatisticsTable();
renderFavoriteTeachers();
