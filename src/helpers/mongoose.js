const mongoose = require('mongoose');

const createModel = (modelName, schema, ...staticMethods) => {
    return mongoose.model(
        modelName,
        addStaticMethodsToSchema(schema, staticMethods)
    );
};

const addStaticMethodsToSchema = (schema, staticMethods) => {
    const reducer = (accumulator, method) => {
        accumulator.statics[method.name] = method;
        return accumulator;
    };

    staticMethods.length && staticMethods.reduce(reducer, schema);

    return schema;
};

module.exports = {
  createModel
};
