PROJECT=nilaundry
SCRIPT_DIR=pkg/database/script

# change if u using local
# PSQL=docker exec -i postgre-db psql -U $(DB_USER) -d $(DB_DBNAME)
# supabase
PSQL= psql postgresql://$(DB_USER):$(DB_PASS)@$(DB_HOST):$(DB_PORT)/postgres

include .env
export

up:
	docker compose -p $(PROJECT) up -d

down:
	docker compose -p $(PROJECT) down

createdb:
	docker exec -i postgre-db psql -U $(DB_USER) -c "CREATE DATABASE $(DB_DBNAME);" || true

migrate: 
	$(PSQL) < $(SCRIPT_DIR)/001_schema.sql
	$(PSQL) < $(SCRIPT_DIR)/002_functions.sql
	$(PSQL) < $(SCRIPT_DIR)/003_procedures.sql
	$(PSQL) < $(SCRIPT_DIR)/004_triggers.sql

seed:
	$(PSQL) < $(SCRIPT_DIR)/005_seed.sql

reset: migrate seed

run:
	go run ./cmd

tidy:
	go mod tidy
