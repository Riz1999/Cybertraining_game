# Cybercrime Training Platform

A gamified training platform for police officers to learn cybercrime investigation procedures aligned with Indian systems like NCRP, CCTNS, and 1930 helpline protocols.

## Project Overview

This platform provides interactive modules that simulate real-world cybercrime investigation scenarios to enhance the skills and knowledge of new recruits in state and national police forces, cybercrime cell officers, and police academy trainees through engaging, progression-based learning experiences.

## Features

- Interactive training modules with gamification elements
- Progress tracking and badge system
- Responsive design for access on various devices
- Low-bandwidth optimization for use in all network conditions
- Simulations of real-world cybercrime investigation scenarios
- Role-based access control for trainees, trainers, and administrators

## Technology Stack

### Frontend
- React.js
- Redux for state management
- TailwindCSS for responsive design
- HTML5 Canvas/WebGL for interactive simulations
- Progressive Web App (PWA) capabilities

### Backend
- Node.js with Express
- MongoDB for database
- Redis for caching and session management
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4 or higher)
- Redis (optional, for production)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd cybercrime-training-platform
   ```

2. Install dependencies
   ```
   npm run install:all
   ```

3. Set up environment variables
   ```
   cp server/.env.example server/.env
   ```
   Edit the `.env` file with your configuration settings.

4. Start the development server
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Development

### Project Structure

```
cybercrime-training-platform/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       └── store/          # Redux store
├── server/                 # Backend Node.js application
│   ├── src/                # Server source code
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── middleware/     # Custom middleware
│   └── .env                # Environment variables
└── package.json            # Root package.json for scripts
```

### Available Scripts

- `npm start` - Start both client and server in development mode
- `npm run start:client` - Start only the client
- `npm run start:server` - Start only the server
- `npm run build` - Build the client for production
- `npm test` - Run tests for both client and server
- `npm run lint` - Run linting for both client and server
- `npm run lint:fix` - Fix linting issues for both client and server

## Modules

1. Introduction to Cybercrime Investigation
2. Complaint Categorization and Intake
3. Time-Critical Response: Transaction Freezing
4. Escalation to FIR and CCTNS
5. Analysis and Evidence Gathering
6. Reporting and Final Action
7. Ethics and Victim Communication (Optional)

## Certification

Users who complete all required modules with a score of 80% or higher will receive a printable certificate documenting their cybercrime investigation skills.

## License

[License information]