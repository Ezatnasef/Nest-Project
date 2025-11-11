import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // 🚨 نستدعي ApiProperty

export class SignupDto {
  
  @ApiProperty({ description: 'The email address of the user.', example: 'user.new@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 6, description: 'The password (min 6 characters).', example: 'SecureP@ss123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'The first name of the user.', example: 'Ahmad' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'The last name of the user.', example: 'Samy' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}