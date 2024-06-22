import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoListDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  title: string;
}
