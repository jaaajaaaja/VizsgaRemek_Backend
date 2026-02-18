import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
@WebSocketGateway(
  3001,
  {
    namespace: "event",
  }
)
export class EventsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server  

  afterInit() {
    console.log("WebSocket initialized!")
  }

  sendRefreshEvent(data: string) {
    this.server.emit("refresh", data)
    console.log("emited to client")
  }
}
