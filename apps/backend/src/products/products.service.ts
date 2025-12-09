import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { createPaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, dto: CreateProductDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId, deletedAt: null },
    });

    if (!vendor) {
      throw new NotFoundException(
        'Vendor profile not found. Please register as a vendor first.',
      );
    }

    // Validate prices
    if (dto.discountPrice && dto.discountPrice >= dto.price) {
      throw new BadRequestException(
        'Discount price must be less than regular price',
      );
    }

    if (dto.originalPrice && dto.discountPrice && dto.originalPrice < dto.discountPrice) {
      throw new BadRequestException(
        'Original price must be greater than or equal to discount price',
      );
    }

    if (dto.originalPrice && !dto.discountPrice && dto.originalPrice < dto.price) {
      throw new BadRequestException(
        'Original price must be greater than or equal to current price',
      );
    }

    const product = await this.prisma.product.create({
      data: {
        vendorId: vendor.id,
        name: dto.name,
        price: dto.price,
        originalPrice: dto.originalPrice,
        discountPrice: dto.discountPrice,
        description: dto.description,
        photoUrl: dto.photoUrl,
        images: dto.images || [],
        category: dto.category,
        tags: dto.tags || [],
        allergens: dto.allergens || [],
        calories: dto.calories,
        preparationTime: dto.preparationTime,
        stockQuantity: dto.stockQuantity,
        isPopular: dto.isPopular ?? false,
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
      where: { userId, deletedAt: null },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.vendorId !== vendor.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    // Validate prices if being updated
    const finalPrice = dto.price ?? product.price;
    const finalDiscountPrice = dto.discountPrice ?? product.discountPrice;
    const finalOriginalPrice = dto.originalPrice ?? product.originalPrice;

    if (finalDiscountPrice && finalDiscountPrice >= finalPrice) {
      throw new BadRequestException(
        'Discount price must be less than regular price',
      );
    }

    if (finalOriginalPrice && finalDiscountPrice && finalOriginalPrice < finalDiscountPrice) {
      throw new BadRequestException(
        'Original price must be greater than or equal to discount price',
      );
    }

    if (finalOriginalPrice && !finalDiscountPrice && finalOriginalPrice < finalPrice) {
      throw new BadRequestException(
        'Original price must be greater than or equal to current price',
      );
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
      where: { userId, deletedAt: null },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.vendorId !== vendor.id) {
      throw new ForbiddenException('You can only delete your own products');
    }

    // Soft delete instead of hard delete
    await this.prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Product deleted successfully' };
  }

  async getMyProducts(userId: string, page = 1, limit = 20) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId, deletedAt: null },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const where = { vendorId: vendor.id, deletedAt: null };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return createPaginatedResponse(products, total, page, limit);
  }

  async getProductsByVendor(vendorId: string) {
    // Verify vendor exists and is not deleted
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId, deletedAt: null },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const products = await this.prisma.product.findMany({
      where: {
        vendorId,
        available: true,
        deletedAt: null,
      },
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
            verified: true,
            deletedAt: true,
          },
        },
      },
    });

    if (!product || product.deletedAt) {
      throw new NotFoundException('Product not found');
    }

    if (product.vendor.deletedAt) {
      throw new NotFoundException('Vendor no longer available');
    }

    return product;
  }

  async searchProducts(search: string, page = 1, limit = 20) {
    const where = {
      AND: [
        { available: true, deletedAt: null },
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' as any } },
            { description: { contains: search, mode: 'insensitive' as any } },
            { category: { contains: search, mode: 'insensitive' as any } },
            { tags: { has: search } },
          ],
        },
        {
          vendor: {
            deletedAt: null,
            verified: true,
          },
        },
      ],
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          vendor: {
            select: {
              id: true,
              shopName: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    // Filter out products with deleted vendors
    const validProducts = products.filter((p: any) => p.vendor);

    return createPaginatedResponse(validProducts, total, page, limit);
  }

  async getAllProducts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          available: true,
          deletedAt: null,
          vendor: {
            deletedAt: null,
            verified: true,
          },
        },
        include: {
          vendor: {
            select: {
              id: true,
              shopName: true,
              logoUrl: true,
              address: true,
              location: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({
        where: {
          available: true,
          deletedAt: null,
          vendor: {
            deletedAt: null,
            verified: true,
          },
        },
      }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  async filterByTags(tags: string[], page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Convert tags to lowercase for case-insensitive matching
    const lowerTags = tags.map(tag => tag.toLowerCase());

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          available: true,
          deletedAt: null,
          vendor: {
            deletedAt: null,
            verified: true,
          },
          tags: {
            hasSome: lowerTags, // Match products that have any of the specified tags
          },
        },
        include: {
          vendor: {
            select: {
              id: true,
              shopName: true,
              logoUrl: true,
            },
          },
        },
        orderBy: { soldCount: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({
        where: {
          available: true,
          deletedAt: null,
          vendor: {
            deletedAt: null,
            verified: true,
          },
          tags: {
            hasSome: lowerTags,
          },
        },
      }),
    ]);

    return {
      products,
      tags: lowerTags,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  async filterByAllergens(excludeAllergens: string[], page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Get all products and filter out those with excluded allergens
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          available: true,
          deletedAt: null,
          vendor: {
            deletedAt: null,
            verified: true,
          },
          NOT: {
            allergens: {
              hasSome: excludeAllergens, // Exclude products with any of these allergens
            },
          },
        },
        include: {
          vendor: {
            select: {
              id: true,
              shopName: true,
              logoUrl: true,
            },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({
        where: {
          available: true,
          deletedAt: null,
          vendor: {
            deletedAt: null,
            verified: true,
          },
          NOT: {
            allergens: {
              hasSome: excludeAllergens,
            },
          },
        },
      }),
    ]);

    return {
      products,
      excludedAllergens: excludeAllergens,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  async getPopularProducts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          available: true,
          deletedAt: null,
          vendor: {
            deletedAt: null,
            verified: true,
          },
          OR: [
            { isPopular: true },
            { soldCount: { gt: 0 } },
          ],
        },
        include: {
          vendor: {
            select: {
              id: true,
              shopName: true,
              logoUrl: true,
            },
          },
        },
        orderBy: [
          { isPopular: 'desc' },
          { soldCount: 'desc' },
        ],
        skip,
        take: limit,
      }),
      this.prisma.product.count({
        where: {
          available: true,
          deletedAt: null,
          vendor: {
            deletedAt: null,
            verified: true,
          },
          OR: [
            { isPopular: true },
            { soldCount: { gt: 0 } },
          ],
        },
      }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }
}
