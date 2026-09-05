# BASE DE DONNÉES
## Logiciel de Gestion ETS AZINNON ET FILS

---

# TABLE 1 : UTILISATEURS

- id
- nom
- prénom
- téléphone
- email
- nom_utilisateur
- mot_de_passe
- rôle
- actif
- date_creation

---

# TABLE 2 : CLIENTS

- id
- nom
- prénom
- téléphone
- adresse
- profession
- type_piece
- numero_piece
- garant
- téléphone_garant
- date_creation

---

# TABLE 3 : MARQUES

- id
- nom_marque

---

# TABLE 4 : MODÈLES

- id
- marque
- modèle

---

# TABLE 5 : MOTOS

- id
- référence
- marque
- modèle
- couleur
- cylindrée
- numéro_châssis
- numéro_moteur
- année
- prix_achat
- frais
- prix_vente
- fournisseur
- date_entrée
- statut

---

# TABLE 6 : VENTES

- id
- client
- moto
- vendeur
- date
- type_vente
- montant_total
- acompte
- reste
- statut

---

# TABLE 7 : PAIEMENTS

- id
- vente
- date
- montant
- mode_paiement
- reçu

---

# TABLE 8 : BUS

- id
- immatriculation
- marque
- nombre_places
- statut

---

# TABLE 9 : LOCATIONS

- id
- client
- bus
- chauffeur
- destination
- date_depart
- date_retour
- prix
- statut

---

# TABLE 10 : DÉPENSES

- id
- libellé
- montant
- date
- catégorie

---

# TABLE 11 : RECETTES

- id
- origine
- montant
- date
