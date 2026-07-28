# FT_TRANSCENDENCE — Documento de traspaso, arquitectura y roadmap

**Repositorio:** `LoreGracia/Ft_trascendence`  
**Fecha de revisión:** 28/07/2026

---

# 1. Objetivo

Este documento describe el estado del proyecto y establece una guía de continuidad para el equipo.

No es únicamente un README de instalación. Su objetivo es que cualquier persona que se incorpore pueda entender:

- qué existe actualmente;
- qué responsabilidad tiene cada rama;
- qué funcionalidades están desarrolladas;
- qué funcionalidades faltan;
- dónde debe implementarse cada cosa;
- qué dependencias existen entre módulos;
- qué ramas nuevas deben crearse;
- qué prioridad tiene cada trabajo;
- cómo integrar finalmente todo en `main`.

## Ramas actuales y previstas

Actualmente existen como líneas principales:

```text
main
9.Frontend
Dice
```

Y se deben crear y desarrollar:

```text
Database
Game
```

Por tanto, la estructura de trabajo prevista será:

```text
                         ┌─────────────────┐
                         │      MAIN       │
                         │ Base integrada  │
                         └────────┬────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
       9.Frontend             Database                Game
             │                    │                    │
             │                    │                    │
             ▼                    │                    ▼
           Dice                   │              Reglas del juego
             │                    │                    │
             └────────────────────┼────────────────────┘
                                  ▼
                         Integración final
```

**Importante:** el diagrama representa responsabilidades, no necesariamente que todas las ramas deban derivar directamente de `main` ni que los merges deban hacerse en ese orden exacto.

---

# 2. Principio arquitectónico fundamental

Hay que separar claramente cuatro responsabilidades:

```text
Frontend
   ↓
Interfaz y experiencia de usuario

Dice
   ↓
Representación 3D + animación + resultado de una tirada

Game
   ↓
Reglas + turnos + estado + validaciones

Database
   ↓
Persistencia de datos
```

La regla fundamental es:

> **Dice produce un resultado. Game decide qué significa. Database guarda el estado. Frontend lo muestra.**

Ejemplo:

```text
Usuario pulsa "Tirar"
        │
        ▼
     Frontend
        │
        ▼
       Game
        │
        │ solicita una tirada
        ▼
       Dice
        │
        │ resultado = 5
        ▼
       Game
        │
        ├── comprueba reglas
        ├── actualiza turno
        ├── calcula estado
        └── solicita persistencia
                 │
                 ▼
              Database
                 │
                 ▼
              Frontend
                 │
                 ▼
             Actualiza UI
```

**Nunca debemos colocar las reglas del juego dentro del dado 3D.**

---

# 3. Prioridades globales

El proyecto no debe avanzar únicamente por orden de ramas. Hay dependencias técnicas.

## Prioridad 1 — Database

**Prioridad: MUY ALTA**

Hay que definir pronto el modelo de datos porque muchas otras funcionalidades dependen de él.

Debe resolver como mínimo:

- usuarios;
- identidad/autenticación;
- partidas;
- participantes;
- estado de partida;
- turnos;
- tiradas;
- resultados;
- historial;
- estadísticas.

---

## Prioridad 2 — Game

**Prioridad: MUY ALTA**

La lógica de juego debe existir independientemente de la interfaz y del dado 3D.

Debe resolver:

- reglas;
- turnos;
- estados;
- jugadores;
- validaciones;
- tiradas;
- resultado;
- fin de partida;
- persistencia necesaria.

`Game` debe poder probarse sin necesidad de renderizar una escena 3D.

---

## Prioridad 3 — Dice

**Prioridad: ALTA**

Ya existe una cantidad importante de trabajo.

Antes de integrarlo definitivamente hay que:

- desacoplar escena y dado;
- solucionar bloqueos;
- soportar varios jugadores/dados;
- separar animación y resultado;
- definir una API limpia.

---

## Prioridad 4 — 9.Frontend

**Prioridad: ALTA**

Ya existe una estructura frontend considerable.

El siguiente paso no debería ser añadir UI indiscriminadamente, sino conectar el frontend con:

```text
Game
Database
Dice
```

---

## Prioridad 5 — main

**Prioridad: INTEGRACIÓN**

`main` debe representar únicamente el estado integrado y suficientemente estable del proyecto.

No debería utilizarse como rama de experimentación.

---

# 4. Matriz de prioridades

| Área | Estado | Prioridad | Dependencias |
|---|---|---:|---|
| `main` | Base disponible | Integración | Todas |
| `9.Frontend` | En desarrollo | ALTA | Game, Database, Dice |
| `Dice` | En desarrollo avanzado | ALTA | Frontend |
| `Database` | Nueva rama | MUY ALTA | main |
| `Game` | Nueva rama | MUY ALTA | Database, Dice |
| Integración completa | Pendiente | MÁXIMA | Todas |

---

# 5. Rama `main`

## 5.1. Responsabilidad

`main` es la base común del proyecto.

Actualmente contiene la estructura inicial de una aplicación Next.js/TypeScript preparada para ejecutarse con Docker.

Debe considerarse:

```text
main = base + infraestructura + estado integrado estable
```

No debemos considerar que `main` sea todavía el proyecto final completo.

---

## 5.2. Estructura conocida

```text
srcs/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .dockerignore
├── .gitignore
├── Dockerfile
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## 5.3. Infraestructura

La base dispone de:

- Next.js;
- TypeScript;
- Docker;
- Docker Compose;
- Makefile;
- ESLint;
- PostCSS;
- configuración de compilación.

El servicio principal utiliza el contenedor:

```text
transcendence-app
```

y la aplicación se expone en:

```text
localhost:3000
```

---

## 5.4. Comandos

```bash
make
```

Construye y levanta el proyecto.

```bash
make watch
```

Levanta el proyecto con Docker Watch.

```bash
make down
```

Detiene el entorno.

```bash
make clean
```

Limpia el entorno definido por el Makefile.

```bash
make fclean
```

Realiza una limpieza más agresiva.

```bash
make prune
```

Limpia recursos Docker no utilizados.

```bash
make re
```

Limpia y reconstruye.

### Precaución

Los comandos de limpieza agresiva pueden eliminar imágenes, volúmenes y recursos Docker que haya que reconstruir posteriormente.

---

## 5.5. Estado de `main`

### Disponible

- [x] Next.js
- [x] TypeScript
- [x] Docker
- [x] Docker Compose
- [x] Makefile
- [x] Aplicación base
- [x] Configuración de desarrollo

### No debe considerarse terminado

- [ ] Base de datos completa
- [ ] Motor de juego
- [ ] Integración definitiva del dado
- [ ] Sistema completo de usuarios
- [ ] Partidas
- [ ] Multijugador
- [ ] Estadísticas
- [ ] Testing completo
- [ ] Integración final

---

# 6. Rama `9.Frontend`

## 6.1. Responsabilidad

`9.Frontend` contiene la evolución de la aplicación desde la base inicial de `main`.

Aquí se desarrolla:

- interfaz;
- navegación;
- componentes reutilizables;
- formularios;
- autenticación a nivel de frontend;
- integración visual;
- componentes relacionados con el dado;
- estructura para consumir la lógica del juego.

---

## 6.2. Estructura

La rama contiene, entre otras:

```text
srcs/
├── actions/
├── app/
├── components/
├── dice/
├── lib/
├── public/
├── .env.local.example
├── Dockerfile
├── eslint.config.mjs
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 6.3. Componentes

Dentro de `components/` aparecen:

```text
components/
├── 3dDice/
├── DiceScene/
├── Form/
├── Input/
├── Menu/
├── Pattern/
├── button/
├── ui/
├── AuthProvider.tsx
├── BottomBar.tsx
└── app-sidebar.tsx
```

Esto muestra una evolución clara respecto a `main`: la interfaz ya está dividida en componentes reutilizables.

---

## 6.4. Autenticación

`AuthProvider.tsx` proporciona una capa para compartir el estado de autenticación entre componentes.

Pero hay que diferenciar:

```text
Frontend AuthProvider
```

de:

```text
Autenticación real + persistencia + seguridad
```

La segunda necesita coordinación con backend y Database.

Por tanto, antes de dar autenticación por terminada hay que revisar:

- login;
- logout;
- persistencia;
- sesión;
- protección de rutas;
- usuario actual;
- errores;
- expiración;
- integración con backend.

---

## 6.5. Navegación

La existencia de:

```text
Menu/
app-sidebar.tsx
BottomBar.tsx
```

permite construir una navegación reutilizable.

Debe mantenerse separada de la lógica del juego.

---

## 6.6. Formularios

La existencia de:

```text
Form/
Input/
```

permite centralizar elementos reutilizables.

Aquí deberían concentrarse progresivamente:

- validaciones;
- estados de error;
- estados de carga;
- accesibilidad;
- estilos comunes.

---

## 6.7. `actions/`

La carpeta `actions/` permite separar acciones de la UI.

Debe evitarse colocar lógica de reglas de juego en los componentes.

La separación recomendada es:

```text
components/
    UI

actions/
    operaciones

Game/
    reglas

Database/
    persistencia
```

---

## 6.8. `lib/`

Debe contener utilidades compartidas y lógica auxiliar.

No debería convertirse en una carpeta donde se acumule código sin clasificación.

---

## 6.9. Variables de entorno

Existe:

```text
.env.local.example
```

Debe utilizarse como plantilla.

No se deben subir secretos reales al repositorio.

---

# 7. Rama `Dice`

## 7.1. Responsabilidad

`Dice` concentra el desarrollo específico del sistema de dados 3D.

Su responsabilidad final debería limitarse a:

```text
crear dado
personalizar dado
mostrar dado
animar tirada
devolver resultado
```

No debe decidir las reglas del juego.

---

## 7.2. Estructura

Entre los elementos existentes encontramos:

```text
srcs/
├── app/
├── components/
├── dice/
├── hooks/
├── lib/
├── public/
├── Dockerfile
├── components.json
├── eslint.config.mjs
├── index.html
├── next.config.ts
├── package.json
├── styles.css
└── tsconfig.json
```

---

## 7.3. Sistema de dados

Dentro de `dice/` existen piezas relacionadas con:

```text
diceAnimation.ts
diceConfig.ts
diceExamples.ts
diceFactory.ts
diceRoll.ts
hud.ts
main.ts
roundedBox.ts
```

La arquitectura ya permite distinguir varias responsabilidades.

### Configuración

`diceConfig.ts`

Debe centralizar parámetros del dado.

### Creación

`diceFactory.ts`

Debe ser responsable de crear/configurar dados.

### Tirada

`diceRoll.ts`

Debe encargarse de la lógica específica de la tirada del dado, no de las reglas globales del juego.

### Animación

`diceAnimation.ts`

Debe ocuparse de cómo se representa visualmente la tirada.

### HUD

`hud.ts`

Elementos de información superpuestos a la escena.

---

# 8. Regla fundamental de Dice

El dado debe devolver un resultado.

Ejemplo:

```text
Dice.roll()
      │
      ▼
     5
```

Pero NO debe decidir:

```text
"si sale 5, el jugador gana"
```

Eso pertenece a `Game`.

La separación correcta es:

```text
Dice
 │
 └── resultado = 5
          │
          ▼
        Game
          │
          └── interpreta el 5 según las reglas
```

---

# 9. Estado actual de Dice

### Realizado

- [x] Selección personalizada por partes.
- [x] Mejora del acabado visual.
- [x] Sistema de creación.
- [x] Configuración.
- [x] Animación.
- [x] Escena 3D.
- [x] Estructura específica de dados.

### Pendiente

- [ ] Comentar/documentar las diferentes partes.
- [ ] Añadir más jugadores.
- [ ] Desvincular Scene y Dice.
- [ ] Conseguir independencia de la escena respecto al HTML.
- [ ] Liberar `main` de responsabilidades específicas del dado.
- [ ] Solucionar bloqueo del ratón durante tiradas.
- [ ] Solucionar bloqueo del sistema `custom` durante tiradas.
- [ ] Definir API pública estable.
- [ ] Separar definitivamente animación y resultado.
- [ ] Preparar integración con `Game`.

---

# 10. Nueva rama `Database`

## 10.1. Objetivo

Esta rama debe crearse para desarrollar la **persistencia del proyecto**.

Es una rama fundamental y debe tener prioridad alta desde este momento.

La base de datos no debe diseñarse después del juego.

Debe diseñarse conjuntamente con el modelo de dominio.

---

# 11. Qué debe almacenar Database

Como mínimo debemos contemplar:

```text
Usuarios
   │
   ├── identidad
   ├── datos de perfil
   └── estadísticas

Partidas
   │
   ├── fecha
   ├── estado
   ├── jugadores
   ├── turno
   └── resultado

Tiradas
   │
   ├── jugador
   ├── partida
   ├── resultado
   └── timestamp

Historial
   │
   ├── partidas
   └── resultados
```

---

# 12. Modelo conceptual inicial

Antes de decidir tablas definitivas, debemos definir las entidades.

Una propuesta inicial:

```text
USER
 │
 ├── id
 ├── username
 ├── email
 ├── password / referencia de autenticación
 └── created_at

GAME
 │
 ├── id
 ├── status
 ├── created_at
 ├── started_at
 └── finished_at

GAME_PLAYER
 │
 ├── game_id
 ├── user_id
 ├── player_order
 └── status

TURN
 │
 ├── id
 ├── game_id
 ├── user_id
 ├── turn_number
 └── status

ROLL
 │
 ├── id
 ├── game_id
 ├── user_id
 ├── turn_id
 ├── result
 └── created_at

STATISTICS
 │
 ├── user_id
 ├── games_played
 ├── games_won
 └── ...
```

**Esto es un modelo conceptual inicial, no un esquema definitivo.**

Debe revisarse antes de implementarlo.

---

# 13. Prioridad de Database

### Fase 1 — MUY ALTA

Definir:

- entidades;
- relaciones;
- claves;
- estados;
- reglas de integridad;
- datos obligatorios/opcionales.

### Fase 2 — MUY ALTA

Implementar:

- usuarios;
- partidas;
- jugadores;
- turnos;
- tiradas.

### Fase 3 — ALTA

Añadir:

- historial;
- estadísticas;
- resultados;
- consultas necesarias para frontend.

### Fase 4 — MEDIA

Optimización y mejoras:

- índices;
- limpieza;
- migraciones;
- backups;
- optimización de consultas.

---

# 14. Qué NO debe hacer Database

La base de datos no debe contener la lógica completa del juego.

Por ejemplo, no debemos convertir una consulta SQL en la responsable de decidir toda una jugada.

La separación correcta es:

```text
Game
 │
 │ decide
 ▼
Database
 │
 │ stores
 ▼
Datos
```

---

# 15. Nueva rama `Game`

## 15.1. Objetivo

`Game` debe contener el **motor lógico del proyecto**.

Esta rama es tan importante como `Database`.

Su responsabilidad es determinar qué ocurre en una partida independientemente de cómo se muestre.

---

# 16. Qué debe resolver Game

Como mínimo:

- creación de partida;
- incorporación de jugadores;
- inicio;
- turnos;
- validaciones;
- tiradas;
- resultados;
- cambios de estado;
- finalización;
- ganador;
- errores;
- reglas especiales.

---

# 17. Máquina de estados de una partida

Es recomendable trabajar con estados explícitos.

Ejemplo:

```text
WAITING
   │
   │ jugadores suficientes
   ▼
READY
   │
   │ iniciar
   ▼
PLAYING
   │
   ├── turno jugador 1
   │
   ├── turno jugador 2
   │
   ├── ...
   │
   └── condición de final
             │
             ▼
          FINISHED
```

Estados adicionales podrán añadirse posteriormente si las reglas lo necesitan.

---

# 18. Turnos

El turno debe ser responsabilidad de `Game`.

No debe decidirlo el frontend.

Ejemplo:

```text
Game
 │
 ├── currentPlayer
 ├── turnNumber
 ├── validActions
 └── state
```

El frontend únicamente muestra:

```text
"Es el turno de Patricia"
```

Pero no debería decidir si Patricia realmente puede jugar.

---

# 19. Validación

Todas las acciones importantes deben validarse en `Game`.

Por ejemplo:

```text
¿Puede este jugador tirar?
¿Es su turno?
¿La partida está activa?
¿Puede realizar esta acción?
¿La partida ha terminado?
```

Nunca debemos confiar exclusivamente en validaciones del frontend.

---

# 20. Relación Game ↔ Dice

Esta relación es fundamental.

Debe funcionar así:

```text
Game
 │
 │ solicita roll
 ▼
Dice
 │
 │ genera resultado
 ▼
Game
 │
 │ interpreta resultado
 ▼
Estado de partida
```

Ejemplo:

```text
Jugador 2 solicita tirada
          │
          ▼
        Game
          │
          ▼
        Dice
          │
          ▼
        "4"
          │
          ▼
        Game
          │
          ├── valida
          ├── aplica reglas
          ├── actualiza turno
          └── guarda resultado
```

---

# 21. Relación Game ↔ Database

`Game` debe ser el responsable de decidir qué datos necesitan persistirse.

Por ejemplo:

```text
Game
 │
 ├── nueva partida
 │       └── Database.createGame()
 │
 ├── jugador entra
 │       └── Database.addPlayer()
 │
 ├── tirada
 │       └── Database.saveRoll()
 │
 └── final
         └── Database.finishGame()
```

La Database no debería decidir cuándo una partida termina.

---

# 22. Relación Game ↔ Frontend

El frontend debe consumir el estado de Game.

Ejemplo:

```text
Game
 │
 └── state
       │
       ├── players
       ├── currentPlayer
       ├── turn
       ├── status
       └── result
              │
              ▼
           Frontend
              │
              ├── muestra jugadores
              ├── muestra turno
              ├── habilita/deshabilita botones
              └── muestra resultado
```

El frontend puede deshabilitar un botón por UX, pero la validación real debe estar en `Game`.

---

# 23. Arquitectura global definitiva

La arquitectura objetivo debería ser:

```text
                       TRANSCENDENCE
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
   Frontend               Game               Database
       │                    │                    │
       │                    │                    │
       │                    ▼                    │
       │                  Rules                  │
       │                    │                    │
       │                    ▼                    │
       │                  State ────────────────►│
       │                    │                    │
       ▼                    │                    ▼
      Dice ◄────────────────┘                 Data
       │
       ├── Scene
       ├── Animation
       ├── Custom
       └── Roll result
```

---

# 24. Flujo completo de una partida

El flujo final debería ser conceptualmente:

```text
1. Usuario inicia sesión
        │
        ▼
2. Frontend obtiene usuario
        │
        ▼
3. Usuario crea/se une a partida
        │
        ▼
4. Game crea/actualiza partida
        │
        ▼
5. Database persiste jugadores
        │
        ▼
6. Game inicia partida
        │
        ▼
7. Frontend muestra estado
        │
        ▼
8. Jugador solicita tirada
        │
        ▼
9. Game valida turno
        │
        ▼
10. Dice realiza animación
        │
        ▼
11. Dice devuelve resultado
        │
        ▼
12. Game aplica reglas
        │
        ▼
13. Database guarda resultado
        │
        ▼
14. Game actualiza estado
        │
        ▼
15. Frontend recibe estado
        │
        ▼
16. Se muestra siguiente turno
        │
        ▼
17. Condición de finalización
        │
        ▼
18. Game finaliza partida
        │
        ▼
19. Database guarda resultado final
```

---

# 25. Orden recomendado de desarrollo

No se recomienda trabajar en las cinco ramas simultáneamente sin coordinación.

## Fase 1 — Definición

Primero acordar:

```text
Usuarios
Partidas
Jugadores
Turnos
Tiradas
Estados
Reglas
```

Esto debe producir un modelo común para `Game` y `Database`.

---

## Fase 2 — Database

Crear:

```text
Database
```

y comenzar por:

```text
users
games
game_players
turns
rolls
```

---

## Fase 3 — Game

Crear:

```text
Game
```

y desarrollar el motor sin depender de UI.

Debe poder probarse con entradas y salidas controladas.

---

## Fase 4 — Terminar Dice

Mientras `Game` avanza, terminar:

```text
Dice
```

con especial atención a:

- desacoplamiento;
- múltiples jugadores;
- API;
- resultado;
- animación;
- bloqueos.

---

## Fase 5 — Integración Frontend

Después:

```text
9.Frontend
```

debe consumir las interfaces de:

```text
Game
Dice
Database/API
```

---

# 26. Roadmap visual

```text
                ┌──────────────────┐
                │     MAIN         │
                │ Base existente   │
                └────────┬─────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    9.Frontend       Database          Game
          │              │              │
          │              │              │
          ▼              └──────┐       │
        Dice                    │       │
          │                     │       │
          └──────────────┐      │       │
                         ▼      ▼       ▼
                       INTEGRACIÓN
                            │
                            ▼
                           MAIN
```

---

# 27. Prioridad por bloques

## 🔴 PRIORIDAD MÁXIMA

### Database

Definir el modelo.

### Game

Definir las reglas y estados.

Estas dos piezas son fundamentales porque condicionan el resto del proyecto.

---

## 🟠 PRIORIDAD ALTA

### Dice

Finalizar la arquitectura y eliminar los problemas conocidos.

### Frontend

Preparar la UI para consumir las interfaces reales.

---

## 🟢 PRIORIDAD DE INTEGRACIÓN

### main

Integrar únicamente cuando las piezas estén suficientemente estabilizadas.

---

# 28. Qué debe estar acordado antes de programar Game

Antes de crear muchas clases/funciones hay que responder:

### Partida

- ¿Cuántos jugadores?
- ¿Puede entrar un jugador después de comenzar?
- ¿Cuándo empieza?
- ¿Cuándo termina?

### Turnos

- ¿Cómo se determina el primero?
- ¿Cómo cambia el turno?
- ¿Qué ocurre si un jugador abandona?

### Dados

- ¿Cuántos dados utiliza cada jugador?
- ¿Qué valores puede producir?
- ¿Hay diferentes tipos de dado?
- ¿Puede modificarse el dado?

### Victoria

- ¿Qué condición determina al ganador?
- ¿Puede haber empate?
- ¿Cómo se registra?

### Persistencia

- ¿Qué se guarda?
- ¿Cuándo se guarda?
- ¿Qué ocurre si falla la persistencia?

Estas decisiones deben documentarse antes de convertirlas en código.

---

# 29. Contrato entre módulos

Es muy recomendable establecer contratos sencillos.

## Dice

Entrada:

```text
configuración
```

Salida:

```text
resultado de tirada
```

---

## Game

Entrada:

```text
acción del jugador
estado actual
resultado de Dice
```

Salida:

```text
nuevo estado de partida
```

---

## Database

Entrada:

```text
datos
```

Salida:

```text
datos persistidos / consultados
```

---

## Frontend

Entrada:

```text
estado
```

Salida:

```text
acciones del usuario
```

---

# 30. Ejemplo de separación correcta

Supongamos que sale un `6`.

### Incorrecto

```text
Dice
 └── si sale 6 → jugador gana
```

### Correcto

```text
Dice
 └── resultado = 6
              │
              ▼
Game
 └── aplica regla del 6
              │
              ▼
Database
 └── guarda resultado
              │
              ▼
Frontend
 └── muestra resultado
```

---

# 31. Testing recomendado

El motor de juego debe poder probarse sin frontend.

Por ejemplo:

```text
Game
 │
 ├── crear partida
 ├── añadir jugadores
 ├── iniciar
 ├── solicitar tirada
 ├── comprobar turno
 ├── aplicar resultado
 └── finalizar
```

Esto permite detectar errores de reglas antes de integrarlos visualmente.

También deben probarse:

- turnos incorrectos;
- jugadores inexistentes;
- partidas terminadas;
- tiradas duplicadas;
- resultados inválidos;
- desconexiones;
- estados inconsistentes.

---

# 32. Integración con tiempo real

Si el proyecto necesita multijugador en tiempo real, la comunicación debe seguir un modelo parecido a:

```text
Jugador A
   │
   ▼
Frontend A
   │
   ▼
Game
   │
   ├── cambia estado
   │
   ▼
WebSocket / canal tiempo real
   │
   ├───────────────┐
   ▼               ▼
Frontend A      Frontend B
```

La base de datos mantiene la persistencia, pero no debería ser el mecanismo utilizado para sincronizar cada evento visual en tiempo real.

---

# 33. Qué pertenece a cada rama

## `main`

Pertenece:

- configuración global;
- infraestructura;
- integración estable;
- configuración común.

---

## `9.Frontend`

Pertenece:

- páginas;
- componentes;
- navegación;
- formularios;
- experiencia de usuario;
- integración visual;
- consumo de API;
- presentación del estado del juego.

---

## `Dice`

Pertenece:

- geometría;
- materiales;
- personalización;
- escena;
- animación;
- interacción 3D;
- resultado de tirada.

---

## `Game`

Pertenece:

- reglas;
- turnos;
- estados;
- validaciones;
- jugadores;
- condiciones de victoria;
- lógica de partida.

---

## `Database`

Pertenece:

- modelo de datos;
- persistencia;
- consultas;
- relaciones;
- historial;
- estadísticas;
- migraciones.

---

# 34. Qué NO pertenece a cada rama

### Dice NO debe contener

- reglas de victoria;
- usuarios;
- persistencia;
- autenticación.

### Frontend NO debe contener

- reglas críticas;
- decisiones de seguridad;
- persistencia directa sin capa correspondiente.

### Database NO debe contener

- animaciones;
- lógica visual;
- reglas completas del juego.

### Game NO debe contener

- código React;
- Babylon.js específico;
- HTML;
- CSS.

---

# 35. Estrategia de merges

La regla de Git sigue siendo:

> **El merge se ejecuta desde la rama destino.**

Ejemplo:

```bash
git switch 9.Frontend
git pull
git merge Dice
```

Aquí:

```text
Destino = 9.Frontend
Origen  = Dice
```

Para integrar Game:

```bash
git switch 9.Frontend
git pull
git merge Game
```

Para integrar Database, si la arquitectura lo permite:

```bash
git switch 9.Frontend
git pull
git merge Database
```

Pero lo recomendable es que la integración funcional de Database se produzca a través de la interfaz/backend correspondiente y no simplemente mezclando código indiscriminadamente.

---

# 36. Flujo recomendado de Pull Requests

En lugar de desarrollar directamente sobre `main`:

```text
main
 │
 ├── 9.Frontend
 ├── Dice
 ├── Database
 └── Game
```

Cada rama debería:

```text
desarrollo
   │
   ▼
tests
   │
   ▼
Pull Request
   │
   ▼
revisión
   │
   ▼
merge
```

---

# 37. Definición de "terminado"

Una funcionalidad no debe marcarse como terminada simplemente porque funciona una vez.

Para considerarla terminada debería:

- compilar;
- estar probada;
- no generar errores conocidos importantes;
- tener una responsabilidad clara;
- estar documentada;
- no introducir acoplamiento innecesario;
- poder integrarse con las otras ramas.

---

# 38. Estado de traspaso

## `main`

**Estado:** base disponible.

**Prioridad:** integración.

---

## `9.Frontend`

**Estado:** desarrollo avanzado respecto a la base.

**Prioridad:** alta.

**Siguiente paso:** preparar integración con Game, Database y Dice.

---

## `Dice`

**Estado:** desarrollo avanzado pero con tareas arquitectónicas pendientes.

**Prioridad:** alta.

**Siguiente paso:** desacoplar, estabilizar y definir API.

---

## `Database`

**Estado:** rama a crear.

**Prioridad:** muy alta.

**Siguiente paso:** diseño del modelo de datos.

---

## `Game`

**Estado:** rama a crear.

**Prioridad:** muy alta.

**Siguiente paso:** definir reglas, estados y contratos.

---

# 39. Plan de trabajo recomendado

## Sprint / Fase 1

### Database

- [ ] Crear rama.
- [ ] Definir entidades.
- [ ] Definir relaciones.
- [ ] Definir estados.
- [ ] Diseñar esquema.
- [ ] Implementar tablas/migraciones.
- [ ] Crear acceso a datos.
- [ ] Probar CRUD básico.

### Game

- [ ] Crear rama.
- [ ] Definir reglas.
- [ ] Definir máquina de estados.
- [ ] Definir turnos.
- [ ] Definir jugadores.
- [ ] Definir tiradas.
- [ ] Definir victoria.
- [ ] Crear tests unitarios.

---

# 40. Sprint / Fase 2

### Dice

- [ ] Desacoplar Scene/Dice.
- [ ] Resolver bloqueos.
- [ ] Soportar varios dados.
- [ ] Separar animación y resultado.
- [ ] Crear API estable.
- [ ] Documentar integración.

### Frontend

- [ ] Revisar autenticación.
- [ ] Revisar navegación.
- [ ] Preparar pantallas de partida.
- [ ] Preparar estado de juego.
- [ ] Consumir API.
- [ ] Integrar Dice.

---

# 41. Sprint / Fase 3

Integración:

```text
Frontend
    │
    ├──────── Dice
    │
    └──────── Game
                 │
                 └──────── Database
```

Validar:

- [ ] crear usuario;
- [ ] iniciar sesión;
- [ ] crear partida;
- [ ] unirse;
- [ ] iniciar;
- [ ] turno;
- [ ] tirar;
- [ ] mostrar dado;
- [ ] obtener resultado;
- [ ] aplicar regla;
- [ ] persistir;
- [ ] cambiar turno;
- [ ] finalizar;
- [ ] guardar resultado.

---

# 42. Sprint / Fase 4

Cuando todo esté integrado:

```text
9.Frontend
Dice
Game
Database
```

se integra progresivamente en:

```text
main
```

y se realiza una validación global.

---

# 43. Checklist final de integración

Antes de considerar el proyecto funcional:

### Infraestructura

- [ ] Docker
- [ ] entorno reproducible
- [ ] variables de entorno
- [ ] configuración documentada

### Frontend

- [ ] navegación
- [ ] autenticación
- [ ] usuario
- [ ] partida
- [ ] interfaz del juego
- [ ] errores
- [ ] loading states

### Dice

- [ ] dado 3D
- [ ] personalización
- [ ] animación
- [ ] resultado
- [ ] múltiples jugadores
- [ ] interacción estable

### Game

- [ ] reglas
- [ ] turnos
- [ ] estados
- [ ] validaciones
- [ ] victoria
- [ ] finalización
- [ ] tests

### Database

- [ ] usuarios
- [ ] partidas
- [ ] jugadores
- [ ] turnos
- [ ] tiradas
- [ ] historial
- [ ] estadísticas

### Integración

- [ ] Frontend ↔ Game
- [ ] Game ↔ Dice
- [ ] Game ↔ Database
- [ ] Frontend ↔ autenticación
- [ ] comunicación en tiempo real
- [ ] persistencia
- [ ] testing global

---

# 44. Arquitectura final resumida

La visión final que debe guiar al equipo es:

```text
                         ┌───────────────┐
                         │   FRONTEND    │
                         │ React/Next.js │
                         └───────┬───────┘
                                 │
                    acciones / estado / UI
                                 │
                                 ▼
                         ┌───────────────┐
                         │     GAME      │
                         │ reglas/estado │
                         └───┬───────┬───┘
                             │       │
                    resultado│       │persistencia
                             │       │
                             ▼       ▼
                      ┌──────────┐ ┌───────────┐
                      │   DICE   │ │ DATABASE  │
                      │ 3D/roll  │ │   datos   │
                      └──────────┘ └───────────┘
```

La responsabilidad de cada módulo debe mantenerse clara:

```text
Frontend  → "¿Cómo lo ve/interactúa el usuario?"

Dice      → "¿Cómo se muestra y ejecuta la tirada?"

Game      → "¿Qué significa esa tirada y qué ocurre ahora?"

Database  → "¿Qué debemos guardar y recuperar?"

main      → "¿Cuál es la versión integrada y estable?"
```

---

# 45. Regla de oro del proyecto

Antes de implementar cualquier funcionalidad, determinar primero dónde pertenece.

Si afecta a:

```text
UI / navegación / interacción
        → Frontend

Dado / escena / animación
        → Dice

Reglas / turnos / estados
        → Game

Persistencia / datos / historial
        → Database

Integración / configuración estable
        → main
```

La arquitectura debe evitar que una misma responsabilidad aparezca duplicada en varias ramas.

---

# 46. Conclusión

El proyecto tiene actualmente una base funcional sobre la que ya se ha avanzado especialmente en frontend y dados.

Sin embargo, para que pueda considerarse una aplicación completa, faltan dos pilares fundamentales:

```text
DATABASE
GAME
```

Estos dos componentes deben tratarse como **prioridad muy alta**.

El orden lógico de trabajo es:

```text
             DEFINIR MODELO
                   │
          ┌────────┴────────┐
          ▼                 ▼
      DATABASE             GAME
          │                 │
          │                 │
          └────────┬────────┘
                   │
                   ▼
                 DICE
                   │
                   ▼
             9.FRONTEND
                   │
                   ▼
             INTEGRACIÓN
                   │
                   ▼
                  MAIN
```

La idea fundamental es no desarrollar cada rama como un proyecto independiente.

El objetivo es que todas las piezas terminen formando un único sistema:

```text
                    TRANSCENDENCE
                         │
         ┌───────────────┼───────────────┐
         │               │               │
     FRONTEND           GAME          DATABASE
         │               │               │
         │               │               │
         └───────┐       │       ┌───────┘
                 ▼       ▼       ▼
                       DICE
                         │
                         ▼
                    EXPERIENCIA
                    DEL USUARIO
```

**Prioridad inmediata:**

1. **Crear y diseñar `Database`.**
2. **Crear y diseñar `Game`.**
3. **Terminar de desacoplar y estabilizar `Dice`.**
4. **Preparar `9.Frontend` para consumir las piezas anteriores.**
5. **Integrar progresivamente todo en `main`.**

Este orden reduce el riesgo de que el frontend se construya sobre una lógica provisional y posteriormente haya que rehacer las pantallas, los componentes o el sistema de autenticación.
