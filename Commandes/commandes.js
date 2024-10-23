// Fonction pour afficher le popup lorsqu'on clique sur le bouton "Ajouter commande"
document.getElementById('ajouteCommandetBtn').addEventListener('click', function() {
    document.getElementById('popupajoutformul').style.display = 'block'; // Afficher le popup
});

// Fonction pour fermer le popup lorsqu'on clique sur l'icône de fermeture
document.getElementById('closePopupBtn').addEventListener('click', function() {
    document.getElementById('popupajoutformul').style.display = 'none'; // Masquer le popup
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Fonction pour obtenir la date du jour au format AAAA-MM-JJ
function setCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');  // Ajoute un zéro pour les mois < 10
    const day = String(today.getDate()).padStart(2, '0');  // Ajoute un zéro pour les jours < 10
    const formattedDate = `${year}-${month}-${day}`;

    document.getElementById('champsDate').value = formattedDate;  // Assigner la date du jour au champ
}

// Appeler cette fonction au chargement de la page ou lors de l'ouverture du popup
window.onload = function() {
    setCurrentDate();  // Lors du chargement de la page
    loadFinalList();   // Charger la liste finale depuis le localStorage
    attachClickEventToIcons();  // Attacher l'événement de clic aux icônes déjà présentes
};

// Tableau pour stocker les données temporaires
let tempData = [];
let finalList = [];

// Fonction pour charger la liste finale depuis le localStorage
// function loadFinalList() {
//     const storedList = localStorage.getItem('finalList');
//     if (storedList) {
//         finalList = JSON.parse(storedList);
//         finalList.forEach((item, index) => {
//             addItemToList(item.fournisseur, item.date, index);
//         });
//     }
// }
// Fonction pour charger la liste finale depuis le localStorage
function loadFinalList() {
    const storedList = localStorage.getItem('finalList');
    if (storedList) {
        finalList = JSON.parse(storedList);
        finalList.forEach((item, index) => {
            addItemToList(item.fournisseur, item.date, index);
        });

        // Afficher ou masquer le message en fonction de la présence d'éléments dans la liste
        toggleEmptyMessage(finalList.length === 0);
    } else {
        // Afficher le message s'il n'y a pas de données chargées
        toggleEmptyMessage(true);
    }
}

// Fonction pour afficher ou masquer le message vide
function toggleEmptyMessage(show) {
    const emptyMessage = document.getElementById('emptyMessage');
    if (show) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }
}


// function addItemToList(fournisseur, date, index) {
//     const listContainer = document.querySelector('.item-list');
//     const newListItem = document.createElement('li');
//     newListItem.className = 'list-item';
//     newListItem.innerHTML = `
//         <span class="left-text">${fournisseur}</span>
//         <span class="center-date">${date}</span>
//         <span class="right-icon" data-id="${index}"><i class="fas fa-eye"></i></span>
//     `;
//     listContainer.appendChild(newListItem);
//     attachClickEventToIcons();  // Réattacher l'événement de clic après l'ajout dynamique
// }

// Fonction pour ajouter un élément à la liste et gérer l'affichage du message
function addItemToList(fournisseur, date, index) {
    const listContainer = document.querySelector('.item-list');
    const newListItem = document.createElement('li');
    newListItem.className = 'list-item';
    newListItem.innerHTML = `
        <span class="left-text">${fournisseur}</span>
        <span class="center-date">${date}</span>
        <span class="right-icon" data-id="${index}"><i class="fas fa-eye"></i></span>
    `;
    listContainer.appendChild(newListItem);
    attachClickEventToIcons();  // Réattacher l'événement de clic après l'ajout dynamique

    // Vérifier si la liste est vide après l'ajout
    toggleEmptyMessage(finalList.length === 0);
}

function clearFields() {
    document.getElementById('champsDesignation').value = '';
    document.getElementById('champsVariete').value = '';
    document.getElementById('champsQuantite').value = '';
    document.getElementById('champsUnite').value = '';
}

// Fonction pour afficher le popup lorsqu'une icône est cliquée
function showPopup(event) {
    const itemId = event.currentTarget.getAttribute('data-id');
    console.log("L'élément cliqué a l'ID:", itemId);

    // Sauvegarder l'ID de l'élément sélectionné dans une variable globale ou sessionStorage
    sessionStorage.setItem('selectedItemId', itemId);

    // Afficher le popup
    document.getElementById('actionPopup').style.display = 'block';
}

// Gestion du bouton "Voir Détail" dans le popup
document.getElementById('voirDetailBtn').addEventListener('click', function() {
    const selectedItemId = sessionStorage.getItem('selectedItemId');
    if (selectedItemId) {
        window.location.href = `detailsPage.html?id=${selectedItemId}`;
    } else {
        alert("Aucun élément sélectionné.");
    }
});

// Fonction pour attacher l'événement de clic aux icônes dynamiques
function attachClickEventToIcons() {
    const rightIcons = document.querySelectorAll('.right-icon');
    rightIcons.forEach(icon => {
        icon.addEventListener('click', showPopup);
    });
}

// Fonction pour fermer le popup
function closePopup() {
    document.getElementById('actionPopup').style.display = 'none';
}

// Fonction pour ajouter les données actuelles aux données temporaires
function saveCurrentData() {
    const designation = document.getElementById('champsDesignation').value;
    const variete = document.getElementById('champsVariete').value;
    const quantite = document.getElementById('champsQuantite').value;
    const unite = document.getElementById('champsUnite').value;

    if (designation && quantite && unite) {
        const currentData = {
            designation: designation,
            variete: variete || '',  // La variété est facultative
            quantite: quantite,
            unite: unite
        };

        tempData.push(currentData);
        clearFields(); // Vider les champs après sauvegarde
    } else {
        alert("Veuillez remplir les champs obligatoires.");
    }
}

// Gestion du bouton "Suivant"
document.getElementById('suivantBtnCommand').addEventListener('click', function() {
    saveCurrentData();
});

// Gestion du bouton "Enregistrer"
document.getElementById('enregistrerBtnCommand').addEventListener('click', function() {
    saveCurrentData(); // Sauvegarder les données actuelles avant d'enregistrer

    const fournisseur = document.getElementById('champsFournisseur').value;
    const date = document.getElementById('champsDate').value;

    if (fournisseur) {
        const finalData = {
            fournisseur: fournisseur,
            date: date,
            details: [...tempData]  // Copier les données temporaires dans la liste finale
        };

        finalList.push(finalData);
        localStorage.setItem('finalList', JSON.stringify(finalList));

        addItemToList(fournisseur, date, finalList.length - 1);  // Ajouter l'élément à la liste

        tempData = [];  // Réinitialiser les données temporaires
        document.getElementById('popupajoutformul').style.display = 'none'; // Fermer le popup
    } else {
        alert("Veuillez remplir le champ Fournisseur.");
    }
});
// Fonction pour fermer le popup(Sélectionnez une option)
function closePopup() {
    document.getElementById('actionPopup').style.display = 'none';
}

// Ajouter l'écouteur d'événement au bouton de fermeture
document.getElementById('closePopupAction').addEventListener('click', closePopup);


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 // Afficher le popup de confirmation lorsqu'on clique sur le bouton "Supprimer" dans le popup d'options
 document.getElementById('supprimerBtn').addEventListener('click', function() {
    document.getElementById('popupConfirmation').style.display = 'block'; // Afficher le popup de confirmation
});

// Fermer les deux popups et supprimer l'élément sélectionné lorsque "Supprimer" est confirmé
document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    // Récupérer l'ID de l'élément sélectionné
    const selectedItemId = sessionStorage.getItem('selectedItemId');

    if (selectedItemId) {
        // Supprimer l'élément de la liste (tu peux ajuster cette logique pour correspondre à ton besoin)
        const itemList = document.querySelector('.item-list');
        const selectedItem = itemList.querySelector(`.right-icon[data-id="${selectedItemId}"]`).parentElement;
        selectedItem.remove();

        // Supprimer l'élément de la liste finale (si tu gères une liste globale)
        finalList.splice(selectedItemId, 1);
        localStorage.setItem('finalList', JSON.stringify(finalList));
    }

    // Fermer les deux popups
    document.getElementById('popupConfirmation').style.display = 'none';
    document.getElementById('actionPopup').style.display = 'none';
});

// Fermer seulement le popup de confirmation si l'utilisateur clique sur "Annuler"
document.getElementById('cancelDeleteBtn').addEventListener('click', function() {
    document.getElementById('popupConfirmation').style.display = 'none'; // Masquer le popup de confirmation
});

