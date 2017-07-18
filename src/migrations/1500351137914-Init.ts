import { Connection, EntityManager, MigrationInterface, QueryRunner } from "typeorm";

export class Init1500351137914 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS vehicle (
                id serial PRIMARY KEY,
                vin VARCHAR (255) UNIQUE NOT NULL,
                year integer NOT NULL,
                make VARCHAR (255) NOT NULL,
                model VARCHAR (255) NOT NULL,
                created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT clock_timestamp()
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("vehicle");
    }

}
