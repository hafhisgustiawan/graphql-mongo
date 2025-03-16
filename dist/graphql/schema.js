import { buildSchema } from 'graphql';
export default buildSchema(`
  type Component {
    _id: ID!
    name: String!
    level: Int!
    weight: Int!
    createdAt: String!
    updatedAt: String!
  }

  input ComponentInput {
    name: String!
    level: Int!
    weight: Int!
  }

  type Query {
    components: [Component]
    component(id: String!): Component
  }

  type Mutation {
    createComponent(componentData: ComponentInput): Component
  }
`);
