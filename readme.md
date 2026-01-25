![Barsonar Backend](https://github.com/user-attachments/assets/1a878232-55f6-40bb-94ba-2e5be3fd6647)


## Tartalomjegyzék

- [Stack](#stack)
- [Előfeltételek](#előfeltételek)
- [Telepítés](#telepítés)
- [Adatbázis felépítése](#adatbázis-felépítése)
- [Adatbázis seed-elése](#adatbázis-seedelése)
- [Futtatás](#futtatás)
- [API dokumentáció](#api-dokumentáció)
- [Tesztelés](#tesztelés)
- [Biztonsági megjegyzések](#biztonsági-megjegyzések)
- [Hozzájárulás](#hozzájárulás)

---

## Stack

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Programozási nyelv:** [TypeScript](https://www.typescriptlang.org/)
- **Adatbázis:** [MySQL](https://www.mysql.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autentikáció:** [JWT](https://www.jwt.io/) (JSON Web Tokens)
- **Jelszó titkosítás:** [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Fájlfeltöltés:** [Multer](https://www.npmjs.com/package/multer)
- **Validáció:** [class-validator, class-transformer](https://docs.nestjs.com/techniques/validation)
- **Kérések maximalizálása:** [Trottler](https://github.com/nestjs/throttler)
- **Tesztelés:** [Jest](https://www.npmjs.com/package/jest), [Supertest](https://www.npmjs.com/package/supertest)
- **Kód formázás:** [Prettier](https://prettier.io/), [ESLint](https://eslint.org/)
- **Teszt adatok generálása:** [Faker](https://fakerjs.dev/)

---

## Előfeltételek

A projekt futtatásához szükséges:

- **Node.js**
- **npm**
- **MySQL** adatbázis

---

## Telepítés

### 1. Klónozás és függőségek telepítése

```bash
# Klónozd a repository-t  
git clone <repository-url>

# Lépj be a mappába ahova klónoztad aztán telepítsd a függőségeket (node_modules mappa)  
npm install
```

```sql
Hozz létre egy adatbázist MySQL-ben

CREATE DATABASE adatbazis_neve
```

### 2. Környezeti változók

Nevezd át a projekt gyökerében lévő `.env.example` fájlt `.env`-re és állítsd be a következő képpen:

```env
DATABASE_URL="mysql://felhasznalonev:jelszo@localhost:3306/adatbazis_neve"
JWT_SECRET="titkos_kulcs_ide"
PORT=[számmal add meg a portot amelyen szeretnéd hogy fusson a backend]
```

Megjegyzés:  

Ha nem állítottál be külön felhasználót és annak egy jelszót az adatbázisban, akkor a felhasználó `root` lesz, a jelszót pedig üresen kell hagyni, de a kettőspontnak benne kell maradnia.

A `JWT_SECRET` pedig egy erős, véletlenszerű karakterlánc legyen ha publikálni akarod a weboldalt. Éles környezetben használj legalább 32 karakter hosszú stringet.

### 3. Adatbázis beállítása

```bash
# Prisma migrációk futtatása
npx prisma migrate dev --name migracio_neve

# Prisma Client generálása
npx prisma generate
```

## Adatbázis felépítése

Az adatbázis a következő táblákat tartalmazza:

```ts
User {
  id: number
  userName: string
  email: string
  password: string
}

User_Interest {
  id: number
  interest: string
  userID: number
}

Place {
  id: number
  googlePlaceID: string
  name: string
  address: string
}

Place_Category {
  id: number
  category: string
  placeID: number
}

Comment {
  id: number
  commentText: string
  rating: number
  createdAt: Date
  updatedAt: Date
  userID: number
  placeID: number
}

Photo {
  id: number
  location: string
  type: string
  userID: number
  placeID: number
}
```

### Kapcsolatok

- Egy felhasználó több kommentet és fotót hozhat létre
  - opcionálisan állíthat be hely kategóriákat, ami érdekli, hogy később kaphasson hely ajánlásokat
- Egy helyhez több kategória, komment és fotó tartozhat
- Kommentek vagy fotók törlésekor a kapcsolódó felhasználó és hely nem törlődik
- Ha törlünk egy felhasználót vagy egy helyet, akkor törlődik az összes hozzá tartozó fotó és komment
  - felhasználó törlése esetén törlődnek a hozzá tartozó érdekeltségek is
  - hely törlése esetén törlődnek a hozzá tartozó kategóriák is

---

## Adatbázis seedelése

Az adatbázis feltöltése tesztadatokkal, Faker-t használ a valósághű adatok generálásához.

```bash
# Seed script futtatása
npx prisma db seed
```

---

## Futtatás

```bash
npm run start:dev
```

A szerver a `http://localhost:3000` címen lesz elérhető (vagy a `PORT` környezeti változóban megadott porton).

---

## API dokumentáció

### Alap URL

```
http://localhost:3000
```

### Autentikáció

A védett végpontokhoz JWT token szükséges. A token a `Auth` header-ben kell küldeni

### HTTP státusz kódok

Az API a következő HTTP státusz kódokat használja:

- `200 OK` - Sikeres kérés
- `201 Created` - Sikeres létrehozás
- `400 Bad Request` - Hibás kérés
- `401 Unauthorized` - Nincs jogosultság (hiányzó vagy érvénytelen token)
- `404 Not Found` - Erőforrás nem található
- `500 Internal Server Error` - Szerver hiba

### Autentikáció (`/auth`)

#### Bejelentkezés

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "jelszo123"
}
```

**Sikeres válasz (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Hibás válasz (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

#### Profil lekérése

```http
GET /auth/profile
Authorization: Bearer <token>
```

**Válasz (200 OK):**
```json
{
  "sub": 1,
  "username": "felhasznalonev"
}
```

---

### Felhasználók (`/user`)

#### Összes felhasználó lekérése

```http
GET /user
```

**Válasz (200 OK):**
```json
[
  {
    "id": 1,
    "userName": "FelhasznaloNev",
    "email": "user@example.com",
    "password": "$2b$10$..."
  }
]
```

#### Felhasználó lekérése email alapján

```http
GET /user/:email
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "userName": "FelhasznaloNev",
  "email": "user@example.com",
  "password": "$2b$10$..."
}
```

**Hibás válasz (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

#### Új felhasználó regisztrálása

```http
POST /user
Content-Type: application/json

{
  "userName": "FelhasznaloNev",
  "email": "user@example.com",
  "password": "jelszo123"
}
```

**Válasz (201 Created):**
```json
{
  "id": 1,
  "userName": "FelhasznaloNev",
  "email": "user@example.com",
  "password": "$2b$10$..."
}
```

**Hibás válasz (400 Bad Request) - validációs hiba:**
```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password should not be empty"],
  "error": "Bad Request"
}
```

#### Felhasználó frissítése

```http
PUT /user/:id
Content-Type: application/json

{
  "userName": "UjNev",
  "email": "ujemail@example.com"
}
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "userName": "UjNev",
  "email": "ujemail@example.com",
  "password": "$2b$10$..."
}
```

#### Felhasználó törlése

```http
DELETE /user/:id
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "userName": "FelhasznaloNev",
  "email": "user@example.com",
  "password": "$2b$10$..."
}
```

---

### Helyek (`/place`)

#### Összes hely lekérése

```http
GET /place
```

**Válasz (200 OK):**
```json
[
  {
    "id": 1,
    "googleplaceID": "ChIJN1t_tDeuEmsRUsoyG83frY4",
    "name": "Kocsma Neve",
    "address": "Budapest, Fő utca 1."
  }
]
```

#### Hely lekérése ID alapján

```http
GET /place/:id
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "googleplaceID": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "name": "Kocsma Neve",
  "address": "Budapest, Fő utca 1."
}
```

#### Új hely hozzáadása

```http
POST /place
Content-Type: application/json

{
  "googleplaceID": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "name": "Kocsma Neve",
  "address": "Budapest, Fő utca 1."
}
```

**Válasz (201 Created):**
```json
{
  "id": 1,
  "googleplaceID": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "name": "Kocsma Neve",
  "address": "Budapest, Fő utca 1."
}
```

#### Hely frissítése

```json
PUT /place/:id
Content-Type: application/json

{
  "name": "Frissített Név",
  "address": "Új cím"
}
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "googleplaceID": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "name": "Frissített Név",
  "address": "Új cím"
}
```

#### Hely törlése

```http
DELETE /place/:id
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "googleplaceID": "ChIJN1t_tDeuEmsRUsoyG83frY4",
  "name": "Kocsma Neve",
  "address": "Budapest, Fő utca 1."
}
```

---

### Kommentek (`/comment`)

#### Összes komment lekérése

```http
GET /comment
```

**Válasz (200 OK):**
```json
[
  {
    "id": 1,
    "commentText": "Nagyszerű hely!",
    "rating": 5,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "userID": 1,
    "placeID": 1
  }
]
```

#### Komment lekérése ID alapján

```http
GET /comment/:id
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "commentText": "Nagyszerű hely!",
  "rating": 5,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z",
  "userID": 1,
  "placeID": 1
}
```

#### Felhasználó összes kommentje

```http
GET /comment/findAllByUser/:userID
```

**Válasz (200 OK):**
```json
[
  {
    "id": 1,
    "commentText": "Nagyszerű hely!",
    "rating": 5,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "userID": 1,
    "placeID": 1
  }
]
```

#### Hely összes kommentje

```http
GET /comment/findAllByPlace/:placeID
```

**Válasz (200 OK):**
```json
[
  {
    "id": 1,
    "commentText": "Nagyszerű hely!",
    "rating": 5,
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z",
    "userID": 1,
    "placeID": 1
  }
]
```

#### Új komment hozzáadása

```http
POST /comment
Content-Type: application/json

{
  "commentText": "Nagyszerű hely!",
  "rating": 5,
  "userID": 1,
  "placeID": 1
}
```

**Válasz (201 Created):**
```json
{
  "id": 1,
  "commentText": "Nagyszerű hely!",
  "rating": 5,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z",
  "userID": 1,
  "placeID": 1
}
```

**Megjegyzés:** A `rating` mező opcionális (1-5 közötti érték).

#### Komment frissítése

```http
PUT /comment/:id
Content-Type: application/json

{
  "commentText": "Frissített komment",
  "rating": 4
}
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "commentText": "Frissített komment",
  "rating": 4,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T13:00:00.000Z",
  "userID": 1,
  "placeID": 1
}
```

#### Komment törlése

```http
DELETE /comment/:id
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "commentText": "Nagyszerű hely!",
  "rating": 5,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z",
  "userID": 1,
  "placeID": 1
}
```

---

### Fotók (`/photo`)

#### Összes fotó lekérése

```http
GET /photo
```

**Válasz (200 OK):**
```json
[
  {
    "id": 1,
    "location": "uploads/1234567890.jpg",
    "type": "jpg",
    "userID": 1,
    "placeID": 1
  }
]
```

#### Fotó lekérése ID alapján

```http
GET /photo/:id
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "location": "uploads/1234567890.jpg",
  "type": "jpg",
  "userID": 1,
  "placeID": 1
}
```

#### Felhasználó összes fotója

```http
GET /photo/getAllByUser/:userID
```

**Válasz (200 OK):**
```json
[
  {
    "id": 1,
    "location": "uploads/1234567890.jpg",
    "type": "jpg",
    "userID": 1,
    "placeID": 1
  }
]
```

#### Hely összes fotója

```http
GET /photo/getAllByPlace/:placeID
```

**Válasz (200 OK):**
```json
[
  {
    "id": 1,
    "location": "uploads/1234567890.jpg",
    "type": "jpg",
    "userID": 1,
    "placeID": 1
  }
]
```

#### Fotó feltöltése

```http
POST /photo
Content-Type: multipart/form-data

file: [kép fájl]
userID: 1
placeID: 1
```

**Korlátok:**
- Maximum 3 fájl tölthető fel egyszerre
- Csak engedéjezett formátum
- Maximum fájlméret: 2 MB
- A feltöltött fájlok az `uploads/` mappában kerülnek tárolásra

**Válasz (201 Created):**
```json
{
  "message": "File uploaded successfully",
  "images": [
    {
      "id": 1,
      "location": "uploads/1234567890.jpg",
      "type": "image/jpg",
      "userID": 1,
      "placeID": 1
    }
  ]
}
```

**Hibás válasz (400 Bad Request) - fájl túl nagy:**
```json
{
  "statusCode": 400,
  "message": "File too large",
  "error": "Bad Request"
}
```

**Hibás válasz (400 Bad Request) - nem engedélyezett fájltípus:**
```json
{
  "statusCode": 400,
  "message": "Invalid file type",
  "error": "Bad Request"
}
```

#### Fotó törlése

```http
DELETE /photo/:id
```

**Válasz (200 OK):**
```json
{
  "id": 1,
  "location": "uploads/1234567890.jpg",
  "type": "jpg",
  "userID": 1,
  "placeID": 1
}
```

---

### Statikus fájlok

A feltöltött képek elérése:

```
http://localhost:3000/uploads/<fájlnév>
```

Példa:
```
http://localhost:3000/uploads/123456789.jpg
```

---

## Tesztelés

### Unit tesztek

```bash
# Összes unit teszt futtatása
npm run test

# Vagy:
npm test

#Lásd hány százalékban van tesztelve az összes sor 
#(azt nem mondja meg ha valamit többféleképpen teszteltél):
npm run test:cov
```

### E2E tesztek

```bash
# E2E tesztek futtatása
npm run test:e2e
```

### Tesztek helyileg

- A service és controller tesztek az `src/` mappában találhatók `*.spec.ts` kiterjesztéssel
- E2E tesztek a `test/` mappában találhatók

---

## Biztonsági megjegyzések

### Fontos figyelmeztetések

1. **Fájlfeltöltés:** 
   - A fájlméret korlátozva van (2 MB)
   - Csak bizonyos fájltípusok engedélyezettek
   - Érdemes vírusellenőrzést is implementálni
   - Használj cloud storage-t `/uploads` mappa helyett nagyobb projekteknél

---

## Hozzájárulás

A projekt fejlesztése során kérjük, hogy:

1. Fork-old a repository-t
2. Hozz létre egy feature branch-et (`git checkout -b feature/uj-funkcio`)
3. Commit-old a változtatásaidat (`git commit -m 'Hozzáadva: új funkció'`)
4. Push-old a branch-et (`git push origin feature/uj-funkcio`)
5. Nyiss egy Pull Request-et

---

**Készítette:** BarSonar fejlesztői csapat  
**Verzió:** 0.0.67  

**Utolsó frissítés:** 2026
