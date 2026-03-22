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
            description: "Az email cím amivel be próbál jelentkezni nem található",
            schema: {
                type: "object",
                properties: {
                    message: { type: "string", example: "User not found!" }
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