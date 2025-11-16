# CodeFolio - API de Gestion de Portfolio (GraphQL)

![GitHub Actions CI](https://github.com/Drissnafii/portfolio-graphql-api/actions/workflows/ci.yml/badge.svg)

Une API GraphQL backend robuste, sécurisée et moderne conçue pour alimenter un site web de portfolio personnel. Construite avec Node.js, TypeScript, Apollo Server et MongoDB, et entièrement conteneurisée avec Docker.

---

## ✨ Fonctionnalités Principales

*   **API GraphQL Complète** : Un seul endpoint pour toutes les opérations de données, avec un schéma fortement typé.
*   **Authentification JWT** : Système de connexion sécurisé pour l'administrateur basé sur les JSON Web Tokens.
*   **Contrôle d'Accès par Rôle (RBAC)** : Les mutations de création, mise à jour et suppression sont protégées et accessibles uniquement par les utilisateurs avec le rôle `admin`.
*   **CRUD Complet** : Gestion totale du Profil, des Projets, des Compétences et des Expériences.
*   **Validation des Entrées** : Validation rigoureuse des données côté serveur avec `zod` pour garantir l'intégrité des données.
*   **Entièrement Testé** : Suite de tests d'intégration et unitaires avec `vitest` pour garantir la fiabilité et la non-régression.
*   **Prêt pour le Déploiement** : Environnement de développement et de production cohérent grâce à Docker et Docker Compose.
*   **CI/CD** : Pipeline d'intégration continue avec GitHub Actions pour automatiser les tests et le linting à chaque push.

---

## 🛠️ Stack Technique

*   **Backend** : Node.js, Express.js
*   **API** : GraphQL, Apollo Server v5
*   **Langage** : TypeScript
*   **Base de Données** : MongoDB (avec Mongoose)
*   **Authentification** : JWT (jsonwebtoken), bcrypt
*   **Validation** : Zod
*   **Tests** : Vitest, Supertest, MongoDB Memory Server
*   **Conteneurisation** : Docker, Docker Compose
*   **CI/CD** : GitHub Actions
*   **Qualité de Code** : ESLint, Prettier

---

## 🚀 Démarrage Rapide (Installation)

Pour lancer ce projet en local, vous aurez besoin de Docker et de Docker Compose.

1.  **Clonez le repository :**
    ```bash
    git clone https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
    cd VOTRE_REPO
    ```

2.  **Configurez les variables d'environnement :**
    Créez un fichier `.env` à la racine du projet en copiant le modèle `.env.example`.
    ```bash
    cp .env.example .env
    ```
    *Le fichier `.env` est déjà configuré pour l'environnement Docker. Vous pouvez changer la `JWT_SECRET` pour une chaîne plus sécurisée si vous le souhaitez.*

3.  **Lancez l'environnement avec Docker Compose :**
    Cette commande va construire l'image de l'API, démarrer le conteneur de l'API et celui de la base de données MongoDB.
    ```bash
    docker compose up --build
    ```

4.  **Votre API est prête !**
    *   L'endpoint GraphQL est accessible à `http://localhost:4000/graphql`
    *   Vous pouvez interagir avec l'API via le Sandbox Apollo Studio directement dans votre navigateur.

5.  **Créez l'utilisateur admin :**
    Pour pouvoir vous connecter et accéder aux mutations protégées, créez un utilisateur admin :
    ```bash
    ./create-admin.sh "VotreMotDePasse123!"
    ```
    
    Identifiants par défaut :
    - Email : `admin@codefolio.com`
    - Password : celui que vous avez défini dans la commande ci-dessus
    
    📚 Pour plus de détails, consultez [docs/admin-user-management.md](docs/admin-user-management.md)

---

## 🧪 Lancer les Tests

Pour exécuter la suite de tests automatisés :
```bash
pnpm test
```
Pour lancer les tests en mode "watch" (se relancent à chaque modification) :
```bash
pnpm test:watch
```
---

## 📝 Exemples de Requêtes GraphQL

### Obtenir toutes les données du portfolio
```graphql
query GetFullPortfolio {
  getPortfolio {
    profile {
      firstName
      lastName
    }
    projects {
      title
    }
  }
}
```

### Se connecter en tant qu'admin
```graphql
mutation LoginAsAdmin {
  login(email: "admin@example.com", password: "password123") {
    token
  }
}
```
> **Note :** Pour les mutations protégées, ajoutez un en-tête HTTP `Authorization` avec la valeur `Bearer VOTRE_TOKEN`.

Ce fichier `README.md` est maintenant prêt à la racine de votre projet. N'oubliez pas de remplacer `VOTRE_USERNAME` et `VOTRE_REPO` par vos informations GitHub pour que le badge de statut fonctionne.

Félicitations pour avoir atteint cette étape de finalisation !

<!--
[PROMPT_SUGGESTION]Comment puis-je créer une collection Postman pour mon API GraphQL ?[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Explique-moi comment fonctionne le fichier `docker-compose.yml` de ce projet.[/PROMPT_SUGGESTION]
