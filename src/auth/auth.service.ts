import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService){}
  signin() {
    return { msg: 'This is the signin route' };
  }

  signup() {
    return { msg: 'This is the signup route' };
  }
}
