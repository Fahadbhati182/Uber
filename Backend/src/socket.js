import { Server as socketIo } from 'socket.io';
import { User } from './models/user.model.js';
import { Captain } from './models/captain.model.js';

let io;

function initializeSocket(server) {
  io = new socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })


  io.on('connection', (socket) => {
    console.log(`Client connected ${socket.id}`)

    socket.on('join', async (data) => {
      const { userId, userType } = data

      if (userType === "User") {
        await User.findByIdAndUpdate(userId, { socketID: socket.id })
      } else {
        await Captain.findByIdAndUpdate(userId, { socketID: socket.id })
      }
    })


    socket.on('update-location-captain', async (data) => {
      const { userId, location } = data

      if (!location || !location.ltd || !location.lng) {
        return socket.emit('error', { message: 'Invalid locations ' })
      }
      await Captain.findByIdAndUpdate(userId, {
        location: {
          ltd: location.ltd,
          lng: location.lng
        }
      })
    })

    socket.on('disconnect', () => {
      console.log(`Client disconnected : ${socket.id}`)
    });
  });
}

function sendMessageToSocket(socketId, messageObj) {
  console.log("socketId:", socketId, "messageObj:", messageObj)
  if (io) {
    io.to(socketId).emit(messageObj.event, messageObj.data)
  } else {
    console.log('Socket.io is not initialized');

  }
}

export { sendMessageToSocket, initializeSocket }