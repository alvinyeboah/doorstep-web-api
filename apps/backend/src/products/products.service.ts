import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProductDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException(
        'Vendor profile not found. Please register as a vendor first.',
      );
    }

    const product = await this.prisma.product.create({
      data: {
        vendorId: vendor.id,
        name: dto.name,
        price: dto.price,
        description: dto.description,
        photoUrl: dto.photoUrl,
        category: dto.category,
        available: dto.available ?? true,
      },
      include: {
        vendor: {
          select: {
            id: true,
            shopName: true,
          },
        },
      },
    });

    return {
      product,
      message: 'Product created successfully',
    };
  }

  async update(userId: string, productId: string, dto: UpdateProductDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.vendorId !== vendor.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: dto,
    });

    return {
      product: updated,
      message: 'Product updated successfully',
    };
  }

  async delete(userId: string, productId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.vendorId !== vendor.id) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { message: 'Product deleted successfully' };
  }

  async getMyProducts(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const products = await this.prisma.product.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }

  async getProductsByVendor(vendorId: string) {
    const products = await this.prisma.product.findMany({
      where: { vendorId, available: true },
      orderBy: { name: 'asc' },
    });

    return products;
  }

  async getProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        vendor: {
          select: {
            id: true,
            shopName: true,
            address: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async searchProducts(search: string) {
    const products = await this.prisma.product.findMany({
      where: {
        AND: [
          { available: true },
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' as any } },
              { description: { contains: search, mode: 'insensitive' as any } },
              { category: { contains: search, mode: 'insensitive' as any } },
            ],
          },
        ],
      },
      include: {
        vendor: {
          select: {
            id: true,
            shopName: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return products;
  }
}
