# Assessment
This assessment is meant to measure your competence in 

* developing a React application 
* interacting with a live API 
* navigating unclear requirements

You are not graded on completing 100% of the objectives but rather your choice of implementation, communicating intent, and a reasonable throughput of completing requirements.

# How to run the application

`$ npm start`

# Requirements
You are tasked with building out the frontend of a system that manages an assisted living facility's electronic health records. The requirements are as follows. You are not provided designs so just make the UI legible.

## List Residents Page

* Display all resident's information
  * full name
  * picture
  * age in years
  * gender
  * room id
* Integrate pagination (requires backend work)
* Filter residents by search query parameters
* Sync URL search params with pagination * filters

# API

You are provided an API with the following interface to complete your requirements.

## GET /residents

```typescript
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

interface FindResidentsSearchQueryParameters {
  id: string;
  name: string;
  gender: 'male' | 'female';
  facility_id: string;
  room_id: string;
}

type FindResidentsResponseBody = Resident[]
```
