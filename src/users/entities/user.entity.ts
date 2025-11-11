import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer'; 

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  ARTIST = 'artist',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // 🚨 إخفاء كلمة المرور
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  // 1. عمود الصلاحية (Roles)
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, 
  })
  role: UserRole; 
  
  // 2. عمود API Key (مُولد بواسطة UUID)
  @Column({ 
    unique: true, 
    nullable: true,
    type: 'varchar', 
  })
  @Exclude() // 🚨 إخفاء المفتاح في الردود
  apiKey: string; 
  
  // 3. حقول المصادقة الثنائية (Two-Factor Authentication)
  @Column({ nullable: true })
  @Exclude() // 🚨 إخفاء المفتاح السري لـ 2FA
  twoFactorSecret: string; 

  @Column({ default: false })
  isTwoFactorEnabled: boolean;
}