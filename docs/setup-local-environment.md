# Setup local environment

## Setup Local Database

### Install mongodb locally

We are using MongoDB as database. To run mongodb locally run below command in your terminal

```bash
docker run --name mongodb -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo:latest
```

### Access mongodb locally

Now you can access your **diucsealumni** database from `mongodb://mongoadmin:secret@localhost:27017/diucsealumni`

> Make sure you have docker installed

### Explore database

To see data in the database, please use [MongoDB Compass](https://www.mongodb.com/products/tools/compass). Download and install the application and open. Create a new connection and insert the mongodb url there. If the database created successfully, we will be able to access the data.