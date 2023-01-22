import Pusher from 'pusher';

import { env } from "../../../env/server.mjs";


const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.PUSHER_CLUSTER,
  encrypted: true
});

export default async (req, res) => {
  try {
    const socketId = req.body.socket_id
    // aka private-chatId
    const channel = req.body.channel_name
    // const { db } = await connect()
    // const chatId = channel.split('-')[1]
    // const result = await db.collection('chats').find({ _id: ObjectId(chatId) })
    // const chat = await result.next()
    if (chat._id.toString()) {
      const auth = pusher.authorizeChannel(socketId, channel)
      return res.send(auth)
    }
  } catch (err) {
    console.log('Pusher Auth Error: ', err)
    res.status(403).end()
  }
}