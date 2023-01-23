import { pusher } from "@/lib/pusher-server.ts"

export default async function handler(req, res) {
  const { message, name } = req.body
  await pusher.trigger('presence-channel', 'chat-update', {
    message,
    name
  })
  res.json({ status: 200 })
}