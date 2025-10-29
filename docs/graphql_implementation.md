
# Documentation de l'implémentation GraphQL

Ce document explique en détail l'implémentation des résolveurs (`resolvers.ts`) et du schéma (`schema.ts`) GraphQL de notre application, avec un focus sur la syntaxe TypeScript pour les débutants.

## 1. Le Schéma GraphQL (`src/graphql/schema.ts`)

Le schéma est le contrat de votre API GraphQL. Il définit les types de données, les requêtes (Queries) et les modifications (Mutations) possibles.

### Syntaxe de Base

```typescript
export const typeDefs = `#graphql
  // ... votre schéma ici
`;
```

- **`export const typeDefs`**:
  - `export`: Ce mot-clé TypeScript (et JavaScript) rend la variable `typeDefs` accessible depuis d'autres fichiers de votre projet. C'est essentiel pour que notre serveur Apollo puisse l'importer.
  - `const typeDefs`: Nous déclarons une constante nommée `typeDefs`. Une constante ne peut pas être réassignée après sa déclaration.
  - `` `#graphql` ``: C'est un "Tagged Template Literal". C'est une fonctionnalité de JavaScript/TypeScript qui permet de passer une chaîne de caractères à une fonction (ici, `#graphql`). Dans notre cas, cela aide les outils de développement (comme l'extension Apollo GraphQL pour VS Code) à comprendre que cette chaîne de caractères contient du code GraphQL, ce qui active la coloration syntaxique et l'autocomplétion.

### Les Types (`type`)

Un type GraphQL définit la structure d'un objet que vous pouvez interroger.

```graphql
type User {
  id: ID!
  username: String!
  email: String!
  role: String!
}
```

- **`type User`**: Définit un nouveau type d'objet nommé `User`.
- **`id: ID!`**:
  - `id`: Le nom du champ.
  - `ID`: Le type de données. `ID` est un type scalaire spécial de GraphQL qui représente un identifiant unique.
  - `!`: Le point d'exclamation signifie que ce champ est **non-nul** (`non-nullable`). Une requête pour un `User` contiendra toujours un `id`.

### Les Requêtes (`Query`)

Le type `Query` est spécial : il définit tous les points d'entrée pour lire des données.

```graphql
type Query {
  # User
  users: [User!]!
  user(id: ID!): User
}
```

- **`users: [User!]!`**:
  - `users`: Le nom de la requête.
  - `[User!]`: Le type de retour est un tableau (`[]`) de `User`.
  - `User!`: Le `!` à l'intérieur des crochets signifie que chaque élément du tableau doit être un `User` (le tableau ne peut pas contenir de `null`).
  - `[User!]!`: Le `!` à l'extérieur signifie que la requête `users` retournera toujours un tableau (elle ne retournera jamais `null`). Le tableau peut être vide, mais pas `null`.
- **`user(id: ID!): User`**:
  - `user`: Le nom de la requête.
  - `(id: ID!)`: Définit un argument requis nommé `id` de type `ID`.
  - `User`: La requête retournera un seul objet `User` ou `null` si aucun utilisateur n'est trouvé avec cet `id`.

### Les Modifications (`Mutation`)

Le type `Mutation` définit les points d'entrée pour écrire ou modifier des données.

```graphql
type Mutation {
  # User
  createUser(username: String!, email: String!, password: String!, role: String): User!
  updateUser(id: ID!, username: String, email: String, role: String): User
  deleteUser(id: ID!): User
}
```

- **`createUser(...)`**:
  - Les arguments `username`, `email`, et `password` sont requis (`!`).
  - `role` est optionnel.
  - La mutation retournera le `User` qui vient d'être créé. Le `!` signifie qu'elle ne peut pas retourner `null`.
- **`updateUser(...)`**:
  - L'`id` est requis pour savoir quel utilisateur modifier.
  - Les autres arguments sont optionnels.
  - La mutation retourne le `User` mis à jour, ou `null` si l'utilisateur n'a pas été trouvé.

### Type Scalaire Personnalisé (`scalar`)

```graphql
scalar Date
```

GraphQL a des types scalaires de base (`Int`, `Float`, `String`, `Boolean`, `ID`). Si vous avez besoin d'un autre type de données atomique, comme une date, vous devez le déclarer comme `scalar`. La logique de conversion de ce type est définie dans les résolveurs.

## 2. Les Résolveurs (`src/graphql/resolvers.ts`)

Les résolveurs sont les "implémentations" de votre schéma. C'est une collection de fonctions qui expliquent à GraphQL comment récupérer les données pour chaque champ. La structure de l'objet `resolvers` doit correspondre exactement à la structure de votre schéma.

### Syntaxe de Base

```typescript
import { GraphQLContext } from './context.js';
// ... autres imports

export const resolvers = {
  // ... implémentations ici
};
```

- **`import { ... } from '...'`**: C'est la syntaxe TypeScript pour importer des modules. Nous importons nos modèles de base de données (`UserModel`, `ProfileModel`, etc.) et notre type de contexte.
- **`export const resolvers`**: Comme pour le schéma, nous exportons cet objet pour qu'il soit utilisable par notre serveur.

### Résolveurs de `Query`

```typescript
Query: {
  // User
  users: async () => await UserModel.find(),
  user: async (_: any, { id }: { id: string }) => await UserModel.findById(id),
},
```

- **`Query: { ... }`**: Cet objet contient les fonctions pour chaque champ défini dans le `type Query` du schéma.
- **`users: async () => ...`**: C'est une fonction fléchée asynchrone. `async` est nécessaire car nous interagissons avec une base de données, ce qui est une opération asynchrone.
  - `await UserModel.find()`: `await` met en pause l'exécution de la fonction jusqu'à ce que la promesse (`Promise`) de `UserModel.find()` soit résolue. `UserModel.find()` est une méthode de Mongoose (notre ORM pour MongoDB) qui récupère tous les documents de la collection `users`. Le résultat est ensuite retourné par GraphQL.
- **`user: async (_: any, { id }: { id: string }) => ...`**:
  - Une fonction résolveur reçoit 4 arguments : `(parent, args, context, info)`.
  - `_`: Le premier argument (`parent`) n'est pas utilisé ici, donc nous utilisons `_` comme convention pour l'ignorer. Le type `any` indique à TypeScript que nous ne nous soucions pas de son type.
  - `{ id }: { id: string }`: C'est le deuxième argument (`args`), qui est un objet contenant les arguments passés à la requête. Ici, nous utilisons la déstructuration d'objet pour extraire directement la propriété `id`. Le typage `{ id: string }` indique à TypeScript que l'objet `args` a une propriété `id` qui est une chaîne de caractères.
  - `await UserModel.findById(id)`: Nous utilisons l'`id` fourni pour trouver un utilisateur spécifique dans la base de données.

### Résolveurs de `Mutation`

```typescript
Mutation: {
  // User
  createUser: async (_: any, args: any) => {
    const newUser = new UserModel(args);
    return await newUser.save();
  },
  updateUser: async (_: any, { id, ...args }: any) => {
    return await UserModel.findByIdAndUpdate(id, args, { new: true });
  },
},
```

- **`createUser: async (_: any, args: any) => { ... }`**:
  - `args`: Ici, nous prenons tous les arguments passés à la mutation (`username`, `email`, etc.) dans un seul objet `args`.
  - `const newUser = new UserModel(args)`: Nous créons une nouvelle instance du modèle Mongoose `User` en lui passant directement les arguments. Mongoose va mapper les champs correspondants.
  - `return await newUser.save()`: Nous sauvegardons ce nouvel utilisateur dans la base de données. La méthode `.save()` retourne l'objet sauvegardé, que nous retournons ensuite.
- **`updateUser: async (_: any, { id, ...args }: any) => { ... }`**:
  - `{ id, ...args }`: Nous utilisons à la fois la déstructuration et la syntaxe "rest" (`...`). `id` est extrait dans sa propre variable, et `...args` rassemble toutes les *autres* propriétés (`username`, `email`, etc.) dans un nouvel objet nommé `args`.
  - `await UserModel.findByIdAndUpdate(id, args, { new: true })`: C'est une méthode Mongoose qui trouve un document par son `id` et le met à jour avec les données de l'objet `args`. L'option `{ new: true }` spécifie que nous voulons que la méthode retourne le document *après* sa mise à jour, et non avant.

### Résolveurs Relationnels

Parfois, un type a un champ qui est un autre type. GraphQL ne sait pas comment lier les deux, vous devez le lui dire.

```typescript
// Dans le schéma
type Project {
  // ... autres champs
  skills: [ProjectSkill!]
}

// Dans les résolveurs
Project: {
  skills: async (project: any) => await ProjectSkillModel.find({ project_id: project._id }),
},
```

- **`Project: { ... }`**: Cet objet contient les résolveurs pour les champs du `type Project`.
- **`skills: async (project: any) => ...`**:
  - Ce résolveur est appelé chaque fois que le champ `skills` d'un `Project` est demandé.
  - Le premier argument d'un résolveur de champ est l'objet parent. Ici, `project` est l'objet `Project` complet qui a été retourné par un résolveur parent (par exemple, la requête `project(id: ...)`).
  - `await ProjectSkillModel.find({ project_id: project._id })`: Nous utilisons l'ID du projet parent (`project._id`) pour trouver toutes les entrées correspondantes dans la collection `ProjectSkill`. C'est ainsi que la relation est établie.

### Résolveur de Scalaire Personnalisé (`Date`)

```typescript
Date: new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    // ...
  },
  parseValue(value) {
    // ...
  },
  parseLiteral(ast) {
    // ...
  },
}),
```

C'est ici que nous définissons la logique pour notre `scalar Date` :
- **`serialize(value)`**: Gère comment une donnée de type `Date` est envoyée **au client**. Nous la convertissons en un timestamp (un nombre).
- **`parseValue(value)`**: Gère comment une valeur `Date` est reçue **du client** via des variables GraphQL. Nous convertissons un nombre (timestamp) en un objet `Date`.
- **`parseLiteral(ast)`**: Gère comment une valeur `Date` est lue lorsqu'elle est écrite directement **dans la requête GraphQL** (par exemple, `myMutation(date: 1672531200000)`).

J'espère que cette explication détaillée vous aide à mieux comprendre le fonctionnement de GraphQL avec TypeScript dans ce projet !
