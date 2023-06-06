import { isUpperCase } from "./str-utils";

import _ from "lodash";

const courses = [
  "Mathematics",
  "Physics",
  "English",
  "Computer Science",
  "Dancing",
  "Chess",
  "Biology",
  "Chemistry",
  "Law",
  "Art",
  "Medicine",
  "Statistics",
];

export function idToString(id) {
  return `${id.name}${id.value}`;
}

export function getPersonName(person) {
  const { title, first, last } = person.name;
  return {
    title,
    fullName: `${first} ${last}`,
  };
}

export function getPersonLocation(person) {
  if (typeof person.location === "object") {
    return {
      city: person.location.city,
      state: person.location.state,
      country: person.location.country,
      postcode: person.location.postcode,
      coordinates: person.location.coordinates,
      timezone: person.location.timezone,
    };
  }
  return {
    city: person.city ? person.city : null,
    state: person.state ? person.state : null,
    country: person.country ? person.country : null,
    postcode: person.postcode ? person.postcode : null,
    coordinates: person.coordinates ? person.coordinates : null,
    timezone: person.timezone ? person.timezone : {},
  };
}

export function getPersonBirthDate(person) {
  return {
    birthDate: person.dob.date,
    age: person.dob.age,
  };
}

export function getRandomCourse() {
  const randomCourseIndex = Math.floor(Math.random() * courses.length);
  return courses[randomCourseIndex];
}

export function getUserId(id) {
  if (typeof id === "object") {
    return `${id.name}${id.value}`;
  }
  return id;
}

export function getUserInitials(user) {
  const separator = " ";
  const [name, surname] = user.fullName.split(separator);
  return `${name[0]}. ${surname[0]}`;
}

export const peopleComparator = (field, ascending) => (a, b) => {
  if (a[field] > b[field]) {
    return ascending;
  }
  if (a[field] < b[field]) {
    return -ascending;
  }
  return 0;
};

export function extractPersonFromResource(resource) {
  const name = getPersonName(resource);
  const { location, picture, id } = resource;
  const birthDate = getPersonBirthDate(resource);
  return {
    gender: _.capitalize(resource.gender),
    title: _.capitalize(name.title),
    fullName: name.fullName,
    city: _.capitalize(location.city),
    state: _.capitalize(location.state),
    country: _.capitalize(location.country),
    postcode: location.postcode,
    coordinates: location.coordinates,
    timezone: location.timezone,
    email: resource.email || null,
    birthDate: birthDate.birthDate,
    age: birthDate.age,
    phone: resource.phone || null,
    picture,
    id: getUserId(id),
    favorite: Math.random() < 0.2,
    backgroundColor: "#fff",
    note: "",
    course: getRandomCourse(),
  };
}

export async function getUsers(count) {
  const url = `https://randomuser.me/api?results=${count}`;
  const fetchedData = await fetch(url);
  const { results } = await fetchedData.json();
  const users = results.map((person) => extractPersonFromResource(person));
  return users;
}

export function validatePerson(person) {
  const phoneRegex = /[0-9-+]+/;
  const ageIsNumeric = person.age === null || typeof person.age === "number";
  const fullNameIsValid =
    typeof person.fullName === "string" &&
    isUpperCase(person.fullName.charAt(0));
  const genderIsValid =
    typeof person.gender === "string" && isUpperCase(person.gender.charAt(0));
  const noteIsValid =
    typeof person.note === "string" &&
    (person.note.length === 0 || isUpperCase(person.note.charAt(0)));
  const stateIsValid =
    person.state === null ||
    (typeof person.state === "string" && isUpperCase(person.state.charAt(0)));
  const countryIsValid =
    person.country === null ||
    (typeof person.country === "string" &&
      isUpperCase(person.country.charAt(0)));
  const phoneIsValid = person.phone === null || phoneRegex.test(person.phone);
  const emailIsValid =
    person.email === null ||
    (typeof person.email === "string" && person.email.includes("@"));
  const isValid =
    ageIsNumeric &&
    fullNameIsValid &&
    genderIsValid &&
    noteIsValid &&
    stateIsValid &&
    countryIsValid &&
    phoneIsValid &&
    emailIsValid;
  return isValid;
}

export function filterPeople(data, filter) {
  let results = data;
  if (filter.country) {
    results = results.filter((person) => person.country === filter.country);
  }
  if (filter.age) {
    if (typeof filter.age === "number") {
      results = results.filter((person) => person.age === filter.age);
    } else if (typeof filter.age === "object") {
      if (filter.age.min) {
        results = results.filter((person) => person.age >= filter.age.min);
      }
      if (filter.age.max) {
        results = results.filter((person) => person.age < filter.age.max);
      }
    }
  }
  if (filter.gender) {
    results = results.filter((person) => person.gender === filter.gender);
  }
  if (typeof filter.favorite === "boolean") {
    results = results.filter((person) => person.favorite === filter.favorite);
  }
  if (filter.withPhoto) {
    results = results.filter((person) => person.picture);
  }
  return results;
}

export function sortPeople(data, opts) {
  let sortingField;
  let direction = 1;
  if (typeof opts === "string") {
    sortingField = opts;
  } else if (typeof opts === "object") {
    sortingField = opts.field;
    if (!_.isNil(opts.direction)) {
      direction = opts.direction;
    }
  }
  return data.sort(peopleComparator(sortingField, direction));
}

export function search(data, query) {
  if (query) {
    const results = [];
    const searchedByName = data.filter((person) => {
      const upperCaseFullname = person.fullName.toUpperCase();
      return upperCaseFullname.startsWith(query.toUpperCase());
    });
    const searchedByAge = data.filter(
      (person) => String(person.age) === String(query)
    );
    const searchedByNote = results.filter(
      (person) => person.note && person.note.includes(query)
    );
    results.push(...searchedByAge, ...searchedByNote, ...searchedByName);
    console.log({ searched: results });
    return results;
  }
  return data;
}

export function getPercentage(data, allData) {
  return (data / allData) * 100;
}

export const generateRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export const getColorsArray = (arrayLen) =>
  new Array(arrayLen).fill("").map(() => generateRandomColor());
