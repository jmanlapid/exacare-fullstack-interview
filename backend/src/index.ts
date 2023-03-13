import express, {Request, Response} from 'express';
import bodyParser from "body-parser"
import cors from 'cors';
import {faker} from '@faker-js/faker';
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db;
const APP_PORT = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

interface Resident {
  id: string;
  image_url: string;
  gender: 'male' | 'female';
  dob: string;
  first_name: string;
  last_name: string;
  facility_id: string;
  room_id: string;
}

app.get('/residents', async (req: Request, res: Response) => {
  const rows = await db.all(`SELECT * FROM residents;`);
  res.send({ data: rows });
});

app.get('/status', (req, res) => {
  res.send('ok')
})

app.listen(APP_PORT, async () => {
  db = await open({
    filename: '/tmp/database.db',
    driver: sqlite3.Database
  });

  await db.exec(`
  DROP TABLE IF EXISTS residents;
  CREATE TABLE residents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    image_url TEXT,
    gender TEXT,
    dob DATE,
    facility_id TEXT,
    room_id TEXT
  );
  `);
  
  for (let x = 0; x < 500; x += 1) {
  const gender = faker.name.sex();
  const dob = faker.date.birthdate({
    max: 90,
    min: 45,
    mode: 'age',
  });
  await db.exec(`
  INSERT INTO residents (first_name, last_name, gender, dob, facility_id, room_id, image_url)
  VALUES
    ("${faker.name.firstName()}",
    "${faker.name.lastName()}",
    "${gender}",
    "${dob.toISOString()}",
    "${faker.datatype.number(100).toString()}",
    "${faker.datatype.number(49).toString()}",
    "${`https://avatars.dicebear.com/api/open-peeps/${x}.svg`}");
    `)
  }

  console.log(`🟢 exacare-fullstack-interview backend listening on port ${APP_PORT}`)
})

function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  console.error(res);
  return res.status(500).send('🛑 Something broke, check backend logs')
}

app.use(errorHandler);
