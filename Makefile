DOCKER_COMPOSE = docker-compose --env-file ./srcs/.env.local

all: up

up:
	$(DOCKER_COMPOSE) up

re:
	$(DOCKER_COMPOSE) up --build

down:
	$(DOCKER_COMPOSE) down

clean:
	$(DOCKER_COMPOSE) down --rmi all -v

fclean: clean
	docker system prune -af
	docker volume prune -f

prune: fclean
	docker builder prune -af

.PHONY: all clean fclean prune re
