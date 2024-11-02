const menuItemReviewFixtures = {
  oneReview: {
    id: 1,
    itemId: 2,
    reviewerEmail: "sampleemail@ucsb.edu",
    stars: 3,
    dateReviewed: "2022-01-02T12:00:00",
    comments: "good",
  },
  threeReviews: [
    {
      id: 0,
      itemId: 0,
      reviewerEmail: "obenedek@ucsb.edu",
      stars: 3,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "good",
    },
    {
      id: 1,
      itemId: 4,
      reviewerEmail: "calebstahl@ucsb.edu",
      stars: 4,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "great",
    },
    {
      id: 2,
      itemId: 2,
      reviewerEmail: "randomstudent@ucsb.edu",
      stars: 5,
      dateReviewed: "2022-01-02T12:00:00",
      comments: "excellent",
    },
  ],
};

export { menuItemReviewFixtures };
