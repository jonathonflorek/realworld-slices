import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ArticleEntity } from './ArticleEntity';

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

    @OneToMany(type => ArticleEntity, article => article.author)
    public articles: ArticleEntity = undefined as any;
}
