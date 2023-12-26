const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2309-FTB-MT-WEB-PT/events";

// ******************************* INITIAL STATE ************************************
const state = {
  parties: [],
};

// ******************************* Selectors ******************************************
const partyList = document.querySelector("#parties");
const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", createParties);

// ******************************** Methods *********************************************

async function render() {
  //fetches the parties
  await getParties();
  //renders the parties to UI
  renderParties();
}
render();

// GET REQUEST - READ
async function getParties() {
  try {
    //gets data from url
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log("json --->", json);
    //adds data to parties array
    state.parties = json.data;
  } catch (error) {
    console.error(error, "There was an error /GET parties");
  }
}

// getParties();

//CREATE REQUEST - POST
async function createParties(name, description, date, location) {
  try {
    const response = await fetch(API_URL, {
      //creates by using POST request
      method: "POST",
      //tells to send data through json
      headers: { "Content-Type": "application/json" },
      //stringify data through json and put in an object
      body: JSON.stringify({ name, description, date, location }),
    });
    const json = await response.json();
    //updates the UI
    render();
  } catch (error) {
    console.error(error, "There was an error /POST recipes");
  }
}

async function addParty(event) {
  //prevents defeault behavior
  event.preventDefault();
  //calls the create parties function
  await createParties(
    addPartyForm.title.value,
    addPartyForm.description.value,
    addPartyForm.date.value,
    addPartyForm.location.value
  );
}

// UPDATE - PUT
async function updateParty(id, name, description, date, location) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      //updates by using PUT request
      method: "PUT",
      //tells to send data through json
      headers: { "Content-Type": "application/json" },
      //stringify data through json and put in an object
      body: JSON.stringify({ name, description, date, location }),
    });
    //update the UI
    render();
  } catch (error) {
    console.error(error, "There was an error /UPDATE party");
  }
}

//DELETE
async function deleteParty(id) {
  try {
    //fetches the url with the id
    const response = await fetch(`${API_URL}/${id}`, {
      //deletes by using delete method
      method: "DELETE",
    });
    //check if response is false
    if (!response.ok) {
      //if false, displays new error message
      throw new Error("Recipe could not be deleted!!!");
    }
    //update the UI
    render();
  } catch (error) {
    console.error(error, "There was an error /DELETE party");
  }
}

function renderParties() {
  //checks if there is any parties
  if (state.parties.length === 0) {
    //displays message if there are no parties
    partyList.innerHTML = `<li> No parties found <li>`;
  }
  const partyCards = state.parties.map((party) => {
    //creates an li tag
    const partyCard = document.createElement("li");
    //adds a class to the li tag
    partyCard.classList.add("party");
    //adds content inside the li tag
    partyCard.innerHTML = `
    <h2>${party.name}</h2>
    <p>${party.description}</p>
    <p>${party.date}
    <p>${party.location}</p>`;
    //creates delete button
    const deleteButton = document.createElement("button");
    //adds text to button
    deleteButton.textContent = "DELETE PARTY";
    //adds delete button to party cards
    partyCard.append(deleteButton);
    //adds event to call deleteParty function when button is clicked
    deleteButton.addEventListener("click", () => deleteParty(party.id));
    return partyCard;
  });
  partyList.replaceChildren(partyCards);
}
