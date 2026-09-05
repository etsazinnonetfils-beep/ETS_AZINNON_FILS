# PROJECT_STATUS

## 1. Vue d’ensemble

Ce dépôt contient un backend Node.js/Express + Prisma + PostgreSQL pour la gestion d’ETS AZINNON & FILS, avec un frontend Vite React côté client.

### Backend
- Framework : Express 5
- ORM : Prisma 6.19.3
- Authentification : JWT + bcrypt
- Validation : Zod
- Sécurité : Helmet, CORS, rate limit
- Tests : Jest + Supertest

### Frontend
- Framework : React + Vite
- Composants principaux : pages de login, motos, clients, ventes, paiements, dashboard, rapports, etc.

---

## 2. Architecture de l’API

### Routage principal
- [backend/src/routes/index.js](backend/src/routes/index.js)
  - `/api/auth`
  - `/api/utilisateurs`
  - `/api/motos`
  - `/api/clients`
  - `/api/ventes`

### Modules backend
- Authentification : [backend/src/routes/auth.routes.js](backend/src/routes/auth.routes.js), [backend/src/controllers/auth.controller.js](backend/src/controllers/auth.controller.js), [backend/src/services/auth.service.js](backend/src/services/auth.service.js)
- Utilisateurs : [backend/src/routes/utilisateurs.routes.js](backend/src/routes/utilisateurs.routes.js), [backend/src/controllers/utilisateurs.controller.js](backend/src/controllers/utilisateurs.controller.js), [backend/src/services/utilisateurs.service.js](backend/src/services/utilisateurs.service.js)
- Motos : [backend/src/routes/motos.routes.js](backend/src/routes/motos.routes.js), [backend/src/controllers/motos.controller.js](backend/src/controllers/motos.controller.js), [backend/src/services/motos.service.js](backend/src/services/motos.service.js)
- Clients : [backend/src/routes/clients.routes.js](backend/src/routes/clients.routes.js), [backend/src/controllers/clients.controller.js](backend/src/controllers/clients.controller.js), [backend/src/services/clients.service.js](backend/src/services/clients.service.js)
- Ventes : [backend/src/routes/ventes.routes.js](backend/src/routes/ventes.routes.js), [backend/src/controllers/ventes.controller.js](backend/src/controllers/ventes.controller.js), [backend/src/services/ventes.service.js](backend/src/services/ventes.service.js)

---

## 3. Sécurité et validation

### Sécurité réellement présente
- Authentification JWT dans [backend/src/middleware/auth.middleware.js](backend/src/middleware/auth.middleware.js)
- Rôles gérés par `authorizeRoles`
- Hashage des mots de passe avec bcrypt dans [backend/src/services/auth.service.js](backend/src/services/auth.service.js) et [backend/src/services/utilisateurs.service.js](backend/src/services/utilisateurs.service.js)
- Validation des entrées via Zod dans [backend/src/middleware/validation.middleware.js](backend/src/middleware/validation.middleware.js)
- Protection HTTP globale via Helmet, CORS, rate limit dans [backend/src/app.js](backend/src/app.js)

### Point de vigilance
- La route ventes est enregistrée dans [backend/src/routes/index.js](backend/src/routes/index.js) sans middleware d’authentification global. Elle accepte seulement une validation de body, mais elle n’est pas protégée par un token requis.

---

## 4. Prisma et migrations

### Schéma principal
Le schéma Prisma principal est défini dans [backend/prisma/schema.prisma](backend/prisma/schema.prisma).

Modèles principaux observés :
- `Utilisateur`
- `Client`
- `Fournisseur`
- `Marque`
- `Moto`
- `Piece`
- `Accessoire`
- `Bus`
- `Location`
- `Vente`
- `Paiement`
- `CaisseJournal`
- `Document`
- `StockMouvement`
- `Achat`

### Migration
Les migrations présentes sont :
- [backend/prisma/migrations/20260723095547_init/migration.sql](backend/prisma/migrations/20260723095547_init/migration.sql)
- [backend/prisma/migrations/20260723100413_base_complete/migration.sql](backend/prisma/migrations/20260723100413_base_complete/migration.sql)

### Observation de cohérence
La génération Prisma a été lancée avec succès via `npm run generate`.

Cependant, lors d’un appel HTTP réel sur `/api/ventes`, la requête a échoué avec une erreur Prisma de type `P2022` :
- `Invalid prisma.client.findUnique() invocation`
- `The column colonne does not exist in the current database`

Cela indique un problème de cohérence entre le schéma Prisma utilisé par l’application et l’état réel de la base PostgreSQL, ou un schéma de migration non aligné avec le client généré.

---

## 5. Vérifications exécutées

### Vérification réussie
- `npm run generate` → succès
- `npm test` → démarrage du runner Jest jusqu’à `RUNS tests/ventes.test.js`, puis blocage / non-achèvement propre du processus

### Vérification observée
- Requête HTTP directe vers `/api/ventes` → réponse `500` avec erreur Prisma `P2022`
- Le test de vente ne termine pas proprement dans le runner actuel, ce qui confirme un blocage de cycle de test / handle ouvert ou un conflit de mock/Prisma non résolu

---

## 6. Dépendances et code mort

### Dépendances présentes
Dans [backend/package.json](backend/package.json), les dépendances critiques sont bien présentes :
- `@prisma/client`
- `express`
- `jsonwebtoken`
- `bcrypt`
- `zod`
- `helmet`
- `cors`
- `express-rate-limit`

### Dépendances ou fichiers déjà à considérer comme “dead files”
Les artefacts temporaires suivants ont été identifiés comme des fichiers de debug non stables :
- `backend/temp_check.js`
- `backend/temp_run_npm_test.js`
- `backend/temp_cmd_test.txt`
- `backend/temp_async_test.txt`

Ces fichiers sont des artefacts de diagnostic et n’appartiennent pas au cœur du backend fonctionnel.

---

## 7. Statut global

### État actuel
- Backend structurellement présent et cohérent sur les modules principaux
- Auth, utilisateurs, motos, clients et ventes mis en place
- Validation Zod et contrôle d’accès JWT présents
- Problème de vérification observable sur la partie ventes / Prisma / migration

### État recommandé pour la suite
1. Corriger le décalage Prisma / base de données pour la table `Client` et les appels `findUnique` liés à la clé `telephone`.
2. Refaire un test unitaire ciblé sur la route vente après correction de l’environnement Prisma.
3. Ajouter une protection authentifiée explicite sur les routes de vente si l’usage métier le requiert.
4. Nettoyer définitivement les artefacts de debug restés dans le dépôt.

---

## 8. Commandes de référence

### Installation et exécution
- `npm install`
- `npm run start`
- `npm run dev`
- `npm test`
- `npm run generate`
- `npx prisma migrate status`

### Variables d’environnement
- `DATABASE_URL`
- `PORT`
- `API_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

---

## 9. Conclusion

Le backend a une base structurelle correcte et les composants principaux sont visibles dans l’architecture. Le point bloquant reste la cohérence entre le schéma Prisma, les migrations et l’instance PostgreSQL réellement interrogée, surtout sur le flux de vente et les recherches de client par téléphone.
