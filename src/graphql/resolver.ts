import { Component } from '../models/componentModel.js';

const components = async () => {
  const components = await Component.find();
  return components;
};

const component = async ({ id }: { id: string }) => {
  const component = await Component.findById(id);
  return component;
};

const createComponent = async (
  args: {
    componentData: { name: string; level: number; weight: number };
  }
  // req: any
) => {
  const createdComponent = await Component.create(args.componentData);
  // return { ...createdComponent, name: undefined }; //ini akan error karent graphql ini akan validasi secara otomatis melalui skema nya,mantap jiwa, data harus sesuai dg skema dan ekspektasi dev, kalo gak ya error

  return createdComponent;
};

export default { components, component, createComponent };
