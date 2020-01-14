import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    public id: number = 0;

    @Column()
    public username: string = '';

    @Column()
    public email: string = '';

    @Column()
    public bio: string = '';

    @Column()
    public image: string = '';

    @Column()
    public salt: string = '';

    @Column()
    public hash: string = '';
}
