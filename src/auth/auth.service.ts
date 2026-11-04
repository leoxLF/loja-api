
import {ConflictException,Injectable,UnauthorizedException} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async register(username: string, email: string, password: string) {
        const exists = await this.userRepository.findOne({
            where: [{ username }, { email }]
        });

        if (exists) {
            throw new ConflictException('Usuário ou email já cadastrado');
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            username,
            email,
            password: hashed_password
        });

        const saved_user = await this.userRepository.save(user);

        const { password: _, ...user_without_password } = saved_user;

        return user_without_password;
    }

    async login(username: string, password: string) {
        const user = await this.userRepository.findOne({
            where: { username }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role
        };

        const accessOptions: JwtSignOptions = {
            secret: this.configService.getOrThrow<string>('JWT_SECRET'),
            expiresIn: this.configService.get<JwtSignOptions['expiresIn']>('JWT_EXPIRES_IN') ?? '15m'
        };

        const refreshOptions: JwtSignOptions = {
            secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<JwtSignOptions['expiresIn']>('JWT_REFRESH_EXPIRES_IN') ?? '1d'
        };

        const access_token = await this.jwtService.signAsync(
            payload,
            accessOptions
        );

        const refresh_token = await this.jwtService.signAsync(
            { sub: user.id },
            refreshOptions
        );

        user.refreshTokenHash = await bcrypt.hash(refresh_token, 10);

        await this.userRepository.save(user);

        return {
            access_token,
            refresh_token
        };
    }

    async refresh(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync<{ sub: number }>(
                refreshToken,
                {
                    secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET')
                }
            );

            const user = await this.userRepository
                .createQueryBuilder('user')
                .addSelect('user.refreshTokenHash')
                .where('user.id = :id', { id: payload.sub })
                .getOne();

            if (!user || !user.refreshTokenHash) {
                throw new UnauthorizedException('Refresh token inválido');
            }

            const isValid = await bcrypt.compare(
                refreshToken,
                user.refreshTokenHash
            );

            if (!isValid) {
                throw new UnauthorizedException('Refresh token inválido');
            }

            const accessOptions: JwtSignOptions = {
                secret: this.configService.getOrThrow<string>('JWT_SECRET'),
                expiresIn: this.configService.get<JwtSignOptions['expiresIn']>('JWT_EXPIRES_IN') ?? '15m'
            };

            const access_token = await this.jwtService.signAsync(
                {
                    sub: user.id,
                    username: user.username,
                    role: user.role
                },
                accessOptions
            );

            return { access_token };

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            throw new UnauthorizedException('Refresh token inválido ou expirado');
        }
    }

    async me(userId: number) {
    const user = await this.userRepository.findOne({
        where: { id: userId }
    });

    if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
    }

    return {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    };
}
}
