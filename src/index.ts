import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
}))


//! DATABASE
import { MongoClient } from 'mongodb'

//! Connection URL
const url = process.env.MONGODB_URL || "";
const client = new MongoClient(url);
const dbName = 'communities';

//! CONNECT TO DB
async function main() {
  await client.connect();
  console.log('Connected successfully to server');
}

//* ROUTES
app.get('/', (c) => {
  return c.text('Hello Hono!')
})

//* GET ALL COMMUNITIES
app.get('/getCommunities', async(c) => {
  const db = client.db(dbName);
  const collection = db.collection('communities');

  let foundCommunities = await collection.find({}).toArray()
  return c.json(foundCommunities)
})

//* SUBMIT A NEW COMMUNITY
app.post('/submitCommunity', async (c) => {
  const body = await c.req.parseBody();

  const db = client.db(dbName);
  const collection = db.collection('communities');

  let newCommunity = await collection.insertOne(body)
  let foundCommunities = await collection.find({}).toArray()

  return c.json(foundCommunities)
})

//* ERROR HANDLING
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json(err.message)
})


//! INIT DB
main()

export default app
