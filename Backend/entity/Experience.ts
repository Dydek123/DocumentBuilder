import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('experience')
export class Experience extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_experience: number;

    @Column()
    id_details: number

    @Column()
    place: string;

    @Column()
    role: string;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column()
    is_actual: boolean;

    @Column()
    description: string;
}
