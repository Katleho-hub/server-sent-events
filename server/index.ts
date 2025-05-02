import { Hono } from 'hono'
import { logger } from 'hono/logger'
import usersRouter from 'server/routes/user.router.js'
import todosRouter from 'server/routes/todo.router.js'
import sseRouter from './routes/sse.router.js'


const app = new Hono()

app.use(logger())

app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})


app.get('/', (c) => {
    return c.text('Hello Hontheo')
})

app.route('/user', usersRouter);

app.route('/todo', todosRouter);

app.route('/sse', sseRouter);



export default app