package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/99designs/gqlgen/handler"
	"github.com/Farishadibrata/golang-rfq/graph"
	"github.com/Farishadibrata/golang-rfq/graph/generated"
	middlewares "github.com/Farishadibrata/golang-rfq/middleware"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

const defaultPort = "4080"

type authString string

const (
	host     = "localhost"
	portDB   = "5432"
	user     = "postgres123"
	password = "postgres123"
	dbname   = "postgres"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	psqlconn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, portDB, user, password, dbname)
	db, err := sql.Open("postgres", psqlconn)
	if err != nil {
		panic(err)
	}
	router := mux.NewRouter()
	router.Use(middlewares.AuthMiddleware)
	// schema := generated.Config{Resolvers: &graph.Resolver{DB: db}}
	schema := generated.Config{Resolvers: &graph.Resolver{DB: db}}
	schema.Directives.RequireLogin = func(ctx context.Context, obj interface{}, next graphql.Resolver, hastoken bool) (interface{}, error) {

		if hastoken {
			token := middlewares.CtxValue(ctx)
			if token == nil {
				return nil, fmt.Errorf("Please provide token")
			}
			return next(ctx)
		}
		return next(ctx)
	}
	gql := generated.NewExecutableSchema(schema)

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", middlewares.AuthMiddleware(handler.GraphQL(gql)))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowCredentials: true,
		Debug:            true,
		AllowOriginFunc:  func(origin string) bool { return true },
	}).Handler(router)

	srv := &http.Server{
		Handler:      corsHandler,
		Addr:         "127.0.0.1:4080",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
