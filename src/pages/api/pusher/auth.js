// import { env } from "../../../env/server.mjs";
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
import { pusher } from "@/lib/pusher-server";


function hash(input, digits) {
  console.log("input ", input)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash % (10 ** digits));
}

export default async (req, res) => {
  console.log("auth endpoint: ", req.body)
  const session = await unstable_getServerSession(req, res, authOptions)
  const randomUserId = hash(session.user.email, 6);

  try {
    if (session) {
      const socketId = req.body.socket_id
      const channel = req.body.channel_name
      const presenceData = {
        user_id: randomUserId,
        user_info: {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image
        },
      };
      // generate auth token
      const auth = pusher.authorizeChannel(socketId, channel, presenceData);
      return res.send(auth)
    } else {
      throw new Error('Unauthorized')
    }
  } catch (err) {
    console.log('Pusher Auth Error: ', err)
    res.status(403).end()
  }
}