import { expect } from 'chai';

import validate from '../src/index.js';
import { schema as employeeSchema, list as employeeListSchema } from '../src/models/schemes/employee.schema.js';

describe('employee schema testing', function() {
  it('should not accept empty object', function(done) {
    expect(validate(employeeSchema, {})).to.be.false;
    done();
  });

  it('should not accept no given name', function(done) {
    expect(validate(employeeSchema, {lastname: 'abc'})).to.be.false;
    done();
  });

  it('should not accept no given lastname', function(done) {
    expect(validate(employeeSchema, {name: 'abc'})).to.be.false;
    done();
  });

  it('should accept a given name and lastname', function(done) {
    expect(validate(employeeSchema, {name: 'abc', lastname: 'd'})).to.be.true;
    done();
  });

  it('should not accept extra properties', function(done) {
    expect(validate(employeeSchema, {name: 'abc', lastname: 'd', age: 22})).to.be.false;
    done();
  });

  it('should accept a supervisor', function(done) {
    expect(validate(employeeSchema, {name: 'abc', lastname: 'd', supervisor: {name: 'def', lastname: 'g'}})).to.be.true;
    done();
  });
});
