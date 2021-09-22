"use strict";
//I am currently working on sorting. Right now I have a working eventlistener that reads the searchterm and knows if the search box is empty
//I might need to look into the sizing of everything as it is huge when uploaded to github pages

window.addEventListener("DOMContentLoaded", start);

//-------------------Global objects and arrays
const studentList = [];
const expelledStudentList = [];
const settings = {
  filter: "all",
  filterCat: "",
  sort: "firstName",
  sortDir: "asc",
  hacked: false,
};
const bloodList = {
  pure: "",
  half: "",
};
const Student = {
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

//-------------------Initial functions

function start() {
  console.log("start()");
  loadJSON();
  //setting event listeners
  document.querySelector("#selectHouse").addEventListener("change", selectFilter);
  document.querySelector("#selectResponsibility").addEventListener("change", selectFilter);
  document.querySelector("#selectBloodstatus").addEventListener("change", selectFilter);
  document.querySelector("#selectEnrolment").addEventListener("change", selectFilter);
  document.querySelector("#sorting .firstName").addEventListener("click", selectSort);
  document.querySelector("#sorting .lastName").addEventListener("click", selectSort);
  document.querySelector("#sorting .house").addEventListener("click", selectSort);
  document.querySelector("#search").addEventListener("change", buildList);
  document.querySelector("#search").addEventListener("input", buildList);
  document.querySelector(".candle.c1").addEventListener("click", toggleCandle);
  document.querySelector(".candle.c2").addEventListener("click", toggleCandle);
  document.querySelector(".candle.c3").addEventListener("click", toggleCandle);
  document.querySelector(".candle.c4").addEventListener("click", toggleCandle);
  document.querySelector(".candle.c5").addEventListener("click", toggleCandle);
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
  displayList(studentList);
}

//------------------candles and hacking
function toggleCandle(event) {
  //find which candle it is based on the classlist id (c1/c2/c3/c4/c5)
  // console.log(event.path[0].classList[1]);
  //then check if the candle is currently lit or unlit and toggle it
  if (event.path[0].classList[2] === "lit") {
    document.querySelector(`.candle.${event.path[0].classList[1]}`).classList.add("unlit");
    document.querySelector(`.candle.${event.path[0].classList[1]}`).classList.remove("lit");
  } else {
    document.querySelector(`.candle.${event.path[0].classList[1]}`).classList.remove("unlit");
    document.querySelector(`.candle.${event.path[0].classList[1]}`).classList.add("lit");
  }
  //then we check if the secret hacking code has been entered
  if (document.querySelector(`.candle.c1`).classList[2] === "unlit") {
    if (document.querySelector(`.candle.c2`).classList[2] === "lit") {
      if (document.querySelector(`.candle.c3`).classList[2] === "lit") {
        if (document.querySelector(`.candle.c4`).classList[2] === "lit") {
          if (document.querySelector(`.candle.c5`).classList[2] === "unlit") {
            //if it is then we call the hacking function
            hackTheSystem();
          }
        }
      }
    }
  }
}

async function hackTheSystem() {
  //first we checked if the system has already been hacked since we only want to do this once
  if (settings.hacked === false) {
    settings.hacked = true;
    console.log("HACK HOGWARTS");
    //change the header
    document.querySelector("h1").textContent = "Hacked Hogwarts Student List";
    //then we add me and my friends to the student list
    await addMe();
    await addMyFriends();
    //randomize blood
    studentList.forEach(function (student) {
      console.log(`${student.firstName} was originally ${student.bloodstatus}`);
      if (student.bloodstatus === "muggleborn") {
        student.bloodstatus = "pureblood";
      } else if (student.bloodstatus === "halfblood") {
        student.bloodstatus = "pureblood";
      } else if (student.bloodstatus === "pureblood") {
        student.bloodstatus = randomBlood();
      }
      console.log(`now they are ${student.bloodstatus}`);
    });
    buildList();
  }
}

async function addMe() {
  const student = Object.create(Student);
  student.firstName = "Rikke";
  student.lastName = "Thøgersen";
  student.middleName = "Blom";
  student.nickName = "Flils";
  student.image = "../img/me.png";
  student.house = "Hufflepuff";
  student.bloodstatus = "muggleborn";

  studentList.push(student);
  // buildList();
}

async function addMyFriends() {
  const anna = Object.create(Student);
  anna.firstName = "Anna";
  anna.lastName = "Kristensen";
  anna.middleName = "Wolf";
  anna.nickName = "Flanna";
  anna.image = "../img/anna.png";
  anna.house = "Ravenclaw";
  anna.bloodstatus = "muggleborn";

  const jesper = Object.create(Student);
  jesper.firstName = "Jesper";
  jesper.lastName = "Hansen";
  jesper.middleName = "Mark";
  jesper.nickName = "Fljesper";
  jesper.image = "../img/jesper.png";
  jesper.house = "Slytherin";
  jesper.bloodstatus = "muggleborn";

  const jo = Object.create(Student);
  jo.firstName = "María José";
  jo.lastName = "Herrera Penisi";
  jo.middleName = "";
  jo.nickName = "Jo";
  jo.image = "../img/jo.png";
  jo.house = "Gryffindor";
  jo.bloodstatus = "muggleborn";

  studentList.push(anna);
  studentList.push(jesper);
  studentList.push(jo);
}

//------------------filter and sort the list + search

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

function selectFilter(event) {
  //finding the category name of the filter used
  const filter = document.querySelector(`#${event.target.id}`).value;
  const filterCat = event.target.id;
  console.log(`filter: ${filter}, category: ${filterCat}`);

  //making sure only one filter can be used at a time (at least for now)
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

  //then we send that data to another function that adjust the global object "settings"
  setFilter(filter, filterCat);
}

function selectSort(event) {
  //finding the sorting method and sorting direction
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
  //sending that info to another function that adjusts the global object "settings"
  setSort(sortBy, sortDir);
  //running another function that adjusts the sorting direction arrow in the display
  toggleSort();
}

function toggleSort() {
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
  } else if (settings.sort === "lastName") {
    document.querySelector(`.firstName span`).textContent = "";
    document.querySelector(`.house span`).textContent = "";
  } else if (settings.sort === "house") {
    document.querySelector(`.firstName span`).textContent = "";
    document.querySelector(`.lastName span`).textContent = "";
  }
}

function setFilter(filter, filterCat) {
  //updating the global object "settings" with new filter choices
  settings.filter = filter;
  settings.filterCat = filterCat;
  //calling the build list to start applying the new filter to the student array
  buildList();
}

function setSort(sortby, sortDir) {
  //updating the global object "settings" with new sorting choices
  settings.sort = sortby;
  settings.sortDir = sortDir;
  //calling the build list to start applying the new sorting method to the student array
  buildList();
}

function buildList() {
  //determine if we should display the enrolled or the expelled students
  let array;
  if (settings.filter === "expelled") {
    array = expelledStudentList;
  } else {
    array = studentList;
  }

  //applying the chosen filters, sorting methods and search parameters to the chosen list
  const filteredList = array.filter(filterList);
  const sortedList = sortList(filteredList);
  const searchedList = searchList(sortedList);
  //sending the final list to the display function
  displayList(searchedList);
}

function randomBlood() {
  let result = Math.floor(Math.random() * 3);
  console.log(result);
  if (result === 0) {
    return "muggleborn";
  } else if (result === 1) {
    return "halfblood";
  } else if (result === 2) {
    return "pureblood";
  }
}

function searchList(list) {
  //first we find the parameter we want to search for
  //we set both it and the student data to lowercase to make it case insensitive
  const searchTerm = document.querySelector("#search").value.toLowerCase();
  //we determine the lenght of the list of students to know how many times to run the loop
  let listlength = list.length;
  //then we make an array to save the search results in
  let searchResult = [];
  //then we check if there is any data in the search parameter
  //if there is then we use .includes to check through names and hogwarts house one at a time
  //if the student has a name that matches they are added to the search result array
  //if the search parameter is empty we return the list without edits
  if (searchTerm !== "") {
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
  }
  //at the end we return the final search result array
  return searchResult;
}

//------------------Student Popup
function openStudentPopup(event) {
  //we know how to find the name of the student
  // console.log(event.path[1].firstElementChild.textContent);
  //now we want to find the corresponding student in the student array
  let showStudent = findStudent(event.path[1].firstElementChild.textContent);

  //change the content of the popup
  //----set text content
  setTextContentPopup(showStudent);
  //----set student image
  document.querySelector(".studentCardStudentIMG").src = `imgStudents/${showStudent.image}`;
  //----find and apply the right house crest and border colors
  setHouseStyling(showStudent);
  //----display if the student is enrolled or not
  setEnrolmentStatus(showStudent);
  //----show the right icons according to their responsibilities and set the button for adding or removing role
  setResponsibilityIconsPopup(showStudent);
  //scroll to top and show the popup
  window.scroll(0, 0);
  document.querySelector(".studentCard-container").classList.remove("hidden");
  //add transparent background
  document.querySelector(".transparentOverlay").classList.remove("hidden");
  document.querySelector("body").classList.add("noScroll");
  //add eventlistener to close the popup
  document.querySelector(".transparentOverlay").addEventListener("click", closePopup);
}

function setTextContentPopup(showStudent) {
  document.querySelector(".studentCardInfoLine:nth-child(2) p span").textContent = showStudent.firstName;
  document.querySelector(".studentCardInfoLine:nth-child(2) p:nth-of-type(2) span").textContent = showStudent.middleName;
  document.querySelector(".studentCardInfoLine:nth-child(2) p:nth-of-type(3) span").textContent = showStudent.lastName;
  document.querySelector(".studentCardInfoLine:nth-child(2) p:nth-of-type(4) span").textContent = showStudent.nickName;
  document.querySelector(".studentCardInfoLine:nth-child(2) p:nth-of-type(5) span").textContent = showStudent.bloodstatus;
}

function setHouseStyling(showStudent) {
  if (showStudent.house === "Gryffindor") {
    document.querySelector(".studentCardCrest").classList.add("gryfCrest");
    document.querySelector(".studentCard").classList.add("gryfBorder");
    // console.log("GRYFFINDOR");
  } else if (showStudent.house === "Ravenclaw") {
    document.querySelector(".studentCardCrest").classList.add("raveCrest");
    document.querySelector(".studentCard").classList.add("raveBorder");
    // console.log("RAVENCLAW");
  } else if (showStudent.house === "Hufflepuff") {
    document.querySelector(".studentCardCrest").classList.add("huffCrest");
    document.querySelector(".studentCard").classList.add("huffBorder");
    // console.log("HUFFLEPUFF");
  } else if (showStudent.house === "Slytherin") {
    document.querySelector(".studentCardCrest").classList.add("slytCrest");
    document.querySelector(".studentCard").classList.add("slytBorder");
    // console.log("SLYTHERIN");
  }
}

function setEnrolmentStatus(showStudent) {
  if (showStudent.expelled === false) {
    document.querySelector(".studentEnrolment").textContent = `${showStudent.firstName} is currently enrolled at Hogwarts`;
    document.querySelector(".studentCardButtons button:nth-of-type(4)").textContent = "expell student";
    document.querySelector(".studentCardButtons button:nth-of-type(4)").addEventListener("click", expellStudent);
  } else {
    document.querySelector(".studentEnrolment").textContent = `${showStudent.firstName} is not currently enrolled at Hogwarts`;
    document.querySelector(".studentCardButtons button:nth-of-type(4)").textContent = "student is already expelled";
    document.querySelector(".studentCardButtons button:nth-of-type(4)").removeEventListener("click", expellStudent);
  }
}

function setResponsibilityIconsPopup(showStudent) {
  if (showStudent.prefect === true) {
    document.querySelector(".studentPrefectLogoSpot").classList.add("prefectlogo");
    document.querySelector(".studentCardButtons button:nth-of-type(1)").textContent = "remove prefect";
    document.querySelector(".studentCardButtons button:nth-of-type(1)").addEventListener("click", removePrefect);
  } else {
    document.querySelector(".studentPrefectLogoSpot").classList.add("prefectlogobeige");
    document.querySelector(".studentCardButtons button:nth-of-type(1)").textContent = "make prefect";
    document.querySelector(".studentCardButtons button:nth-of-type(1)").addEventListener("click", makePrefect);
  }
  if (showStudent.inquisitorial === true) {
    document.querySelector(".studentInquisitorialLogoSpot").classList.add("inquisitoriallogo");
    document.querySelector(".studentCardButtons button:nth-of-type(2)").textContent = "remove from inquisitorial squad";
    document.querySelector(".studentCardButtons button:nth-of-type(2)").addEventListener("click", removeInquisitorial);
  } else {
    document.querySelector(".studentInquisitorialLogoSpot").classList.add("inquisitoriallogobeige");
    document.querySelector(".studentCardButtons button:nth-of-type(2)").textContent = "make inquisitorial squad";
    document.querySelector(".studentCardButtons button:nth-of-type(2)").addEventListener("click", checkInquisitorial);
  }
  if (showStudent.quidditch === true) {
    document.querySelector(".studentQuidditchLogoSpot").classList.add("quidditchlogo");
  } else {
    document.querySelector(".studentQuidditchLogoSpot").classList.add("quidditchlogobeige");
  }
}

function resetPopupVisuals() {
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

function closePopup() {
  //reapply the hidden class to remove popup from screen, and remove the noScroll class
  document.querySelector(".transparentOverlay").classList.add("hidden");
  document.querySelector(".studentCard-container").classList.add("hidden");
  document.querySelector("body").classList.remove("noScroll");
  resetPopupVisuals();
}

function findStudent(firstname) {
  let studentObject;
  let array;
  //first we check which student list we should loop through to find the student
  if (settings.filter === "expelled") {
    array = expelledStudentList;
  } else {
    array = studentList;
  }
  //then we loop through the data until we find the name
  array.forEach(function (student) {
    if (student.firstName === firstname) {
      studentObject = student;
    }
  });
  //and lastly we return the student object
  return studentObject;
}

//------------------expelling students

function expellStudent(event) {
  //sending the name to another function to get the full student object
  const name = event.path[2].querySelector(".studentCardInfoLine p span").textContent;
  if (name === "Rikke") {
    // alert("No way - you can never expel me");
    denyExpellMe();
  } else {
    const findExpelled = findStudent(name);
    //finding that students index in the array
    const index = studentList.indexOf(findExpelled);
    //setting the student expelled as true
    findExpelled.expelled = true;
    //styling the open student popup
    document.querySelector(".studentEnrolment").textContent = `${findExpelled.firstName} is not currently enrolled at Hogwarts`;
    //removing that student from the student list
    studentList.splice(index, 1);
    //adding that student to the expelled student list
    expelledStudentList.push(findExpelled);
    //removing eventlistener and changing button
    document.querySelector(".studentCardButtons button:nth-of-type(4)").removeEventListener("click", expellStudent);
    document.querySelector(".studentCardButtons button:nth-of-type(4)").textContent = "student is already expelled";
    document.querySelector(".studentCardButtons button:nth-of-type(4):hover").style.transform = "scale(1)";
    //rebuilding this student list without the student
    buildList();
  }
}

function denyExpellMe() {
  console.log("hehehehe");
  //show the modal
  document.querySelector(".modal-container").classList.remove("hidden");
  //style the modal
  document.querySelector(".modal p:nth-of-type(1) span").textContent = "You can't expel me, I've hacked the system";
  document.querySelector(".modal p:nth-of-type(1) span:nth-of-type(2)").textContent = "";
  document.querySelector(".modal p:nth-of-type(2) span").textContent = `I mean, it’s sort of exciting, isn’t it, breaking the rules?`;
  document.querySelector(".modal p:nth-of-type(2) span:nth-of-type(2)").textContent = "";
  document.querySelector(".modal button:nth-of-type(1)").classList.add("hidden");
  document.querySelector(".modal button:nth-of-type(2)").classList.add("hidden");
  //set event listeners for closing the modal
  document.querySelector(".modal img").addEventListener("click", closeModal);
}

//------------------prefects

function makePrefect(event) {
  //first we find the name of the student through the event
  // let prefectName = event.path[2].querySelector(".studentCardInfoLine p span").textContent;
  //now we want to find the corresponding student and their house in the student array
  //so that we know which prefects to check for
  let showStudent = findStudent(event.path[2].querySelector(".studentCardInfoLine p span").textContent);
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
    //--if the student can't be a prefect we let the user know with an alert telling them to remove one of the other prefects
    console.log("too many prefects");
    prefectModal(prefectsFromHouse, showStudent);
    // alert(`Too many prefects: ${prefectsFromHouse[0].firstName} ${prefectsFromHouse[0].lastName} and ${prefectsFromHouse[1].firstName} ${prefectsFromHouse[1].lastName} are already prefects, remove one of them to add ${showStudent.firstName}`);
  }
  buildList();
}

function prefectModal(currentPrefects, student) {
  //show the modal
  document.querySelector(".modal-container").classList.remove("hidden");
  //style the modal
  document.querySelector(".modal p:nth-of-type(1) span").textContent = student.house;
  document.querySelector(".modal p:nth-of-type(1) span:nth-of-type(2)").textContent = " can only have 2 prefects.";
  document.querySelector(".modal p:nth-of-type(2) span:nth-of-type(1)").textContent = `Remove one of the current prefects to add `;
  document.querySelector(".modal p:nth-of-type(2) span:nth-of-type(2)").textContent = student.firstName;
  document.querySelector(".modal button:nth-of-type(1) span:nth-of-type(1)").textContent = `Remove `;
  document.querySelector(".modal button:nth-of-type(2) span:nth-of-type(1)").textContent = `Remove `;
  document.querySelector(".modal button:nth-of-type(1) span:nth-of-type(2)").textContent = currentPrefects[0].firstName;
  document.querySelector(".modal button:nth-of-type(2) span:nth-of-type(2)").textContent = currentPrefects[1].firstName;
  //set event listeners for closing the modal and for removing the two other prefects
  document.querySelector(".modal img").addEventListener("click", closeModal);
  document.querySelector(".modal button:nth-of-type(1) ").addEventListener("click", removePrefectFromModal);
  document.querySelector(".modal button:nth-of-type(2) ").addEventListener("click", removePrefectFromModal);

  console.log(`The current prefects are: ${currentPrefects[0].firstName} ${currentPrefects[0].lastName} and ${currentPrefects[1].firstName} ${currentPrefects[1].lastName}`);
}

function closeModal() {
  console.log("close modal");
  //hide the modal
  document.querySelector(".modal-container").classList.add("hidden");
  //unhide the buttons in case we need the modal for prefects
  document.querySelector(".modal button:nth-of-type(1)").classList.remove("hidden");
  document.querySelector(".modal button:nth-of-type(2)").classList.remove("hidden");
}

function removePrefect(event) {
  // let prefectName = event.path[2].querySelector(".studentCardInfoLine p span").textContent;
  //now we want to find the corresponding student and their house in the student array
  //so that we know which prefects to check for
  let showStudent = findStudent(event.path[2].querySelector(".studentCardInfoLine p span").textContent);
  showStudent.prefect = false;
  document.querySelector(".studentCardButtons button:nth-of-type(1)").textContent = "make prefect";
  document.querySelector(".studentPrefectLogoSpot").classList.add("prefectlogobeige");
  document.querySelector(".studentPrefectLogoSpot").classList.remove("prefectlogo");
  document.querySelector(".studentCardButtons button:nth-of-type(1)").removeEventListener("click", removePrefect);
  document.querySelector(".studentCardButtons button:nth-of-type(1)").addEventListener("click", makePrefect);
  //running buildlist to update the role icons
  buildList();
}

function removePrefectFromModal(event) {
  //finding the student name from the button
  console.log(event);
  console.log(findStudent(event.path[0].children[1].textContent));
  let removeStudent = findStudent(event.path[0].children[1].textContent);
  removeStudent.prefect = false;

  //styling the student popup:
  document.querySelector(".studentPrefectLogoSpot").classList.remove("prefectlogobeige");
  document.querySelector(".studentPrefectLogoSpot").classList.add("prefectlogo");
  //--and change the button accordingly
  document.querySelector(".studentCardButtons button:nth-of-type(1)").textContent = "remove prefect";
  document.querySelector(".studentCardButtons button:nth-of-type(1)").removeEventListener("click", makePrefect);
  document.querySelector(".studentCardButtons button:nth-of-type(1)").addEventListener("click", removePrefect);

  //finding the student that should be added instead
  console.log(event.path[2].children[3].children[1].textContent);
  let newPrefect = findStudent(event.path[2].children[3].children[1].textContent);
  newPrefect.prefect = true;
  //close the modal
  closeModal();
  //running buildlist to update the role icons
  buildList();
}

//------------------inquisitorial squad
function checkInquisitorial(event) {
  console.log("make inquisitorial");
  //find the student name:
  let studentName = event.path[2].querySelector(".studentCardInfoLine p span").textContent;
  //then find the corresponding student in the array
  let inquisitorialStudent = findStudent(studentName);

  //then we check if they are a: in Slytherin
  if (inquisitorialStudent.house === "Slytherin") {
    makeInquisitorial(inquisitorialStudent, event);
  } else if (inquisitorialStudent.bloodstatus === "pureblood") {
    //or b: a pureblood
    makeInquisitorial(inquisitorialStudent, event);
  } else {
    //if they are neither we deny their request
    // alert(`${studentName} is not qualified to be part of the inquisitorial squad. Only purebloods and Slytherins are accepted.`);
    denyInquisitorialModal(inquisitorialStudent);
  }
}

function makeInquisitorial(student, event) {
  //we set the status in the object
  student.inquisitorial = true;
  console.log(student);
  //--then we style the popup
  document.querySelector(".studentInquisitorialLogoSpot").classList.remove("inquisitoriallogobeige");
  document.querySelector(".studentInquisitorialLogoSpot").classList.add("inquisitoriallogo");
  //--and change the button accordingly
  document.querySelector(".studentCardButtons button:nth-of-type(2)").textContent = "remove from inquisitorial squad";
  document.querySelector(".studentCardButtons button:nth-of-type(2)").removeEventListener("click", checkInquisitorial);
  document.querySelector(".studentCardButtons button:nth-of-type(2)").addEventListener("click", removeInquisitorial);
  //run buildlist to update with the new icons
  buildList();
  //now we check to see if the system has been hacked
  //if it has we want to set a timer to remove the student from the role again
  if (settings.hacked === true) {
    setTimeout(function () {
      // alert("We don't like racists");
      noMoreInquisitorialSquad(student);
      removeInquisitorial(event);
    }, 5000);
  }
}

function removeInquisitorial(event) {
  console.log("remove this racist");
  //find the student name:
  let studentName = event.path[2].querySelector(".studentCardInfoLine p span").textContent;
  //then find the corresponding student in the array
  let inquisitorialStudent = findStudent(studentName);

  inquisitorialStudent.inquisitorial = false;
  //--then we style the popup
  document.querySelector(".studentInquisitorialLogoSpot").classList.add("inquisitoriallogobeige");
  document.querySelector(".studentInquisitorialLogoSpot").classList.remove("inquisitoriallogo");
  //--and change the button accordingly
  document.querySelector(".studentCardButtons button:nth-of-type(2)").textContent = "make inquisitorial squad";
  document.querySelector(".studentCardButtons button:nth-of-type(2)").addEventListener("click", checkInquisitorial);
  document.querySelector(".studentCardButtons button:nth-of-type(2)").removeEventListener("click", removeInquisitorial);
  //run buildlist to update with the new icons
  buildList();
}

function denyInquisitorialModal(student) {
  console.log(student);
  //show the modal
  document.querySelector(".modal-container").classList.remove("hidden");
  //style the modal
  document.querySelector(".modal p:nth-of-type(1) span:nth-of-type(1)").textContent = student.firstName;
  document.querySelector(".modal p:nth-of-type(1) span:nth-of-type(2)").textContent = " is not eligable to be part of the inquisitorial squad";
  document.querySelector(".modal p:nth-of-type(2) span").textContent = `Only Slytherins and pureblood students will be accepted.`;
  document.querySelector(".modal p:nth-of-type(2) span:nth-of-type(2)").textContent = "";
  document.querySelector(".modal button:nth-of-type(1)").classList.add("hidden");
  document.querySelector(".modal button:nth-of-type(2)").classList.add("hidden");
  //set event listeners for closing the modal
  document.querySelector(".modal img").addEventListener("click", closeModal);
}

function noMoreInquisitorialSquad(student) {
  //show the modal
  document.querySelector(".modal-container").classList.remove("hidden");
  //style the modal
  document.querySelector("h2").textContent = "No more racists!";
  document.querySelector(".modal p:nth-of-type(1) span").textContent = `In protest against the racist regime at Hogwarts, I'm going to remove ${student.firstName} from the Inquisitorial Squad.`;
  document.querySelector(".modal p:nth-of-type(1) span:nth-of-type(2)").textContent = "";
  document.querySelector(".modal p:nth-of-type(2) span").textContent = `Don't try to add anymore students to the squad..`;
  document.querySelector(".modal p:nth-of-type(2) span:nth-of-type(2)").textContent = "";
  document.querySelector(".modal button:nth-of-type(1)").classList.add("hidden");
  document.querySelector(".modal button:nth-of-type(2)").classList.add("hidden");
  //set event listeners for closing the modal
  document.querySelector(".modal img").addEventListener("click", closeModal);
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

//------------------Displaying the students

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

//------------------Cleaning the data

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
  } else {
    return "backup.png";
  }
}

function cleanName(name) {
  const firstLetter = name.slice(0, 1).toUpperCase();
  const restOfName = name.slice(1).toLowerCase();
  const cleanName = firstLetter + restOfName;
  return cleanName;
}

//------------------Determine blood status

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
