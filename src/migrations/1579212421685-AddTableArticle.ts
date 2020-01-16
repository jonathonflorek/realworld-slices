import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTableArticle1579212421685 implements MigrationInterface {
    name = 'AddTableArticle1579212421685'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "article" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "body" character varying NOT NULL, "created" TIMESTAMP NOT NULL, "updated" TIMESTAMP NOT NULL, "tagList" text NOT NULL, "authorId" integer, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "article" ADD CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_a9c5f4ec6cceb1604b4a3c84c87"`, undefined);
        await queryRunner.query(`DROP TABLE "article"`, undefined);
    }

}
