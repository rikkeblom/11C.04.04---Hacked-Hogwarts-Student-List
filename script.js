"use strict";
//I am currently working on sorting. Right now I have a working eventlistener that reads the searchterm and knows if the search box is empty

window.addEventListener("DOMContentLoaded", start);

const studentList = [];
const settings = {
  filter: "all",
  filterCat: "",
  sort: "name",
  sortDir: "asc",
};
let Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  image: "",
  house: "",
  bloodstatus: "muggleborn",
  prefect: false,
  inquisitorial: false,
  expelled: false,
};

function start() {
  console.log("start()");
  loadJSON();

  document.querySelector("#selectHouse").addEventListener("change", selectFilter);
  document.querySelector("#selectResponsibility").addEventListener("change", selectFilter);
  document.querySelector("#selectBloodstatus").addEventListener("change", selectFilter);
  document.querySelector("#sorting .firstName").addEventListener("click", selectSort);
  document.querySelector("#sorting .lastName").addEventListener("click", selectSort);
  document.querySelector("#sorting .house").addEventListener("click", selectSort);
  document.querySelector("#sorting .responsibility").addEventListener("click", selectSort);
  document.querySelector("#search").addEventListener("change", search);
  document.querySelector("#search").addEventListener("input", search);
}

function loadJSON() {
  //this function fetches the content of the json data
  //and sends the data to the function prepareStudents
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareStudents(jsonData);
    });
}

function prepareStudents(jsonData) {
  //this functions loops through each object in the json document
  //it makes a copy of the Student object
  //and fills it by calling other functions that translates and cleans the data into the categories we need
  jsonData.forEach((jsonObject) => {
    // console.log("prepareStudents: ");
    // console.log(jsonObject);
    const student = Object.create(Student);
    student.firstName = getFirstName(jsonObject.fullname.trim());
    student.lastName = getLastName(jsonObject.fullname.trim());
    student.middleName = getMiddleName(jsonObject.fullname.trim());
    student.nickName = getNickName(jsonObject.fullname.trim());
    student.image = getImage(student.lastName, student.firstName);
    student.house = getHouseName(jsonObject.house.trim());
    studentList.push(student);
  });
  // console.table(studentList);
  displayList(studentList);
}

//------------------Controller: filter and sort the list + search

function filterList(student) {
  if (settings.filterCat === "selectHouse") {
    if (settings.filter === "all") {
      return true;
    } else {
      if (student.house === settings.filter) {
        return true;
      } else {
        return false;
      }
    }
  } else if (settings.filterCat === "selectResponsibility") {
    if (settings.filter === "all") {
      return true;
    } else {
      if (settings.filter === "prefect") {
        console.log("prefects");
        if (student.prefect === true) {
          return true;
        } else {
          return false;
        }
      } else if (settings.filter === "inquisitorial") {
        if (student.inquisitorial === true) {
          return true;
        } else {
          return false;
        }
      }
    }
  } else if (settings.filterCat === "selectBloodstatus") {
    if (settings.filter === "all") {
      return true;
    } else {
      if (settings.filter === student.bloodstatus) {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return true;
  }
}

function sortList(list) {
  return list.sort(sortByParam);

  function sortByParam(a, b) {
    if (a[settings.sort] < b[settings.sort]) {
      return -1;
    }
    return 1;
  }
}

function selectFilter(event) {
  //finding the category name of the filter used
  // console.log(event.target.id);

  const filter = document.querySelector(`#${event.target.id}`).value;
  const filterCat = event.target.id;

  //making sure only one filter can be used (at least for now)
  if (event.target.id === "selectHouse") {
    document.querySelector("#selectResponsibility").value = "all";
    document.querySelector("#selectBloodstatus").value = "all";
  } else if (event.target.id === "selectResponsibility") {
    document.querySelector("#selectHouse").value = "all";
    document.querySelector("#selectBloodstatus").value = "all";
  } else if (event.target.id === "selectBloodstatus") {
    document.querySelector("#selectHouse").value = "all";
    document.querySelector("#selectResponsibility").value = "all";
  }

  setFilter(filter, filterCat);
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  setSort(sortBy, sortDir);
}

function setFilter(filter, filterCat) {
  settings.filter = filter;
  settings.filterCat = filterCat;
  buildList();
}

function setSort(sortby, sortDir) {
  settings.sort = sortby;
  settings.sortDir = sortDir;
  buildList();
}

function buildList() {
  const filteredList = studentList.filter(filterList);
  const sortedList = sortList(filteredList);
  displayList(sortedList);
}

function search() {
  const searchTerm = document.querySelector("#search").value;
  if (searchTerm !== "") {
    console.log("searching");
  } else {
    console.log("stop searching");
  }
}

//------------------Count Students

function countGryffindors(student) {
  if (student.house === "Gryffindor") {
    return true;
  } else {
    return false;
  }
}
function countHufflepuffs(student) {
  if (student.house === "Hufflepuff") {
    return true;
  } else {
    return false;
  }
}
function countRavenclaws(student) {
  if (student.house === "Ravenclaw") {
    return true;
  } else {
    return false;
  }
}
function countSlytherins(student) {
  if (student.house === "Slytherin") {
    return true;
  } else {
    return false;
  }
}

//------------------View: displaying the students
function setInfoLine() {
  const totalStudents = studentList.length;
  //edit when I start expelling students so it updates
  const expelledStudents = 0;
  const enrolledStudents = totalStudents - expelledStudents;

  document.querySelector(".enrolledCount").textContent = enrolledStudents;
  document.querySelector(".expelledCount").textContent = expelledStudents;
  document.querySelector(".gryfCount").textContent = studentList.filter(countGryffindors).length;
  document.querySelector(".huffCount").textContent = studentList.filter(countHufflepuffs).length;
  document.querySelector(".raveCount").textContent = studentList.filter(countRavenclaws).length;
  document.querySelector(".slytCount").textContent = studentList.filter(countSlytherins).length;
}

function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";
  // console.log(students);
  students.forEach(displayStudent);

  //displaying the current student counts
  setInfoLine();
  //displaying the list length
  document.querySelector(".container-infoLine span").textContent = students.length;
}

function displayStudent(student) {
  // console.log(student);
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);
  // set clone data
  clone.querySelector('[data-field="firstName"]').textContent = student.firstName;
  clone.querySelector('[data-field="lastName"]').textContent = student.lastName;
  clone.querySelector('[data-field="house"]').textContent = student.house;
  // append clone to list
  document.querySelector("tbody").appendChild(clone);
}

//------------------Model: cleaning the data

function getFirstName(fullname) {
  if (fullname.includes(" ") == true) {
    const firstName = fullname.substring(0, fullname.indexOf(" "));
    const cleanFirstName = cleanName(firstName);
    return cleanFirstName;
  } else {
    const cleanFirstName = cleanName(fullname);
    return cleanFirstName;
  }
}

function getLastName(fullname) {
  if (fullname.includes(" ") == true) {
    const lastName = fullname.slice(fullname.lastIndexOf(" ") + 1);
    const cleanLastName = cleanName(lastName);
    return cleanLastName;
  }
  return undefined;
}

function getMiddleName(fullname) {
  if (fullname.includes(" ") == true) {
    const middleSpace = fullname.slice(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
    const firstCharacter = middleSpace.slice(0, 1);
    if (firstCharacter !== '"') {
      return cleanName(middleSpace);
    }
  }
}

function getNickName(fullname) {
  const middleSpace = fullname.slice(fullname.indexOf(" ") + 1, fullname.lastIndexOf(" "));
  const firstCharacter = middleSpace.slice(0, 1);
  if (firstCharacter === '"') {
    const length = middleSpace.length;
    const nickNameWithoutQuotes = middleSpace.slice(1, length - 1);
    // console.log(nickNameWithoutQuotes);
    const cleanNickName = cleanName(nickNameWithoutQuotes);
    return cleanNickName;
  }
}

function getHouseName(house) {
  const cleanHouse = cleanName(house);
  return cleanHouse;
}

function getImage(lastname, firstname) {
  //files are named lastname_firstletteroffirstname.png
  //except for the patil twins and Justin Finch-Fletchley
  if (lastname !== undefined) {
    const smallLastName = lastname.toLowerCase();
    const smallFirstName = firstname.toLowerCase();
    const firstLetterOfFirstName = firstname.slice(0, 1).toLowerCase();
    if (lastname == "Patil") {
      const imageSrc = `${smallLastName}_${smallFirstName}.png`;
      return imageSrc;
    } else if (lastname.includes("-") == true) {
      const partOfLastNameAfterHyphen = lastname.slice(lastname.indexOf("-") + 1);
      const imageSrc = `${partOfLastNameAfterHyphen}_${firstLetterOfFirstName}.png`;
      return imageSrc;
    } else {
      const imageSrc = `${smallLastName}_${firstLetterOfFirstName}.png`;
      return imageSrc;
    }
  }
}

function cleanName(name) {
  const firstLetter = name.slice(0, 1).toUpperCase();
  const restOfName = name.slice(1).toLowerCase();
  const cleanName = firstLetter + restOfName;
  return cleanName;
}