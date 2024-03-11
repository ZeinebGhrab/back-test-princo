import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRolesMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: any, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'Missing Authorization Header' });
    }

    const token = req.headers.authorization;
    console.log('token', token);
    try {
      const decoded = this.jwtService.verify(token.split(' ')[1], {
        secret: this.configService.get('JWT_AT_SECRET'),
      });
      req.user = decoded;
      console.log('Decoded Token:', decoded);
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).send({ message: 'Invalid Token' });
    }
  }
}
