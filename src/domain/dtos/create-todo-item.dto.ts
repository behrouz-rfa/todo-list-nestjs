import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoItemDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  priority?: number;
}
