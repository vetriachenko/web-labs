import {
  isUpperCase,
  capitalize
} from './str-utils';

const { additionalUsers, randomUserMock } = require('./FE4U-Lab3-mock');
const courses = ['Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing', 'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics'];

export function idToString(id) {
  if (typeof id === 'object') {
    return `${id.name}${id.value}`;
  }
  return id;
}

export function getPersonName(person) {
  if (typeof person.name === 'object') {
    return {
      title: person.name.title,
      fullName: `${person.name.first} ${person.name.last}`,
    };
  }
  return {
    title: person.title,
    fullName: person.full_name,
  };
}

export function getPersonLocation(person) {
  if (typeof person.location === 'object') {
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
  if (typeof person.dob === 'object') {
    return {
      birthDate: person.dob.date,
      age: person.dob.age,
    };
  }
  if (typeof person.b_day === 'string') {
    const birthYear = Number(person.b_day.substring(0, 4));
    const currentYear = new Date().getFullYear();
    return {
      birthDate: person.b_day,
      age: currentYear - birthYear,
    };
  }
  return {
    birthDate: null,
    age: null,
  };
}

export function getRandomCourse() {
  const randomCourseIndex = Math.floor(Math.random() * courses.length);
  return courses[randomCourseIndex];
}

export function getUserId(id) {
  if (typeof id === 'object') {
    return `${id.name}${id.value}`;
  }
  return id;
}

export function getUserInitials(user) {
  const separator = ' ';
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

export function fetchUsers() {
  const data = [...randomUserMock];
  const ids = new Set();
  data.forEach((user) => {
    const id = getUserId(user.id);
    ids.add(id);
  });
  additionalUsers.forEach((user) => {
    const id = getUserId(user.id);
    if (!ids.has(id)) {
      data.push(user);
      ids.add(id);
    }
  });
  return data;
}

export function extractPersonFromResource(resource) {
  const name = getPersonName(resource);
  const location = getPersonLocation(resource);
  const birthDate = getPersonBirthDate(resource);
  return {
    gender: capitalize(resource.gender),
    title: capitalize(name.title),
    fullName: name.fullName,
    city: capitalize(location.city),
    state: capitalize(location.state),
    country: capitalize(location.country),
    postcode: location.postcode,
    coordinates: location.coordinates,
    timezone: location.timezone,
    email: resource.email || null,
    birthDate: birthDate.date,
    age: birthDate.age,
    phone: resource.phone || null,
    pictureLarge: resource.picture_large || null,
    pictureThumbnail: resource.picture_thumbnail || null,
    id: getUserId(resource.id),
    favorite: resource.favorite === true,
    backgroundColor: resource.bg_color || '#fff',
    note: capitalize(resource.note || ''),
    course: resource.course ? capitalize(resource.course) : getRandomCourse(),
  };
}

export function getUsers() {
  const fetchedData = fetchUsers();
  return fetchedData.map((person) => extractPersonFromResource(person));
}

export function validatePerson(person) {
  const phoneRegex = /[0-9-+]+/;
  const ageIsNumeric = person.age === null || typeof person.age === 'number';
  const fullNameIsValid =
    typeof person.fullName === 'string' &&
    isUpperCase(person.fullName.charAt(0));
  const genderIsValid =
    typeof person.gender === 'string' && isUpperCase(person.gender.charAt(0));
  const noteIsValid =
    typeof person.note === 'string' &&
    (person.note.length === 0 || isUpperCase(person.note.charAt(0)));
  const stateIsValid =
    person.state === null ||
    (typeof person.state === 'string' && isUpperCase(person.state.charAt(0)));
  const countryIsValid =
    person.country === null ||
    (typeof person.country === 'string' &&
      isUpperCase(person.country.charAt(0)));
  const phoneIsValid = person.phone === null || phoneRegex.test(person.phone);
  const emailIsValid =
    person.email === null ||
    (typeof person.email === 'string' && person.email.includes('@'));
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
    if (typeof filter.age === 'number') {
      results = results.filter((person) => person.age === filter.age);
    } else if (typeof filter.age === 'object') {
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
  if (typeof filter.favorite === 'boolean') {
    results = results.filter((person) => person.favorite === filter.favorite);
  }
  if (filter.withPhoto) {
    results = results.filter(
      (person) => person.pictureLarge || person.pictureThumbnail
    );
  }
  return results;
}

export function sortPeople(data, opts) {
  let sortingField;
  let direction = 1;
  if (typeof opts === 'string') {
    sortingField = opts;
  } else if (typeof opts === 'object') {
    sortingField = opts.field;
    if (opts.direction !== null && opts.direction !== undefined) {
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
