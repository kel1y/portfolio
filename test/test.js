let chai = require('chai');

let chaiHttp = require('chai-http');

let express = require('express')


const mongoose = require('mongoose');
const authRoutes = require('../authroutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('../authreq');

let app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');




// const dbURI = 'mongodb+srv://inkkelly:kelly.j.ke@cluster0.v4ttnn7.mongodb.net/portfolio?retryWrites=true&w=majority';
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
//   .then((result) => app.listen(3000))
//   .catch((err) => console.log(err));

server = app.listen(5000)

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/dashboard', requireAuth, (req, res) => res.render('dashboard'));
app.use(authRoutes);
  

chai.should();

chai.use(chaiHttp);

describe('Test API', () => {

    // test the get sign up route

    describe('Get /signup', () => {
        it('it should get sign up', (done) =>{
            chai.request(server)
                .get('/signup')
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
        it('it should Not get sign up', (done) =>{
            chai.request(server)
                .get('/wrongsignup')
                .end((err, response) => {
                    response.should.have.status(404);
                done();
                })
        })
    })


    
    // test the post sign up route

    describe('post /signup', () => {
        it('it should post signup info', (done) =>{
            chai.request(server)
                .post('/signup')
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    // response.body.should.have.property('email').eq('Please enter an email');
                done();
                })
        })
        it('it should Not get sign up', (done) =>{
            chai.request(server)
                .post('/wrongsignup')
                .end((err, response) => {
                    response.should.have.status(404);
                done();
                })
        })
    })

    // test the  get login route

    describe('Get /login ', () => {
        it('it should get login', (done) =>{
            chai.request(server)
                .get('/login')
                .end((err, response) => {
                    response.should.have.status(200);
                    // response.body.should.be.a('html');
                done();
                })
        })
        it('it should Not get login', (done) =>{
            chai.request(server)
                .get('/wronglogin')
                .end((err, response) => {
                    response.should.have.status(404);
                    // response.text.should.be.eq('wrong login URL')
                done();
                })
        })
    })

    // test the post login route

    describe('post /login', () => {
        it('it should post login info', (done) =>{
            chai.request(server)
                .post('/login')
                .end((err, response) => {
                    response.should.have.status(404);
                    // response.body.should.be.a('object');
                    // response.body.should.have.property('email').eq('That email is not registered');
                done();
                })
        })
        it('it should Not login', (done) =>{
            chai.request(server)
                .post('/wronglogin')
                .end((err, response) => {
                    response.should.have.status(200);
                done();
                })
        })
    })

    // test the  get log out route

    describe('get /logout', () => {
        it('it should get logout info', (done) =>{
            chai.request(server)
                .get('/logout')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                done();
                })
        })
        // it('it should Not get logout', (done) =>{
        //     chai.request(server)
        //         .get('/logout')
        //         .end((err, response) => {
        //             response.should.have.status(404);
        //         done();
        //         })
        // })
    })

});