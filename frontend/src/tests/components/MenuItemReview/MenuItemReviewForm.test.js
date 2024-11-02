import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemReviewForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByText(/Item Id/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a MenuItemReview", async () => {
    render(
      <Router>
        <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
      </Router>,
    );
    await screen.findByTestId(/MenuItemReview-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/MenuItemReview-id/)).toHaveValue("1");
  });

//   test("Correct Error messsages on bad input", async () => {
//     render(
//       <Router>
//         <MenuItemReviewForm />
//       </Router>,
//     );
//     await screen.findByTestId("MenuItemReview-itemId");
//     const dateReviewedField = screen.getByTestId("MenuItemReview-dateReviewed");
//     const submitButton = screen.getByTestId("MenuItemReview-submit");

//     fireEvent.change(dateReviewedField, { target: { value: "" } });
//     fireEvent.click(submitButton);

//     await screen.findByText(/dateReviewed is required. /);
//   });
// don't need because type validations take care of this? - no error messages

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReview-submit");
    const submitButton = screen.getByTestId("MenuItemReview-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/ItemId is required./);
    expect(screen.getByText(/dateReviewed is required./)).toBeInTheDocument();
    expect(screen.getByText(/reviewerEmail is required./)).toBeInTheDocument();
    expect(screen.getByText(/stars is required./)).toBeInTheDocument();
  });

  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <MenuItemReviewForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("MenuItemReview-itemId");

    const itemId = screen.getByTestId("MenuItemReview-itemId");
    const dateReviewed = screen.getByTestId("MenuItemReview-dateReviewed");
    const reviewerEmail = screen.getByTestId("MenuItemReview-reviewerEmail");
    const stars = screen.getByTestId("MenuItemReview-stars");
    const comments = screen.getByTestId("MenuItemReview-comments");
    const submitButton = screen.getByTestId("MenuItemReview-submit");

    //null comments
    fireEvent.change(itemId, { target: { value: 2 } });
    fireEvent.change(reviewerEmail, { target: { value: "obenedek@ucsb.edu" } });
    fireEvent.change(dateReviewed, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(stars, { target: { value: 4 } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/ItemId is required/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/dateReviewed must be in ISO format/),
    ).not.toBeInTheDocument();
    expect(
        screen.queryByText(/comments are required./),
    ).not.toBeInTheDocument();

    //not null comments
    fireEvent.change(itemId, { target: { value: 2 } });
    fireEvent.change(reviewerEmail, { target: { value: "obenedek@ucsb.edu" } });
    fireEvent.change(dateReviewed, {
      target: { value: "2022-01-02T12:00" },
    });
    fireEvent.change(stars, { target: { value: 4 } });
    fireEvent.change(comments, { target: { value: "great food!" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/ItemId is required/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/dateReviewed must be in ISO format/),
    ).not.toBeInTheDocument();
    expect(
        screen.queryByText(/comments are required./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <MenuItemReviewForm />
      </Router>,
    );
    await screen.findByTestId("MenuItemReview-cancel");
    const cancelButton = screen.getByTestId("MenuItemReview-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});