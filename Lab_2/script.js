let addTeacherBtn = document.getElementsByClassName("add-teacher-btn");
let teacherCard = document.getElementsByClassName("teacher-picture");

let addTeacherPopUp = document.getElementsByClassName("add-teacher")[0];
let teacherInfoPopUp = document.getElementsByClassName("teacher-info")[0];

let closeAddBtn = document.getElementsByClassName("close-add");
let closeInfoBtn = document.getElementsByClassName("close-info");

for (let i = 0; i < addTeacherBtn.length; i++) {
    addTeacherBtn[i].addEventListener("click", () => {
        addTeacherPopUp.style.display = "block";
    });
}

closeAddBtn[0].addEventListener("click", () => {
    addTeacherPopUp.style.displa="none";
});

for (let i = 0; i < teacherCard.length; i++) {
    teacherCard[i].addEventListener("click", (e) => {
        teacherInfoPopUp.style.display = "block";
    });    
}

closeInfoBtn[0].addEventListener("click", () => {
    teacherInfoPopUp.style.displa="none";
});