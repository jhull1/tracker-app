const chai = require('chai');
const chaiHttp = require('chai-http');


const expect = chai.expect;

chai.use(chaiHttp);

describe('Root', function() {


  
  it('should show HTML for the root', function() {
    return chai.request('http://localhost:8080/')
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.html
      });
  });
});