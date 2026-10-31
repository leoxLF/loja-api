import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async register(username: string, email: string, password: string) {
        const exists = await this.userRepository.findOne({where: [{username}, {email}]});
        if (exists) throw new ConflictException('Usuário ou email já cadastrado');

        const hashed_password = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({username, email, password: hashed_password});
        const saved_user = await this.userRepository.save(user);
       const { password: _, ...user_without_password } = saved_user;
       return user_without_password;
    }

    async login(username: string, password: string){
        const user = await this.userRepository.findOne({where: {username}});
        if(!user || !(await bcrypt.compare(password, user.password))) throw new UnauthorizedException('credenciais inválidas');
        const payload = { sub: user.id, username: user.username, role: user.role};
        return{
            access_token: await this.jwtService.signAsync(payload)
        }
    }

}