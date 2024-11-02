const recommendationRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "petrus@ucsb.edu",
    professorEmail: "phtcon@ucsb.edu",
    explanation: "Grad school",
    dateRequested: "2024-11-02T12:23:00",
    dateNeeded: "2024-12-31T11:59:59",
    done: false,
  },
  threeRequest: [
    {
      id: 1,
      requesterEmail: "obenedek@ucsb.edu",
      professorEmail: "rich@cs.ucsb.edu",
      explanation: "Internship",
      dateRequested: "2024-10-21T11:30:00",
      dateNeeded: "2024-12-24T11:59:59",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "divyanipunj@ucsb.edu",
      professorEmail: "phtcon@ucsb.edu",
      explanation: "Research lab",
      dateRequested: "2023-12-22T09:27:00",
      dateNeeded: "2024-02-28T11:59:59",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "calebstahl@ucsb.edu",
      professorEmail: "dimirza@cs.ucsb.edu",
      explanation: "Job application",
      dateRequested: "2024-11-05T08:31:22",
      dateNeeded: "2025-01-27T12:00:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
