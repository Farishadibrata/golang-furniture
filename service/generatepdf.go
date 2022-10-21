package service

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/johnfercher/maroto/pkg/color"
	"github.com/johnfercher/maroto/pkg/consts"
	"github.com/johnfercher/maroto/pkg/pdf"
	"github.com/johnfercher/maroto/pkg/props"
)

func GeneratePDFMux(w http.ResponseWriter, r *http.Request) {
	GeneratePDF()
	vars := mux.Vars(r)
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Category: %v\n", vars["id"])
}
func GeneratePDF() {
	begin := time.Now()

	darkGrayColor := getDarkGrayColor()
	grayColor := getGrayColor()
	whiteColor := color.NewWhite()
	blueColor := getBlueColor()
	// redColor := getRedColor()
	header := getHeader()
	contents := getContents()

	m := pdf.NewMaroto(consts.Portrait, consts.A4)
	m.SetPageMargins(10, 15, 10)

	m.RegisterHeader(func() {
		m.Row(20, func() {
			m.Col(3, func() {
				m.Text("Nama Perusahaan", props.Text{
					Size:        16,
					Align:       consts.Left,
					Extrapolate: false,
					Color:       blueColor,
				})
				m.Text("Alamat", props.Text{
					Top:   10,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
				m.Text("Website", props.Text{
					Top:   15,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
			})
			m.Col(7, func() {
				m.Text("Quotation", props.Text{
					Size:        14,
					Align:       consts.Right,
					Extrapolate: false,
				})
				m.Text("Tanggal", props.Text{
					Top:         8,
					Size:        8,
					Style:       consts.BoldItalic,
					Align:       consts.Right,
					Extrapolate: false,
					Color:       blueColor,
				})
				m.Text("No Quotation", props.Text{
					Top:   12,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Right,
					Color: blueColor,
				})
				m.Text("Berlaku sampai", props.Text{
					Top:   16,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Right,
					Color: blueColor,
				})
			})
			m.Col(2, func() {
				m.Text("Tanggal", props.Text{
					Top:         8,
					Size:        8,
					Style:       consts.BoldItalic,
					Align:       consts.Left,
					Extrapolate: false,
					Color:       blueColor,
				})
				m.Text("No Quotation", props.Text{
					Top:   12,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
				m.Text("Berlaku sampai", props.Text{
					Top:   16,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
			})
		})
		m.Row(20, func() {
			m.Col(3, func() {
				m.Text("Dibuat Untuk", props.Text{
					Size:        16,
					Align:       consts.Left,
					Extrapolate: false,
					Color:       blueColor,
				})
				m.Text("Nama Klien", props.Text{
					Top:   10,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
				m.Text("Alamat", props.Text{
					Top:   15,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
				m.Text("No Telepon", props.Text{
					Top:   15,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
			})
			m.Col(7, func() {
				m.Text("Dikirimkan Ke", props.Text{
					Size:        16,
					Align:       consts.Left,
					Extrapolate: false,
					Color:       blueColor,
				})
				m.Text("Nama Klien", props.Text{
					Top:   10,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
				m.Text("Alamat", props.Text{
					Top:   15,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
				m.Text("No Telepon", props.Text{
					Top:   15,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
			})
		})
	})

	m.RegisterFooter(func() {
		m.Row(20, func() {
			m.Col(12, func() {
				m.Text("Tel: 55 024 12345-1234", props.Text{
					Top:   13,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
				m.Text("www.mycompany.com", props.Text{
					Top:   16,
					Style: consts.BoldItalic,
					Size:  8,
					Align: consts.Left,
					Color: blueColor,
				})
			})
		})
	})

	m.Row(10, func() {
		m.Col(12, func() {
			m.Text("Invoice ABC123456789", props.Text{
				Top:   3,
				Style: consts.Bold,
				Align: consts.Center,
			})
		})
	})

	m.SetBackgroundColor(darkGrayColor)

	m.Row(7, func() {
		m.Col(3, func() {
			m.Text("Transactions", props.Text{
				Top:   1.5,
				Size:  9,
				Style: consts.Bold,
				Align: consts.Center,
				Color: color.NewWhite(),
			})
		})
		m.ColSpace(9)
	})

	m.SetBackgroundColor(whiteColor)

	m.TableList(header, contents, props.TableList{
		HeaderProp: props.TableListContent{
			Size:      9,
			GridSizes: []uint{3, 4, 2, 3},
		},
		ContentProp: props.TableListContent{
			Size:      8,
			GridSizes: []uint{3, 4, 2, 3},
		},
		Align:                consts.Center,
		AlternatedBackground: &grayColor,
		HeaderContentSpace:   1,
		Line:                 false,
	})

	m.Row(20, func() {
		m.ColSpace(7)
		m.Col(2, func() {
			m.Text("Total:", props.Text{
				Top:   5,
				Style: consts.Bold,
				Size:  8,
				Align: consts.Right,
			})
		})
		m.Col(3, func() {
			m.Text("R$ 2.567,00", props.Text{
				Top:   5,
				Style: consts.Bold,
				Size:  8,
				Align: consts.Center,
			})
		})
	})

	err := m.OutputFileAndClose("generated.pdf")
	if err != nil {
		fmt.Println("Could not save PDF:", err)
		os.Exit(1)
	}

	end := time.Now()
	fmt.Println(end.Sub(begin))
}

func getHeader() []string {
	return []string{"", "Product", "Quantity", "Price"}
}

func getQuotation() [][]string {
	return [][]string{
		{"Tanggal", "2022-10-21"},
		{"No Quotation", "12312133"},
		{"Berlaku Sampai", "14 Hari"},
	}
}
func getContents() [][]string {
	return [][]string{
		{"", "Swamp", "12", "R$ 4,00"},
		{"", "Sorin, A Planeswalker", "4", "R$ 90,00"},
		{"", "Tassa", "4", "R$ 30,00"},
		{"", "Skinrender", "4", "R$ 9,00"},
		{"", "Island", "12", "R$ 4,00"},
		{"", "Mountain", "12", "R$ 4,00"},
		{"", "Plain", "12", "R$ 4,00"},
		{"", "Black Lotus", "1", "R$ 1.000,00"},
		{"", "Time Walk", "1", "R$ 1.000,00"},
		{"", "Emberclave", "4", "R$ 44,00"},
		{"", "Anax", "4", "R$ 32,00"},
		{"", "Murderous Rider", "4", "R$ 22,00"},
		{"", "Gray Merchant of Asphodel", "4", "R$ 2,00"},
		{"", "Ajani's Pridemate", "4", "R$ 2,00"},
		{"", "Renan, Chatuba", "4", "R$ 19,00"},
		{"", "Tymarett", "4", "R$ 13,00"},
		{"", "Doom Blade", "4", "R$ 5,00"},
		{"", "Dark Lord", "3", "R$ 7,00"},
		{"", "Memory of Thanatos", "3", "R$ 32,00"},
		{"", "Poring", "4", "R$ 1,00"},
		{"", "Deviling", "4", "R$ 99,00"},
		{"", "Seiya", "4", "R$ 45,00"},
		{"", "Harry Potter", "4", "R$ 62,00"},
		{"", "Goku", "4", "R$ 77,00"},
		{"", "Phreoni", "4", "R$ 22,00"},
		{"", "Katheryn High Wizard", "4", "R$ 25,00"},
		{"", "Lord Seyren", "4", "R$ 55,00"},
	}
}

func getDarkGrayColor() color.Color {
	return color.Color{
		Red:   55,
		Green: 55,
		Blue:  55,
	}
}

func getGrayColor() color.Color {
	return color.Color{
		Red:   200,
		Green: 200,
		Blue:  200,
	}
}

func getBlueColor() color.Color {
	return color.Color{
		Red:   10,
		Green: 10,
		Blue:  150,
	}
}

func getRedColor() color.Color {
	return color.Color{
		Red:   150,
		Green: 10,
		Blue:  10,
	}
}
