import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("MenuItemReviewEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit MenuItemReview");
      expect(
        screen.queryByTestId("MenuItemReview-itemId"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/menuitemreview", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          itemId: 4,
          reviewerEmail: "teststudent@ucsb.edu",
          stars: 4,
          dateReviewed: "2022-01-02T12:00:00",
          comments: "yummy",
        });
      axiosMock.onPut("/api/menuitemreview").reply(200, {
        id: "17",
        itemId: "5",
        reviewerEmail: "teststudent@ucsb.edu",
        stars: "5",
        dateReviewed: "2022-01-02T12:00:00",
        comments: "delicious",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReview-id");

      const idField = screen.getByTestId("MenuItemReview-id");
      const itemIdField = screen.getByTestId("MenuItemReview-itemId");
      const reviewerEmailField = screen.getByTestId(
        "MenuItemReview-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReview-stars");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReview-dateReviewed",
      );
      const commentsField = screen.getByTestId("MenuItemReview-comments");
      const submitButton = screen.getByTestId("MenuItemReview-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemIdField).toBeInTheDocument();
      expect(itemIdField).toHaveValue(4);
      expect(reviewerEmailField).toBeInTheDocument();
      expect(reviewerEmailField).toHaveValue("teststudent@ucsb.edu");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue(4);
      expect(dateReviewedField).toBeInTheDocument();
      expect(dateReviewedField).toHaveValue("2022-01-02T12:00");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("yummy");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemIdField, {
        target: { value: 5 },
      });
      fireEvent.change(starsField, {
        target: { value: 5 },
      });
      fireEvent.change(commentsField, {
        target: { value: "delicious" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Review Updated - id: 17 reviewerEmail: teststudent@ucsb.edu",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "5",
          reviewerEmail: "teststudent@ucsb.edu",
          stars: "5",
          dateReviewed: "2022-01-02T12:00:00",
          comments: "delicious",
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReview-id");

      const idField = screen.getByTestId("MenuItemReview-id");
      const itemIdField = screen.getByTestId("MenuItemReview-itemId");
      const reviewerEmailField = screen.getByTestId(
        "MenuItemReview-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReview-stars");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReview-dateReviewed",
      );
      const commentsField = screen.getByTestId("MenuItemReview-comments");
      const submitButton = screen.getByTestId("MenuItemReview-submit");

      expect(idField).toHaveValue("17");
      expect(itemIdField).toHaveValue(4);
      expect(reviewerEmailField).toHaveValue("teststudent@ucsb.edu");
      expect(starsField).toHaveValue(4);
      expect(dateReviewedField).toHaveValue("2022-01-02T12:00");
      expect(commentsField).toHaveValue("yummy");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(itemIdField, {
        target: { value: 5 },
      });
      fireEvent.change(starsField, { target: { value: 5 } });
      fireEvent.change(commentsField, { target: { value: "delicious" } });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Review Updated - id: 17 reviewerEmail: teststudent@ucsb.edu",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
    });
  });
});