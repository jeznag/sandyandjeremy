import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";

function getRoleMutationFragment(roles) {
  return `[
    ${roles.map(
      role =>
        `
        {
          role_name: "${role.roleName}",
          details: "${role.details}"
        }`
    )}
  ]`.replace(/[\s]{2,}/g, " ");
}

function getAdditionalGuestMutationFragment(eventCode, additionalGuests) {
  return `[
    ${additionalGuests.map(
      guest => `
      {
        dietary_requirements: "${guest.dietaryRequirements}",
        email: "${guest.email}",
        guest_name: "${guest.firstName} ${guest.lastName}",
        phone: "${guest.phone}",
        related_event: "${eventCode}"
      }`
    )}
  ]`.replace(/[\s]{2,}/g, " ");
}

function generateRSVPMutation(eventCode, mainGuest, additionalGuests, roles) {
  debugger;

  return gql`
    mutation insert_rsvps {
      insert_rsvps(
        objects: [
          {
            email: "${mainGuest.email}",
            dietary_requirements: "${mainGuest.dietaryRequirements}",
            related_event: "${eventCode}",
            guest_name: "${mainGuest.firstName} ${mainGuest.lastName}",
            phone: "${mainGuest.phone}",
            additional_guests: {
              data: ${getAdditionalGuestMutationFragment(
                eventCode,
                additionalGuests
              )}
            },
            roles: {
              data: ${getRoleMutationFragment(roles)}
            }
          }
        ]
      ) {
        affected_rows
        returning {
          email
          guest_id
          guest_name
          phone
          additional_guests {
            guest_name
            email
            phone
            guest_id
            main_guest
          }
          roles {
            role_name
            details
            role_id
          }
        }
      }
    }
  `;
}

export function createRSVP(eventCode, mainGuest, additionalGuests, roles) {
  const client = new ApolloClient({
    uri: "https://sandy-jem-wedding-site.herokuapp.com/v1alpha1/graphql",
    headers: {
      "X-RSVP_EVENT_CODE": eventCode,
    }
  });

  const mutationQuery = generateRSVPMutation(
    eventCode,
    mainGuest,
    additionalGuests,
    roles
  );
  debugger;
  return client.mutate({
    mutation: mutationQuery
  });
}
