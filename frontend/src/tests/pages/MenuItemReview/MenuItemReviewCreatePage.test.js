import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {
    const queryClient = new QueryClient();
    const review = {
      id: 3,
      itemId: 2,
      reviewerEmail: "charliestudent@ucsb.edu",
      stars: 4,
      comments: "yummy!",
      dateReviewed: "2022-01-02T12:00:00",
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, review);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });

    const itemIdInput = screen.getByLabelText("Item Id");
    expect(itemIdInput).toBeInTheDocument();

    const dateReviewedInput = screen.getByLabelText(
      "Date Reviewed (iso format)",
    );
    expect(dateReviewedInput).toBeInTheDocument();

    const reviewerEmailInput = screen.getByLabelText("Reviewer Email");
    expect(reviewerEmailInput).toBeInTheDocument();

    const starsInput = screen.getByLabelText("Stars");
    expect(starsInput).toBeInTheDocument();

    const commentsInput = screen.getByLabelText("Comments");
    expect(commentsInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(itemIdInput, { target: { value: 2 } });
    fireEvent.change(starsInput, { target: { value: 4 } });
    fireEvent.change(dateReviewedInput, {
      target: { value: "2022-01-02T12:00:00" },
    });
    fireEvent.change(reviewerEmailInput, {
      target: { value: "alexstudent@ucsb.edu" },
    });
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: 2,
      reviewerEmail: "alexstudent@ucsb.edu",
      stars: 4,
      comments: "yummy!",
      dateReviewed: "2022-01-02T12:00:00",
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New review Created - id: 3 reviewerEmail: alexstudent@ucsb.edu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
  });
});
