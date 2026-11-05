import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiOperation({ summary: 'Registra um novo usuário', description: 'Cadastra um usuário no sistema utilizando nome de usuário, e-mail e senha.' })
    @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos, e-mail inválido ou campos fora dos critérios de validação.' })
    @ApiResponse({ status: 409, description: 'Nome de usuário ou e-mail já cadastrado.' })
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto.username, dto.email, dto.password);
    }

    @ApiOperation({ summary: 'Autentica um usuário', description: 'Realiza a autenticação utilizando nome de usuário e senha, retornando um token JWT.' })
    @ApiResponse({ status: 201, description: 'Login realizado com sucesso. Token JWT retornado.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou fora dos critérios de validação.' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.username, dto.password);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@Req() req: any) {
        return this.authService.me(req.user.userId);
    }

    @ApiOperation({ summary: 'Atualiza o access token utilizando um refresh token' })
    @ApiResponse({ status: 201, description: 'Novo access token gerado com sucesso.' })
    @ApiResponse({ status: 401, description: 'Refresh token inválido ou expirado.' })
    @Post('refresh')
    refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refresh(dto.refresh_token);
    }
}
