import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: IUser) {
    const payload = { email: user.email, sub: user.id };
  
    // Ajoutez la catégorie à la réponse de l'utilisateur
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: user.type,
      category: user.category,  // Ajoutez la catégorie ici
      latitude: user.latitude,
      longitude: user.longitude,
    };
  
    return {
      access_token: this.jwtService.sign(payload),
      user: userResponse,
    };
  }
  
}
