import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.purchases)
  user: User;

  @ManyToOne(() => Product, product => product.purchases, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'datetime', nullable: true })
  payment_date: Date | null;
}
