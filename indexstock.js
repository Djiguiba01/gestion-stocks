class Product {
    constructor(designation, variete, quantite, unite) {
      this.designation = designation;
      this.variete = variete;
      this.quantite = quantite;
      this.unite = unite;
    }
  }
  
  let productList = [];
  let selectedProductIndex = null;
  
  document.addEventListener('DOMContentLoaded', () => {
    const addProductBtn = document.getElementById('addProductBtn');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeIcon = document.getElementById('closeIcon');
    const deleteBtn = document.getElementById('deleteBtn');
    const popupOverlay = document.getElementById('popupOverlay');
    const confirmDeleteOverlay = document.getElementById('confirmDeleteOverlay');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const productListEl = document.getElementById('productList');
    

    const searchInput = document.getElementById('searchInput');
    const noResultsMessage = document.getElementById('noResultsMessage');

    // Écouter les entrées dans la barre de recherche
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        filterProducts(searchTerm);
    });

    function filterProducts(searchTerm) {
        const filteredProducts = productList.filter(product => 
            product.designation.toLowerCase().includes(searchTerm) || 
            product.variete.toLowerCase().includes(searchTerm)
        );

        // Si aucun produit ne correspond, afficher un message
        if (filteredProducts.length === 0) {
            productListEl.innerHTML = '';
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
            renderProductList(filteredProducts);
        }
    }

    function renderProductList(products = productList) {
        productListEl.innerHTML = products.length
            ? products.map(
                (product, index) => `
                    <li onclick="editProduct(${index})">
                        <span>${product.designation}</span>
                        <span>${product.variete}</span>
                        <span>${product.quantite}</span>
                        <span>${product.unite}</span>
                    </li>`
              ).join('')
            : '<p>Aucun produit ajouté.</p>';
    }

    // Initialisation
    renderProductList();

  
    // Load saved products from localStorage
    const savedProducts = localStorage.getItem('productList');
    if (savedProducts) {
      productList = JSON.parse(savedProducts);
      renderProductList();
    }
  
    addProductBtn.addEventListener('click', () => {
      openPopup();
    });
  
    submitBtn.addEventListener('click', () => {
      handleSubmit();
    });
  
    cancelBtn.addEventListener('click', () => {
      closePopup();
    });
  
    deleteBtn.addEventListener('click', () => {
      confirmDelete();
    });
  
    confirmDeleteBtn.addEventListener('click', () => {
      deleteProduct();
    });
  
    cancelDeleteBtn.addEventListener('click', () => {
      closeConfirmDeletePopup();
    });
  
    function renderProductList() {
      productListEl.innerHTML = productList.length
        ? productList.map(
            (product, index) => `
          <li onclick="editProduct(${index})">
            <span>${product.designation}</span>
            <span>${product.variete}</span>
            <span>${product.quantite}</span>
            <span>${product.unite}</span>
          </li>`
          ).join('')
        : '<p>Aucun produit ajouté.</p>';
    }
  
    window.editProduct = (index) => {
      selectedProductIndex = index;
      const product = productList[index];
      document.getElementById('designationInput').value = product.designation;
      document.getElementById('varieteInput').value = product.variete;
      document.getElementById('quantiteInput').value = product.quantite;
      document.getElementById('uniteInput').value = product.unite;
      openPopup(true);
    };
  
    function handleSubmit() {
        const designation = document.getElementById('designationInput').value.trim();
        const variete = document.getElementById('varieteInput').value.trim();
        const quantite = document.getElementById('quantiteInput').value.trim();
        const unite = document.getElementById('uniteInput').value.trim();
        
        // Réinitialiser les messages d'erreur
        document.getElementById('designationError').textContent = '';
        document.getElementById('varieteError').textContent = '';
        document.getElementById('quantiteError').textContent = '';
        document.getElementById('uniteError').textContent = '';
        
        let isValid = true;
      
        // Vérifier chaque champ
        if (designation === '') {
          document.getElementById('designationError').textContent = 'Veuillez entrer une désignation.';
          isValid = false;
        }
        if (variete === '') {
          document.getElementById('varieteError').textContent = 'Veuillez entrer une variété.';
          isValid = false;
        }
        if (quantite === '') {
          document.getElementById('quantiteError').textContent = 'Veuillez entrer une quantité.';
          isValid = false;
        }
        if (unite === '') {
          document.getElementById('uniteError').textContent = 'Veuillez sélectionner une unité.';
          isValid = false;
        }
      
        // Si tous les champs sont valides, continuer avec l'ajout ou la modification
        if (isValid) {
          const newProduct = new Product(designation, variete, quantite, unite);
      
          if (selectedProductIndex !== null) {
            productList[selectedProductIndex] = newProduct;
          } else {
            productList.push(newProduct);
          }
      
          localStorage.setItem('productList', JSON.stringify(productList));
          renderProductList();
          closePopup();
        }
      }
      
  
    function confirmDelete() {
      confirmDeleteOverlay.style.display = 'flex';
    }
  
    function deleteProduct() {
      productList.splice(selectedProductIndex, 1);
      localStorage.setItem('productList', JSON.stringify(productList));
      renderProductList();
      closePopup();
      closeConfirmDeletePopup();
    }
  
    function closePopup() {
      popupOverlay.style.display = 'none';
      resetForm();
    }
  
   function openPopup(estEdition = false) {
  popupOverlay.style.display = 'flex';

  if (estEdition) {
    document.getElementById('popupTitle').textContent = 'MODIFIER UN PRODUIT';
    deleteBtn.style.display = 'inline';  // Afficher le bouton supprimer lors de la modification
    cancelBtn.style.display = 'none';    // Cacher le bouton annuler lors de la modification
    closeIcon.style.display='inline';

  } else {
    document.getElementById('popupTitle').textContent = 'AJOUTER UN PRODUIT';
    deleteBtn.style.display = 'none';    // Cacher le bouton supprimer lors de l'ajout
    cancelBtn.style.display = 'inline';  // Afficher le bouton annuler lors de l'ajout
    closeIcon.style.display='none';
  }
}

  
    function closeConfirmDeletePopup() {
      confirmDeleteOverlay.style.display = 'none';
    }
  
    function resetForm() {
      selectedProductIndex = null;
      document.getElementById('designationInput').value = '';
      document.getElementById('varieteInput').value = '';
      document.getElementById('quantiteInput').value = '';
      document.getElementById('uniteInput').value = '';
    }

    
    document.getElementById("closeIcon").addEventListener("click", function() {
      document.getElementById("popupOverlay").style.display = "none";
    });
    

});
