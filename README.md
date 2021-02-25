# Angular Frontend Shop App
<img alt="spring-boot-angular" src="https://miro.medium.com/max/2600/1*e_GNttaJ14fRHslfQYx6eA.png" width="500">

> This application has been made with monolithic architecture. The frontend of application is angular, backend is [spring-boot](https://github.com/ahmetfurkaneren/monolithic-shop-springboot) and database is mongoDB.

## Installation of Frontend

### Clone repository

```bash
git clone https://github.com/ahmetfurkaneren/monolithic-shop-angular.git
cd monolithic-shop-angular
```

### Install Angular-Cli globally

```bash
npm install -g @angular/cli
```

### Install NPM packages

```bash
npm install
```

### Run development server

```bash
ng serve
or
npm run start
```

Runs a webpack-development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Checkout the shop

Point your browser to localhost:4200. In any case the dev build is not working, there is an already built app available on http://shop.andre-abt.com for checking out. Deeplinking for the Angular router is handled via .htaccess config.

### Build app for prod

```bash
ng build --prod --build-optimizer
```

###### Note: 
> This application has been cloned from the following [link](https://github.com/monobasic/Angular-Reactive-Demo-Shop) and the backend of the application has been changed from google firebase to [spring-boot](https://github.com/ahmetfurkaneren/monolithic-shop-springboot)


# Spring Boot Backend Shop App

## Installation of Backend

1. **Clone the application**

	```bash
	git clone https://github.com/ahmetfurkaneren/monolithic-shop-springboot.git
	cd monolithic-shop-springboot
	```

2. **Create Mongo database and import data**

	```bash
	mongorestore  data/
	```

3. **Set env for mongo and jwt security**

	```bash
	export MONGO_URI=mongodb://localhost:27017/shop
    export JWT_BASE64_SECRET=<base64-secret>
	```

4. **Run the app**
	Note:Note: Product images removed from repo because of image licensing reasons so that should add product images in resource/images/products

	You can run the spring boot app by typing the following command

	```bash
	./mvnw
	```

	The server will start on port 8080.

	You can also package the application in the form of a `jar` file and then run it

	```bash
	./mvnw package
	java -jar target/polls-0.0.1-SNAPSHOT.jar
	```
###### Note: 
> Mongodb data has been provided from the following [link](https://github.com/monobasic/Angular-Reactive-Demo-Shop)

