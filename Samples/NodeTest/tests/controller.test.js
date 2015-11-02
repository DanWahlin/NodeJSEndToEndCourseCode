var sinon = require('sinon');
var expect = require("chai").expect;
var getUsers = require('../routes/users');

describe("Routes", function() {
  describe("GET", function() {

      it("should respond", function() {
        var req,res,spy;

        req = res = {};
        spy = res.send = sinon.spy();

        getUsers(req, res);
        expect(spy.calledOnce).to.equal(true);
        console.log(spy);
      });     

  });
});