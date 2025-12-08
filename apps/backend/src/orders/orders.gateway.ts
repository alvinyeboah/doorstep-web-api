import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Configure appropriately for production
    credentials: true,
  },
  namespace: '/orders',
})
export class OrdersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrdersGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Customer/Vendor subscribes to order updates
   * Usage: socket.emit('subscribeToOrder', orderId)
   */
  @SubscribeMessage('subscribeToOrder')
  handleSubscribeToOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() orderId: string,
  ) {
    client.join(`order:${orderId}`);
    this.logger.log(`Client ${client.id} subscribed to order:${orderId}`);
    return { event: 'subscribed', orderId };
  }

  /**
   * Unsubscribe from order updates
   */
  @SubscribeMessage('unsubscribeFromOrder')
  handleUnsubscribeFromOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() orderId: string,
  ) {
    client.leave(`order:${orderId}`);
    this.logger.log(`Client ${client.id} unsubscribed from order:${orderId}`);
    return { event: 'unsubscribed', orderId };
  }

  /**
   * Stepper sends live location updates
   * Usage: socket.emit('updateStepperLocation', { orderId, latitude, longitude })
   */
  @SubscribeMessage('updateStepperLocation')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { orderId: string; latitude: number; longitude: number },
  ) {
    this.logger.debug(
      `Location update for order ${data.orderId}: ${data.latitude}, ${data.longitude}`,
    );

    // Broadcast to all clients subscribed to this order
    this.server.to(`order:${data.orderId}`).emit('stepperLocationUpdated', {
      orderId: data.orderId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date().toISOString(),
    });

    return { event: 'locationUpdated', success: true };
  }

  /**
   * Backend calls this when order status changes
   */
  emitOrderStatusUpdate(orderId: string, status: string, orderData?: any) {
    this.logger.log(`Emitting status update for order ${orderId}: ${status}`);

    this.server.to(`order:${orderId}`).emit('orderStatusUpdated', {
      orderId,
      status,
      order: orderData,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Backend calls this when stepper is assigned
   */
  emitStepperAssigned(orderId: string, stepperData: any) {
    this.logger.log(`Emitting stepper assigned for order ${orderId}`);

    this.server.to(`order:${orderId}`).emit('stepperAssigned', {
      orderId,
      stepper: stepperData,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Notify stepper of new delivery assignment
   */
  notifyStepperNewOrder(stepperId: string, orderData: any) {
    this.logger.log(`Notifying stepper ${stepperId} of new order`);

    this.server.to(`stepper:${stepperId}`).emit('newOrderAssigned', {
      order: orderData,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Stepper joins their personal room for receiving delivery notifications
   */
  @SubscribeMessage('registerStepper')
  handleRegisterStepper(
    @ConnectedSocket() client: Socket,
    @MessageBody() stepperId: string,
  ) {
    client.join(`stepper:${stepperId}`);
    this.logger.log(`Stepper ${stepperId} registered for notifications`);
    return { event: 'stepperRegistered', stepperId };
  }

  /**
   * Get connected clients for a specific order (for debugging)
   */
  getOrderSubscribers(orderId: string): number {
    const room = this.server.sockets.adapter.rooms.get(`order:${orderId}`);
    return room ? room.size : 0;
  }
}
