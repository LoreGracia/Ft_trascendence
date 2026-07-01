NAME = inception
DOCKER_COMPOSE = docker-compose 

all:
	$(DOCKER_COMPOSE) up -d --build

watch:
	$(DOCKER_COMPOSE) up -w --build

down:
	$(DOCKER_COMPOSE) down --rmi all

clean: down 

fclean: clean
	docker system prune -af
	docker volume prune -f

prune: fclean
	docker builder prune -af

re: prune all

.PHONY: all clean fclean prune re