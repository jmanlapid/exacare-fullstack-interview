const express = require('express')
const bodyParser = require("body-parser")
const { faker } = require('@faker-js/faker')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const residents = [];
for (let x = 0; x < 2500; x += 1) {
  const gender = faker.name.sex();
  const dob = faker.date.birthdate({
    max: 90,
    min: 45,
    mode: 'age',
  });
  residents.push({
    // Begin basic data only returned in GET /residents
    image_url: `https://avatars.dicebear.com/api/open-peeps/${faker.datatype.uuid()}.svg`,
    id: x.toString(),
    first_name: faker.name.firstName(gender),
    last_name: faker.name.lastName(),
    gender,
    dob: `${dob.getFullYear()}-${dob.getMonth() + 1}-${dob.getDate()}`,
    facility_id: faker.datatype.number(100).toString(),
    room_id: faker.datatype.number(49).toString(),
    // Begin detailed data only returned in GET /residents/:resident_id/vitals
    vitals: {
      height: `${faker.datatype.number({min: 5, max: 6})}' ${faker.datatype.number({min: 0, max: 11})}\"`,
      weight: `${faker.datatype.number({min: 90, max: 225})} lbs`,
      oxygen_saturation: `${faker.datatype.number({ min: 95, max: 100})}%`,
      temperature: `${faker.datatype.number({ min: 97, max: 99, precision: 0.1})} °F`,
      pain_level: faker.helpers.arrayElement(['none', 'low', 'medium', 'high', 'extreme'])
    }
    
  });
}

app.get('/residents',(req, res) => {
  const { name, id, gender, facility_id, room_id } = req.query;

  const filteredResidents = residents.filter((resident) => {
    const conditions = [];

    if (name) {
      const lowercaseName = name.toLowerCase();
      conditions.push(resident.first_name.toLowerCase().includes(lowercaseName) || resident.last_name.includes(lowercaseName));
    }

    if (id) {
      conditions.push(resident.id == id);
    }

    if (gender) {
      conditions.push(resident.gender == gender);
    }

    if (facility_id) {
      conditions.push(resident.facility_id == facility_id);
    }

    if (room_id) {
      conditions.push(resident.room_id == room_id);
    }

    return conditions.every(condition => condition === true) || conditions.length === 0
  });

  const filteredResidentsWithoutVitals = filteredResidents.map((item) => {
    const copy = {...item};
    delete copy.vitals;
    return copy;
  });

  return res.send(filteredResidentsWithoutVitals);
});

app.get('/residents/:resident_id/vitals', (req, res) => {
  const matchingResidentVitals = residents.find((resident) => resident.id == req.params.resident_id)?.vitals;

  if (!matchingResidentVitals) {
    return res.status(404);
  }

  return res.status(200).send(matchingResidentVitals);
});

app.put('/residents/:resident_id/vitals', (req, res) => {
  const matchingResidentIndex = residents.findIndex((resident) => resident.id == req.params.resident_id);
  const {height, weight, oxygen_saturation, temperature, pain_level} = req.body;

  if (matchingResidentIndex === -1) {
    return res.status(404);
  }

  const currentVitals = residents[matchingResidentIndex].vitals;
  const newVitals = {
    ...currentVitals,
    ...(height ? {height} : {}),
    ...(weight ? {weight} : {}),
    ...(oxygen_saturation ? {oxygen_saturation} : {}),
    ...(temperature ? {temperature} : {}),
    ...(pain_level ? {pain_level} : {}),
  };

  residents[matchingResidentIndex].vitals = newVitals;
  return res.status(200).send(newVitals);
});

app.get('/status', (req, res) => {
  res.send('ok')
})

app.listen(port, () => {
  console.log(`exacare-fullstack-interview backend listening on port ${port}`)
})

function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  console.error(res);
  return res.status(500).send('Something broke, check backend logs')
}

app.use(errorHandler);
