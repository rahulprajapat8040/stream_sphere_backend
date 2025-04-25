import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken'
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models';


@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(@InjectModel(User) private readonly userModel: typeof User) { }
  @WebSocketServer()
  server: Server

  afterInit(server: Server) {
    console.log("Socket server intialized")
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token
    try {
      const decoded = jwt.verify(token, process.env.SCRETE as string) as { userId: string }
      const user = await this.userModel.findByPk(decoded.userId);
      if (!user) {
        client.emit('error', 'User not found');
        return client.disconnect();
      }
      client.data.user = user;
      console.log('User connected:', user);
    } catch (err) {
      console.log("Invalid token", err.message)
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected', client.id)
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: { room: string; message: string; sender: User }) {
    const user = client.data.user
    if (!user) return
    const fullMessage = {
      room: payload.room,
      message: payload.message,
      sender: user,
      senderId: user.id,
    }

    console.log(fullMessage)

    this.server.to(payload.room).emit("receiveMessage", fullMessage)
  }

  @SubscribeMessage("joinRoom")
  handleJoinRoom(client: Socket, room: string) {
    client.join(room)
    client.emit('joinedRoom', room)
    this.updateRoomCount(room)
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit("leftRoom", room);
  }

  @SubscribeMessage('getOnlineCount')
  handleGetOnlineCount(client: Socket, room: string) {
    const roomInfo = this.server.sockets.adapter.rooms.get(room)
    const count = roomInfo ? roomInfo.size : 0;
    client.emit("onlineCount", { room, count })
  }

  private updateRoomCount(room: string) {
    const roomInfo = this.server.sockets.adapter.rooms.get(room)
    const count = roomInfo ? roomInfo.size : 0;
    this.server.to(room).emit('onlineCount', { room, count })
  }

}
