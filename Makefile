DOCKER_COMPOSE = docker-compose --env-file .env.local

all: up

up: https
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

https: certs/local.key certs/local.crt

certs/local.key certs/local.crt:
	mkdir -p certs
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-keyout certs/local.key -out certs/local.crt \
			-subj "/CN=*.docker.localhost"

.PHONY: all clean fclean prune re
