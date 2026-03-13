## Back-end (Mockito et JUnit)

**Tests unitaires** (logique métier, mocks)

- **UserService**
  - `register(user)` valide → save appelé + mot de passe encodé
  - `login()` bons identifiants → retourne un JWT
- **StudentService**
  - `create(student)` → sauvegarde
  - `findById(id)` valide → retourne étudiant
  - `update(id, student)` → met à jour
  - `delete(id)` → supprime
- **JwtService**
  - Génération d’un token
  - Validation d’un token valide

**Tests d’intégration** (API + base)

- **UserController**
  - POST `/register` valide → 201
  - POST `/login` valide → 200 + JWT
- **StudentController**
  - GET `/students` avec JWT → 200
  - POST `/students` → 201
  - PUT `/students/{id}` → 200
  - DELETE `/students/{id}` → 204

*Pour exécuter les test Back-end : `nvn test`

## Front-End (Jest)

**Tests unitaires** (services, intercepteur)

- **AuthService**
  - `login()` → appelle API et stocke le token en localStorage
  - `getToken()` / `isLoggedIn()` / `logout()` → comportement attendu
- **StudentService**
  - `getAll()` / `getById()` / `create()` / `update()` / `delete()` → appels HTTP corrects (mock HttpClient)
- **authInterceptor**
  - Requête vers `/api/login` ou `/api/register` → pas d’en-tête Authorization
  - Requête vers autre URL avec token → en-tête `Authorization: Bearer <token>`

**Tests composants** (léger)

- **LoginComponent** : soumission formulaire valide → appel AuthService.login + navigation
- **StudentListComponent** : chargement → appel StudentService.getAll

*Pour exécuter les test Jest : `npm test`

---

## Tests E2E (Cypress)

- **Connexion** : saisie login/mot de passe valides → redirection vers `/students`
- **Liste étudiants** : accès à `/students` (authentifié) → affichage de la liste
- Inscription : formulaire d’inscription valide → message de succès

*Pour exécuter les E2E : `npm run e2e`