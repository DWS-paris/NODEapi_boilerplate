/* 
Imports
*/
    // NPM modules
    require('dotenv').config(); //=> https://www.npmjs.com/package/dotenv
    const express = require('express'); //=> https://www.npmjs.com/package/express
    const bodyParser = require('body-parser'); //=> https://www.npmjs.com/package/body-parser
    const cookieParser = require('cookie-parser'); //=> https://www.npmjs.com/package/cookie-parser
    const ejs = require('ejs'); //=> https://www.npmjs.com/package/ejs
    const passport = require('passport'); //=> https://www.npmjs.com/package/passport

    // NodeJS modules
    const path = require('path'); //=> https://www.npmjs.com/package/path

    // Inner modules
    const MONGOclass = require('./services/mongo.class');
    const MYSQLClass = require('./services/mysql.class');
//


/* 
Declarations
*/
    const server = express();
    const port = process.env.PORT;
//


/* 
Server class
*/
    class ServerClass{
        constructor(){
            // Instanciate MongoDB
            this.MONGO = new MONGOclass;

            // Instanciate MYSQL
            this.MYSQL = new MYSQLClass;
        }

        init(){
            // Set CORS middleware
            server.use( (req, res, next) => {
                // Allow actions for specific origins
                res.header('Access-Control-Allow-Origin', ['http://127.0.0.1:8080']);
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Access-Control-Allow-Methods', ['GET', 'PUT', 'POST', 'DELETE', 'POST']);
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

                // Enable access to specific origins
                next();
            });

            // Set server view engine
            server.engine( 'html', ejs.renderFile );
            server.set( 'view engine', 'html' );
            
            // Static path configuration
            server.set( 'views', __dirname + '/www' );
            server.use( express.static(path.join(__dirname, 'www')) );

            //=> Body-parser
            server.use(bodyParser.json({limit: '10mb'}));
            server.use(bodyParser.urlencoded({ extended: true }));

            //=> Use CookieParser to setup serverside cookies
            server.use(cookieParser(process.env.COOKIE_SECRET));

            // Start server configuration
            this.configMongo();
        };

        configMySql(){
            this.MYSQL.connectDb()
            .then( connection => {
                // Set MySQL router
                const CrudMySqlRouterClass = require('./routers/crud.mysql.router');
                const crudmySqlRouter = new CrudMySqlRouterClass(connection);
                server.use('/api', crudmySqlRouter.init());

                // Set front router
                server.get('/*',  (req, res) => res.render('index') );

                // Launch server
                this.launch();
            })
            .catch( connectionError => {
                console.log(`MYsql connection error: ${connectionError}`)
            })
        }

        configMongo(){
            // Authentication
            const { setAuthentication } = require('./services/auth.service');
            setAuthentication(passport);
            
            // Set Mongo router
            const CrudMongoRouterClass = require('./routers/crud.mongo.router');
            // Include passport in the routeur
            const crudMongoRouter = new CrudMongoRouterClass({ passport });
            server.use('/api', crudMongoRouter.init());

            // Set front router
            server.get('/*',  (req, res) => res.render('index') );

            // Launch server
            this.launch();
        };

        launch(){
            // Start MongoDB connection
            this.MONGO.connectDb()
            .then( db => {
                // Start server
                server.listen(port, () => {
                    console.log({
                        node: `http://localhost:${port}`,
                        mongo: db.url,
                    });
                });
            })
            .catch( dbErr => console.log('MongoDB Error', dbErr));
        };
    }
//

/* 
Start server
*/
    const NODEapi_boilerplate = new ServerClass();
    NODEapi_boilerplate.init();
//