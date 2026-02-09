![Barsonar Backend](https://github.com/user-attachments/assets/1a878232-55f6-40bb-94ba-2e5be3fd6647)


## Tartalomjegyzék

- [Tartalomjegyzék](#tartalomjegyzék)
- [Stack](#stack)
- [Előfeltételek](#előfeltételek)
- [Telepítés](#telepítés)
  - [1. Klónozás és függőségek telepítése](#1-klónozás-és-függőségek-telepítése)
  - [2. Környezeti változók](#2-környezeti-változók)
  - [3. Adatbázis beállítása](#3-adatbázis-beállítása)
- [Adatbázis felépítése](#adatbázis-felépítése)
  - [Kapcsolatok](#kapcsolatok)
- [Adatbázis seedelése](#adatbázis-seedelése)
- [Futtatás](#futtatás)
  - [A feltöltött képek elérése](#a-feltöltött-képek-elérése)
- [Tesztelés](#tesztelés)
  - [Unit tesztek](#unit-tesztek)
  - [E2E tesztek](#e2e-tesztek)
  - [Tesztek helyileg](#tesztek-helyileg)
- [Biztonsági megjegyzések](#biztonsági-megjegyzések)
  - [Fontos figyelmeztetések](#fontos-figyelmeztetések)
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

Ha nem állítottál be külön felhasználót és annak egy jelszót az adatbázisban, akkor a felhasználó `root` lesz, a jelszót pedig üresen kell hagyni és a kettőspontot kitörölni.

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

User_Friend {
  id: number,
  userID: number,
  friendID: number
}

Pending_Friend_Request {
  id: number,
  userID: number,
  friendID: number
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

News {
  id: number,
  text: string,
  placeID: number,
  userID: number,
  approved: boolean
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

- Egy felhasználó több kommentet, hírt és fotót hozhat létre
  - opcionálisan állíthat be hely kategóriákat, ami érdekli, hogy később kaphasson hely ajánlásokat
- Egy felhasználónak több barátja lehet
- Egy helyhez több kategória, komment, hír és fotó tartozhat
- Kommentek, hírek vagy fotók törlésekor a kapcsolódó felhasználó és hely nem törlődik
- Ha törlünk egy felhasználót vagy egy helyet, akkor törlődik az összes hozzá tartozó fotó, hír, és komment
  - felhasználó törlése esetén törlődnek a hozzá tartozó érdekeltségek és kitörli barátlistából is
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

### A feltöltött képek elérése

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
