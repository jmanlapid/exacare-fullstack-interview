# Assessment
This assessment is meant to measure your competence in 

* developing a React application 
* interacting with a live API 
* navigating unclear requirements

You are not graded on completing 100% of the objectives but rather your choice of implementation, communicating intent, and a reasonable throughput of completing requirements.

# How to run the application

`$ npm start`

# Requirements
You are tasked with building out the frontend of a system that manages an assisted living facility's electronic health records. The requirements are as follows. You are not provided designs so please do your best to display the information in a reasonably pleasant UI.

## View 1/ List Residents

* Display all resident's information
  * full name
  * picture
  * age in years
  * gender
  * room id
* Filter residents by search query parameters

## View 2/ Resident Vitals

* Clicking a resident takes you to that resident's detailed vitals view
* Display resident's vitals
  * height
  * weight
  * oxygen saturation
  * temperature
  * pain level
* Form to update a resident's vitals

## Areas for discussion
* pagination
* debounce / deferring
* URLs
* testing

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
  facility: string;
  room_id: string;
}

type FindResidentsResponseBody = Resident[]
```

## GET /residents/:resident_id/vitals
```typescript
  interface ResidentVitals {
    height: string;
    weight: string;
    oxygen_saturation: string;
    temperature: string;
    pain_level: 'none' | 'low' | 'medium' | 'high' | 'extreme';
  }

  type GetResidentVitalsResponseBody = ResidentVitals;
```

## PUT /residents/:resident_id/vitals
```typescript
  type UpdateResidentVitalsRequestBody = ResidentVitals;
  type UpdateResidentVitalsResponseBody = ResidentVitals;
```
