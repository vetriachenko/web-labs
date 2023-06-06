import { codes } from "./dial-codes.js";
import { randomUserMock, additionalUsers } from "./FE4U-Lab3-mock.js";

let Users = format(randomUserMock);

//console.log(format(randomUserMock));
//validation(Users[15]);
//console.log(search("course", "Mathematics"));
//console.log(filtration("course", "Mathematics"));
//console.log(sorting("state"));
console.log(percentage("course", "Mathematics"));

function format(users) {
    let newUsers = [];

    for (const user of users) {
        let newUser = {};
        newUser["gender"] = user.gender;
        newUser["title"] = user.name.title;
        newUser["full_name"] = `${user.name.first} ${user.name.last}`;
        newUser["city"] = user.location.city;
        newUser["state"] = user.location.state;
        newUser["country"] = user.location.country;
        newUser["postcode"] = user.location.postcode;
        newUser["coordinates"] = { "latitude": user.location.coordinates.latitude, "longitude": user.location.coordinates.longitude };
        newUser["timezone"] = { "offset": user.location.timezone.offset, "discription": user.location.timezone.discription };
        newUser["email"] = user.email;
        newUser["b_date"] = user.dob.date;
        newUser["age"] = user.dob.age;
        newUser["phone"] = user.phone;
        newUser["picture_large"] = user.picture.large;
        newUser["picture_thumbnail"] = user.picture.thumbnail;
        newUser["id"] = "";
        newUser["favourite"] = "";
        newUser["course"] = randomCourse();
        newUser["note"] = "";
        newUsers.push(newUser);
    }
    return newUsers;
}

function validation(user) {
    let valid = true;
    if (!(typeof user.full_name == 'string' && user.full_name[0] == user.full_name[0].toUpperCase()) ||
        !(typeof user.gender == 'string' && user.gender[0] == user.gender[0].toUpperCase()) ||
        !typeof user.note == 'string' ||
        !(typeof user.state == 'string' && user.state[0] == user.state[0].toUpperCase()) ||
        !(typeof user.city == 'string' && user.city[0] == user.city[0].toUpperCase()) ||
        !(typeof user.country == 'string' && user.country[0] == user.country[0].toUpperCase())) {
        console.log("Поля full_name, gender, note, state, city, country мають бути строками, та починатись з великої літери!");
        valid = false;
    }

    if (typeof user.age != 'number') {
        console.log("Поле age має бути чисельним!");
        valid = false;
    }

    // if (!user.phone.startsWith(codes[user.country])) {
    //     console.log("Поле phone має відповідати заданому формату!");
    //     valid = false;
    // }

    if (!user.email.includes("@")) {
        console.log("Поле email має відповідати формату запису email, тобто мати @!");
        valid = false;
    }

    if (user.email.startsWith("@") || user.email.endsWith("@")) {
        console.log("Поле email має відповідати формату запису email!");
        valid = false;
    }

    if (valid)
        console.log("Ура, об'єдок is valid!");
}

function filtration(property, toFilter) {
    return Users.filter(user => {
        if (user[property])
            return user[property] == toFilter;
    });
}

function search(property, toFind) {
    return Users.find(user => {
        if (user[property])
            return user[property] == toFind;
    });
}

function sorting(property) {
    return Users.sort((a, b) => {
        if (a[property] > b[property])
            return 1;
        if (a[property] < b[property])
            return -1;
        return 0;
    });
}

function percentage(property, toFilter) {
    let objectLength =  Users.filter(user => {
        if (user[property])
            return user[property] == toFilter;
    }).length;
    return `${(objectLength / Users.length) * 100}%`; 
}

function randomCourse() {
    let courses = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry",
        "Law", "Art", "Medicine", "Statistics"];
    return courses[Math.floor(Math.random() * courses.length)];
}