import { SetMetadata } from '@nestjs/common';

export const PAGINATE_KEY = 'paginate';

/**
 * Decorator to enable automatic pagination for an endpoint
 * Apply this to controller methods that return arrays of data
 *
 * @example
 * @Get('products')
 * @Paginate()
 * async getAllProducts() {
 *   return this.productsService.findAll();
 * }
 */
export const Paginate = () => SetMetadata(PAGINATE_KEY, true);
