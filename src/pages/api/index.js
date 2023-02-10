import { pusher } from "@/lib/pusher-server.ts"

export default async function handler(req, res) {
  const { message, name, email, image,meta } = req.body
  await pusher.trigger('presence-channel', 'chat-update', {
    message,
    name,
    email,
    image,
    meta
  })
  res.json({ status: 200 })
}
