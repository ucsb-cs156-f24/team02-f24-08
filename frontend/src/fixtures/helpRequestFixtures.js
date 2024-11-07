const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "divyanipunj@ucsb.edu",
    teamId: "8",
    tableOrBreakoutRoom: "breakout",
    requestTime: "2022-01-02T12:00:00",
    explanation: "Issues with Swagger.",
    solved: "false",
  },
  threeHelpRequests: [
    {
      id: 2,
      requesterEmail: "chaewonbang@ucsb.edu",
      teamId: "15",
      tableOrBreakoutRoom: "breakout",
      requestTime: "2022-01-02T12:00:00",
      explanation: "Issues with divyani.",
      solved: "false",
    },
    {
      id: 3,
      requesterEmail: "somestudent@ucsb.edu",
      teamId: "1",
      tableOrBreakoutRoom: "table",
      requestTime: "2022-01-02T12:00:00",
      explanation: "Dokku problems.",
      solved: "false",
    },
    {
      id: 4,
      requesterEmail: "anotherstudent@ucsb.edu",
      teamId: "7",
      tableOrBreakoutRoom: "table",
      requestTime: "2022-01-02T12:00:00",
      explanation: "Issue with Storybook.",
      solved: "true",
    },
  ],
};

export { helpRequestFixtures };
