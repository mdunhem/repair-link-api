import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Vehicle {

    @PrimaryGeneratedColumn()
    id: Number;

    @Column()
    vin: String;

    @Column("int")
    year: Number;

    @Column()
    make: String;

    @Column()
    model: String;

    @CreateDateColumn()
    created: Date;

}