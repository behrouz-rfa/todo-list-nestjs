import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '../../application/queries/get-user.query';
import { User } from '../../domain/models/user.model';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get User by ID' })
  @ApiResponse({ status: 200, description: 'Returns the user.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(@Param('id') userId: string): Promise<User> {
    return this.queryBus.execute(new GetUserQuery(userId));
  }
}
