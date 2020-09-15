import ApolloClient from "apollo-boost";
const apolloClient = new ApolloClient({
  // 你需要在这里使用绝对路径
  uri: "/dbeaver/gql"
});

const requestGraphql = function(mutationVal, params) {
  const result = apolloClient.mutate({
    mutation: mutationVal,
    variables: params
  });
  return Promise.resolve(result);
};
export { apolloClient, requestGraphql };
