package directives

import (
	"context"

	"github.com/99designs/gqlgen/graphql"
	middlewares "github.com/Farishadibrata/golang_travel/middleware"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func Auth(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	tokenData := middlewares.CtxValue(ctx)
	if tokenData == nil {
		return nil, &gqlerror.Error{
			Message: "Access Denied",
		}
	}

	return next(ctx)
}
