import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    if (req.user.profile === 'admin') {
      return this.purchasesService.findAll();
    }
    return this.purchasesService.findAll(req.user.userId);
  }

  // Cart Endpoints
  @UseGuards(JwtAuthGuard)
  @Get('cart')
  getCart(@Request() req) {
    return this.purchasesService.getCart(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cart')
  addToCart(@Request() req, @Body('productId') productId: number, @Body('quantity') quantity: number) {
    return this.purchasesService.addToCart(req.user.userId, productId, quantity || 1);
  }

  @UseGuards(JwtAuthGuard)
  @Put('cart/:id')
  updateCartItem(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.purchasesService.updateCartItem(+id, quantity);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cart/:id')
  removeFromCart(@Param('id') id: string) {
    return this.purchasesService.removeFromCart(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  checkout(@Request() req) {
    return this.purchasesService.checkout(req.user.userId);
  }
}
