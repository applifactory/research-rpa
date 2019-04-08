import { Entity, Column, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Company {
  
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  name: string;

  @Column()
  linkedinUrl: string;

  @Column()
  websiteUrl: string;

}