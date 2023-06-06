import {
  getUserInitials,
  search,
  filterPeople,
  getUsers,
  sortPeople,
} from "./people-utils";

const testModules = require("./test-module");

require("../css/app.css");
require("../scss/style.scss");

async function setup() {
  console.log(testModules.hello);

  const users = await getUsers(50);
  const limit = 10;
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

    teacherAvatar.src = userPhoto;
    teacherName.innerText = user.fullName;
    teacherSpeciality.innerText = user.course;
    teacherLocation.innerText = `${user.city || ""}, ${user.country || ""}`;
    teacherPersonInfo.innerText = `${user.age || ""}, ${user.gender || ""}`;
    teacherPersonEmail.innerText = user.email;
    teacherPersonPhone.innerText = user.phone;
    teacherPersonDescribe.innerText = user.note;
    teacherPersonFavorite.innerText = user.favorite ? "⭐️" : "☆";

    teacherPersonFavorite.onclick = () => {
      user.favorite = !user.favorite;
      teacherPersonFavorite.innerText = user.favorite ? "⭐️" : "☆";
      renderTeachers();
      renderFavoriteTeachers();
    };
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
  const uniqCountries = Array.from(new Set(countries));

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
  const uniqGenders = Array.from(new Set(genders));

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

  const statisticsTable = document.querySelector(".stats-table");
  const sortByName = statisticsTable.querySelector("#stats-table__name-sort");
  const sortByAge = statisticsTable.querySelector("#stats-table__age-sort");
  const sortByGender = statisticsTable.querySelector(
    "#stats-table__gender-sort"
  );
  const sortByNationality = statisticsTable.querySelector(
    "#stats-table__nationality-sort"
  );

  function renderStatisticsTable() {
    const offset = (currentPage - 1) * limit;
    const statisticsTableBody = statisticsTable.querySelector("tbody");
    const sortedTeachers = sortPeople(users, sortFilter);
    const slicedTeachers = sortedTeachers.slice(offset, offset + limit);
    statisticsTableBody.innerHTML = "";
    slicedTeachers.forEach((teacher) => {
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

  const sortByCourse = statisticsTable.querySelector(
    "#stats-table__course-sort"
  );

  const allSortHeaders = [
    {
      node: sortByName,
      key: "fullName",
    },
    {
      node: sortByCourse,
      key: "course",
    },
    {
      node: sortByAge,
      key: "age",
    },
    {
      node: sortByGender,
      key: "gender",
    },
    {
      node: sortByNationality,
      key: "country",
    },
  ];

  function resetSortHeaders() {
    allSortHeaders.forEach(({ node }) =>
      node.classList.remove("stats-table__header--active")
    );
  }

  allSortHeaders.forEach(({ node, key }) => {
    node.onclick = () => {
      resetSortHeaders();

      node.classList.add("stats-table__header--active");
      const directionIcon = node.querySelector(".stats-table__header-icon");

      const currentDirection =
        sortFilter.field === key ? -sortFilter.direction || 1 : 1;

      directionIcon.innerText = currentDirection === 1 ? "↑" : "↓";

      sortFilter.field = key;
      sortFilter.direction = currentDirection;

      renderStatisticsTable();
    };
  });

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
    users.push(newUser);
    renderTeachers();
    renderStatisticsTable();
    closeAddTeacherFormModal();
    sendTeacherToServer(newUser);
  };

  function renderPagination() {
    const lastPage = Math.ceil(users.length / limit);
    const setStatisisticsPage = document.querySelector(".paging__pages");
    const pagingLast = document.querySelector(".paging__last");
    setStatisisticsPage.innerHTML = "";
    pagingLast.style.visibility = "visible";
    const pages = ["prev", "current", "next"];
    pages.forEach((page, i) => {
      if (page === "prev" && currentPage === 1) return;
      if (page === "next" && currentPage === lastPage) return;
      const pageBtn = document.createElement("span");
      pageBtn.classList.add("paging__button");
      pageBtn.innerText = currentPage + i - 1;
      pageBtn.onclick = () => {
        currentPage = currentPage + i - 1;
        renderStatisticsTable();
        renderPagination();
      };
      setStatisisticsPage.appendChild(pageBtn);
    });
    if (currentPage === lastPage) pagingLast.style.visibility = "hidden";
  }

  addTeacherForm.onsubmit = (e) => {
    e.preventDefault();
    addTeacher();
  };

  const addMoreTeachersBtn = document.querySelector("#add-more-teachers");
  addMoreTeachersBtn.onclick = async () => {
    const addedUsers = await getUsers(10);
    users.push(...addedUsers);
    renderTeachers();
    renderStatisticsTable();
    renderFavoriteTeachers();
  };

  renderPagination();
  renderTeachers();
  renderStatisticsTable();
  renderFavoriteTeachers();
}
setup();
