import { PartialType, PickType } from '@nestjs/mapped-types'
import { CreateNewsDto } from './create-news.dto';

export class UpdateNewsDto extends PartialType(
    PickType(CreateNewsDto, ['text'] as const)
) {}