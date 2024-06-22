import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoItemDto {
  @ApiProperty()
  title?: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  priority?: number;
}
