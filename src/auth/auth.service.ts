import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // Hash the password
    const hash = await argon.hash(dto.password);
    try {
      // Save the user in the database
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;
      // Return the saved user
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // compare password
    const pwdMatch = await argon.verify(user.hash, dto.password);
    // if password does not match throw exception
    if (!pwdMatch) throw new ForbiddenException('Credentials incorrect');
    // send back the user
    delete user.hash;
    return user;
    return { msg: 'This is the signin route' };
  }
}
