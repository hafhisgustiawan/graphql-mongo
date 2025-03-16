declare module 'xss-clean' {
  export default value;
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';
  const Schema: DocumentNode;
  export = Schema;
}
