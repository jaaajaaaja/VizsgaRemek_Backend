import { applyDecorators } from "@nestjs/common";
import {
    ApiCookieAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse,
    ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { PeriodEnum } from "src/types/place-types";

export function AdminApprovesNews() {
    return applyDecorators(
        ApiOperation({ summary: "ADMIN - Elfogad egy hírt" }),
        ApiCookieAuth(),
        ApiParam({ name: "id", description: "news id" }),
        ApiOkResponse({
            description: "Sikeresen elfogadja a hírt",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    approved: { type: "boolean", example: true }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "Csak admin férhet hozzá a végponthoz",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Forbidden resource!" }
                }
            }
        })
    )
}

export function AdminGetAllNews() {
    return applyDecorators(
        ApiOperation({ summary: "ADMIN - Visszaadja az összes hírt" }),
        ApiCookieAuth(),
        ApiOkResponse({
            description: "Visszaadja a híreket",
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        text: { type: "string", example: "Test news text." },
                        placeID: { type: "number", example: 1 },
                        userID: { type: "number", example: 1 }
                    }
                }

            }
        }),
        ApiForbiddenResponse({
            description: "Csak admin férhet hozzá a végponthoz",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Forbidden resource!" }
                }
            }
        })
    )
}

export function AdminDeletesPlace() {
    return applyDecorators(
        ApiOperation({ summary: "ADMIN - Töröl egy helyet" }),
        ApiCookieAuth(),
        ApiParam({ name: "id", description: "place id" }),
        ApiOkResponse({
            description: "Töröl egy helyet",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    text: { type: "string", example: "Test news text." },
                    placeID: { type: "number", example: 1 },
                    userID: { type: "number", example: 1 }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "Csak admin férhet hozzá a végponthoz",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Forbidden resource!" }
                }
            }
        })
    )
}

export function AdminGetAllPlaces() {
    return applyDecorators(
        ApiOperation({ summary: "ADMIN - Visszaadja az összes helyet" }),
        ApiCookieAuth(),
        ApiOkResponse({
            description: "Visszaadja az összes helyet az adatbázisban, ha van",
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        googleplaceID: { type: "string", example: "PELDA123ID" },
                        name: { type: "string", example: "Hely neve" },
                        address: { type: "string", example: "Példa u. 123" }
                    }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "Nincs hely felvéve az adatbázisba",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "No places in database!" }
                }
            }
        })
    )
}

export function GetPlaceById() {
    return applyDecorators(
        ApiOperation({ summary: "Visszad egy helyet id alapján" }),
        ApiParam({ name: "id", description: "place id" }),
        ApiOkResponse({
            description: "Visszad egy helyet",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    googleplaceID: { type: "string", example: "PELDA123ID" },
                    name: { type: "string", example: "Hely neve" },
                    address: { type: "string", example: "Példa u. 123" }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "Nem létezik a hely amit le akarunk kérni",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Place not found!" }
                }
            }
        })
    )
}

export function GetPlaceByGoogleplaceID() {
    return applyDecorators(
        ApiOperation({ summary: "Visszad egy helyet google place id alapján" }),
        ApiParam({ name: "googleplaceID", description: "googleplace id" }),
        ApiOkResponse({
            description: "Visszad egy helyet",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    googleplaceID: { type: "string", example: "PELDA123ID" },
                    name: { type: "string", example: "Hely neve" },
                    address: { type: "string", example: "Példa u. 123" }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "Nem létezik a hely amit le akarunk kérni",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Place not found!" }
                }
            }
        })
    )
}

export function AddPlace() {
    return applyDecorators(
        ApiOperation({ summary: "Létrehoz egy helyet" }),
        ApiCookieAuth(),
        ApiCreatedResponse({
            description: "Létrehozza a helyet",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    googleplaceID: { type: "string", example: "PELDA123ID" },
                    name: { type: "string", example: "Hely neve" },
                    address: { type: "string", example: "Példa u. 123" }
                }
            }
        })
    )
}

export function AddCategory() {
    return applyDecorators(
        ApiOperation({ summary: "Létrehoz egy hely kategóriákat" }),
        ApiCookieAuth(),
        ApiParam({ name: "placeID", description: "place id" }),
        ApiCreatedResponse({
            description: "Létrehozza a helyhez tartozó kategóriákat",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    category: { type: "string", example: "bar" },
                    placeID: { type: "number", example: 1 }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "A helynek már fel van véve ez a kategória",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "place already has this category!" }
                }
            }
        })
    )
}

export function AddNews() {
    return applyDecorators(
        ApiOperation({ summary: "Hozzáad a helyhez egy hírt" }),
        ApiCookieAuth(),
        ApiParam({ name: "id", description: "place id" }),
        ApiCreatedResponse({
            description: "Sikeresen létrehozta a hírt",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    text: { type: "string", example: "Helyhez tartazó hír szövege" },
                    placeID: { type: "number", example: 1 },
                    userID: { type: "number", example: 1 },
                    approved: { type: "boolean", example: false }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "A helynek már van ilyen kategóriája",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "place already has this category!" }
                }
            }
        })
    )
}

export function UpdateNews() {
    return applyDecorators(
        ApiOperation({ summary: "Módosít egy hírt id alapján" }),
        ApiCookieAuth(),
        ApiParam({ name: "id", description: "news id" }),
        ApiOkResponse({
            description: "Sikeresen módosítja a hírt",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    text: { type: "string", example: "Helyhez tartazó hír módosított szövege" },
                    placeID: { type: "number", example: 1 },
                    userID: { type: "number", example: 1 },
                    approved: { type: "boolean", example: false }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "A felhasználó csak a saját kommentjét módosíthatja",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "You can only edit your own news!" }
                }
            }
        }),
        ApiUnauthorizedResponse({
            description: "Csak bejelentkezett felhasználó módosíthat híreket",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "You can not edit this news!" }
                }
            }
        })
    )
}

export function GetAllNewsByPlace() {
    return applyDecorators(
        ApiOperation({ summary: "Visszadja a helyhez tartozó híreket" }),
        ApiParam({ name: "placeID", description: "place id" }),
        ApiOkResponse({
            description: "Visszadja a híreket",
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        text: { type: "string", example: "Test news text." },
                        placeID: { type: "number", example: 1 },
                        userID: { type: "number", example: 1 }
                    }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "Nincs a helyhez komment",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "No news available for this place!" }
                }
            }
        })
    )
}

export function StatisticsDecorator() {
    return applyDecorators(
        ApiOperation({ summary: "ADMIN - Helyek statisztikáit adja vissza" }),
        ApiCookieAuth(),
        ApiQuery({ name: "period", enum: PeriodEnum }),
        ApiOkResponse({
            description: "Visszaadja a helyek statisztikáit a megadott intervallumon belül",
            schema: {
                items: {
                    properties: {
                        placeId: { type: "number", example: 1 },
                        placeName: { type: "string", example: "Hely neve" },
                        totalPhotos: { type: "number", example: 11 },
                        totalComments: { type: "number", example: 15 },
                        averageRating: { type: "number", example: 4.5 }
                    }
                }
            }
        })
    )
}

export function DeleteNewsDecorator() {
    return applyDecorators(
        ApiOperation({ summary: "ADMIN - Hír törlése" }),
        ApiCookieAuth(),
        ApiParam({ name: "id", description: "news id" }),
        ApiOkResponse({
            description: "Sikeresen törli a hírt",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    message: { type: "string", example: "deleted" }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "A törölni kívánt hír nem található",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "News not found!" }
                }
            }
        })
    )
}