NAME = inception
DOCKER_COMPOSE = docker-compose -f srcs/docker-compose.yml

all:
	$(DOCKER_COMPOSE) up -d --build
	@chmod +x srcs/get_url.sh
	@./srcs/get_url.sh

up:
	$(DOCKER_COMPOSE) up all

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