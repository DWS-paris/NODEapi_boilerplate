/*
Imports
*/
    // Node
    const express = require('express');

    // NPM
    const bcrypt = require('bcryptjs');

    // Inner
    const PostModel = require('../models/post.schema');
    const UserModel = require('../models/user.schema');
//

/*
Routes definition
*/
    class CrudMongoRouterClass {

        // Inject Passport to secure routes
        constructor() {
            // Instanciate router
            this.router = express.Router();
        };
        
        // Set route fonctions
        routes(){

            /* 
            AUTH: Register 
            */
                this.router.post('/auth/register', (req, res) => {
                    // Encrypt user password
                    bcrypt.hash( req.body.password, 10 )
                    .then( hashedPassword => {
                        // Change user password
                        req.body.password = hashedPassword;
                        
                        // Save user data
                        UserModel.create(req.body)
                        .then( document => res.status(201).json({
                            method: 'POST',
                            route: `/api/mongo/auth/register`,
                            data: document,
                            error: null,
                            status: 201
                        }))
                        .catch( err => res.status(502).json({
                            method: 'POST',
                            route: `/api/mongo/auth/register`,
                            data: null,
                            error: err,
                            status: 502
                        }));
                    })
                    .catch( hashError => res.status(500).json({
                        method: 'POST',
                        route: `/api/mongo/auth/register`,
                        data: null,
                        error: hashError,
                        status: 500
                    }));
                });
            //

            /* 
            AUTH: Login 
            */
                this.router.post('/auth/login', (req, res) => {
                    // Get user from email
                    UserModel.findOne({ email: req.body.email }, (err, user) => {
                        if(err){
                            return res.status(500).json({
                                method: 'POST',
                                route: `/api/mongo/auth/login`,
                                data: null,
                                error: err,
                                status: 500
                            });
                        }
                        else{
                            // Check user password
                            const validPassword = bcrypt.compareSync(req.body.password, user.password);
                            if( !validPassword ){
                                // Generate user JWT
                                const userCookie = user.generateJwt(user)
                                res.cookie(process.env.COOKIE_NAME, userCookie);

                                return res.status(500).json({
                                    method: 'POST',
                                    route: `/api/mongo/auth/login`,
                                    data: userCookie,
                                    error: 'Invalid password',
                                    status: 500
                                });
                            }
                            else{
                                return res.status(201).json({
                                    method: 'POST',
                                    route: `/api/mongo/auth/login`,
                                    data: user,
                                    error: null,
                                    status: 201
                                });
                            };
                        };
                    });
                });
            //

            /* 
            CRUD: Create route 
            */
                this.router.post('/:endpoint', (req, res) => {
                    PostModel.create(req.body)
                    .then( document => res.status(201).json({
                        method: 'POST',
                        route: `/api/mongo/${req.params.endpoint}`,
                        data: document,
                        error: null,
                        status: 201
                    }))
                    .catch( err => res.status(502).json({
                        method: 'POST',
                        route: `/api/${req.params.endpoint}`,
                        data: null,
                        error: err,
                        status: 502
                    }));
                });
            //

            /* 
            CRUD: Read all route 
            */
                this.router.get('/:endpoint', (req, res) => {
                    PostModel.find()
                    .then( documents => res.status(200).json({
                        method: 'GET',
                        route: `/api/mongo/${req.params.endpoint}`,
                        data: documents,
                        error: null,
                        status: 200
                    }))
                    .catch( err => res.status(502).json({
                        method: 'GET',
                        route: `/api/${req.params.endpoint}`,
                        data: null,
                        error: err,
                        status: 502
                    }));
                });
            //

            /* 
            CRUD: Read one route
            */
                this.router.get('/:endpoint/:id', (req, res) => {
                    PostModel.findById(req.params.id)
                    .then( document => res.status(200).json({
                        method: 'GET',
                        route: `/api/mongo/${req.params.endpoint}/${req.params.id}`,
                        data: document,
                        error: null,
                        status: 200
                    }))
                    .catch( err => res.status(502).json({
                        method: 'GET',
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: null,
                        error: err,
                        status: 502
                    }));
                });
            //

            /* 
            CRUD: Update route 
            */
                this.router.put('/:endpoint/:id', (req, res) => {
                    PostModel.findById(req.params.id)
                    .then( document => {
                        // Update document
                        document.title = req.body.title;
                        document.content = req.body.content;
                        
                        // Save document
                        document.save()
                        .then( updatedDocument => res.status(200).json({
                            method: 'PUT',
                            route: `/api/mongo/${req.params.endpoint}/${req.params.id}`,
                            data: updatedDocument,
                            error: null,
                            status: 200
                        }))
                        .catch( err => res.status(502).json({
                            method: 'PUT',
                            route: `/api/mongo/${req.params.endpoint}/${req.params.id}`,
                            data: null,
                            error: err,
                            status: 502
                        }));
                    })
                    .catch( err => res.status(404).json({
                        method: 'PUT',
                        route: `/api/mongo/${req.params.endpoint}/${req.params.id}`,
                        data: null,
                        error: err,
                        status: 404
                    }));
                });
            //

            /* 
            CRUD: Delete route 
            */
                this.router.delete('/:endpoint/:id', (req, res) => {
                    PostModel.findOneAndDelete({ _id: req.params.id })
                    .then( deletedDocument => res.status(200).json({
                            method: 'delete',
                            route: `/api/mongo/${req.params.endpoint}/${req.params.id}`,
                            data: deletedDocument,
                            error: null,
                            status: 200
                    }))
                    .catch( err => res.status(404).json({
                        method: 'delete',
                        route: `/api/${req.params.endpoint}/${req.params.id}`,
                        data: null,
                        error: err,
                        status: 404
                    }));
                });
            //
        };

        // Start router
        init(){
            // Get route fonctions
            this.routes();

            // Sendback router
            return this.router;
        };
    };
//

/*
Export
*/
    module.exports = CrudMongoRouterClass;
//