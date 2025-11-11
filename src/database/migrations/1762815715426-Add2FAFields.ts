import { MigrationInterface, QueryRunner } from "typeorm";

export class Add2FAFields1762815715426 implements MigrationInterface {
    name = 'Add2FAFields1762815715426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "apiKey" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_c654b438e89f6e1fbd2828b5d37" UNIQUE ("apiKey")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "twoFactorSecret" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isTwoFactorEnabled" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isTwoFactorEnabled"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "twoFactorSecret"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_c654b438e89f6e1fbd2828b5d37"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "apiKey"`);
    }

}
