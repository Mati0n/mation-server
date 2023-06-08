const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server');
const expect = chai.expect;
chai.use(chaiHttp);

describe('MATION Server API Tests', () => {
  let server;

  before((done) => {
    server = app.listen(53301, () => {
      console.log('Test server is running on port 53301');
      done();
    });
  });

  after((done) => {
    server.close(done);
  });

  describe('Authentication', () => {
    let uuid = 'test-uuid';

    it('should fail to register a new panel with an existing UUID', (done) => {
      chai.request(server)
        .post('/auth/register')
        .send({ uuid })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').eql('Panel already exists');
          done();
        });
    });

    it('should fail to login with an invalid UUID', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({ uuid: 'invalid-uuid' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').eql('Invalid UUID');
          done();
        });
    });

    it('should successfully login with a valid UUID', (done) => {
      chai.request(server)
        .post('/auth/login')
        .send({ uuid })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });
  });

  describe('API requests', () => {
    let token;

    before((done) => {
      chai.request(server)
        .post('/auth/login')
        .send({ uuid: 'test-uuid' })
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    it('should return the status', (done) => {
      chai.request(server)
        .get('/api/status')
        .set('Authorization', token)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').eql('OK');
          done();
        });
    });

    it('should receive a command', (done) => {
      chai.request(server)
        .post('/api/command')
        .set('Authorization', token)
        .send({ command: 'test-command' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').eql('Command received');
          done();
        });
    });

    // Здесь вы также можете добавить тесты для других API-запросов
  });
});

