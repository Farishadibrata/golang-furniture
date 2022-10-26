package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/devAlvinSyahbana/golang-rfq/graph/generated"
	"github.com/devAlvinSyahbana/golang-rfq/graph/model"
	"github.com/devAlvinSyahbana/golang-rfq/service"
	"github.com/lib/pq"
)

// CreateRfq is the resolver for the createRFQ field.
func (r *mutationResolver) CreateRfq(ctx context.Context, input model.NewRfq) (*model.Rfq, error) {
	sqlStatement := `INSERT INTO rfq.header(
		"CompanyName", "CompanyAddress", "CompanyWebsite", "QuotationDate", "QuotationNo", "QuotationExpires", "MadeForName", "MadeForAddress", "MadeForPhone", "SentToName", "SentToAddress", "SentToPhone", "Disc", "Tax", "Interest", "SNK", "Status")
		VALUES ($1, $2, $3, $4, $5,$6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *;`
	response := &model.Rfq{}
	items := []*model.Item{}

	err := r.DB.QueryRow(sqlStatement, input.CompanyName, input.CompanyAddress, input.CompanyWebsite, input.QuotationDate, input.QuotationNo, input.QuotationExpires, input.MadeForName, input.MadeForAddress, input.MadeForPhone, input.SentToName, input.SentToAddress, input.SentToPhone, input.Disc, input.Tax, input.Interest, pq.Array(input.Snk), input.Status).Scan(
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
		&response.ID,
		&response.CreatedAt,
		&response.CreatedBy,
		&response.UpdatedAt,
		&response.UpdatedBy,
		&response.Status,
		&response.DeletedAt,
		&response.DeletedBy,
		&response.IsDeleted)
	for _, item := range input.Items {
		newItem := &model.Item{}
		// debuging
		// log.Print(`INSERT INTO rfq.items(
		// 	"HeaderID", "Nama", "Harga", "Qty")
		// 	VALUES ($1, $2, $3, $4) RETURNING *;`, response.ID, item.Nama, item.Harga, item.Qty)

		println(response.ID)
		sqlStatementItem := `INSERT INTO rfq.items(
			"HeaderID", "Nama", "Harga", "Qty")
			VALUES ($1, $2, $3, $4) RETURNING *;`
		err := r.DB.QueryRow(sqlStatementItem, response.ID, item.Nama, item.Harga, item.Qty).Scan(
			&newItem.HeaderID,
			&newItem.Nama,
			&newItem.Harga,
			&newItem.Qty,
			&newItem.CreatedAt,
			&newItem.CreatedBy,
			&newItem.UpdatedAt,
			&newItem.UpdatedBy,
			&newItem.DeletedAt,
			&newItem.DeletedBy,
			&newItem.IsDeleted,
		)
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
		return nil, fmt.Errorf("invalid login")
	}
	token, _ := service.JwtGenerate(user.Email)
	response := model.LoginResponse{Token: token}
	return &response, nil
}

// Rfq is the resolver for the RFQ field.
func (r *mutationResolver) Rfq(ctx context.Context, input model.RFQInput) (*model.Rfq, error) {
	response := &model.Rfq{}

	err := r.DB.QueryRow(`SELECT * FROM rfq.header WHERE "ID" = ($1)`, input.ID).Scan(
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
		&response.ID,
		&response.CreatedAt,
		&response.CreatedBy,
		&response.UpdatedAt,
		&response.UpdatedBy,
		&response.Status,
		&response.DeletedAt,
		&response.DeletedBy,
		&response.IsDeleted,
	)

	if err != nil {
		panic(err)
	}

	rowsItems, errItems := r.DB.Query(`SELECT * FROM rfq.items WHERE "HeaderID" = ($1)`, input.ID)

	if errItems != nil {
		panic(errItems)
	}

	responseArray := []*model.Item{}
	for rowsItems.Next() {
		responseItem := &model.Item{}
		rowsItems.Scan(
			&responseItem.HeaderID,
			&responseItem.Nama,
			&responseItem.Harga,
			&responseItem.Qty,
			&responseItem.CreatedAt,
			&responseItem.CreatedBy,
			&responseItem.UpdatedAt,
			&responseItem.UpdatedBy,
			&responseItem.DeletedAt,
			&responseItem.DeletedBy,
			&responseItem.IsDeleted,
		)
		responseArray = append(responseArray, responseItem)
	}

	response.Items = responseArray

	return response, nil
}

// RFQList is the resolver for the RFQList field.
func (r *queryResolver) RFQList(ctx context.Context) ([]*model.RFQList, error) {
	rows, err := r.DB.Query(`SELECT "ID", "CompanyName","QuotationNo" FROM rfq.header ORDER BY "CreatedAt" DESC`)
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
