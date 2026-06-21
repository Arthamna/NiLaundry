How To Run
1. Fill env with creds, example :

```
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_DBNAME=nilaundry
DB_PORT=5432
APP_PORT=8080
JWT_SECRET_KEY=ganti-pakai-string-acak-yang-panjang
```

2. Run Postgres DB (Local) :


cd backend
make up        # docker compose up postgre-db

3. Buat database + jalankan migration + seed:


make migrate   # createdb + apply 001..004 (schema, functions, procedures, triggers)
make seed      # apply 005_seed.sql (cabang, pegawai, layanan, tarif, voucher)
Atau gabungan: make reset

Kalau tidak pakai make, manual:

```
docker exec -it postgre-db psql -U postgres -c "CREATE DATABASE nilaundry;"
docker exec -i postgre-db psql -U postgres -d nilaundry < pkg/database/script/001_schema.sql
docker exec -i postgre-db psql -U postgres -d nilaundry < pkg/database/script/002_functions.sql
docker exec -i postgre-db psql -U postgres -d nilaundry < pkg/database/script/003_procedures.sql
docker exec -i postgre-db psql -U postgres -d nilaundry < pkg/database/script/004_triggers.sql
docker exec -i postgre-db psql -U postgres -d nilaundry < pkg/database/script/005_seed.sql
```

4. Jalankan backend:


make run       # go run ./cmd
Server listen di http://localhost:8080.

5. Jalankan frontend (di terminal lain):


cd ../frontend
npm install
# pastikan .env.local punya: NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
npm run dev