import { applyDecorators } from "@nestjs/common";
import {
    ApiBadRequestResponse, ApiCookieAuth, ApiCreatedResponse, ApiForbiddenResponse,
    ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse
} from "@nestjs/swagger";

export function AdminGetAllComments() {
    return applyDecorators(
        ApiOperation({ summary: "ADMIN - Visszaadja az összes kommentet" }),
        ApiCookieAuth(),
        ApiOkResponse({
            description: "Visszaadja a kommenteket",
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        commentText: { type: "string", example: "Elég jó ez a hely!" },
                        rating: { type: "number", example: 4 },
                        createdAt: { type: "date", example: "2026-01-28 12:41:49.938" },
                        updatedAt: { type: "date", example: "2026-02-13 12:41:49.939" },
                        userID: { type: "number", example: 1 },
                        placeID: { type: "number", example: 1 },
                        approved: { type: "boolean", example: false }
                    }
                }
            }
        })
    )
}

export function GetCommentById() {
    return applyDecorators(
        ApiOperation({ summary: "Visszaad egy kommentet id alapján" }),
        ApiParam({ name: "id", description: "comment id" }),
        ApiOkResponse({
            description: "Visszaad egy kommentet",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    commentText: { type: "string", example: "Elég jó ez a hely!" },
                    rating: { type: "number", example: 4 },
                    createdAt: { type: "date", example: "2026-01-28 12:41:49.938" },
                    updatedAt: { type: "date", example: "2026-02-13 12:41:49.939" },
                    userID: { type: "number", example: 1 },
                    placeID: { type: "number", example: 1 }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "Elfogadásra váró komment",
            schema: {
                type: "object",
                properties: {
                    res: { type: "string", example: "This comment is waiting for approval!" }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "Nem létezik a komment.",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Comment not found!" }
                }
            }
        })
    )
}

export function GetCommentByUser() {
    return applyDecorators(
        ApiOperation({ summary: "Visszaadja egy felhasználó összes kommentejét id alapján" }),
        ApiParam({ name: "userID", description: "user id" }),
        ApiOkResponse({
            description: "Visszaadja a felhasználó összes kommentjét, ami el van fogadva",
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        commentText: { type: "string", example: "Elég jó ez a hely!" },
                        rating: { type: "number", example: 4 },
                        createdAt: { type: "date", example: "2026-01-28 12:41:49.938" },
                        updatedAt: { type: "date", example: "2026-02-13 12:41:49.939" },
                        userID: { type: "number", example: 1 },
                        placeID: { type: "number", example: 1 }
                    }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "Nincs a felhasználónak kommentje",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "User did not post any comments!" }
                }
            }
        })
    )
}

export function GetCommentByPlace() {
    return applyDecorators(
        ApiOperation({ summary: "Visszaadja egy hely összes kommentejét id alapján" }),
        ApiParam({ name: "placeID", description: "place id" }),
        ApiOkResponse({
            description: "Visszaadja a hely összes kommentjét, ami el van fogadva",
            schema: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        commentText: { type: "string", example: "Elég jó ez a hely!" },
                        rating: { type: "number", example: 4 },
                        createdAt: { type: "date", example: "2026-01-28 12:41:49.938" },
                        updatedAt: { type: "date", example: "2026-02-13 12:41:49.939" },
                        userID: { type: "number", example: 1 },
                        placeID: { type: "number", example: 1 }
                    }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "A hely nem található",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Place not found!" }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "A helyhez nem posztoltak kommentet",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Place does not have any comments!" }
                }
            }
        })
    )
}

export function AddComment() {
    return applyDecorators(
        ApiOperation({ summary: "Hozzáad egy kommentet" }),
        ApiCookieAuth(),
        ApiCreatedResponse({
            description: "Létrehozza a kommentet",
            schema: {
                type: "object",
                properties: {
                    commentText: { type: "string", example: "Komment szöveg" },
                    rating: { type: "number", example: 4 },
                    placeID: { type: "number", example: 1 }
                }
            }
        }),
        ApiBadRequestResponse({
            description: "Elutasítja a komment létrehozását",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "array", example: [
                            "commentText must be longer than or equal to 1 characters",
                            "commentText must be a string",
                            "commentText should not be empty",
                            "placeID must be a number conforming to the specified constraints",
                            "placeID should not be empty"
                        ]
                    }
                }
            }
        }),
        ApiUnauthorizedResponse({
            description: "Elutasítja a komment létrehozását, ha a felhasználó nincs bejelentkezve",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Unauthorized" }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "Nem találja a helyet amihez kommentelni szeretnénk",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Place not found!" }
                }
            }
        })
    )
}

export function DeleteComment() {
    return applyDecorators(
        ApiOperation({ summary: "Töröl egy kommentet id alapján" }),
        ApiCookieAuth(),
        ApiParam({ name: "id", description: "comment id" }),
        ApiOkResponse({ description: "Sikeres komment törlés" }),
        ApiNotFoundResponse({
            description: "Nincs komment amit törölni lehetne",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Can not delete comment, not found!" }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "A bejelentkezett felhasználó csak a saját kommentjét törölheti",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "You can only delete your own comment!" }
                }
            }
        })
    )
}

export function UpdateComment() {
    return applyDecorators(
        ApiOperation({ summary: "Módosít egy kommentet" }),
        ApiCookieAuth(),
        ApiParam({ name: "id", description: "comment id" }),
        ApiOkResponse({
            description: "Sikeres módosítás",
            schema: {
                type: "object",
                properties: {
                    commentText: { type: "string", example: "Fissített komment üzenet" },
                    rating: { type: "number", example: 4 },
                    placeID: { type: "number", example: 1 }
                }
            }
        }),
        ApiBadRequestResponse({
            description: "Elutasítja a módosítást",
            schema: {
                type: "object",
                properties: {
                    message: {
                        type: "array", example: [
                            "commentText must be longer than or equal to 1 characters",
                            "commentText should not be empty",
                            "rating must not be greater than 5"
                        ]
                    }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "A bejelentkezett felhasználó csak a saját kommentjeit módosíthatja",
            schema: {
                type: "object",
                properties: {
                    messsage: { type: "string", example: "You can only edit your own comments!" }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "Nem található a komment amit módosítani szeretne a felhasználó",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "No comment found!" }
                }
            }
        })
    )
}

export function AdminApprovesComment() {
    return applyDecorators(
        ApiOperation({ summary: "ADMIN - Elfogadja a kommentet" }),
        ApiCookieAuth(),
        ApiParam({ name: "id", description: "comment id" }),
        ApiOkResponse({
            description: "Sikeres módosítás",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    approved: { type: "boolean", example: true }
                }
            }
        }),
        ApiNotFoundResponse({
            description: "Nem található a komment amit el szeretne fogadni az admin",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Comment not found!" }
                }
            }
        }),
        ApiForbiddenResponse({
            description: "Csak adminnak van hozzáférése",
            schema: {
                type: "object",
                properties: {
                    messsage: { type: "string", example: "Forbidden resource!" }
                }
            }
        })
    )
}