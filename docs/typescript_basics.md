
# Guide des Bases de TypeScript pour Débutants

Ce document est un guide complet pour les débutants qui souhaitent comprendre les concepts fondamentaux de TypeScript. Nous aborderons la syntaxe, les fonctionnalités clés et les bonnes pratiques avec des exemples clairs.

## 1. Qu'est-ce que TypeScript ?

TypeScript est un sur-ensemble de JavaScript (`superset`). Cela signifie que tout code JavaScript valide est également du code TypeScript valide. TypeScript ajoute un système de **typage statique** optionnel à JavaScript. Le but principal est de détecter les erreurs courantes pendant le développement (par exemple, dans votre éditeur de code) plutôt qu'à l'exécution (dans le navigateur de l'utilisateur).

Le code TypeScript est transpilé en code JavaScript pour pouvoir être exécuté par les navigateurs ou Node.js.

## 2. Les Types de Base

TypeScript étend les types primitifs de JavaScript.

```typescript
// Boolean
let estFait: boolean = false;

// Number (pour les entiers et les flottants)
let age: number = 30;
let prix: number = 19.99;

// String (chaîne de caractères)
let nom: string = "Alice";
let phrase: string = `Bonjour, je m'appelle ${nom}`;

// Array (tableau)
let nombres: number[] = [1, 2, 3];
// Syntaxe alternative avec les génériques
let noms: Array<string> = ["Alice", "Bob"];

// Tuple (tableau avec un nombre fixe d'éléments de types connus)
let personne: [string, number] = ["Alice", 30]; // OK
// personne = [30, "Alice"]; // Erreur

// Enum (énumération)
enum Couleur {Rouge, Vert, Bleu};
let c: Couleur = Couleur.Vert; // La valeur est 1 (par défaut)

// Any (n'importe quel type - à utiliser avec prudence !)
let variableMagique: any = 4;
variableMagique = "Maintenant je suis une chaîne"; // OK

// Void (absence de type, généralement pour les fonctions qui ne retournent rien)
function afficherMessage(): void {
    console.log("Message!");
}

// Null et Undefined
let u: undefined = undefined;
let n: null = null;

// Never (pour les fonctions qui ne terminent jamais ou qui lèvent toujours une exception)
function erreur(message: string): never {
    throw new Error(message);
}
```

## 3. Les Interfaces

Une interface est un moyen de définir la "forme" ou le "contrat" d'un objet. Elle spécifie les propriétés et les méthodes qu'un objet doit avoir.

### Interface Simple

```typescript
interface Utilisateur {
  nom: string;
  age: number;
}

function saluer(personne: Utilisateur) {
  return `Bonjour, ${personne.nom}`;
}

let user = { nom: "Alice", age: 30 };
saluer(user); // OK
```

### Propriétés Optionnelles

Utilisez `?` pour marquer une propriété comme optionnelle.

```typescript
interface Utilisateur {
  nom: string;
  age?: number; // L'âge est optionnel
}

let user1: Utilisateur = { nom: "Bob" }; // OK
let user2: Utilisateur = { nom: "Alice", age: 30 }; // OK
```

### Propriétés en Lecture Seule

Utilisez `readonly` pour créer des propriétés qui ne peuvent pas être modifiées après la création de l'objet.

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
// p1.x = 5; // Erreur: Cannot assign to 'x' because it is a read-only property.
```

### Interfaces pour les Fonctions

Les interfaces peuvent aussi décrire la signature d'une fonction.

```typescript
interface FonctionDeRecherche {
  (source: string, sousChaine: string): boolean;
}

let maRecherche: FonctionDeRecherche;
maRecherche = function(src, sub) {
  let resultat = src.search(sub);
  return resultat > -1;
}
```

## 4. Les Classes

TypeScript supporte la programmation orientée objet avec les classes, comme en JavaScript moderne, mais avec des fonctionnalités supplémentaires comme le typage des membres.

```typescript
class Animal {
  // Les modificateurs public, private, protected
  public nom: string;
  private age: number;

  constructor(nom: string, age: number) {
    this.nom = nom;
    this.age = age;
  }

  public seDeplacer(distanceEnMetres: number = 0): void {
    console.log(`${this.nom} s'est déplacé de ${distanceEnMetres}m.`);
  }
}

class Chien extends Animal {
  constructor(nom: string, age: number) {
    super(nom, age); // Appelle le constructeur de la classe parente (Animal)
  }

  aboyer(): void {
    console.log("Woof! Woof!");
    // console.log(this.age); // Erreur: La propriété 'age' est privée et accessible uniquement dans la classe 'Animal'.
  }
}

const monChien = new Chien("Rex", 5);
monChien.seDeplacer(10);
monChien.aboyer();
console.log(monChien.nom); // OK
```

- **`public`**: (par défaut) Le membre est accessible de n'importe où.
- **`private`**: Le membre n'est accessible qu'à l'intérieur de la classe où il est déclaré.
- **`protected`**: Le membre est accessible à l'intérieur de la classe où il est déclaré et dans les classes qui en héritent.

## 5. Les Fonctions

TypeScript améliore les fonctions JavaScript en permettant de typer les paramètres et les valeurs de retour.

```typescript
// Fonction nommée avec des types
function addition(x: number, y: number): number {
  return x + y;
}

// Fonction fléchée
const soustraction = (x: number, y: number): number => {
  return x - y;
};

// Paramètres optionnels et par défaut
function construireNom(prenom: string, nom: string = "Smith", initiales?: string): string {
  if (initiales) {
    return `${prenom} ${initiales}. ${nom}`;
  }
  return `${prenom} ${nom}`;
}

let resultat1 = construireNom("Bob"); // Bob Smith
let resultat2 = construireNom("Bob", "Adams"); // Bob Adams
let resultat3 = construireNom("Bob", "Adams", "C"); // Bob C. Adams
```

## 6. Les Génériques (Generics)

Les génériques sont l'une des fonctionnalités les plus puissantes de TypeScript. Ils permettent de créer des composants (fonctions, classes, interfaces) qui peuvent fonctionner avec plusieurs types de données sans perdre l'information de type.

### Fonction Générique

Imaginez une fonction qui retourne le premier élément d'un tableau. Sans les génériques, vous pourriez utiliser `any`.

```typescript
function premierElement(arr: any[]) {
  return arr[0];
}

let el = premierElement([1, 2, 3]); // 'el' est de type 'any', on a perdu l'information que c'était un nombre.
```

Avec les génériques :

```typescript
function premierElement<T>(arr: T[]): T {
  return arr[0];
}

// TypeScript peut inférer le type T
let premierNombre = premierElement([1, 2, 3]); // premierNombre est de type 'number'

// Ou vous pouvez le spécifier explicitement
let premiereChaine = premierElement<string>(["a", "b", "c"]); // premiereChaine est de type 'string'
```

- **`<T>`**: Déclare une variable de type `T`.
- **`arr: T[]`**: Le paramètre `arr` est un tableau d'éléments de type `T`.
- **`: T`**: La fonction retourne une valeur de type `T`.

### Interface Générique

```typescript
interface Paire<T, U> {
  cle: T;
  valeur: U;
}

let maPaire: Paire<string, number> = { cle: "age", valeur: 30 };
```

## 7. Types Avancés

### Union de Types

Un type peut être l'un parmi plusieurs types.

```typescript
function afficherId(id: string | number) {
  console.log(`L'ID est : ${id}`);
  if (typeof id === "string") {
    // On peut utiliser les méthodes de string ici
    console.log(id.toUpperCase());
  }
}

afficherId(101); // OK
afficherId("202"); // OK
```

### Intersection de Types

Combine plusieurs types en un seul.

```typescript
interface Personne {
  nom: string;
}

interface Employe {
  codeEmploye: number;
}

// Un EmployePersonne a toutes les propriétés de Personne ET de Employe
type EmployePersonne = Personne & Employe;

const employe: EmployePersonne = {
  nom: "Alice",
  codeEmploye: 123
};
```

### Types Littéraux

Permet de spécifier des valeurs exactes qu'une chaîne ou un nombre doit avoir.

```typescript
type Alignement = "gauche" | "droite" | "centre";

function alignerTexte(texte: string, alignement: Alignement) {
  // ...
}

alignerTexte("Bonjour", "gauche"); // OK
// alignerTexte("Monde", "haut"); // Erreur: L'argument de type '"haut"' n'est pas assignable au paramètre de type 'Alignement'.
```

Ce guide couvre les concepts essentiels pour bien démarrer avec TypeScript. La clé est de pratiquer et d'utiliser le système de types à votre avantage pour écrire un code plus sûr et plus maintenable.
