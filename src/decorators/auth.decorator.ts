import { applyDecorators } from "@nestjs/common";
import {
    ApiCookieAuth, ApiForbiddenResponse, ApiNotFoundResponse,
    ApiOkResponse, ApiOperation, ApiUnauthorizedResponse
} from "@nestjs/swagger";

export function Login() {
    return applyDecorators(
        ApiOperation({ summary: "Bejelentkezés" }),
        ApiOkResponse({
            description: "Sikeres bejelentkezés",
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    email: { type: "string", example: "email@email.email" },
                    role: { type: "string", example: "user" }
                }
            }
        }),
        ApiUnauthorizedResponse({
            description: "Helytelen jelszó",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Unathorized!" }
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

export function GetProfile() {
    return applyDecorators(
        ApiOperation({ summary: 'Profil lekérése', deprecated: true }),
        ApiCookieAuth(),
        ApiOkResponse({ description: 'Lekért profil' })
    )
}

export function GetMe() {
    return applyDecorators(
        ApiOperation({ summary: 'Profil lekérése' }),
        ApiCookieAuth(),
        ApiOkResponse({
            description: 'Lekért profil',
            schema: {
                type: "object",
                properties: {
                    id: { type: "number", example: 1 },
                    userName: { type: "string", example: "felhasználónév" },
                    email: { type: "string", example: "felhasznalo@pelda.com" },
                    age: { type: "number", example: 18 }
                }
            }
        })
    )
}

export function Logout() {
    return applyDecorators(
        ApiOperation({
            summary: 'Kijelentkezés',
            description: 'Szükséges hogy a felhasználó be legyen jelentkezve!',
        }),
        ApiCookieAuth(),
        ApiOkResponse({ description: 'Sikeres kijelentkezés' })
    )
}