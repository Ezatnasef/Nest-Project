import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedArtistRelation1762280534228 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "songs"
            ADD COLUMN "artist_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "songs"
            ADD CONSTRAINT "FK_songs_artist_id" FOREIGN KEY ("artist_id") REFERENCES "artists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "songs"
            ALTER COLUMN "artist_id" SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "songs"
            DROP CONSTRAINT "FK_songs_artist_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "songs"
            DROP COLUMN "artist_id"
        `);
    }

}
