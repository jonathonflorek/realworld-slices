import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('article')
export class ArticleEntity {

    @PrimaryGeneratedColumn()
    public id: number = 0;

    @Column()
    public slug: string = '';

    @Column()
    public title: string = '';

    @Column()
    public description: string = '';

    @Column()
    public body: string = '';

    @Column('timestamp')
    public created: Date = undefined as any;

    @Column('timestamp')
    public updated: Date = undefined as any;

    @Column('simple-array')
    public tagList: string[] = undefined as any;

    @ManyToOne(type => UserEntity, user => user.articles)
    public author: UserEntity = undefined as any;
}
