package service

import (
	"log"
	"strconv"

	"github.com/Farishadibrata/golang-furniture/tools"
	"gopkg.in/gomail.v2"
)

func SendEmail(sendTo, subject, body string) {
	var CONFIG_SMTP_HOST = tools.GoDotEnvVariable("CONFIG_SMTP_HOST")
	var CONFIG_SMTP_PORT = 465
	if i, err := strconv.Atoi(tools.GoDotEnvVariable("CONFIG_SMTP_PORT")); err == nil {
		CONFIG_SMTP_PORT = i
	}
	var CONFIG_SENDER_NAME = tools.GoDotEnvVariable("CONFIG_SENDER_NAME")
	var CONFIG_AUTH_EMAIL = tools.GoDotEnvVariable("CONFIG_AUTH_EMAIL")
	var CONFIG_AUTH_PASSWORD = tools.GoDotEnvVariable("CONFIG_AUTH_PASSWORD")

	mailer := gomail.NewMessage()
	mailer.SetHeader("From", CONFIG_SENDER_NAME)
	mailer.SetHeader("To", sendTo)
	mailer.SetHeader("Subject", subject)
	mailer.SetBody("text/html", body)

	dialer := gomail.NewDialer(
		CONFIG_SMTP_HOST,
		CONFIG_SMTP_PORT,
		CONFIG_AUTH_EMAIL,
		CONFIG_AUTH_PASSWORD,
	)

	err := dialer.DialAndSend(mailer)
	if err != nil {
		log.Panic(err.Error())
	}

}
