import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDot } from 'src/dot/auth.dot';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private jwtPayload: JwtService,
  ) {}

  async createUser(AuthDot: AuthDot): Promise<User> {
    const { username, password } = AuthDot;
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.authRepository.create({
      username,
      password: hashedPassword,
    });
    await this.authRepository.save(user);
    return user;
    // try {
    //   await this.authRepository.save(user);
    //   return user;
    // } catch (error) {
    //   if (error.code === '23505') {
    //     throw new ConflictException('Username already exists 😃');
    //   } else {
    //     throw new NotFoundException('Something went wrong!');
    //   }
    // }
  }

  async login(AuthDot: AuthDot): Promise<{ accessToken: string }> {
    const { username, password } = AuthDot;
    const user = await this.authRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtPayload.sign(payload);
      return { accessToken };
    } else {
      throw new NotFoundException('Invalid Credentials 😕');
    }
  }
}
