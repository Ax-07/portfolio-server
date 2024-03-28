# Backend Todo List API

Ce projet est une API pour une application de gestion de tâches (Todo List). Il a été conçu pour fournir toutes les fonctionnalités nécessaires pour créer, lire, mettre à jour et supprimer des tâches.

## Récupération du projet

Vous pouvez cloner le projet à partir de son [repository GitHub](https://github.com/Ax-07/backend-todo-list).

## Installation

Assurez-vous d'avoir Node.js et npm installés sur votre machine.

1. Clonez le repository : `git clone https://github.com/Ax-07/backend-todo-list.git`
2. Accédez au dossier du projet : `cd backend-todo-list`
3. Installez les dépendances : `npm install`
4. Lancer le server : `npm start`

## Technologies et bibliothèques utilisées

Ce projet a été développé en utilisant les technologies et bibliothèques suivantes :

- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express.js** : Framework pour construire l'API web.
- **Sequelize** : ORM pour interagir avec la base de données.
- **SQLite** : Système de gestion de base de données relationnelle utilisé pour stocker les données de l'application.
- **Swagger** : Utilisé pour la documentation de l'API.

## Utilisation

Pour démarrer le serveur, exécutez : `npm start`

## Traitement des images

Lorsqu'une image est téléchargée via le formulaire, le backend crée automatiquement trois versions différentes de l'image (desktop, tablette, mobile) au format webP avec une qualité à 80%. Ces versions sont stockées dans le tableau `images` du modèle Todo.

## Routes API

L'API fournit les routes suivantes pour gérer les tâches :

- **Création d'une tâche** : 
  - Méthode : `POST`
  - URL : `http://localhost:8050/api/todo`
  - Body : 
    ```json
    { 
      "title" : "titre", 
      "description" : "texte de description", 
      "status" : true ou false
    }
    ```

- **Récupération de toutes les tâches** :
  - Méthode : `GET`
  - URL : `http://localhost:8050/api/todo`

- **Récupération d'une tâche spécifique** :
  - Méthode : `GET`
  - URL : `http://localhost:8050/api/todo/{id}`

- **Mise à jour d'une tâche** :
  - Méthode : `PUT`
  - URL : `http://localhost:8050/api/todo/{id}`
  - Body : 
    ```json
    { 
      "title" : "nouveau titre", 
      "description" : "nouveau texte de description", 
      "status" : true ou false
    }
    ```

- **Suppression d'une tâche** :
  - Méthode : `DELETE`
  - URL : `http://localhost:8050/api/todo/{id}`

## Documentation API

La documentation de l'API est disponible via Swagger. Vous pouvez y accéder en lançant le serveur et en naviguant vers [http://localhost:8050/api-docs](http://localhost:8050/api-docs).