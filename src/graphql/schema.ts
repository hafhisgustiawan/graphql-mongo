import { buildSchema } from 'graphql';

//jadi nanti di postman, di body nya pilih tab graphql. Nanti postman bisa detect query schema yang ada, liat dokumentasi biar gak bingung

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
