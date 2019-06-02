import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import { getRoleParts, ROLE_NAME_IDX, HELP_NEEDED_ID_IDX } from '../utils/getRoleParts';

function getRoleMutationFragment(roles) {
  return `[
    ${roles.map(
      role =>
        `
        {
          role_name: "${getRoleParts(role.roleName)[ROLE_NAME_IDX]}",
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

function generateHelpNeededMutations(roles) {
  const rolesGroupedByHelpNeededId = roles.reduce((result, role) => {
    const helpNeededId = getRoleParts(role.roleName)[HELP_NEEDED_ID_IDX];
    if (!result[helpNeededId]) {
      result[helpNeededId] = 1;
    } else {
      result[helpNeededId] = result[helpNeededId] + 1;
    }
    return result;
  }, {});
  return Object.keys(rolesGroupedByHelpNeededId)
    .map(helpNeededId => {
      const numRolesFilled = rolesGroupedByHelpNeededId[helpNeededId];
      return gql`
        mutation update_help_needed {
          update_help_needed(
            _inc: {
              number_filled: ${numRolesFilled},
              vacancies_remaining: ${numRolesFilled * -1}
            },
            where: {
              help_needed_id: {
                _eq: ${helpNeededId}
              }
            }
          ) {
            affected_rows
            returning {
              vacancies_remaining
            }
          }
        }`;
    })
}

function generateRSVPMutation(eventCode, mainGuest, additionalGuests, roles) {
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

export function createRSVP(eventData, mainGuest, additionalGuests, roles) {
  const client = new ApolloClient({
    uri: "https://sandy-jem-wedding-site.herokuapp.com/v1alpha1/graphql",
    headers: {
      "X-RSVP_EVENT_CODE": eventData.event_code
    }
  });

  const createRSVPMutation = generateRSVPMutation(
    eventData.event_code,
    mainGuest,
    additionalGuests,
    roles
  );

  const mutations = [client.mutate({
    mutation: createRSVPMutation
  })];

  const updateHelpNeededMutations = generateHelpNeededMutations(roles).map((mutationGql) =>
    client.mutate({
      mutation: mutationGql
    })
  );

  return Promise.all(mutations.concat(updateHelpNeededMutations));
}
