import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Purchase } from './purchase.entity';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,
  ) {}

  // History of purchases (already paid)
  findAll(userId?: number): Promise<Purchase[]> {
    if (userId) {
      return this.purchasesRepository.find({ where: { user: { id: userId }, payment_date: Not(IsNull()) }, relations: ['product'] });
    }
    return this.purchasesRepository.find({ where: { payment_date: Not(IsNull()) }, relations: ['user', 'product'] });
  }

  // Cart methods
  getCart(userId: number): Promise<Purchase[]> {
    return this.purchasesRepository.find({ where: { user: { id: userId }, payment_date: IsNull() }, relations: ['product'] });
  }

  async addToCart(userId: number, productId: number, quantity: number = 1): Promise<Purchase> {
    let item = await this.purchasesRepository.findOne({ where: { user: { id: userId }, product: { id: productId }, payment_date: IsNull() } });
    if (item) {
      item.quantity += quantity;
      return this.purchasesRepository.save(item);
    }
    const purchase = this.purchasesRepository.create({
      user: { id: userId },
      product: { id: productId },
      quantity: quantity,
      payment_date: null
    });
    return this.purchasesRepository.save(purchase);
  }

  async updateCartItem(id: number, quantity: number): Promise<Purchase> {
    const item = await this.purchasesRepository.findOneBy({ id });
    if (!item) throw new NotFoundException('Item not found');
    item.quantity = quantity;
    return this.purchasesRepository.save(item);
  }

  async removeFromCart(id: number): Promise<void> {
    await this.purchasesRepository.delete(id);
  }

  async checkout(userId: number): Promise<void> {
    const items = await this.getCart(userId);
    const now = new Date();
    for (const item of items) {
      item.payment_date = now;
      await this.purchasesRepository.save(item);
    }
  }
}
