import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import bcrypt from 'bcrypt';
import { nanoid } from "nanoid";
import { createUser, getUserByUsername } from "db/queries/user.queries.js";

const usersRouter = new Hono();
const saltRounds = 10;

usersRouter.post('/', async ({req, json}) => {
    const body = await req.parseBody<any>();
    const { username, password } = body;
  
    // Minimal Input Validation
    if (!username || !password) {
      json({ message: 'Missing required property' }, 400);
    }
  
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.info({password, username, hashedPassword})
    const userId = nanoid();
  
    const recordedUser = getUserByUsername.get(username || '');
  
    if (recordedUser) {
        json({ message: 'Username already exists' }, 400);
    }
  
    const newUser = createUser.get(userId, username, hashedPassword, Date.now()) as {
        user_id: string,
        username: string,
        created_at: string,
    };
  
    return json({message: {
      userId: newUser.user_id,
      username: newUser.username,
      joined: new Date(newUser.created_at).toISOString(),
    }}, 201);
});

export default usersRouter