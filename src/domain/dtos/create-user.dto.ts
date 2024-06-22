import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly password: string;
}

export class LoginUserDto {
  @ApiProperty()
  readonly username: string;
  @ApiProperty()
  readonly password: string;
}
