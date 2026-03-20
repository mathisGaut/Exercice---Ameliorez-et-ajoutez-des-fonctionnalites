# EtudiantFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.16.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Jest](https://jestjs.io/) test runner, use the following command:

```bash
jest
```

## Tests end-to-end (Cypress)

Sans instrumentation (à lancer avec l’app déjà servie, par ex. `ng serve` sur le port 4200) :

```bash
npm run e2e
```

Avec **couverture de code E2E** (sert l’app via Webpack + Istanbul, lance Cypress, puis génère un rapport NYC) :

```bash
npm run e2e:coverage
```

- Rapport HTML : `coverage-e2e/index.html` (dossiers `coverage-e2e/` et `.nyc_output/` sont ignorés par Git). Ouvrir ce fichier **via le chemin absolu** ou « Révéler dans le Finder » plutôt que depuis un autre dossier : le rapport NYC référence des assets dans le même répertoire.
- Avant chaque run, `pree2e:coverage` nettoie `.nyc_output` et `coverage-e2e` pour éviter un rapport incohérent.
- Pour régénérer le HTML à partir d’un run déjà terminé : `npm run coverage:report` (lit **uniquement** `.nyc_output/out.json`). Sans **`npm run e2e:coverage` au préalable**, ce fichier est vide : vous verrez un message d’erreur explicite au lieu d’un rapport 0 %.
- Le build instrumenté est plus lent que `ng serve` classique ; libérez le port **4200** avant de lancer la commande.

Pour ouvrir l’UI Cypress :

```bash
npm run cypress:open
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
