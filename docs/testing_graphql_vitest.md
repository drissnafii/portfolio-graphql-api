
# Guide de Test pour une API GraphQL avec Vitest et Apollo Server

Ce document explique comment mettre en place un environnement de test moderne avec Vitest et comment écrire des tests pour vos résolveurs et votre schéma GraphQL.

## 1. Pourquoi Vitest ?

Vitest est un framework de test de nouvelle génération, conçu pour être rapide et simple à configurer, surtout dans les projets utilisant Vite, mais il fonctionne parfaitement sans Vite également. Il est compatible avec l'API de Jest (les `describe`, `it`, `expect` que vous connaissez peut-être déjà), ce qui rend la transition facile.

## 2. Installation des Dépendances

Nous allons installer Vitest et `@apollo/server-testing`, qui nous aidera pour les tests d'intégration.

Exécutez la commande suivante pour installer les dépendances de développement :

```bash
pnpm add -D vitest @apollo/server-testing
```

- **`vitest`**: Le framework de test ultra-rapide.
- **`@apollo/server-testing`**: Bibliothèque d'aide pour les tests d'intégration d'Apollo Server (fonctionne parfaitement avec Vitest).

## 3. Configuration de Vitest

Créez un fichier de configuration pour Vitest à la racine de votre projet. Nommez-le `vitest.config.ts` et ajoutez-y le contenu suivant :

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Pour utiliser describe, it, expect sans les importer
    environment: 'node', // Spécifie l'environnement de test
    // Permet de simuler les modules de manière similaire à Jest
    mockReset: true,
  },
});
```

Ensuite, mettez à jour le script de test dans votre fichier `package.json` :

```json
// package.json
"scripts": {
  // ... vos autres scripts
  "test": "vitest",
  "test:ui": "vitest --ui" // Optionnel, pour une interface graphique
},
```

## 4. Tester les Résolveurs (Test Unitaire)

Le test unitaire d'un résolveur avec Vitest est très similaire à Jest. Nous allons isoler une fonction de résolveur et simuler ses dépendances.

**Structure de Fichier :**
`src/graphql/resolvers.test.ts`

**Exemple de Test Unitaire avec Vitest :**

```typescript
// src/graphql/resolvers.test.ts
import { describe, it, expect, vi } from 'vitest';
import { resolvers } from './resolvers.js';
import { UserModel } from '../models/User.js';

// On simule le module UserModel avec vi.mock()
vi.mock('../models/User.js');

describe('[Resolvers] Query', () => {

  it('le résolveur "user" doit appeler UserModel.findById avec le bon ID', async () => {
    // 1. ARRANGE (Préparation)
    const mockUser = {
      id: '1',
      username: 'TestUser',
      email: 'test@example.com',
      role: 'USER',
    };

    // On configure le mock pour qu'il retourne notre utilisateur de test
    // Notez la syntaxe légèrement différente de Jest
    vi.mocked(UserModel.findById).mockResolvedValue(mockUser as any);

    const args = { id: '1' };

    // 2. ACT (Action)
    const result = await resolvers.Query.user(null, args);

    // 3. ASSERT (Vérification)
    expect(UserModel.findById).toHaveBeenCalledTimes(1);
    expect(UserModel.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockUser);
  });

});
```

**Explication des différences avec Jest :**
- **`import { describe, it, expect, vi } from 'vitest'`**: On importe les globales de test depuis `vitest`.
- **`vi.mock(...)`**: C'est l'équivalent de `jest.mock()` pour simuler un module.
- **`vi.mocked(...)`**: C'est un utilitaire pour typer correctement une fonction mockée et accéder à ses méthodes de simulation (`.mockResolvedValue`, etc.).

## 5. Tester le Schéma et les Résolveurs (Test d'Intégration)

Le test d'intégration reste conceptuellement le même : on crée un serveur Apollo en mémoire et on lui envoie des requêtes. La bibliothèque `@apollo/server-testing` est agnostique et fonctionne sans problème.

**Exemple de Test d'Intégration avec Vitest :**

```typescript
// src/graphql/resolvers.integration.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApolloServer } from '@apollo/server';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { UserModel } from '../models/User.js';

// Simuler les dépendances
vi.mock('../models/User.js');

describe('[Integration] API GraphQL', () => {
  let testServer: ApolloServer;

  beforeEach(() => {
    testServer = new ApolloServer({
      typeDefs,
      resolvers,
    });
    // On s'assure que les mocks sont "propres" avant chaque test
    vi.resetAllMocks();
  });

  it('doit retourner un utilisateur pour la query "user"', async () => {
    // 1. ARRANGE
    const mockUser = {
      id: '1',
      username: 'TestUser',
      email: 'test@example.com',
      role: 'USER',
    };
    vi.mocked(UserModel.findById).mockResolvedValue(mockUser as any);

    const query = `
      query GetUser($userId: ID!) {
        user(id: $userId) {
          id
          username
        }
      }
    `;

    // 2. ACT
    const response = await testServer.executeOperation({
      query: query,
      variables: { userId: '1' },
    });

    // 3. ASSERT
    expect(response.body.kind).toBe('single');
    if (response.body.kind === 'single') {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.user.username).toBe('TestUser');
    }
  });
});
```

**Explication :**
- La structure est quasiment identique à l'exemple avec Jest.
- On utilise `beforeEach` pour initialiser le serveur et `vi.resetAllMocks()` pour s'assurer que les simulations d'un test n'interfèrent pas avec un autre.
- L'appel à `testServer.executeOperation` et la structure de la réponse sont exactement les mêmes.

## Pour Lancer les Tests

Une fois vos fichiers de test créés (assurez-vous qu'ils se terminent par `.test.ts` ou `.spec.ts`), exécutez simplement la commande :

```bash
pnpm test
```

Ou pour une expérience plus interactive, lancez l'interface utilisateur de Vitest :

```bash
pnpm run test:ui
```

Cela ouvrira une page dans votre navigateur où vous pourrez voir les résultats de vos tests en temps réel.
