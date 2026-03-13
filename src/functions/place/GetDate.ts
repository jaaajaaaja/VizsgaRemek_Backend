import { PeriodEnum } from "src/types/place-types"

export function GetDate(period: PeriodEnum): { startOfMonth: Date, endOfMonth: Date } {
    const now = new Date()

    let startOfMonth: Date = new Date()
    let endOfMonth: Date = new Date()

    if (period == PeriodEnum.TODAY) {
        startOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
        endOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    }

    if (period == PeriodEnum.WEEK) {
        const dayOfWeek = now.getDay()
        startOfMonth.setDate(now.getDate() - dayOfWeek)
        startOfMonth.setHours(0, 0, 0, 0)

        endOfMonth.setDate(startOfMonth.getDate() + 6)
        endOfMonth.setHours(23, 59, 59, 999)
    }

    if (period == PeriodEnum.MONTH) {
        startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    }

    if (period == PeriodEnum.YEAR) {
        startOfMonth = new Date(now.getFullYear(), 0, 1)
        endOfMonth = new Date(now.getFullYear() + 1, 0, 1)
    }

    return { startOfMonth, endOfMonth }
}