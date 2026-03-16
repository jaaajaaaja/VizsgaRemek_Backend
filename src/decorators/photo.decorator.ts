import { applyDecorators } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConsumes, ApiCookieAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from "@nestjs/swagger";

export function AdminGetAllPhoto() {
    return applyDecorators(
        ApiOperation({ summary: "ADMIN - Visszaadja az összes képet" }),
        ApiCookieAuth(),
        ApiOkResponse({
            description: "Visszadja a képeket",
            schema: {
                type: "array",
                items: {
                    properties: {
                        id: { type: "number", example: 1 },
                        location: { type: "string", example: "uploads/example.jpg" },
                        type: { type: "string", example: "image/jpg" },
                        user: { type: "string", example: "user name" },
                        place: { type: "string", example: "place name" },
                        approved: { type: "boolean", example: false }
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

export function GetPhotoById() {
    return applyDecorators(
        ApiOperation({ summary: "Visszaad egy képet id alapján" }),
        ApiParam({ name: "id", description: "photo id" }),
        ApiOkResponse({
            description: "Sikeresen visszaad egy képet",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    location: { type: "string", example: "uploads/example.jpg" },
                    type: { type: "string", example: "image/jpg" },
                    user: { type: "string", example: "user name" },
                    place: { type: "string", example: "place name" }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "A kép elfogadásra vár",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "This image is waiting for approval!" }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "A kép nem található",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Image not found!" }
                }
            }
        })
    )
}

export function GetAllPhotoByUser() {
    return applyDecorators(
        ApiOperation({ summary: "Visszaadja a felhasználő összes feltöltött és elfogadott képét" }),
        ApiParam({ name: "userID", description: "user id" }),
        ApiOkResponse({
            description: "Sikeresen visszaadja a képeket",
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        location: { type: "string", example: "uploads/example.jpg" },
                        type: { type: "string", example: "image/jpg" },
                        user: { type: "string", example: "user name" },
                        place: { type: "string", example: "place name" }
                    }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "A felhasználó nem töltött fel képet",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "user did not upload any images!" }
                }
            }
        })
    )
}

export function GetAllPhotoByPlace() {
    return applyDecorators(
        ApiOperation({ summary: "Visszaadja a helyhez feltöltött összes elfogadott képét" }),
        ApiParam({ name: "placeID", description: "place id" }),
        ApiOkResponse({
            description: "Sikeresen visszaadja a képeket",
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        location: { type: "string", example: "uploads/example.jpg" },
                        type: { type: "string", example: "image/jpg" },
                        user: { type: "string", example: "user name" },
                        place: { type: "string", example: "place name" }
                    }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "A helyhez még nincs feltöltött képet",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "place does not have any images!" }
                }
            }
        })
    )
}

export function DeletePhotoById() {
    return applyDecorators(
        ApiOperation({ summary: "Töröl egy képet id alapján" }),
        ApiCookieAuth(),
        ApiParam({ name: "id", description: "photo id" }),
        ApiOkResponse({
            description: "Sikeresen töröl egy képet",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    location: { type: "string", example: "uploads/example.jpg" },
                    type: { type: "string", example: "image/jpg" },
                    user: { type: "string", example: "user name" },
                    place: { type: "string", example: "place name" }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "A felhasználó csak a saját képeit törölheti",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "You can only delete your own photos!" }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "A törölni kívánt kép nem található",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Image not found!" }
                }
            }
        })
    )
}

export function AddPhotos() {
    return applyDecorators(
        ApiOperation({ summary: "Feltölt 1-3 képet egy helyhez" }),
        ApiCookieAuth(),
        ApiConsumes('multipart/form-data'),
        ApiCreatedResponse({
            description: "Sikeresen feltöltötte a képeket",
            schema: {
                type: "number",
                example: 201
            }
        }),
        ApiBadRequestResponse({
            description: "Nem megfelelő formátum vagy hiányzó paraméterek",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "userID and placeID are required!" }
                }
            }
        }),
        ApiUnauthorizedResponse({
            description: "Nincs hitelesítés vagy érvénytelen token",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Unauthorized" }
                }
            }
        })
    )
}

export function AdminApprovesPhoto() {
    return applyDecorators(
        ApiOperation({ summary: "ADMIN - Elfogadja a képet" }),
        ApiCookieAuth(),
        ApiParam({ name: "id", description: "photo id" }),
        ApiOkResponse({
            description: "Sikeresen elfogadja a képet",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    location: { type: "string", example: "uploads/example.jpg" },
                    type: { type: "string", example: "image/jpg" },
                    user: { type: "string", example: "user name" },
                    place: { type: "string", example: "place name" },
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
        }),
        ApiNotFoundResponse({
            description: "Az elfogadni kívánt fotó nem található",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Image not found!" }
                }
            }
        })
    )
}