import Chart from "chart.js/auto";
import dayjs from "dayjs";
import _ from "lodash";
import L from "leaflet";

import {
  getUserInitials,
  search,
  filterPeople,
  getUsers,
  getColorsArray,
} from "./people-utils";

const testModules = require("./test-module");

require("../css/app.css");
require("../scss/style.scss");

async function setup() {
  console.log(testModules.hello);

  const users = await getUsers(50);
  const limit = 10;
  let map = null;
  let currentPage = 1;

  const filter = {};
  const sortFilter = {};
  let searchFilter = "";

  const teacherCardModal = document.querySelector("#teacher-modal");
  const closeTeacherForm = document.querySelector("#close-teacher-modal");
  closeTeacherForm.onclick = () =>
    teacherCardModal.classList.add("modal_close");

  function openTeacherForm(user) {
    const userPhoto = user.picture && user.picture.medium;

    const teacherForm = document.querySelector("#teacher-modal");
    teacherForm.classList.remove("modal_close");
    const teacherName = teacherForm.querySelector(".teacher-card__name");
    const teacherAvatar = teacherForm.querySelector(".teacher-card__avatar");
    const teacherSpeciality = teacherForm.querySelector(
      ".teacher-card__speciality"
    );
    const teacherLocation = teacherForm.querySelector(
      ".teacher-card__location"
    );
    const teacherPersonInfo = teacherForm.querySelector(
      ".teacher-card__person-info"
    );
    const teacherPersonEmail = teacherForm.querySelector(
      ".teacher-card__email"
    );
    const teacherPersonPhone = teacherForm.querySelector(
      ".teacher-card__phone"
    );
    const teacherPersonDescribe = teacherForm.querySelector(
      ".teacher-card__describe"
    );

    const teacherPersonFavorite = teacherForm.querySelector(
      ".teacher-card__favorite"
    );

    const teacherDaysToBirthday = teacherForm.querySelector(
      ".teacher-card__days-to-birthday"
    );

    const currentDate = dayjs();
    const birtdayInThisYear = dayjs(user.birthDate).year(currentDate.year());
    const nextBirthday =
      birtdayInThisYear > currentDate
        ? birtdayInThisYear
        : birtdayInThisYear.add(1, "year");
    const daysToBirthday = nextBirthday.diff(currentDate, "day");

    teacherAvatar.src = userPhoto;
    teacherName.innerText = user.fullName;
    teacherSpeciality.innerText = user.course;
    teacherLocation.innerText = `${user.city || ""}, ${user.country || ""}`;
    teacherPersonInfo.innerText = `${user.age || ""}, ${user.gender || ""}`;
    teacherPersonEmail.innerText = user.email;
    teacherPersonPhone.innerText = user.phone;
    teacherPersonDescribe.innerText = user.note;
    teacherPersonFavorite.innerText = user.favorite ? "⭐️" : "☆";
    teacherDaysToBirthday.innerText = `Days to bithday: ${daysToBirthday}`;

    teacherPersonFavorite.onclick = () => {
      user.favorite = !user.favorite;
      teacherPersonFavorite.innerText = user.favorite ? "⭐️" : "☆";
      renderTeachers();
      renderFavoriteTeachers();
    };

    const { latitude, longitude } = user.coordinates;

    if (map) {
      map.off();
      map.remove();
    }
    map = L.map("teacher-card__map").setView([latitude, longitude], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map);
  }

  const getTeacherBlock = (teacher) => {
    const teacherPhoto = teacher.picture && teacher.picture.large;
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

  const teachersList = document.querySelector(".teachers-list");

  function renderTeachers() {
    const searchedUsers = search(users, searchFilter);
    const filteredUsers = filterPeople(searchedUsers, filter);
    teachersList.innerHTML = "";

    filteredUsers.forEach((user) => {
      const teacher = document.createElement("div");
      teacher.classList.add("teacher-compact-info");
      if (user.favorite)
        teacher.classList.add("teacher-compact-info--favorite");
      teacher.onclick = () => openTeacherForm(user);
      teacher.innerHTML += getTeacherBlock(user);
      teachersList.appendChild(teacher);
    });
  }

  const filtersRow = document.querySelector(".teachers__filters-row");
  const filterByAge = filtersRow.querySelector("#filter-age");
  const agesFilters = ["any", "10-20", "20-30", "30+"];

  agesFilters.forEach((ageFilter) => {
    const newAgeFilter = document.createElement("option");
    newAgeFilter.value = ageFilter;
    newAgeFilter.innerText = ageFilter;
    filterByAge.appendChild(newAgeFilter);
  });

  filterByAge.onchange = (e) => {
    const { value } = e.target;
    const age = {
      any: null,
      "10-20": { min: 10, max: 20 },
      "20-30": { min: 20, max: 30 },
      "30+": { min: 30 },
    };
    filter.age = age[value];
    renderTeachers();
  };

  renderTeachers();

  const filterByCountry = filtersRow.querySelector("#filter-region");
  const countries = users.map(({ country }) => country);
  const uniqCountries = _.uniq(countries);

  const countryFilters = ["any", ...uniqCountries];

  countryFilters.forEach((country) => {
    const newCountryFilter = document.createElement("option");
    newCountryFilter.value = country;
    newCountryFilter.innerText = country;
    filterByCountry.appendChild(newCountryFilter);
  });

  filterByCountry.onchange = (e) => {
    const { value } = e.target;
    filter.country = value === "any" ? null : value;
    renderTeachers();
  };

  const filterByGender = filtersRow.querySelector("#filter-sex");
  const genders = users.map(({ gender }) => gender);
  const uniqGenders = _.uniq(genders);

  const genderFilters = ["any", ...uniqGenders];

  genderFilters.forEach((gender) => {
    const newGenderFilter = document.createElement("option");
    newGenderFilter.value = gender;
    newGenderFilter.innerText = gender;
    filterByGender.appendChild(newGenderFilter);
  });

  filterByGender.onchange = (e) => {
    const { value } = e.target;
    filter.gender = value === "any" ? null : value;
    renderTeachers();
  };

  const withPhotoFilter = filtersRow.querySelector("#filter-withPhoto");
  withPhotoFilter.onchange = () => {
    filter.withPhoto = !filter.withPhoto;
    renderTeachers();
  };

  const favoriteFilter = filtersRow.querySelector("#filter-isFavorite");
  favoriteFilter.onchange = () => {
    filter.favorite = !filter.favorite;
    renderTeachers();
  };

  const favoriteTeachers = document.querySelector(".favorite-teachers");

  const renderFavoriteTeachers = () => {
    favoriteTeachers.innerHTML = "";
    const currentFavoriteTeachers = filterPeople(users, { favorite: true });
    currentFavoriteTeachers.forEach((teacher) => {
      const teacherContainer = document.createElement("div");
      teacherContainer.classList.add("teacher-compact-info");
      teacherContainer.classList.add("teacher-compact-info--favorite");
      teacherContainer.onclick = () => openTeacherForm(teacher);
      teacherContainer.innerHTML += getTeacherBlock(teacher);
      favoriteTeachers.appendChild(teacherContainer);
    });
  };

  const findInputForm = document.querySelector("#find-teacher");
  findInputForm.onsubmit = (e) => {
    e.preventDefault();
    const input = findInputForm.querySelector("input");
    const searchValue = input.value;
    searchFilter = searchValue;
    renderTeachers();
  };

  const addTeacherFormModal = document.querySelector("#add-teacher-modal");
  const addTeacherForm = document.querySelector("#add-teacher-form");
  const openAddTeacherFormBtns = document.querySelectorAll(".add-teacher__btn");
  openAddTeacherFormBtns.forEach((btn) => {
    btn.onclick = () => {
      addTeacherFormModal.classList.remove("modal_close");
    };
  });

  const closeAddTeacherFormModal = () => {
    addTeacherFormModal.classList.add("modal_close");
  };

  const closeIcon = document.querySelector("#close-add-teacher-modal");
  closeIcon.onclick = closeAddTeacherFormModal;

  const sendTeacherToServer = (teacher) => {
    fetch("http://localhost:3000/teacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teacher),
    });
  };

  const addTeacher = () => {
    const { elements } = addTeacherForm;
    const newUser = {};
    for (let i = 0; i < elements.length; i++) {
      const item = elements.item(i);
      newUser[item.name] = item.value;
    }
    delete newUser[""];
    const birthYear = Number(newUser.birthDate.substring(0, 4));
    const currentYear = new Date().getFullYear();
    newUser.age = currentYear - birthYear;
    newUser.id = Date.now();
    newUser.coordinates = { latitude: 50.402, longitude: 30.387 };
    users.push(newUser);
    renderTeachers();
    
    closeAddTeacherFormModal();
    sendTeacherToServer(newUser);
  };

  

  addTeacherForm.onsubmit = (e) => {
    e.preventDefault();
    addTeacher();
  };

  const addMoreTeachersBtn = document.querySelector("#add-more-teachers");
  addMoreTeachersBtn.onclick = async () => {
    const addedUsers = await getUsers(10);
    users.push(...addedUsers);
    renderTeachers();
    
    renderFavoriteTeachers();
  };

  let currentChart = null;

  function renderChart(labels, data) {
    const chart = document.getElementById("chart");

    const canvasData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: getColorsArray(labels.length),
        },
      ],
    };

    if (currentChart) currentChart.destroy();
    currentChart = new Chart(chart, {
      type: "pie",
      data: canvasData,
    });

    
  }

  const ageChartBtn = document.querySelector("#chart-age");
  const courseChartBtn = document.querySelector("#chart-course");
  const genderChartBtn = document.querySelector("#chart-gender");
  const nationalityChartBtn = document.querySelector("#chart-nationality");

  const chartOptions = [
    {
      node: ageChartBtn,
      key: "age",
    },
    {
      node: courseChartBtn,
      key: "course",
    },
    {
      node: genderChartBtn,
      key: "gender",
    },
    {
      node: nationalityChartBtn,
      key: "country",
    },
  ];

  const resetChartButtonActive = () => {
    chartOptions.forEach(({ node }) => node.classList.remove("btn--active"));
  };

  chartOptions.forEach(({ node, key }) => {
    const labels = users.map((user) => user[key]);
    const uniqLabels = _.uniq(labels);
    const data = uniqLabels.map(
      (label) => users.filter((user) => user[key] === label).length
    );

    node.onclick = () => {
      resetChartButtonActive();
      node.classList.add("btn--active");
      renderChart(uniqLabels, data);
    };
  });

  courseChartBtn.click();

  renderTeachers();
  renderFavoriteTeachers();
}
setup();
