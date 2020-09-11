import gql from 'graphql-tag'
import apolloClient from '../utils/graphql'
 
export function createConnection(params) {
 return apolloClient.mutate({
  mutation: gql`mutation createConnection($config: ConnectionConfig!) {
      createConnection(config: $config) {
          id
          name
          description
          driverId
          connected
          readOnly
          features
          authNeeded
          authModel
      }
    },`,
  variables: params
 })
}
