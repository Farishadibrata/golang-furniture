package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/Farishadibrata/golang-furniture/graph/model"
	"github.com/Farishadibrata/golang-furniture/service"
	"github.com/Farishadibrata/golang-furniture/tools"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DB struct {
	client *mongo.Client
}

type EmailCreds struct {
	host         string
	port         int
	senderName   string
	authEmail    string
	authPassword string
}

func Connect() *DB {
	client, err := mongo.NewClient(options.Client().ApplyURI(tools.GoDotEnvVariable("MONGODB")))
	if err != nil {
		log.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	return &DB{
		client: client,
	}
}

func (db *DB) Save(input model.NewItem) *model.Item {
	collection := db.client.Database("tripartafurniture").Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := collection.InsertOne(ctx, input)
	if err != nil {
		log.Fatal(err)
	}
	userObjectID, err := primitive.ObjectIDFromHex(input.CreatedBy)
	collectionUser := db.client.Database("tripartafurniture").Collection("users").FindOne(ctx, bson.M{"_id": userObjectID})

	if err != nil {
		log.Fatal(err)
	}

	var Title string = "New item added " + input.Name
	var Body string = "New item added :" + input.Name + "\n" + "Price :" + fmt.Sprintf("%d", input.Price) + "\n" + "Style :" + input.Style + "\n" + "Delivery Days :" + fmt.Sprintf("%d", input.DeliveryDays) + "\n" + "Description :" + input.Description + "\n"

	user := model.User{}
	collectionUser.Decode(&user)
	service.SendEmail(user.Email, Title, Body)

	return &model.Item{
		ID:          res.InsertedID.(primitive.ObjectID).Hex(),
		Name:        input.Name,
		Style:       input.Style,
		Description: input.Description,
		Price:       input.Price,
	}

}

func (db *DB) Delete(ID string) *bool {
	ObjectID, err := primitive.ObjectIDFromHex(ID)
	if err != nil {
		log.Fatal(err)
	}
	collection := db.client.Database("tripartafurniture").Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, error := collection.DeleteOne(ctx, bson.M{"_id": ObjectID})
	if error != nil {
		log.Fatal(err)
	}
	success := new(bool)
	*success = true
	return success
}

func (db *DB) FindByID(ID string) *model.Item {
	ObjectID, err := primitive.ObjectIDFromHex(ID)
	if err != nil {
		log.Fatal(err)
	}
	collection := db.client.Database("tripartafurniture").Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res := collection.FindOne(ctx, bson.M{"_id": ObjectID})
	item := model.Item{}
	res.Decode(&item)
	return &item
}

func (db *DB) Find(input *model.FilterItem) []*model.Item {
	collection := db.client.Database("tripartafurniture").Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	findQuery := bson.M{}
	if input.Style != nil {
		findQuery = bson.M{"style": bson.M{"$in": input.Style}}
	}
	if input.DeliveryDays != nil {
		findQuery = bson.M{"deliveryDays": bson.M{"$in": input.DeliveryDays}}
	}

	if input.Name != nil {
		findQuery["name"] = input.Name
	}

	cur, err := collection.Find(ctx, findQuery)
	if err != nil {
		log.Fatal(err)
	}
	var items []*model.Item
	for cur.Next(ctx) {
		var item *model.Item
		err := cur.Decode(&item)
		if err != nil {
			log.Fatal(err)
		}
		items = append(items, item)
	}
	return items
}

func (db *DB) DeliveryDays() []int {
	collection := db.client.Database("tripartafurniture").Collection("items")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "items"}, {"localField", "requires._id"}, {"foreignField", "_id"}, {"as", "requires"}}}}
	showLoadedCursor, err := collection.Aggregate(ctx, mongo.Pipeline{lookupStage})
	if err != nil {
		log.Fatal(err)
	}
	var deliveryDays []int

	for showLoadedCursor.Next(ctx) {
		var item *model.Item
		showLoadedCursor.Decode(&item)
		deliveryDays = append(deliveryDays, item.DeliveryDays)
	}
	return deliveryDays
}
