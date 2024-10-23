document.addEventListener('DOMContentLoaded', function() {
    const popupMenu = document.getElementById('popupMenu');
    const menuToggle = document.getElementById('menuToggle');
    const cards = document.querySelectorAll('.card, .popup-card');
    const mainContent = document.querySelector('.menu-main');
    const menuItems = document.querySelectorAll(".menu-aside a.card");

    menuItems.forEach(item => {
        item.addEventListener("click", function() {
            // Retirer la classe 'selected' de tous les éléments
            menuItems.forEach(i => i.classList.remove("selected"));
            // Ajouter la classe 'selected' à l'élément cliqué
            this.classList.add("selected");
        });
    });
    
    // Ouvre le menu contextuel quand l'icône est cliquée
    menuToggle.addEventListener('click', function() {
        popupMenu.style.display = 'block';
    });

    // Ferme le popup si on clique en dehors du popup ou sur un lien du menu
    document.addEventListener('click', function(event) {
        const isClickInside = popupMenu.contains(event.target) || menuToggle.contains(event.target);
        if (!isClickInside) {
            popupMenu.style.display = 'none';
        }
    });

    // Change le contenu principal lorsque l'on clique sur un menu
    // Fonction pour gérer la sélection du menu
function setActiveMenu() {
    const menuLinks = document.querySelectorAll('.menu-aside a');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Supprime la classe active de tous les liens
            menuLinks.forEach(item => item.classList.remove('active'));
            // Ajoute la classe active au lien cliqué
            this.classList.add('active');
        });
    });
}

// Appelle la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', setActiveMenu);

// Gérer l'état de l'élément actif au chargement de la page
const currentPath = window.location.pathname.split('/').pop(); // Obtenir le nom de la page actuelle
const activeLink = document.querySelector(`.menu-aside a[href="${currentPath}"]`);
if (activeLink) {
    activeLink.classList.add('active');
}

   
});
