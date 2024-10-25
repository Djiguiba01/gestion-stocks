document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addButton');
    const popupForm = document.getElementById('popupForm');
    const livraisonForm = document.getElementById('livraisonForm');
    const cancelButton = document.getElementById('cancelButton');
    const livraisonList = document.getElementById('livraisons-list');
    const dateField = document.getElementById('date');
    const suivantButton = document.getElementById('suivantButton');
    const overlay = document.getElementById('overlay');

    

// Ouvrir le popup et l'overlay
    addButton.addEventListener('click', function() {
        popupForm.style.display = 'block';
        overlay.classList.add('active'); // Activer l'overlay
    });
    

    // Fermer le popup et l'overlay
    cancelButton.addEventListener('click', function() {
        popupForm.style.display = 'none';
        overlay.classList.remove('active'); // Désactiver l'overlay
    });

    // Fermer le popup si on clique sur l'overlay
    overlay.addEventListener('click', function() {
        popupForm.style.display = 'none';
        overlay.classList.remove('active'); // Désactiver l'overlay
    });

// ::::::::::::::::::::



    // Afficher la date du jour automatiquement
    const currentDate = new Date().toLocaleDateString('fr-CA');
    dateField.value = currentDate;

    // Charger les livraisons depuis le localStorage
    let livraisons = JSON.parse(localStorage.getItem('livraisons')) || [];
    displayLivraisons();

    // Objet temporaire pour la livraison en cours
    let currentLivraison = {
        destination: '',
        date: currentDate,
        articles: [] // Liste des articles ajoutés
    };

    // Ouvrir le popup quand on clique sur le bouton "Ajouter"
    addButton.addEventListener('click', function() {
        popupForm.style.display = 'block';
    });

    // Fermer le popup quand on clique sur "Annuler"
    cancelButton.addEventListener('click', function() {
        popupForm.style.display = 'none';
    });

    // Bouton "Suivant" pour ajouter un article à la livraison
    suivantButton.addEventListener('click', function() {
        addCurrentArticleToList(); // Ajouter l'article actuel
    });

    // Enregistrer la livraison complète quand on soumet le formulaire
    livraisonForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Ajouter l'article en cours avant l'enregistrement
        addCurrentArticleToList();

        // Ajouter la livraison à la liste principale
        currentLivraison.destination = document.getElementById('destination').value;
        livraisons.push(currentLivraison);
        localStorage.setItem('livraisons', JSON.stringify(livraisons));

        // Réinitialiser le formulaire et l'état de la livraison
        popupForm.style.display = 'none';
        livraisonForm.reset();
        dateField.value = currentDate;
        currentLivraison = { destination: '', date: currentDate, articles: [] };

        // Afficher les livraisons mises à jour
        displayLivraisons();
    });

    // Fonction pour afficher les livraisons
    // function displayLivraisons() {
    //     livraisonList.innerHTML = '';

    //     livraisons.forEach((livraison) => {
    //         const li = document.createElement('li');
    //         li.textContent = `${livraison.destination} - ${livraison.date}`;
    //         livraisonList.appendChild(li);

    //         li.addEventListener('click', function() {
    //             showLivraisonDetails(livraison);
    //         });
    //     });
    // }
    function displayLivraisons() {
        livraisonList.innerHTML = ''; // Réinitialise la liste
    
        if (livraisons.length === 0) {
            // Si la liste est vide, affiche un message dans une carte
            const card = document.createElement('div');
            card.className = 'cardaucuneliste'; // Applique la classe de la carte
            card.innerHTML = '<p>Ajouter une livraison...</p>';
            livraisonList.appendChild(card); // Ajoute la carte à la liste
        } else {
            // Sinon, affiche les livraisons
            livraisons.forEach((livraison) => {
                const li = document.createElement('li');
    
                // Crée un conteneur pour les éléments de livraison
                const container = document.createElement('div');
                container.style.display = 'flex'; // Applique display flex
                container.style.justifyContent = 'space-between'; // Espace entre les éléments
                container.style.alignItems = 'center'; // Centre verticalement les éléments
    
                // Crée des éléments pour la destination et la date
                const destination = document.createElement('span');
                destination.textContent = livraison.destination;
    
                const date = document.createElement('span');
                date.textContent = livraison.date;
    
                // Ajoute les éléments au conteneur
                container.appendChild(destination);
                container.appendChild(date);
    
                // Ajoute le conteneur à l'élément li
                li.appendChild(container);
    
                // Ajoute l'élément li à la liste
                livraisonList.appendChild(li);
    
                // Ajouter un événement de clic pour chaque livraison
                li.addEventListener('click', function() {
                    showLivraisonDetails(livraison);
                });
            });
        }
    }
    
    

    // Fonction pour ajouter l'article actuel à la liste
    function addCurrentArticleToList() {
        const designation = document.getElementById('designation').value;
        const variete = document.getElementById('variete').value;
        const quantite = document.getElementById('quantite').value;
        const unite = document.getElementById('unite').value;

        if (designation && quantite && unite) { // Vérifier si les champs requis sont remplis
            const article = {
                designation: designation,
                variete: variete,
                quantite: quantite,
                unite: unite
            };

            // Ajouter l'article à la livraison en cours
            currentLivraison.articles.push(article);

            // Réinitialiser les champs d'articles
            document.getElementById('designation').value = '';
            document.getElementById('variete').value = '';
            document.getElementById('quantite').value = '';
            document.getElementById('unite').value = '';
        }
    }

    // Variables pour le popup de détails
    const detailPopup = document.getElementById('detailPopup');
    const popupMessage = document.getElementById('popupMessage');
    const viewDetailButton = document.getElementById('viewDetailButton');
    const closeDetailPopup = document.getElementById('closeDetailPopup');

    // Variables pour le popup de confirmation de suppression
    const deleteConfirmationPopup = document.getElementById('deleteConfirmationPopup');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');

    let selectedLivraison; // Déclare la variable selectedLivraison au niveau global

    // Afficher les détails de la livraison dans le popup
    function showLivraisonDetails(livraison) {
        popupMessage.textContent = ` ${livraison.destination} - ${livraison.date}`;
        detailPopup.style.display = 'block';
        detailPopup.style.textAlign = 'center';
        selectedLivraison = livraison; // Stocker la livraison sélectionnée

        // Gérer le clic sur "Voir les détails"
        viewDetailButton.onclick = function() {
            // Rediriger vers une autre page
            window.location.href = `detailslivraisons.html?id=${livraison.destination}`; // Changez l'URL comme nécessaire
        };

        // Gérer le clic sur "Supprimer"
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.onclick = function() {
            // Afficher le popup de confirmation
            deleteConfirmationPopup.style.display = 'block';
        };

        // Gérer le clic sur le bouton de confirmation de suppression
        confirmDeleteButton.onclick = function() {
            // Code pour supprimer la livraison de la liste
            livraisons = livraisons.filter(l => l.destination !== selectedLivraison.destination);
            localStorage.setItem('livraisons', JSON.stringify(livraisons));
            displayLivraisons(); // Mettre à jour l'affichage
            detailPopup.style.display = 'none'; // Fermer le popup de détails
            deleteConfirmationPopup.style.display = 'none'; // Fermer le popup de confirmation
        };

        // Gérer le clic sur le bouton d'annulation de suppression
        cancelDeleteButton.onclick = function() {
            deleteConfirmationPopup.style.display = 'none'; // Fermer le popup de confirmation
        };

        // Gérer le clic sur le bouton de fermeture du popup de détails
        closeDetailPopup.onclick = function() {
            detailPopup.style.display = 'none'; // Fermer le popup de détails
        };

        // Optionnel: fermer le popup de confirmation si on clique en dehors
        window.onclick = function(event) {
            if (event.target === deleteConfirmationPopup) {
                deleteConfirmationPopup.style.display = 'none';
            }
        };
    }

    // Fermer le popup de détails
    closeDetailPopup.addEventListener('click', function() {
        detailPopup.style.display = 'none';
    });
});
