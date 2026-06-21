package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func ConnectToPostgresql() *gorm.DB {
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_DBNAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=prefer",
		dbHost, dbUser, dbPass, dbName, dbPort)

	// Supabase/PgBouncer transaction pooling does not persist prepared statements
	// across pooled connections, which surfaces as
	//   ERROR: prepared statement "stmtcache_..." already exists (SQLSTATE 42P05).
	// pgx's simple query protocol skips server-side prepared statements entirely,
	// which is the supported way to run GORM through a transaction pooler.
	pgConfig := postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}

	newLogger := logger.New(
		log.New(log.Writer(), "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold: time.Second,
			LogLevel:      logger.Warn,
			Colorful:      true,
		},
	)

	db, err := gorm.Open(postgres.New(pgConfig), &gorm.Config{Logger: newLogger})
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Error obtaining sql.DB:", err)
	}
	sqlDB.SetMaxOpenConns(20)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(time.Hour)

	fmt.Println("Connected to PostgreSQL successfully!")
	return db
}
