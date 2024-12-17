// Gestion du clic sur "Ajouter au panier"
document.getElementById('add-to-cart')?.addEventListener('click', function (e) {
    e.preventDefault(); // Empêcher le comportement par défaut (changer de page)

    // Produit à ajouter
    const produit = {
        nom: "SmartMed",
        prix: 99.99
    };

    // Récupérer le panier actuel depuis localStorage
    let panier = JSON.parse(localStorage.getItem('panier')) || [];

    // Ajouter le produit au panier
    panier.push(produit);

    // Sauvegarder le panier mis à jour dans localStorage
    localStorage.setItem('panier', JSON.stringify(panier));

    alert('Produit ajouté au panier !');
});

// Charger le panier sur la page "panier.html"
if (document.getElementById('panier-container')) {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const panierContainer = document.getElementById('panier-container');
    const totalElement = document.getElementById('total');

    // Vérifier si le panier est vide
    if (panier.length === 0) {
        panierContainer.innerHTML = '<p>Votre panier est vide.</p>';
    } else {
        let total = 0;

        // Afficher chaque produit dans le panier
        panier.forEach((produit, index) => {
            const produitElement = document.createElement('div');
            produitElement.innerHTML = `
                <p>${produit.nom} - ${produit.prix.toFixed(2)} €</p>
                <button onclick="supprimerProduit(${index})">Supprimer</button>
            `;
            panierContainer.appendChild(produitElement);
            total += produit.prix;
        });

        // Afficher le total
        totalElement.textContent = `Total : ${total.toFixed(2)} €`;
        // Enregistrer le total dans localStorage
        localStorage.setItem('totalPanier', total.toFixed(2)); // Sauvegarde du total dans localStorage
    }
}

// Fonction pour supprimer un produit
function supprimerProduit(index) {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    panier.splice(index, 1); // Supprimer le produit à l'index donné
    localStorage.setItem('panier', JSON.stringify(panier)); // Mettre à jour localStorage
    location.reload(); // Recharger la page pour mettre à jour l'affichage
}

// Fonction pour afficher l'alerte et vider le champ email
function showAlert(event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre immédiatement
    alert("Vous recevez un email de confirmation dans quelques secondes");
    
    // Vider le champ email
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.value = ''; // Réinitialise le champ à une chaîne vide
    }

    // Décommenter la ligne suivante pour soumettre le formulaire après l'alerte
    // document.querySelector('form').submit(); 
}

// Ajoute un écouteur d'événement pour le formulaire
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', showAlert);
    }
});

// Gestion du clic sur le bouton de paiement
document.getElementById('payment-button')?.addEventListener('click', function () {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    
    if (panier.length === 0) {
        alert("Votre panier est vide. Ajoutez des produits avant de procéder au paiement.");
    } else {
        // Redirige vers la page de paiement
        const total = localStorage.getItem('totalPanier');
        // Enregistrer le total dans localStorage pour l'utiliser sur la page de paiement
        localStorage.setItem('totalPanier', total);
        window.location.href = 'paiement.html'; // Remplacez par le chemin correct de votre page de paiement
    }
});

// Récupérer le total du panier et l'afficher
document.addEventListener('DOMContentLoaded', function() {
    const total = localStorage.getItem('totalPanier');
    const totalElement = document.getElementById('total'); // Assurez-vous d'avoir un élément avec cet ID dans votre HTML

    if (total) {
        totalElement.textContent = `Total à payer : ${total} €`; // Affiche le total dans l'élément
    } else {
        totalElement.textContent = "0.00 €"; // Si pas de total, afficher 0.00
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Récupérer le total du panier
    const total = parseFloat(localStorage.getItem('totalPanier')) || 0.00;

    // Afficher le total dans la page de paiement
    const cartTotalElement = document.getElementById('cart-total');
    const payButton = document.getElementById('pay-button');

    if (cartTotalElement) {
        cartTotalElement.textContent = `${total.toFixed(2)} €`; // Mise à jour du total avec €
    }

    if (payButton) {
        payButton.textContent = `Paiement ${total.toFixed(2)} €`; // Correction pour le bouton
    }

    // Gestion de la soumission du formulaire
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (total > 0) {
            alert(`Paiement de ${total.toFixed(2)} € effectué avec succès !`); // Correction de l'alerte
            localStorage.removeItem('panier'); // Vider le panier
            localStorage.removeItem('totalPanier'); // Supprimer le total
            window.location.href = 'index.html'; // Redirection vers une page de confirmation
        } else {
            alert("Votre panier est vide. Aucun paiement n'est possible.");
        }
    });

    // Ajouter un compte à rebours pour la session
    const countdownElement = document.getElementById('countdown');
    let sessionTime = 300; // 5 minutes en secondes

    function updateCountdown() {
        const minutes = Math.floor(sessionTime / 60);
        const seconds = sessionTime % 60;
        countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        sessionTime--;

        if (sessionTime < 0) {
            clearInterval(countdownInterval);
            alert("La session de paiement a expiré.");
            window.location.href = 'panier.html'; // Redirection vers le panier
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
});
