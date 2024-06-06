import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // request: stores the request object.
    const request = context.switchToHttp().getRequest();

    // token: fetched and stores the access token passed via headers.
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('invalid bearer token');
    }

    // payload: stores the extracted data from the jwt token i.e. { userId, email }.
    const payload = await this.jwtService
      .verifyAsync(token, {
        secret: 'mysecret',
      })
      .catch((error) => {
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('invalid bearer token');
        }
        throw error;
      });

    // request.user: stores the payload for access in the protected routes.
    request.user = payload;

    return true;
  }

  // extractTokenFromHeader(): helper function to extract the bearer token from the header.
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
