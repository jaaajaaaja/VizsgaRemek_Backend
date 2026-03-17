import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation, ApiCookieAuth, ApiOkResponse, ApiForbiddenResponse,
  ApiNotFoundResponse, ApiConflictResponse, ApiUnauthorizedResponse, ApiParam,
} from '@nestjs/swagger';

/*
  ----------------------------------------------------------------------------------------------------------
  DEFAULT ENDPOINTS
  ----------------------------------------------------------------------------------------------------------
*/

export function GetAllUsersAdmin() {
  return applyDecorators(
    ApiOperation({ summary: "ADMIN - Visszaadja az összes felhasználót" }),
    ApiCookieAuth(),
    ApiOkResponse({
      description: "Visszaadja a felhasználókat",
      schema: {
        type: "array",
        items: {
          properties: {
            id: { type: "number", example: 1 },
            userName: { type: "string", example: "Felhasználónév" },
            email: { type: "string", example: "felhasznalonev@email.com" },
            age: { type: "number", example: 1 },
            role: { type: "string", example: "user" },
          }
        }
      }
    }),
    ApiForbiddenResponse({
      description: "Csak adminnak van hozzáférése a végponthoz",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Forbidden resource!" }
        }
      }
    })
  )
}

export function PostUser() {
  return applyDecorators(
    ApiOperation({ summary: "Létrehoz egy felhasználót" }),
    ApiOkResponse({
      description: "Létrehozza a felhasználót",
      schema: {
        type: "object",
        properties: {
          userName: { type: "string", example: "felhaszálónév" },
          email: { type: "string", example: "pelda@pelda.pelda" },
          password: { type: "string", example: "asd123" },
          age: { type: "number", example: 18 }
        }
      }
    }),
    ApiConflictResponse({
      description: "Már benne van az adatbázisban az email cím",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Email already in use!" }
        }
      }
    })
  )
}

export function DeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: "Töröl egy felhasználót" }),
    ApiCookieAuth(),
    ApiParam({ name: "id", description: "felhasználó id" }),
    ApiOkResponse({
      description: "Kitörli a felhasználót",
      schema: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          userName: { type: "string", example: "felhaszálónév" },
          email: { type: "string", example: "pelda@pelda.pelda" },
          password: { type: "string", example: "asd123" },
          age: { type: "number", example: 18 }
        }
      }
    }),
    ApiForbiddenResponse({
      description: "A felhasználó csak a saját profilját törölheti",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "You can only delete your own profile!" }
        }
      }
    })
  )
}

export function UpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: "Módosít egy felhasználót" }),
    ApiCookieAuth(),
    ApiParam({ name: "id", description: "felhasználó id" }),
    ApiOkResponse({
      description: "Módosítja a felhasználót",
      schema: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          userName: { type: "string", example: "módosított felhaszálónév" },
          email: { type: "string", example: "pelda@pelda.pelda" },
          password: { type: "string", example: "asd123" },
          age: { type: "number", example: 18 }
        }
      }
    }),
    ApiForbiddenResponse({
      description: "A felhasználó csak a saját profilját módosíthatja",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "You can only edit your own profile!" }
        }
      }
    }),
    ApiNotFoundResponse({
      description: "A felhasználó nem használható",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "User not found!" }
        }
      }
    })
  )
}

/*
  ----------------------------------------------------------------------------------------------------------
  RECOMMENDATIONS
  ----------------------------------------------------------------------------------------------------------
*/

export function GetRecommendedPlaces() {
  return applyDecorators(
    ApiOperation({ summary: "Visszaad egy helyet a felhasználó érdekeltségi köre alapján" }),
    ApiCookieAuth(),
    ApiOkResponse({
      description: "Visszaad egy helyet",
      schema: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          googleplaceID: { type: "string", example: "123ID" },
          name: { type: "string", example: "felhasználónév" },
          address: { type: "string", example: "123 Utca" },
          comments: { type: "string", example: "[kommentek listája]" }
        }
      }
    }),
    ApiForbiddenResponse({
      description: "Nem talált megfelelő helyet az adatbázisban",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "No places found matching your interests!" }
        }
      }
    }),
    ApiNotFoundResponse({
      description: "A felhasználónak nincsenek érekeltségei",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "user has no interests!" }
        }
      }
    })
  )
}

export function GetRecommendationByAge() {
  return applyDecorators(
    ApiOperation({ summary: "Visszaad 5 helyet a felhasználó kora alapján (többi felhasználó kommentjeit veszi figyelembe)" }),
    ApiCookieAuth(),
    ApiOkResponse({
      description: "Visszaad 5 helyet",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            googleplaceID: { type: "string", example: "123ID" },
            name: { type: "string", example: "felhasználónév" },
            address: { type: "string", example: "123 Utca" },
            comments: { type: "string", example: "[kommentek listája]" }
          }
        }
      }
    }),
    ApiForbiddenResponse({
      description: "Nem található elég komment az ajánláshoz",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Not enough comments to recommend!" }
        }
      }
    }),
    ApiNotFoundResponse({
      description: "Nem található a felhasználó",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "User not found!" }
        }
      }
    }),
    ApiConflictResponse({
      description: "Nincs beállítva a felhasználónak kor",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Please set your age!" }
        }
      }
    }),
    ApiUnauthorizedResponse({
      description: "Csak bejelentkezve lehet lekérni",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Log in first!" }
        }
      }
    })
  )
}

/*
  ----------------------------------------------------------------------------------------------------------
  FRIENDS
  ----------------------------------------------------------------------------------------------------------
*/

export function AddUserFriend() {
  return applyDecorators(
    ApiOperation({ summary: "Elküldi egy barátkérelmet" }),
    ApiCookieAuth(),
    ApiParam({ name: "id", description: "barát felhasználó id-ja" }),
    ApiOkResponse({
      description: "Elküldi a kérelmet",
      schema: {
        type: "object",
        properties: {
          userID: { type: "number", example: 1 },
          friendID: { type: "number", example: 2 },
        }
      }
    }),
    ApiConflictResponse({
      description: "Már van függőben egy barátkérelem ehhez a felhasználóhoz",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "You already sent a request to this user!" }
        }
      }
    }),
    ApiForbiddenResponse({
      description: "Már a barátod ez a felhasználó",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "You already have this user as a friend!" }
        }
      }
    }),
    ApiNotFoundResponse({
      description: "A felhasználó, akinek a kérelmet küldöd, nem használható",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "The user you are trying to send the request to does not exist!" }
        }
      }
    })
  )
}

export function DealWithFriendRequest() {
  return applyDecorators(
    ApiOperation({ summary: "Elfogadja vagy elutasítja egy barátkérelmet" }),
    ApiCookieAuth(),
    ApiParam({ name: "id", description: "kérelmet küldő felhasználó id-ja" }),
    ApiOkResponse({
      description: "Elfogadja a kérelmet",
      schema: {
        type: "object",
        properties: {
          userID: { type: "number", example: 1 },
          friendID: { type: "number", example: 2 },
        }
      }
    }),
    ApiNotFoundResponse({
      description: "A felhasználótól nincs függőben barátkérelmed",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "You do not have a pending friend request from this user!" }
        }
      }
    })
  )
}

export function SearchByUsername() {
  return applyDecorators(
    ApiOperation({ summary: "Felhasználóra keres felasználónév alapján" }),
    ApiParam({ name: "userName", description: "keresett felhasználó neve" }),
    ApiOkResponse({
      description: "Visszaadja a felhasználót",
      schema: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          userName: { type: "string", example: "felhasználónév" }
        }
      }
    })
  )
}

export function GetFriendList() {
  return applyDecorators(
    ApiOperation({ summary: "Felhasználó barátainak lekérése" }),
    ApiCookieAuth(),
    ApiOkResponse({
      description: "Visszaadja a felhasználó barátait",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            userName: { type: "string", example: "felhasználónév" }
          }
        }
      }
    }),
    ApiUnauthorizedResponse({
      description: "Csak bejelentkezett felhasználó kérheti le a barátlistáját",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Log in to see your friendlist!" }
        }
      }
    }),
    ApiNotFoundResponse({
      description: "Nincs barátja a felhasználónak",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "You do not have any friends yet!" }
        }
      }
    })
  )
}

/*
  ----------------------------------------------------------------------------------------------------------
  INTERESTS
  ----------------------------------------------------------------------------------------------------------
*/

export function PostUserInterest() {
  return applyDecorators(
    ApiOperation({ summary: "Hozzáad egy felhasználó érdekeltséget" }),
    ApiCookieAuth(),
    ApiOkResponse({
      description: "Létrehozza az érdekeltséget",
      schema: {
        type: "object",
        properties: {
          interest: { type: "string", example: "bar" },
          userID: { type: "number", example: 1 }
        }
      }
    }),
    ApiConflictResponse({
      description: "A felhasználónak már be van állítva az érdekeltség",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "You already have this interest!" }
        }
      }
    })
  )
}

export function DeleteUserInterest() {
  return applyDecorators(
    ApiOperation({ summary: "Töröl egy felhasználó érdekeltséget" }),
    ApiCookieAuth(),
    ApiOkResponse({
      description: "Törli az érdekeltséget",
      schema: {
        type: "object",
        properties: {
          id: { type: "number", example: 1 },
          userID: { type: "number", example: 1 }
        }
      }
    }),
    ApiNotFoundResponse({
      description: "Nincs beállítvan a felhasználónak a törölni kívánt érdekeltség",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Interest not found!" }
        }
      }
    })
  )
}

export function GetUserInterestList() {
  return applyDecorators(
    ApiOperation({ summary: "Felhasználó érdekeltségeinek lekérése" }),
    ApiCookieAuth(),
    ApiOkResponse({
      description: "Visszaadja a felhasználó érdekeltségeit",
      schema: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            interest: { type: "string", example: "beer_bar" },
            userID: { type: "number", example: 1 }
          }
        }
      }
    }),
    ApiNotFoundResponse({
      description: "Nincs beállítva érdekeltség a felhasználónak",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "user has no interests set!" }
        }
      }
    })
  )
}

export function GetAllUserInterestsAdmin() {
  return applyDecorators(
    ApiOperation({ summary: "ADMIN - Visszaadja az összes felhasználó érdekeltséget" }),
    ApiCookieAuth(),
    ApiOkResponse({
      description: "Visszaadja a felhasználókat",
      schema: {
        type: "array",
        items: {
          properties: {
            id: { type: "number", example: 1 },
            userName: { type: "string", example: "Felhasználónév" },
            email: { type: "string", example: "felhasznalonev@email.com" },
            age: { type: "number", example: 1 },
            role: { type: "string", example: "user" },
          }
        }
      }
    }),
    ApiForbiddenResponse({
      description: "Csak adminnak van hozzáférése a végponthoz",
      schema: {
        type: "object",
        properties: {
          message: { type: "string", example: "Forbidden resource!" }
        }
      }
    })
  )
}
