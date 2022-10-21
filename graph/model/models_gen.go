// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type Item struct {
	HeaderID string `json:"HeaderID"`
	Nama     string `json:"Nama"`
	Harga    int    `json:"Harga"`
	Qty      int    `json:"Qty"`
}

type ItemInput struct {
	Nama  string `json:"Nama"`
	Harga int    `json:"Harga"`
	Qty   int    `json:"Qty"`
}

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type NewRfq struct {
	CompanyName      string       `json:"CompanyName"`
	CompanyAddress   string       `json:"CompanyAddress"`
	CompanyWebsite   string       `json:"CompanyWebsite"`
	QuotationDate    string       `json:"QuotationDate"`
	QuotationNo      string       `json:"QuotationNo"`
	QuotationExpires string       `json:"QuotationExpires"`
	MadeForName      string       `json:"MadeForName"`
	MadeForAddress   string       `json:"MadeForAddress"`
	MadeForPhone     string       `json:"MadeForPhone"`
	SentToName       string       `json:"SentToName"`
	SentToAddress    string       `json:"SentToAddress"`
	SentToPhone      string       `json:"SentToPhone"`
	Items            []*ItemInput `json:"Items"`
	Snk              []string     `json:"SNK"`
	Disc             int          `json:"Disc"`
	Tax              int          `json:"Tax"`
	Interest         int          `json:"Interest"`
}

type Rfq struct {
	ID               string   `json:"id"`
	CompanyName      string   `json:"CompanyName"`
	CompanyAddress   string   `json:"CompanyAddress"`
	CompanyWebsite   string   `json:"CompanyWebsite"`
	QuotationDate    string   `json:"QuotationDate"`
	QuotationNo      string   `json:"QuotationNo"`
	QuotationExpires string   `json:"QuotationExpires"`
	MadeForName      string   `json:"MadeForName"`
	MadeForAddress   string   `json:"MadeForAddress"`
	MadeForPhone     string   `json:"MadeForPhone"`
	SentToName       string   `json:"SentToName"`
	SentToAddress    string   `json:"SentToAddress"`
	SentToPhone      string   `json:"SentToPhone"`
	Items            []*Item  `json:"Items"`
	Snk              []string `json:"SNK"`
	Disc             int      `json:"Disc"`
	Tax              int      `json:"Tax"`
	Interest         int      `json:"Interest"`
}

type RFQList struct {
	ID          string `json:"id"`
	CompanyName string `json:"CompanyName"`
	QuotationNo string `json:"QuotationNo"`
}
