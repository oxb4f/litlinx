DOCKER_USERNAME ?= oxb4f
APP_NAME ?= $(shell basename $(PWD))
GIT_BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)
GIT_COMMIT ?= $(shell git rev-parse --short HEAD)
DOCKER_TAG ?= ${GIT_BRANCH}-${GIT_COMMIT}
APP_IMAGE ?= ${DOCKER_USERNAME}/${APP_NAME}:${DOCKER_TAG}
DOCKER_FILE ?= build/Dockerfile
DOCKER_COMPOSE ?= deployment/docker-compose.dev.yml
ENV_FILE ?= .env.dev

RN := $(shell echo $$(( RANDOM % 9 + 1 ))`seq -w 0 8 | shuf | tr -d '\n' | head -c 9`)
RS := $(shell openssl rand -base64 10 | tr -dc 'a-zA-Z0-9' | head -c 10)

# @target build
PULL ?= false ## Pull the latest base image before building. Default is false.
NO_CACHE ?= false ## Build the image without using cache. Default is false.
TARGET ?= dev ## Build target for docker: dev, prod or test

# @target run
DETACH ?= false ## Run docker-compose in detached mode. Default is false.

BLUE := \033[1;34m
GREEN := \033[0;32m
WHITE := \033[0;97m
RESET := \033[0m

.PHONY: build run stop help hurl test-unit

build: ## Build the Docker image for the application
ifeq ($(PULL),true)
	PULL_FLAG=--pull
else
	PULL_FLAG=
endif
ifeq ($(NO_CACHE),true)
	NO_CACHE_FLAG=--no-cache
else
	NO_CACHE_FLAG=
endif
	DOCKER_BUILDKIT=1 docker build $(PULL_FLAG) $(NO_CACHE_FLAG) --tag ${APP_IMAGE} --file ${DOCKER_FILE} --target ${TARGET} .

run: stop ## Start the application using Docker Compose
ifeq ($(DETACH),true)
	DETACH_FLAG=-d
else
	DETACH_FLAG=
endif
	APP_IMAGE=${APP_IMAGE} ENV_FILE=${ENV_FILE} docker-compose --file ${DOCKER_COMPOSE} --project-name ${APP_NAME} up $(DETACH_FLAG)

stop: ## Stop the application using Docker Compose
	APP_IMAGE=${APP_IMAGE} ENV_FILE=${ENV_FILE} docker-compose --file ${DOCKER_COMPOSE} down --remove-orphans --volumes

hurl: ## Run hurl tests against the application
	@hurl \
		--variables-file ./hurl/vars \
		--variable rn=$(RN) \
		--variable rs=$(RS) \
		--file-root ./hurl \
		--insecure \
		--error-format long \
		--test \
		--glob "./hurl/*.hurl"

test-unit: stop ## Run unit tests against the application
	APP_IMAGE=${APP_IMAGE} ENV_FILE=${ENV_FILE} docker-compose --file ${DOCKER_COMPOSE} --project-name ${APP_NAME} up --detach

	docker-compose --file ${DOCKER_COMPOSE} --project-name ${APP_NAME} exec --tty --interactive app sh -c "pnpm test:unit"

help: ## Display this help message
	@echo "Usage: make [target] [FLAGS]"
	@echo ""
	@echo "$(BLUE)Targets:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "; print "$(GREEN)"} /^[a-zA-Z_-]+:.*?## / {printf "  %-10s $(WHITE)%s$(RESET)\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(BLUE)Flags:$(RESET)"
	@awk 'BEGIN {target=""} \
		/^# @target/ {target=$$3; next} \
		/##/ && target!="" { \
			split($$1, arr, "?"); var=arr[1]; \
			desc=substr($$0, index($$0, "##") + 3); \
			if (!printed[target]++) { \
				printf "\n${GREEN}Flags for '" target "' target:${RESET}\n"; \
			} \
			printf "  ${BLUE}%s=true${RESET}   - ${WHITE}%s${RESET}\n", var, desc \
		} \
		/^$$/ {target=""}' $(MAKEFILE_LIST)
