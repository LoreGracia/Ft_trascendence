DOCKER_COMPOSE = docker-compose --env-file ./srcs/.env.local

all: up

up:
	$(DOCKER_COMPOSE) up

re:
	$(DOCKER_COMPOSE) up --build

down:
	$(DOCKER_COMPOSE) down

clean:
	down --rmi all

fclean: clean
	docker system prune -af
	docker volume prune -f

prune: fclean
	docker builder prune -af

re: prune all

.PHONY: all clean fclean prune re
