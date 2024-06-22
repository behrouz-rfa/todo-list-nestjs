import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../domain/services/user.service';
import { CreateUserDto, LoginUserDto } from '../domain/dtos/create-user.dto';
import { User } from '../domain/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userReq: LoginUserDto) {
    const user = await this.userService.findByUsername(userReq.username);
    if (user && (await bcrypt.compare(userReq.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      const payload = { username: user.username, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    return null;
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.findByUsername(createUserDto.username);
    if (user) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.userService.registerUser({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser;
  }
}
