import { Entity, Column, ObjectID, ObjectIdColumn, BeforeInsert } from 'typeorm';
import * as crypto from 'crypto';

@Entity()
export class User {
  
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }
  @Column()
  password: string;

}