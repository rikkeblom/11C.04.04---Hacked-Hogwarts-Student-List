"use strict";
//I am currently working on sorting. Right now I have a working eventlistener that reads the searchterm and knows if the search box is empty
//I might need to look into the sizing of everything as it is huge when uploaded to github pages

window.addEventListener("DOMContentLoaded", start);

const studentList = [];
const expelledStudentList = [];
const settings = {
  filter: "all",
  filterCat: "",
  sort: "firstName",
  sortDir: "asc",
};
let bloodList = {
  pure: "",
  half: "",
};

let Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  nickName: "",
  image: "",
  house: "",
  bloodstatus: "",
  prefect: false,
  inquisitorial: false,
  quidditch: false,
  expelled: false,
};

function start() {
  console.log("start()");
  loadJSON();

  document.querySelector("#selectHouse").addEventListener("change", selectFilter);
  document.querySelector("#selectResponsibility").addEventListener("change", selectFilter);
  document.querySelector("#selectBloodstatus").addEventListener("change", selectFilter);
  document.querySelector("#selectEnrolment").addEventListener("change", selectFilter);
  document.querySelector("#sorting .firstName").addEventListener("click", selectSort);
  document.querySelector("#sorting .lastName").addEventListener("click", selectSort);
  document.querySelector("#sorting .house").addEventListener("click", selectSort);
  document.querySelector("#sorting .responsibility").addEventListener("click", selectSort);
  document.querySelector("#search").addEventListener("change", buildList);
  document.querySelector("#search").addEventListener("input", buildList);
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

async function prepareStudents(jsonData) {
  //this functions starts by loading the json object with the family names and bloodstatus
  //we use async await to make sure we finish this assignment before moving on to preparing each student
  await getBloodStatusList();
  //then we loop through each object in the json document
  //it makes a copy of the Student object
  //and fills it by calling other functions that translates and cleans the data into the categories we need

  await jsonData.forEach((jsonObject) => {
    const student = Object.create(Student);
    student.firstName = getFirstName(jsonObject.fullname.trim());
    student.lastName = getLastName(jsonObject.fullname.trim());
    student.middleName = getMiddleName(jsonObject.fullname.trim());
    student.nickName = getNickName(jsonObject.fullname.trim());
    student.image = getImage(student.lastName, student.firstName);
    student.house = getHouseName(jsonObject.house.trim());
    student.bloodstatus = decideBlood(getLastName(jsonObject.fullname.trim()));

    studentList.push(student);
  });
  console.log(studentList);
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
  let firstNumber;
  let secondNumber;
  if (settings.sort === "responsibility") {
    //I've made this one difficult for myself by using icons
    //I need a way to translate the icons into their
    //this will only have a value if the student has the prefect logo
    // document.querySelector("td:last-of-type div:nth-of-type(1)").classList[2])
    // let result = list.sort(function sortByRespons(a, b) {
    //   a = a.querySelector("td:last-of-type div:nth-of-type(1)").classList[2].getAttribute(value);
    //   b = b.getAttribute(value);
    //   //first we check what direction we should sort in
    //   if (settings.sortDir === "asc") {
    //     firstNumber = 1;
    //     secondNumber = -1;
    //   } else {
    //     firstNumber = -1;
    //     secondNumber = 1;
    //   }
    //   //then we sort the student.the sort param
    //   if (a.inquisitorial < b.inquisitorial) {
    //     return firstNumber;
    //   } else {
    //     return secondNumber;
    //   }
    // });
    return list;
  } else {
    return list.sort(sortByParam);

    function sortByParam(a, b) {
      if (settings.sortDir === "asc") {
        firstNumber = 1;
        secondNumber = -1;
      } else {
        firstNumber = -1;
        secondNumber = 1;
      }

      if (a[settings.sort] < b[settings.sort]) {
        return firstNumber;
      } else {
        return secondNumber;
      }
    }
  }
}

function selectFilter(event) {
  //finding the category name of the filter used
  console.log(event.target.id);

  const filter = document.querySelector(`#${event.target.id}`).value;
  const filterCat = event.target.id;
  console.log(`filter: ${filter}, category: ${filterCat}`);

  //making sure only one filter can be used (at least for now)
  if (event.target.id === "selectHouse") {
    document.querySelector("#selectResponsibility").value = "all";
    document.querySelector("#selectBloodstatus").value = "all";
    document.querySelector("#selectEnrolment").value = "all";
  } else if (event.target.id === "selectResponsibility") {
    document.querySelector("#selectHouse").value = "all";
    document.querySelector("#selectBloodstatus").value = "all";
    document.querySelector("#selectEnrolment").value = "all";
  } else if (event.target.id === "selectBloodstatus") {
    document.querySelector("#selectHouse").value = "all";
    document.querySelector("#selectResponsibility").value = "all";
    document.querySelector("#selectEnrolment").value = "all";
  } else if (event.target.id === "selectEnrolment") {
    document.querySelector("#selectHouse").value = "all";
    document.querySelector("#selectResponsibility").value = "all";
    document.querySelector("#selectBloodstatus").value = "all";
  }

  setFilter(filter, filterCat);
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  let sortDir = settings.sortDir;
  //checking if this sort was already selected, meaning it should toggle
  if (sortBy === settings.sort) {
    if (settings.sortDir === "asc") {
      sortDir = "des";
    } else {
      sortDir = "asc";
    }
  }
  // console.log(`toggle direction: ${sortDir}`);
  // const sortDir = event.target.dataset.sortDirection;
  setSort(sortBy, sortDir);
  toggleSort();
}

function toggleSort() {
  // console.log(settings.sort);
  //setting the sort direction arrow
  if (settings.sortDir === "asc") {
    document.querySelector(`.${settings.sort} span`).textContent = " ▲";
  } else if (settings.sortDir === "des") {
    document.querySelector(`.${settings.sort} span`).textContent = " ▼";
  }
  //removing other arrows
  if (settings.sort === "firstName") {
    document.querySelector(`.lastName span`).textContent = "";
    document.querySelector(`.house span`).textContent = "";
    document.querySelector(`.responsibility span`).textContent = "";
  } else if (settings.sort === "lastName") {
    document.querySelector(`.firstName span`).textContent = "";
    document.querySelector(`.house span`).textContent = "";
    document.querySelector(`.responsibility span`).textContent = "";
  } else if (settings.sort === "house") {
    document.querySelector(`.firstName span`).textContent = "";
    document.querySelector(`.lastName span`).textContent = "";
    document.querySelector(`.responsibility span`).textContent = "";
  } else if (settings.sort === "responsibility") {
    document.querySelector(`.firstName span`).textContent = "";
    document.querySelector(`.lastName span`).textContent = "";
    document.querySelector(`.house span`).textContent = "";
  }
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
  if (settings.filter === "expelled") {
    console.log("show expelled students instead");
    console.table(expelledStudentList);
    const filteredList = expelledStudentList.filter(filterList);
    const sortedList = sortList(filteredList);
    const searchedList = searchList(sortedList);
    console.table(searchedList);
    displayList(searchedList);
  } else {
    const filteredList = studentList.filter(filterList);
    const sortedList = sortList(filteredList);
    const searchedList = searchList(sortedList);
    displayList(searchedList);
  }
}

function searchList(list) {
  const searchTerm = document.querySelector("#search").value.toLowerCase();
  let listlength = list.length;
  let searchResult = [];

  if (searchTerm !== "") {
    console.log("searching");
    for (let i = 0; i < listlength; i++) {
      if (list[i].firstName.toLowerCase().includes(searchTerm) === true) {
        searchResult.push(list[i]);
      } else if (list[i].house.toLowerCase().includes(searchTerm) === true) {
        searchResult.push(list[i]);
      } else if (list[i].lastName !== undefined) {
        if (list[i].lastName.toLowerCase().includes(searchTerm) === true) {
          searchResult.push(list[i]);
        }
      }
    }
  } else if (searchTerm === "") {
    searchResult = list;
    console.log("stop searching");
  }

  // console.log(searchResult);
  return searchResult;
}

//------------------Controller: Open Student Popup
function openStudentPopup(event) {
  //we know how to find the name of the student
  // console.log(event.path[1].firstElementChild.textContent);
  //now we want to find the corresponding student in the student array
  let showStudent;
  studentList.forEach(function (student) {
    if (student.firstName === event.path[1].firstElementChild.textContent) {
      showStudent = student;
    }
  });

  //grap the popup
  const template = document.querySelector(".studentCard-container");

  //change the template
  //----set text content
  template.querySelector(".studentCardInfoLine:nth-child(2) p span").textContent = showStudent.firstName;
  template.querySelector(".studentCardInfoLine:nth-child(2) p:nth-of-type(2) span").textContent = showStudent.middleName;
  template.querySelector(".studentCardInfoLine:nth-child(2) p:nth-of-type(3) span").textContent = showStudent.lastName;
  template.querySelector(".studentCardInfoLine:nth-child(2) p:nth-of-type(4) span").textContent = showStudent.nickName;
  template.querySelector(".studentCardInfoLine:nth-child(2) p:nth-of-type(5) span").textContent = showStudent.bloodstatus;

  //----set student image
  template.querySelector(".studentCardStudentIMG").src = `imgStudents/${showStudent.image}`;

  //----find the right house crest and border colors
  if (showStudent.house === "Gryffindor") {
    template.querySelector(".studentCardCrest").classList.add("gryfCrest");
    template.querySelector(".studentCard").classList.add("gryfBorder");
    // console.log("GRYFFINDOR");
  } else if (showStudent.house === "Ravenclaw") {
    template.querySelector(".studentCardCrest").classList.add("raveCrest");
    template.querySelector(".studentCard").classList.add("raveBorder");
    // console.log("RAVENCLAW");
  } else if (showStudent.house === "Hufflepuff") {
    template.querySelector(".studentCardCrest").classList.add("huffCrest");
    template.querySelector(".studentCard").classList.add("huffBorder");
    // console.log("HUFFLEPUFF");
  } else if (showStudent.house === "Slytherin") {
    template.querySelector(".studentCardCrest").classList.add("slytCrest");
    template.querySelector(".studentCard").classList.add("slytBorder");
    // console.log("SLYTHERIN");
  }

  //----display if the student is enrolled or not
  if (showStudent.expelled === false) {
    template.querySelector(".studentEnrolment").textContent = `${showStudent.firstName} is currently enrolled at Hogwarts`;
    document.querySelector(".studentCardButtons button:nth-of-type(4)").textContent = "expell student";
    document.querySelector(".studentCardButtons button:nth-of-type(4)").addEventListener("click", expellStudent);
  } else {
    template.querySelector(".studentEnrolment").textContent = `${showStudent.firstName} is not currently enrolled at Hogwarts`;
    document.querySelector(".studentCardButtons button:nth-of-type(4)").textContent = "student is already expelled";
    document.querySelector(".studentCardButtons button:nth-of-type(4)").removeEventListener("click", expellStudent);
  }

  //----show the right icons according to their responsibilities and set the button for adding or removing role
  if (showStudent.prefect === true) {
    template.querySelector(".studentPrefectLogoSpot").classList.add("prefectlogo");
    document.querySelector(".studentCardButtons button:nth-of-type(1)").textContent = "remove prefect";
    document.querySelector(".studentCardButtons button:nth-of-type(1)").addEventListener("click", removePrefect);
  } else {
    template.querySelector(".studentPrefectLogoSpot").classList.add("prefectlogobeige");
    document.querySelector(".studentCardButtons button:nth-of-type(1)").textContent = "make prefect";
    document.querySelector(".studentCardButtons button:nth-of-type(1)").addEventListener("click", makePrefect);
  }
  if (showStudent.inquisitorial === true) {
    template.querySelector(".studentInquisitorialLogoSpot").classList.add("inquisitoriallogo");
  } else {
    template.querySelector(".studentInquisitorialLogoSpot").classList.add("inquisitoriallogobeige");
  }
  if (showStudent.quidditch === true) {
    template.querySelector(".studentQuidditchLogoSpot").classList.add("quidditchlogo");
  } else {
    template.querySelector(".studentQuidditchLogoSpot").classList.add("quidditchlogobeige");
  }

  //scroll to top and show the popup
  window.scroll(0, 0);
  template.classList.remove("hidden");
  //add transparent background
  document.querySelector(".transparentOverlay").classList.remove("hidden");
  document.querySelector("body").classList.add("noScroll");
  //add eventlisteners
  //---to close the popup
  document.querySelector(".transparentOverlay").addEventListener("click", closePopup);
  //---to expell the student
}

function closePopup() {
  //reapply the hidden class to remove popup from screen, and remove the noScroll class
  document.querySelector(".transparentOverlay").classList.add("hidden");
  document.querySelector(".studentCard-container").classList.add("hidden");
  document.querySelector("body").classList.remove("noScroll");

  //reset the template classes to avoid weirdness on future popups
  //--Gryffindor styling
  document.querySelector(".studentCardCrest").classList.remove("gryfCrest");
  document.querySelector(".studentCard").classList.remove("gryfBorder");
  //--Ravenclaw styling
  document.querySelector(".studentCardCrest").classList.remove("raveCrest");
  document.querySelector(".studentCard").classList.remove("raveBorder");
  //--Slytherin styling
  document.querySelector(".studentCardCrest").classList.remove("slytCrest");
  document.querySelector(".studentCard").classList.remove("slytBorder");
  //--Hufflepuff styling
  document.querySelector(".studentCardCrest").classList.remove("huffCrest");
  document.querySelector(".studentCard").classList.remove("huffBorder");
  //--responsibility icons
  document.querySelector(".studentPrefectLogoSpot").classList.remove("prefectlogo");
  document.querySelector(".studentPrefectLogoSpot").classList.remove("prefectlogobeige");
  document.querySelector(".studentInquisitorialLogoSpot").classList.remove("inquisitoriallogo");
  document.querySelector(".studentInquisitorialLogoSpot").classList.remove("inquisitoriallogobeige");
  document.querySelector(".studentQuidditchLogoSpot").classList.add("quidditchlogo");
  document.querySelector(".studentQuidditchLogoSpot").classList.add("quidditchlogobeige");
}

//------------------Model: expelling students

function expellStudent(event) {
  console.log("Expelled");
  //finding the student from the clickevent
  let expelledName = event.path[2].querySelector(".studentCardInfoLine p span").textContent;
  console.log(expelledName);
  let findExpelled;
  studentList.forEach(function (student) {
    if (student.firstName === expelledName) {
      findExpelled = student;
    }
  });

  //finding that student in the array
  const index = studentList.indexOf(findExpelled);
  //setting the student expelled as true
  findExpelled.expelled = true;
  document.querySelector(".studentEnrolment").textContent = `${findExpelled.firstName} is not currently enrolled at Hogwarts`;
  console.log(findExpelled);
  //removing that student from the student list
  studentList.splice(index, 1);
  // console.table(studentList);
  //adding that student to the expelled student list
  expelledStudentList.push(findExpelled);
  //removing eventlistener and changing button
  document.querySelector(".studentCardButtons button:nth-of-type(4)").removeEventListener("click", expellStudent);
  document.querySelector(".studentCardButtons button:nth-of-type(4)").textContent = "student is already expelled";
  document.querySelector(".studentCardButtons button:nth-of-type(4):hover").style.transform = "scale(1)";
  //rebuilding this student list without the student
  buildList();
}

//------------------Controller: prefect

function makePrefect(event) {
  console.log(event);
  let prefectName = event.path[2].querySelector(".studentCardInfoLine p span").textContent;
  //now we want to find the corresponding student and their house in the student array
  //so that we know which prefects to check for
  let showStudent;
  studentList.forEach(function (student) {
    if (student.firstName === prefectName) {
      showStudent = student;
    }
  });
  let studentHouse = showStudent.house;
  //checking how many prefects there are in that house
  //--first filter for house
  let studentsFromHouse = studentList.filter(housefilter);
  function housefilter(student) {
    if (student.house === studentHouse) {
      return true;
    } else {
      return false;
    }
  }
  console.log(`We want to make ${showStudent.firstName} from ${showStudent.house} a prefect`);
  console.log(studentsFromHouse);
  //--then filter the prefects within that house
  let prefectsFromHouse = studentsFromHouse.filter(prefectFilter);
  console.log(prefectsFromHouse);
  function prefectFilter(student) {
    if (student.prefect === true) {
      return true;
    } else {
      return false;
    }
  }
  //--then I check how long the array is before we add the new prefect to make sure there is no more 1
  let amountOfPrefects = prefectsFromHouse.length;
  console.log(amountOfPrefects);

  if (amountOfPrefects < 2) {
    //--if there are less than 2 prefects we can make the student a prefect
    showStudent.prefect = true;
    //--then we style the popup
    document.querySelector(".studentPrefectLogoSpot").classList.remove("prefectlogobeige");
    document.querySelector(".studentPrefectLogoSpot").classList.add("prefectlogo");
    //--and change the button accordingly
    document.querySelector(".studentCardButtons button:nth-of-type(1)").textContent = "remove prefect";
    document.querySelector(".studentCardButtons button:nth-of-type(1)").removeEventListener("click", makePrefect);
    document.querySelector(".studentCardButtons button:nth-of-type(1)").addEventListener("click", removePrefect);
  } else {
    console.log("too many prefects");
    alert(`Too many prefects: ${prefectsFromHouse[0].firstName} ${prefectsFromHouse[0].lastName} and ${prefectsFromHouse[1].firstName} ${prefectsFromHouse[1].lastName} are already prefects, remove one of them to add ${showStudent.firstName}`);
  }
  buildList();
}

function removePrefect(event) {
  let prefectName = event.path[2].querySelector(".studentCardInfoLine p span").textContent;
  //now we want to find the corresponding student and their house in the student array
  //so that we know which prefects to check for
  let showStudent;
  studentList.forEach(function (student) {
    if (student.firstName === prefectName) {
      showStudent = student;
    }
  });
  showStudent.prefect = false;
  document.querySelector(".studentCardButtons button:nth-of-type(1)").textContent = "make prefect";
  document.querySelector(".studentPrefectLogoSpot").classList.add("prefectlogobeige");
  document.querySelector(".studentPrefectLogoSpot").classList.remove("prefectlogo");
  document.querySelector(".studentCardButtons button:nth-of-type(1)").removeEventListener("click", removePrefect);
  document.querySelector(".studentCardButtons button:nth-of-type(1)").addEventListener("click", makePrefect);
  //running buildlist to update the role icons
  buildList();
}

//------------------Model? Count Students

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
  //edit when I start expelling students so it updates
  const expelledStudents = expelledStudentList.length;
  const enrolledStudents = studentList.length;

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

  //responsibility icons
  if (student.prefect === true) {
    clone.querySelector('[data-field="responsibility"] .prefectLogoSpot').classList.add("prefectlogo");
  }
  if (student.inquisitorial === true) {
    clone.querySelector('[data-field="responsibility"] .inquisitorialLogoSpot').classList.add("inquisitoriallogo");
  }
  if (student.quidditch === true) {
    clone.querySelector('[data-field="responsibility"] .quidditchLogoSpot').classList.add("quidditchlogo");
  }

  //set eventlistener
  clone.querySelector(".fullStudent").addEventListener("click", openStudentPopup);

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

//------------------Model: determine blood status

async function getBloodStatusList() {
  await fetch("https://petlatkea.dk/2021/hogwarts/families.json")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareBloodList(jsonData);
    });
}

function decideBlood(lastName) {
  let result;
  if (bloodList.half.includes(lastName) === true) {
    // console.log("halfblood");
    result = "halfblood";
  } else if (bloodList.pure.includes(lastName) === true) {
    // console.log("pureblood");
    result = "pureblood";
  } else {
    // console.log("muggleborn");
    result = "muggleborn";
  }
  // console.log(result);
  return result;
}

function prepareBloodList(jsonData) {
  bloodList.pure = jsonData.pure;
  bloodList.half = jsonData.half;
}
