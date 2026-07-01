# Backlog — Dice App (ft_transcendence variant)

> Formato: Épica → Issue → Sub-issues (checklist).
> Cada Issue se puede copiar directamente como issue de GitHub/GitLab; los sub-issues como tareas dentro de ella o como issues enlazadas.

---

## Epic 1 — Infraestructura y DevOps

- [ ] **Issue 1.1: Scaffolding del monorepo**
  - [ ] Inicializar workspaces (frontend Next.js, backend Node, package `shared`)
  - [ ] Configurar `tsconfig` base y por paquete
  - [ ] Configurar ESLint + Prettier compartidos
- [ ] **Issue 1.2: Dockerización**
  - [ ] Dockerfile backend
  - [ ] Dockerfile frontend
  - [ ] docker-compose.yml (db, redis, backend, frontend, nginx)
  - [ ] Volúmenes persistentes para la base de datos
- [ ] **Issue 1.3: Variables de entorno**
  - [ ] `.env.example` documentado
  - [ ] Gestión de secretos (JWT secret, DB URL, OAuth keys)
- [ ] **Issue 1.4: HTTPS / WSS**
  - [ ] Certificados (self-signed para dev, Let's Encrypt si hay dominio)
  - [ ] Config Nginx con proxy a WebSocket
- [ ] **Issue 1.5: CI/CD**
  - [ ] GitHub Actions: lint + typecheck en cada PR
  - [ ] GitHub Actions: tests automáticos
  - [ ] Build de imágenes Docker en pipeline

---

## Epic 2 — Base de datos

- [ ] **Issue 2.1: Diseño del esquema (ERD)**
  - [ ] Tabla `users` (id, username, email, password_hash, avatar, created_at)
  - [ ] Tabla `sessions`/`refresh_tokens`
  - [ ] Tabla `matches` (id, game_type, status, created_at, finished_at)
  - [ ] Tabla `match_players` (match_id, user_id, score, posición final)
  - [ ] Tabla `rolls` (match_id, player_id, valores de dados, turno, timestamp)
  - [ ] Constraints: username/email únicos, FKs con cascade adecuado
- [ ] **Issue 2.2: Setup de Prisma**
  - [ ] Definir `schema.prisma`
  - [ ] Migraciones iniciales
  - [ ] Cliente Prisma tipado en backend
- [ ] **Issue 2.3: Seed de datos de prueba**
  - [ ] Usuarios de test
  - [ ] Partidas de ejemplo en ambos modos

---

## Epic 3 — Autenticación y usuarios

- [ ] **Issue 3.1: Registro**
  - [ ] Endpoint `POST /auth/register`
  - [ ] Validación con Zod (email, username, password fuerte)
  - [ ] Hash de contraseña (argon2 o bcrypt)
- [ ] **Issue 3.2: Login**
  - [ ] Endpoint `POST /auth/login`
  - [ ] Emisión de JWT (access token) + refresh token en cookie httpOnly
  - [ ] Rate limiting de intentos de login
- [ ] **Issue 3.3: Middleware de autorización**
  - [ ] Verificación de JWT en rutas protegidas
  - [ ] Renovación de access token vía refresh token
- [ ] **Issue 3.4: Logout**
  - [ ] Invalidación de refresh token
- [ ] **Issue 3.5: OAuth (recomendado para Transcendence)**
  - [ ] Integración login con la API de 42 (intra) o Google
- [ ] **Issue 3.6: Gestión de perfil**
  - [ ] Editar username/avatar
  - [ ] Endpoint `GET /users/me`
- [ ] **Issue 3.7 (opcional): 2FA**
  - [ ] TOTP con app tipo Google Authenticator

---

## Epic 4 — Motor de juego (lógica compartida)

- [ ] **Issue 4.1: Modelo de datos del juego**
  - [ ] Tipos compartidos: `GameType`, `MatchState`, `RollResult`
- [ ] **Issue 4.2: RNG server-side**
  - [ ] Generar tiradas SIEMPRE en backend (evitar cheating desde el cliente)
  - [ ] El cliente solo anima el resultado que le envía el servidor
- [ ] **Issue 4.3: Gestión de turnos**
  - [ ] Cola de turnos por partida
  - [ ] Timeout por turno (evitar bloqueos si un jugador no actúa)
- [ ] **Issue 4.4: Estados de partida**
  - [ ] `waiting` → `in_progress` → `finished`
  - [ ] Persistencia de cada tirada en tabla `rolls`

---

## Epic 5 — Modo Fast-Play

- [ ] **Issue 5.1: Definir reglas**
  - [ ] Nº de dados y tiradas por jugador
  - [ ] Condición de victoria (mayor suma / mayor valor único, a decidir por equipo)
- [ ] **Issue 5.2: Backend**
  - [ ] Endpoint/evento socket para crear partida fast-play
  - [ ] Lógica de resolución y determinación de ganador
- [ ] **Issue 5.3: Frontend**
  - [ ] Pantalla de partida fast-play
  - [ ] Botón de tirada + estado de espera del oponente
  - [ ] Pantalla de resultado/victoria
- [ ] **Issue 5.4: Animación 3D**
  - [ ] Animación corta de tirada (Babylon)

---

## Epic 6 — Modo Add42

- [ ] **Issue 6.1: Definir reglas**
  - [ ] Acumulación de puntos por turno hasta llegar a 42
  - [ ] Qué ocurre si se supera 42 (bust / vuelta a 0 / pierde el turno — decidir)
  - [ ] Condición exacta de victoria
- [ ] **Issue 6.2: Backend**
  - [ ] Lógica de acumulación de score por jugador
  - [ ] Validación de bust y fin de partida
- [ ] **Issue 6.3: Frontend**
  - [ ] Marcador acumulado en tiempo real
  - [ ] Historial visual de tiradas de la partida en curso
- [ ] **Issue 6.4: Animación 3D**
  - [ ] Animación encadenada de tiradas múltiples

---

## Epic 7 — Motor 3D (Babylon.js)

- [ ] **Issue 7.1: Setup de escena**
  - [ ] Integración de Babylon Engine/Scene dentro de un componente React
  - [ ] Ciclo de vida correcto (dispose al desmontar componente)
- [ ] **Issue 7.2: Geometría del dado**
  - [ ] Reutilizar approach CSG de caja redondeada ya trabajado
  - [ ] Soporte de color emisivo y presets "legendary"
- [ ] **Issue 7.3: Física de la tirada**
  - [ ] Motor de físicas (Havok o Cannon.js con Babylon)
  - [ ] Sincronizar animación visual con el resultado real del servidor
- [ ] **Issue 7.4: Rendimiento**
  - [ ] Instancing si hay varios dados en pantalla
  - [ ] Ajuste de calidad según dispositivo (mobile)
- [ ] **Issue 7.5: Responsive canvas**
  - [ ] Resize del canvas Babylon con el layout Next.js

---

## Epic 8 — Multijugador en tiempo real

- [ ] **Issue 8.1: Servidor de WebSockets**
  - [ ] Setup Socket.io en el backend Node
  - [ ] Autenticación del socket (JWT en handshake)
- [ ] **Issue 8.2: Salas de partida**
  - [ ] Crear/unirse a sala por código
  - [ ] Emparejamiento simple (matchmaking básico) opcional
- [ ] **Issue 8.3: Sincronización de estado**
  - [ ] Broadcast de tiradas y cambios de turno a todos los jugadores de la sala
- [ ] **Issue 8.4: Reconexión**
  - [ ] Manejo de desconexión/reconexión sin perder estado de partida
- [ ] **Issue 8.5 (opcional): Chat en partida**
  - [ ] Chat básico por sala (valorado como módulo extra en Transcendence)

---

## Epic 9 — Frontend (Next.js + React)

- [ ] **Issue 9.1: Estructura de rutas (App Router)**
  - [ ] `/login`, `/register`, `/dashboard`, `/lobby`, `/match/[id]`
- [ ] **Issue 9.2: Layout y navegación**
  - [ ] Header/nav con estado de sesión
- [ ] **Issue 9.3: Páginas de auth**
  - [ ] Formularios login/registro con validación en cliente (Zod)
- [ ] **Issue 9.4: Dashboard de usuario**
  - [ ] Resumen de estadísticas y accesos rápidos
- [ ] **Issue 9.5: Lobby**
  - [ ] Selección de modo de juego (fast-play / add42)
  - [ ] Crear/unirse a partida
- [ ] **Issue 9.6: Página de partida**
  - [ ] Integración del canvas Babylon + UI de estado de partida
- [ ] **Issue 9.7: Responsive / mobile-first**

---

## Epic 10 — Estadísticas e historial

- [ ] **Issue 10.1: Registro de partidas**
  - [ ] Guardar resultado final, modo, jugadores, duración
- [ ] **Issue 10.2: Endpoint de historial**
  - [ ] `GET /users/:id/matches`
- [ ] **Issue 10.3: Página de estadísticas**
  - [ ] Win rate, nº de partidas, tiradas totales
- [ ] **Issue 10.4 (opcional): Leaderboard global**
  - [ ] Ranking por victorias o puntuación acumulada

---

## Epic 11 — Seguridad

- [ ] **Issue 11.1: Validación e higienización de inputs**
  - [ ] Zod en todos los endpoints
  - [ ] Sanitización contra XSS en campos de texto libre (chat, username)
- [ ] **Issue 11.2: Protección CSRF**
- [ ] **Issue 11.3: Rate limiting**
  - [ ] Login, registro, y endpoints sensibles
- [ ] **Issue 11.4: Gestión segura de contraseñas**
  - [ ] Hash + salt, nunca almacenar en claro ni loguear
- [ ] **Issue 11.5: Auditoría de dependencias**
  - [ ] `npm audit` / Dependabot

---

## Epic 12 — Testing y QA

- [ ] **Issue 12.1: Tests unitarios backend**
  - [ ] Lógica de fast-play
  - [ ] Lógica de add42
  - [ ] Auth (hash, JWT)
- [ ] **Issue 12.2: Tests unitarios frontend**
  - [ ] Componentes clave (formularios, marcador)
- [ ] **Issue 12.3: Tests de integración**
  - [ ] Endpoints REST completos
- [ ] **Issue 12.4: Tests E2E**
  - [ ] Flujo: registro → login → crear partida → jugar → ver resultado
- [ ] **Issue 12.5: Test de carga**
  - [ ] Concurrencia de WebSockets con varias salas simultáneas

---

## Epic 13 — Documentación

- [ ] **Issue 13.1: README del proyecto**
  - [ ] Instrucciones de setup local y con Docker
- [ ] **Issue 13.2: Documentación de API**
  - [ ] OpenAPI/Swagger para endpoints REST
- [ ] **Issue 13.3: Diagrama de arquitectura**
  - [ ] Diagrama de componentes (frontend, backend, DB, sockets)
- [ ] **Issue 13.4: Diagrama ERD**
- [ ] **Issue 13.5: Guía de contribución del equipo**

---

## Epic 14 — Cumplimiento de requisitos 42 / Transcendence

- [ ] **Issue 14.1: Despliegue con un solo comando** (`docker-compose up --build`)
- [ ] **Issue 14.2: HTTPS/WSS obligatorio en todas las conexiones**
- [ ] **Issue 14.3: Revisión de módulos elegidos vs. requeridos (mayores/menores del proyecto)**
- [ ] **Issue 14.4: Checklist de seguridad final** (passwords, SQL injection, XSS, .env fuera del repo)
- [ ] **Issue 14.5: Preparación de la defensa** (demo, casos de prueba en vivo)

---

### Notas finales
- Los Epics 5 y 6 dependen de tener cerrados los Epics 2, 3 y 4.
- El Epic 7 (Babylon) y el Epic 8 (tiempo real) pueden avanzar en paralelo una vez esté el Epic 4.
- Se recomienda cerrar el Epic 0 en la primera reunión de equipo antes de crear las issues reales en el gestor de tareas.

---

## Referencias

Este backlog sigue la lógica de descomposición **Épica → Historia/Issue → Tarea**, habitual en marcos ágiles de gestión de producto, y se apoya conceptualmente en las siguientes fuentes:

- Schwaber, K. & Sutherland, J. (2020). *The Scrum Guide: The Definitive Guide to Scrum: The Rules of the Game*. Scrum.org / Scrum Inc. Disponible en: https://scrumguides.org — utilizado como referencia para la estructura de Product Backlog, la idea de incremento de valor entregable por iteración, y el rol de Scrum Master en la organización del trabajo.
- Cohn, M. (2004). *User Stories Applied: For Agile Software Development*. Addison-Wesley. — referencia habitual para la jerarquía Epic → User Story → Task usada para desglosar cada módulo del proyecto en issues y sub-issues accionables.
- Atlassian. *Agile Coach: Epics, Stories, Themes, and Initiatives*. Disponible en: https://www.atlassian.com/agile/project-management/epics-stories-themes — referencia práctica para la organización de epics e issues en herramientas tipo Jira/GitHub Projects, aplicada aquí a la estructura del documento.
- Enunciado del proyecto **ft_transcendence** de la École 42 — utilizado como base para los requisitos técnicos no funcionales recogidos en el Epic 14 (despliegue con Docker en un solo comando, HTTPS/WSS obligatorio, gestión segura de credenciales). *Nota: se recomienda contrastar el Epic 14 con el enunciado oficial actualizado de vuestra intra, ya que los requisitos exactos pueden variar según la versión del proyecto asignada.*

> Aviso: las tres primeras referencias son fuentes metodológicas reales; la estructura concreta de epics/issues de este documento es una propuesta elaborada específicamente para este proyecto y no una traducción literal de ninguna de ellas.
