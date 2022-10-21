package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/Farishadibrata/golang-rfq/graph/generated"
	"github.com/Farishadibrata/golang-rfq/graph/model"
	"github.com/Farishadibrata/golang-rfq/service"
	"github.com/lib/pq"
)

// CreateRfq is the resolver for the createRFQ field.
func (r *mutationResolver) CreateRfq(ctx context.Context, input model.NewRfq) (*model.Rfq, error) {
	sqlStatement := `INSERT INTO rfq.header(
		"CompanyName", "CompanyAddress", "CompanyWebsite", "QuotationDate", "QuotationNo", "QuotationExpires", "MadeForName", "MadeForAddress", "MadeForPhone", "SentToName", "SentToAddress", "SentToPhone", "Disc", "Tax", "Interest", "SNK")
		VALUES ($1, $2, $3, $4, $5,$6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;`
	response := &model.Rfq{}
	items := []*model.Item{}

	err := r.DB.QueryRow(sqlStatement, input.CompanyName, input.CompanyAddress, input.CompanyWebsite, input.QuotationDate, input.QuotationNo, input.QuotationExpires, input.MadeForName, input.MadeForAddress, input.MadeForPhone, input.SentToName, input.SentToAddress, input.SentToPhone, input.Disc, input.Tax, input.Interest, pq.Array(input.Snk)).Scan(
		&response.CompanyName,
		&response.CompanyAddress,
		&response.CompanyWebsite,
		&response.QuotationDate,
		&response.QuotationNo,
		&response.QuotationExpires,
		&response.MadeForName,
		&response.MadeForAddress,
		&response.MadeForPhone,
		&response.SentToName,
		&response.SentToAddress,
		&response.SentToPhone,
		&response.Disc,
		&response.Tax,
		&response.Interest,
		pq.Array(&response.Snk),
		&response.ID)
	for _, item := range input.Items {
		newItem := &model.Item{}

		println(response.ID)
		sqlStatementItem := `INSERT INTO rfq.items(
			"HeaderID", "Nama", "Harga", "Qty")
			VALUES ($1, $2, $3, $4) RETURNING *;`
		err := r.DB.QueryRow(sqlStatementItem, response.ID, item.Nama, item.Harga, item.Qty).Scan(&newItem.HeaderID, &newItem.Nama, &newItem.Harga, &newItem.Qty)
		if err != nil {
			panic(err)
		}
		items = append(items, newItem)
	}
	if err != nil {
		panic(err)
	}
	response.Items = items
	return response, err
}

// Login is the resolver for the login field.
func (r *mutationResolver) Login(ctx context.Context, input model.Login) (*model.LoginResponse, error) {
	user := &model.Login{}
	err := r.DB.QueryRow("SELECT * FROM rfq.user WHERE email = ($1) AND password = ($2)", input.Email, input.Password).Scan(&user.Email, &user.Password)

	if err != nil {
		return nil, fmt.Errorf("Invalid login")
	}
	token, _ := service.JwtGenerate(user.Email)
	response := model.LoginResponse{Token: token}
	return &response, nil
}

// RFQs is the resolver for the RFQs field.
func (r *queryResolver) RFQs(ctx context.Context) ([]*model.Rfq, error) {
	rows, err := r.DB.Query("SELECT * FROM rfq.header")
	if err != nil {
		panic(err)
	}
	responseArray := []*model.Rfq{}
	for rows.Next() {
		response := &model.Rfq{}
		rows.Scan(&response.CompanyName,
			&response.CompanyAddress,
			&response.CompanyWebsite,
			&response.QuotationDate,
			&response.QuotationNo,
			&response.QuotationExpires,
			&response.MadeForName,
			&response.MadeForAddress,
			&response.MadeForPhone,
			&response.SentToName,
			&response.SentToAddress,
			&response.SentToPhone,
			&response.Disc,
			&response.Tax,
			&response.Interest,
			pq.Array(&response.Snk),
			&response.ID)
		responseArray = append(responseArray, response)
	}
	return responseArray, nil
}

// RFQList is the resolver for the RFQList field.
func (r *queryResolver) RFQList(ctx context.Context) ([]*model.RFQList, error) {
	rows, err := r.DB.Query(`SELECT "ID", "CompanyName","QuotationNo" FROM rfq.header`)
	if err != nil {
		panic(err)
	}
	responseArray := []*model.RFQList{}
	for rows.Next() {
		response := &model.RFQList{}
		rows.Scan(&response.ID,
			&response.CompanyName,
			&response.QuotationNo)
		responseArray = append(responseArray, response)
	}
	return responseArray, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
