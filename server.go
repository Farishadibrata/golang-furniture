package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/Farishadibrata/golang-furniture/directives"
	"github.com/Farishadibrata/golang-furniture/graph"
	"github.com/Farishadibrata/golang-furniture/graph/generated"
	middlewares "github.com/Farishadibrata/golang-furniture/middleware"
	"github.com/gorilla/mux"
)

const defaultPort = "3000"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	router := mux.NewRouter()
	router.Use(middlewares.AuthMiddleware)

	schema := generated.Config{Resolvers: &graph.Resolver{}}
	schema.Directives.Auth = directives.Auth

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(schema))

	buildHandler := http.FileServer(http.Dir("./app-web/dist/"))
	staticHandler := http.StripPrefix("/assets/", http.FileServer(http.Dir("./testf")))
	router.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)
	router.Handle("/", buildHandler)
	router.Handle("/assets", staticHandler)
	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe("127.0.0.1:"+port, router))
}
