import { Component } from '../models/componentModel.js';
const components = async () => {
    const components = await Component.find();
    return components;
};
const component = async ({ id }) => {
    const component = await Component.findById(id);
    return component;
};
const createComponent = async (args) => {
    const createdComponent = await Component.create(args.componentData);
    return createdComponent;
};
export default { components, component, createComponent };
