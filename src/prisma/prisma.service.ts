import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';


@Injectable()
export class PrismaService extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        try {
            await this.$connect()
        } catch (e) {
            console.error("Failed to connect to databse! ", e)
            throw e
        }
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}
