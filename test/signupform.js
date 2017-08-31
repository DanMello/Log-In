const app = require("../index.js") 
const chai = require('chai')

describe('contact page', function() {
  it('should show contact a form');
  it('should refuse empty submissions');
  it('should refuse partial submissions');
  it('should keep values on partial submissions');
  it('should refuse invalid emails');
  it('should accept complete submissions');
});