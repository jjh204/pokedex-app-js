const pokemonRepository = (function () {
  // added all my global variables at the top to more easily see them.
  const pokemonList = [];
  const apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  const loadingMessage = document.querySelector("#loading-message");
  const modalContainer = document.querySelector("#modal-container");

  // allows pokemon objects to be added (conditional to object.key format)
  function add(pokemon) {
    if (typeof pokemon === "object") {
      pokemonList.push(pokemon);
    }
  }

  // allows pokemonList to be called as a whole
  function getAll() {
    return pokemonList;
  }

  // this will display the name of each pokemon in a <li> format on the DOM
  function addListItem(pokemon) {
    const pokemonAsList = document.querySelector(".pokemon-list");
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("pokemon-button");
    listItem.appendChild(button);
    pokemonAsList.appendChild(listItem);
    // here the code for the event listener to pull specific pokemon object
    button.addEventListener("click", function () {
      showDetails(pokemon);
    });
  }

  // functions to control the display of the loading message.
  function showLoadingMessage() {
    loadingMessage.classList.remove("is-hidden");
  }
  function hideLoadingMessage() {
    loadingMessage.classList.add("is-hidden");
  }

  // using promise and fetch to call the pokemon details via API (fetch returns a promise)
  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl)
      .then(function (response) {
        // this is calling the data returning a JSON promise
        return response.json();
      })
      .then(function (json) {
        hideLoadingMessage();
        // this is then returning the JSON objects for each
        json.results.forEach(function (item) {
          const pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    const url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageUrl = details.sprites.front_default;

        item.types = [];
        for (let i = 0; i < details.types.length; i++) {
          item.types.push(" " + details.types[i].type.name);
        }

        item.abilities = [];
        for (let i = 0; i < details.abilities.length; i++) {
          item.abilities.push(" " + details.abilities[i].ability.name);
        }

        item.height = details.height;
        item.weight = details.weight;
        return item;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  // this is pulling the specific details in a modal
  function showModal(item) {
    modalContainer.innerHTML = "";

    // creating the initial modal structure ready for the DOM
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // this is creating the close button in modal
    const closeButtonElement = document.createElement("button");
    closeButtonElement.classList.add("modal-close");
    closeButtonElement.innerText = "Close";
    closeButtonElement.addEventListener("click", hideModal);

    const titleElement = document.createElement("h1");
    titleElement.innerText = item.name;
    const imageElement = document.createElement("img");
    imageElement.src = item.imageUrl;
    const typesElement = document.createElement("div");
    typesElement.innerHTML =
      '<p class="pokemon-details">Type: </p>' + " " + item.types;
    const abilitiesElement = document.createElement("div");
    abilitiesElement.innerHTML =
      '<p class="pokemon-details">Ability: </p>' + " " + item.abilities;
    const heightElement = document.createElement("div");
    heightElement.innerHTML =
      '<p class="pokemon-details">Height: </p>' + " " + item.height / 10 + " m";
    const weightElement = document.createElement("div");
    weightElement.innerHTML =
      '<p class="pokemon-details">Weight: </p>' +
      " " +
      item.weight / 10 +
      " kg";

    // adding all the modal elements to the DOM
    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(imageElement);
    modal.appendChild(typesElement);
    modal.appendChild(abilitiesElement);
    modal.appendChild(heightElement);
    modal.appendChild(weightElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add("is-visible");
  }

  function hideModal() {
    modalContainer.classList.remove("is-visible");
  }

  // adding ability to use escape key to close the modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
      hideModal();
    }
  });

  // adding the ability to click on the modal container to close
  modalContainer.addEventListener("click", (e) => {
    const target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  });

  // this function is used to display each pokemon object to the console **now including API loadDetails
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      showModal(item);
    });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal,
    hideModal: hideModal,
  };
})();

// functions are being called to actually display the data.
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
