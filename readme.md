![Barsonar Backend](./assets/barsonar-backend-logo.png)


## <span style="color:purple">Tartalomjegyzék</span>
- [Tartalomjegyzék](#tartalomjegyzék)
- [Stack](#stack)
- [Előfeltételek](#előfeltételek)
- [Telepítés](#telepítés)
    - [1. Klónozás és függőségek telepítése](#1-klónozás-és-függőségek-telepítése)
    - [2. Környezeti változók](#2-környezeti-változók)
    - [3. Adatbázis beállítása](#3-adatbázis-beállítása)
- [Futtatás Dockerben](#futtatás-dockerben)
- [Adatbázis felépítése](#adatbázis-felépítése)
    - [Kapcsolatok](#kapcsolatok)
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

## <span style="color:purple">Stack</span>

- **Framework:** [<span style="color:#E92747">NestJS</span> <span style="color:#68a063 ">(Node.js)</span>](https://nestjs.com/)
- **Programozási nyelv:** [<span style="color:#007acc">TypeScript</span>](https://www.typescriptlang.org/)
- **Adatbázis:** [<span style="color:#00758F">My</span><span style="color:#F29111">SQL</span>](https://www.mysql.com/)
- **ORM:** [<span style="color:#3DBFA6">Prisma</span>](https://www.prisma.io/)
- **Autentikáció:** [<span style="color:#7549F2">JWT</span>](https://www.jwt.io/) (JSON Web Tokens)
- **Jelszó titkosítás:** [<span style="color:#E05D44">bcrypt</span>](https://www.npmjs.com/package/bcrypt)
- **Fájlfeltöltés:** [<span style="color:#68a063">Multer</span>](https://www.npmjs.com/package/multer)
- **Validáció:** [class-validator, class-transformer](https://docs.nestjs.com/techniques/validation)
- **Kérések maximalizálása:** [Trottler](https://github.com/nestjs/throttler)
- **Tesztelés:** [<span style="color:#C21325">Jest</span>](https://www.npmjs.com/package/jest), [Supertest](https://www.npmjs.com/package/supertest)
- **Kód formázás:** [<span style="color:#56B3B4">Prettier</span>](https://prettier.io/), [<span style="color:#4b32c3">ESLint</span>](https://eslint.org/)
- **Teszt adatok generálása:** [<span style="color:#1FC994">Faker</span>](https://fakerjs.dev/)
- **Deployment:** [<span style="color:#1D63ED">Docker</span>](https://https://www.docker.com/)

---

## <span style="color:purple">Előfeltételek</span>

A projekt futtatásához szükséges:

- **<span style="color:red">Node.js</span>**
- **<span style="color:red">npm</span>**
- **<span style="color:red">MySQL</span>**
- **<span style="color: #1D63ED">Docker Desktop</span>**, ha csak futtatni szeretnéd a programot, nem fejleszteni

---

## <span style="color:purple">Telepítés</span>

#### 1. Klónozás és függőségek telepítése

```bash
# Klónozd a repository-t  
git clone <repository-url>

# Lépj be a mappába ahova klónoztad a projektet, és telepítsd a függőségeket (node_modules mappa)  
npm install
```

```sql
Hozz létre egy adatbázist MySQL-ben

CREATE DATABASE adatbazis_neve
```

#### 2. Környezeti változók

Nevezd át a projekt gyökerében lévő `.env.example` fájlt `.env`-re és állítsd be a következő képpen:

```env
PORT=[számmal add meg a portot amelyen szeretnéd hogy fusson a backend]
DATABASE_URL=mysql://felhasznalonev:jelszo@localhost:3306/adatbazis_neve
JWT_SECRET=titkos_kulcs_ide
COOKIE_SECRET=másik_titkos_kulcs_ide
FRONTEND_IP=[az esetleges frontend ip címe, ha az nem localhost-on fut]
```

Megjegyzés:  

Ha nem állítottál be külön felhasználót és annak egy jelszót az adatbázisban, akkor a felhasználó `root` lesz, a jelszót pedig üresen kell hagyni és a kettőspontot kitörölni.

A `JWT_SECRET` és a `COOKIE_SECRET` pedig erős, véletlenszerű karakterláncok legyenek ha publikálni akarod a weboldalt. Éles környezetben használj legalább 32 karakter hosszú stringet.

#### 3. Adatbázis beállítása

```bash
# A létrehozott adatbázis feltöltése
npx prisma db push
# vagy 
npx prisma migrate reset # Csak fejlesztés közben add ki ezt a parancsot (itt a seed parancs is lefut)
# Mind a két esetben a Prisma Client legenerálódik

# Új migráció hozzáadása
npx prisma migrate dev --name migracio_neve
  -> # Ebben az esetben viszont manuálisan le kell generálni a Prisma Clientet
  npx prisma generate

# Adatbázis feltöltése adatokkal (ha nem a migrate reset parancsot adtad ki)
npx prisma db seed
```

## <span style="color:purple">Futtatás Dockerben</span>

Ha nem szeretnéd fejleszteni az alkalmazást csak futtatni akkor elég ha letöltöd a Dockert beírsz két parancsot és már fut is a szerver. Természetesen a kódot attól még le kell tölteni a gépedre.

```bash 
docker build -t barsonar-backend --no-cache .
docker compose up
```

## <span style="color:purple">Adatbázis felépítése</span>

Az adatbázis a következő táblákat tartalmazza:

```ts
User {
  id: number,
  userName: string,
  email: string,
  password: string
}

User_Interest {
  id: number,
  interest: string,
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
  id: number,
  googlePlaceID: string,
  name: string,
  address: string
}

Place_Category {
  id: number,
  category: string,
  placeID: number
}

Comment {
  id: number,
  commentText: string,
  rating: number,
  createdAt: Date,
  updatedAt: Date,
  userID: number,
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
  id: number,
  location: string,
  type: string,
  userID: number,
  placeID: number
}
```

#### Kapcsolatok

- Egy felhasználó több kommentet, hírt és fotót hozhat létre
  - opcionálisan állíthat be hely kategóriákat, ami érdekli, hogy később kaphasson hely ajánlásokat
- Egy felhasználónak több barátja lehet
- Egy helyhez több kategória, komment, hír és fotó tartozhat
- Kommentek, hírek vagy fotók törlésekor a kapcsolódó felhasználó és hely nem törlődik
- Ha törlünk egy felhasználót vagy egy helyet, akkor törlődik az összes hozzá tartozó fotó, hír, és komment
  - felhasználó törlése esetén törlődnek a hozzá tartozó érdekeltségek és kitörli barátlistából is
  - hely törlése esetén törlődnek a hozzá tartozó kategóriák is


---

## <span style="color:purple">Futtatás</span>

```bash
npm run start:dev
```

A szerver a
- `http://localhost:3000`
- `http://[lokális ip címed]:3000` 
  
címeken lesz elérhető (vagy a `PORT` környezeti változóban megadott porton).

---

## <span style="color:purple">A feltöltött képek elérése</span>

```bash
http://localhost:3000/uploads/<fájlnév>

# Példa:
http://localhost:3000/uploads/123456789.jpg
```

---

## <span style="color:purple">Tesztelés</span>

#### Unit tesztek

```bash
# Összes unit teszt futtatása
npm run test

# Vagy:
npm test

#Lásd hány százalékban van tesztelve az összes sor 
#(azt nem mondja meg ha valamit többféleképpen teszteltél):
npm run test:cov
```

#### E2E tesztek

```bash
# E2E tesztek futtatása
npm run test:e2e
```

#### Tesztek helyileg

- A service és controller tesztek az `src/` mappában találhatók `*.spec.ts` kiterjesztéssel
- E2E tesztek a `test/` mappában találhatók

---

## <span style="color:purple">Biztonsági megjegyzések</span>

#### Fontos figyelmeztetések

1. **Fájlfeltöltés:** 
   - A fájlméret korlátozva van (2 MB)
   - Csak bizonyos fájltípusok engedélyezettek
   - Érdemes vírusellenőrzést is implementálni
   - Használj cloud storage-t `/uploads` mappa helyett nagyobb projekteknél

---

## <span style="color:purple">Hozzájárulás</span>

**A projekt fejlesztése során kérjük, hogy:**

1. Fork-old a repository-t
2. Hozz létre egy feature branch-et (`git checkout -b feature/uj-funkcio`)
3. Commit-old a változtatásaidat (`git commit -m 'Hozzáadva: új funkció'`)
4. Push-old a branch-et (`git push origin feature/uj-funkcio`)
5. Nyiss egy Pull Request-et

---

**Készítette:** BarSonar fejlesztői csapat  
**Verzió:** 0.0.67  

**Utolsó frissítés:** 2026
