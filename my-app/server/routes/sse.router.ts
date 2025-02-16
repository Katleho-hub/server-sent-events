import { Hono, } from "hono";
import { streamSSE } from 'hono/streaming'

const sseRouter = new Hono();
let id = 0;

sseRouter.get('/', async (c) => {
    c.header('Content-Type', 'text/event-stream');
    return streamSSE(c, async (stream) => {
        const test = JSON.parse(JSON.stringify((c.req.raw.headers)))?.['last-event-id'];
      while (true) {

        if (!id && test) id = test;
        const message = `It is ${new Date().toISOString()}, id = ${id}`

            await stream.writeSSE({
                data: message,
                event: 'update',
                id: String(id++),
              })


        await stream.sleep(20_000)

        
      }
    })
  })

export default sseRouter;