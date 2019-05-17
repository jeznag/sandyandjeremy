import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

export function getMatchingEvent(eventCode) {
  const getMatchingEventQuery = gql`
    {
      events(where: {event_code: {_eq: "${eventCode}"}}) {
        event_id
        event_name
        event_code
        help_needed(where: {vacancies_remaining: {_gt: 0}}) {
          role_type
        }
      }
    }
  `;

  const client = new ApolloClient({
    uri: "https://sandy-jem-wedding-site.herokuapp.com/v1alpha1/graphql",
    headers: {
      "X-RSVP_EVENT_CODE": eventCode
    }
  });

  return client.query({
    query: getMatchingEventQuery
  });
}
