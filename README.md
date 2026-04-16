# HNG Stage 0 - Backend API

A REST API that classifies names by gender using the Genderize.io API.

## Endpoint

GET /api/classify?name={name}

## Example Request

GET https://your-api-url.com/api/classify?name=James

## Example Response

```json
{
  "status": "success",
  "data": {
    "name": "James",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-16T10:00:00.000Z"
  }
}
```

## Tech Stack

- Node.js
- Express

## Setup

```bash
npm install
npm start
```# hng-stage0-backend
