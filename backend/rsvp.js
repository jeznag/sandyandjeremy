require("dotenv").config();

const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "appVqHScGrZ6Soog5"
);

async function isValidEventCode(eventCode) {
  try {
    const matchingEvents = await base("Events")
      .select({
        filterByFormula: `FIND("${eventCode}", {Event Code})`
      })
      .firstPage();
    return matchingEvents.length > 0;
  } catch (e) {
    return false;
  }
}

async function createRSVP(eventID, mainRSVPData, additionalRSVPData) {
  try {
    const mainRSVP = await base("RSVPs").create({
      Name: mainRSVPData.Name,
      Email: mainRSVPData.Email,
      Event: [eventID],
      "Phone Number": mainRSVPData.Phone,
      "Dietary Requirements": mainRSVPData.dietaryRequirements
    });

    const mainRSVPID = mainRSVP.getId();
    const mainRsvpRoles = Promise.all(
      mainRSVPData.roles.map(role => {
        return base("Roles").create({
          "Role Name": role.name,
          Details: role.details,
          RSVP: [mainRSVPID]
        });
      })
    );

    // console.log("HELLO", mainRSVP);
    const additionalRSVPs = await Promise.all(
      additionalRSVPData.map(rsvpData => {
        return base("RSVPs").create({
          Name: rsvpData.Name,
          Email: rsvpData.Email,
          Event: [eventID],
          "Phone Number": rsvpData.Phone,
          "Dietary Requirements": rsvpData.dietaryRequirements,
          "Main Guest": [mainRSVPID]
        });
      })
    );

    const additionalRoles = additionalRSVPs.map(rsvpRecord => {
      console.log(rsvpRecord);
      const rawData = additionalRSVPData.find(
        rsvp => rsvp.Email === rsvpRecord.fields.Email
      );
      console.log(rawData);
      return rawData.roles.map(role => {
        return base("Roles").create({
          "Role Name": role.name,
          Details: role.details,
          RSVP: [rsvpRecord.getId()]
        });
      });
    });

    await Promise.all(additionalRoles.concat(mainRsvpRoles));
  } catch (e) {
    console.log(e);
    return false;
  }
}

createRSVP(
  "rec9KakNpM358QK0y",
  {
    Name: "Fake Tester",
    Email: "sdfdsf@sdfds.com",
    Phone: "3243434",
    dietaryRequirements: "No gluten",
    roles: [
      {
        name: "Photographer",
        details: "Happy to help take photos"
      },
      {
        name: "Catering",
        details: "I'll bring some food"
      }
    ]
  },
  [
    {
      Name: "Fake Tester2",
      Email: "sdfdsf@sdfd2s.com",
      Phone: "32434234",
      dietaryRequirements: "No futons",
      roles: [
        {
          name: "Videographer",
          details: "Happy to help take videos"
        },
        {
          name: "Drinks",
          details: "I'll bring some drinks"
        }
      ]
    }
  ]
).then(result => console.log(result));
