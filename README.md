# Transcendence

A 42-school final project: a multiplayer online dice game built with a modern full-stack architecture. The application combines a Next.js frontend, a real-time Socket.IO backend, PostgreSQL persistence, Prisma ORM, and Traefik-based HTTPS routing to deliver a complete web game platform with authentication, user profiles, rooms, and leaderboard tracking.

## Team and roles

This project was developed by a small multidisciplinary team, with clear responsibilities assigned to each member to ensure a balanced final delivery and a maintainable architecture.

- Project Manager / Frontend Developer (@lgracia): Implementation of the user interface, navigation flow, responsive pages, client-side state management, architecture decisions, and delivery management.
- Team Lead / Frontend Developer (@pamanzan): Coordination of tasks, sprint planning, issue tracking, client-side state management, and presentation of the game experience.
- Backend Developer (@jgirbau-): Design and maintenance of the real-time multiplayer logic, Socket.IO server, turn system, room management, and game rules enforcement.
- Database / Auth Developer (@amarquez): Prisma schema design, PostgreSQL integration, authentication flows, session management, and persistence of user statistics.
- DevOps / Infrastructure Engineer (@ecoma-ba): Docker Compose orchestration, HTTPS routing with Traefik, certificate generation, environment configuration, and deployment support.

## 1. Project overview

This project implements a competitive multiplayer dice game where users can create or join rooms, select a game mode, ready up, and play in real time against other users. The challenge is not only to build a game, but also to provide a polished user experience with authentication, persistent statistics, OAuth login, room management, and a real-time backend.

The system is designed around three main layers:

- Frontend: Next.js + React + TypeScript
- Backend / game server: Node.js + Express + Socket.IO
- Data layer: PostgreSQL + Prisma

The app is structured to support a 42-style final evaluation focused on:

- authentication and user management
- multiplayer room creation and joining
- real-time synchronization
- database persistence
- leaderboard and game statistics
- a production-like deployment setup with HTTPS, reverse proxy, and containers

## 2. Core features

### Authentication and user system

- Email/password authentication via Better Auth
- GitHub OAuth login
- User profile management
- Username and email uniqueness validation
- Persistent sessions and accounts in PostgreSQL
- JWT-based validation for socket access

### Multiplayer room system

- Create rooms by game mode
- Join a room using a room code
- Waiting lobby with live player status updates
- Ready / lock selection and validation
- Match start only when the room is ready
- Support for multiple players in a shared room

### Game modes

#### Free Play

- Each player accumulates points across turns
- The player with the highest total score wins
- The game ends after a full round cycle across the table

#### Add42

- Players accumulate dice values into a personal total
- If a player exceeds 42, they are locked
- If a player reaches exactly 42, they win immediately
- If all players lock, the highest score not exceeding 42 wins
- Ties are handled as draws

### Real-time gameplay

- Socket-based room synchronization
- Server-side turn management
- Dice rolls are validated and broadcast to all players
- Match state transitions and winner resolution happen on the server
- Reconnection support restores the room state for active players

### Persistent stats and leaderboard

- User statistics are saved per game mode
- Match outcomes update win/loss/tie counters
- Leaderboard values are generated from user stats
- Rankings are displayed separately for Free Play and Add42

### User interface

- Responsive multi-page interface
- Animated 3D dice interactions
- Active lobby and in-game state synchronization
- Profile and leaderboard views
- HTTPS access through Traefik and generated local certificates

## 3. Project architecture

The repository is organized as follows:

```text
.
├── docker-compose.yml          # Container orchestration for Postgres, app, socket, Traefik
├── Makefile                    # Convenience commands for running the stack
├── .env.local.example          # Environment variables template
├── certs/                     # TLS certificates used locally
├── traefik/
│   └── config.yaml             # Reverse proxy routing rules
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/             # Prisma migration history
│   └── seed.ts                 # Seed utilities if used
├── next/
│   ├── app/                    # App Router pages and layout
│   ├── components/             # Frontend UI and game visual components
│   ├── hooks/                  # Client-side game and socket logic
│   ├── lib/                    # Auth, validation, utility logic
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies and scripts
│   └── Dockerfile              # Frontend container definition
├── server/
│   ├── game/                   # Rules, factories, room logic, dice mechanics
│   ├── lib/                    # DB integration helpers
│   ├── sockets/                # Socket.IO server entrypoints
│   ├── package.json            # Backend dependencies and scripts
│   └── Dockerfile              # Backend container definition
└── README.md
```

## 4. Tech stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Babylon.js / custom 3D dice visualizations
- Socket.IO client

### Backend

- Node.js
- Express
- Socket.IO
- JWT validation
- Prisma client

### Database

- PostgreSQL 17
- Prisma ORM

### Authentication and security

- Better Auth
- GitHub OAuth
- HTTPS termination with Traefik
- JWT-based socket authentication

### Deployment

- Docker
- Docker Compose
- local certificate generation with OpenSSL

## 5. Game logic

### Room system

A room is created when a user clicks Create Room in a selected game mode. The server registers a waiting room with:

- a unique room code
- a game type
- a players array
- room state (OPEN or CLOSED)

Once created, other users can join the room with the code. The game does not start until the room is ready and all players are locked / ready.

### Turn system

The server keeps track of the current turn index in the match state. Each player can roll only when it is their turn. After a valid roll, the turn advances to the next player and the updated state is broadcast to everyone in the room.

### Rules engine

The logic is separated into:

- game rules
- game factory
- room manager
- dice generation functions

The backend implements two game strategies:

- Free Play: maximize the score after the last turn cycle
- Add42: avoid busting above 42 and outperform opponents under that cap

## 6. Database design

The Prisma schema defines the core persistence model for the application:

- User: authenticated users and profiles
- Session: session tracking
- Account: OAuth/email account associations
- Verification: verification tokens
- Jwks: key material for JWT usage
- Game: match metadata
- PlayerGame: participation data per user per game
- Roll: individual roll history
- UserStats: cumulative wins, losses, ties, and game totals

This design supports both runtime game data and persistent leaderboard information.

## 7. Running the project

The project includes a `Makefile` with the main commands:

```bash
make up
```

Starts the full environment with the configured Docker services.

```bash
make re
```

Rebuilds the images and starts everything again.

```bash
make down
```

Stops the running services.

```bash
make clean
```

Stops containers and removes the generated resources.

```bash
make fclean
```

Performs a more aggressive cleanup, including Docker system prune operations.

### Direct Docker Compose usage

```bash
docker-compose --env-file .env.local up --build
```

## 8. Accessing the application

Once the stack is running, the app is exposed through local HTTPS endpoints:

- Frontend: https://dice.localhost:8443
- Socket server: https://socket.localhost:8443
- Traefik dashboard: https://traefik.localhost

The local certificate is generated under `certs/local.crt` and `certs/local.key`.

> In a local development environment, browsers may warn about the self-signed certificate. This is expected for a 42 project and should be accepted temporarily for local testing.

## 9. Main routes and application flow

The frontend includes the following key user flows:

- `/` landing page
- `/login` login page
- `/signup` registration page
- `/landing` authenticated game entry point
- `/lobby` waiting room and room management
- `/leaderboard` leaderboard view
- `/profile` user profile and stats
- `/privacy-politics` legal content page

### Typical game flow

1. The user logs in or creates an account.
2. The user selects a game mode: Free Play or Add42.
3. The user creates or joins a room.
4. Other players join and choose their ready state.
5. Once the room is ready, the match starts.
6. Each player rolls in turn.
7. The server validates the roll, updates totals, and broadcasts the results.
8. Match results are persisted and reflected in profiles and leaderboard stats.

## 10. Validation, rules, and subject alignment

This project follows the spirit of the 42 Transcendence subject by combining multiple layers of real-world web development:

- database persistence with Prisma
- authentication with secure session management
- real-time communication with Socket.IO
- interactive game logic with room states and match rules
- user-centric interfaces with leaderboard and profile systems
- containerized local deployment with HTTPS routing

The project therefore goes beyond a simple frontend demo: it is a complete multi-service web application designed like a production game platform.

## 11. Responsibilities by folder

### Frontend (`next/`)

Responsible for:

- rendering UI and pages
- handling authentication flows
- managing client-side game state
- connecting to the Socket.IO server
- displaying matchmaking and leaderboard views

### Game server (`server/`)

Responsible for:

- validating socket clients via tokens
- creating and managing rooms
- validating turns and dice rolls
- enforcing the game rules
- persisting completed matches

### Database (`prisma/`)

Responsible for:

- schema definition
- relationships between users, games, and stats
- migration history and data consistency

### Infrastructure (`traefik/`, `certs/`, `docker-compose.yml`)

Responsible for:

- route orchestration
- secure local HTTPS access
- service isolation and container lifecycle
- deployment readiness in local environments

## 12. Implementation notes

- Docker Compose is used to simplify local development and evaluation.
- The app is designed for local HTTPS hosts rather than public internet deployment.
- Socket authentication is enforced using validated tokens to protect the backend.
- The project stores both runtime state and database records for ranking and stats.

## 13. Deliverable notes for evaluation

For a final 42 submission, this project is expected to demonstrate:

- stable local deployment
- coherent game flow from login to match completion
- working multiplayer communication
- persistent user and stat models
- clear separation between frontend, backend, and database
- organized code and container-based execution

## 14. Conclusion

Transcendence is a complete multiplayer online dice game project that combines real-time gameplay, secure authentication, persistent storage, and modern web technologies in a single system. It matches the expectations of the 42 final project: a polished product, a robust architecture, and a functional full-stack application with a real game loop and user experience.

## 15. Quick start summary

```bash
cp .env.local.example .env.local
make up
```

Then open:

```text
https://dice.localhost:8443
```

and start playing.

## Resources Used

- Libraries: Next.js, React, TypeScript, Tailwind CSS, Babylon.js (3D dice), Socket.IO, Express, Prisma, and related npm packages.
- Tools: Docker, Docker Compose, Traefik, OpenSSL, PostgreSQL, Prisma Migrate, Make.
- External services / APIs: GitHub OAuth, Better Auth, PANGOLIN endpoint, NEWT (replace with exact service names/URLs used in your deployment).
- Assets and 3D resources: textures, models and other assets used for the dice and UI — include author and license information here (replace with concrete attributions).
- Documentation & references: link to official docs for core technologies (Next.js, Socket.IO, Prisma, Babylon.js) and any tutorials or articles followed.
- Licenses & credits: list third-party licenses and any required attributions for assets or libraries.
- Quick commands & locations: `cp .env.local.example .env.local`, `make up`, certificates at `certs/`.

