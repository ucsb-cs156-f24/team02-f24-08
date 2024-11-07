import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["Name", "URL", "Explanation", "Email", "Date Added"];
  const testId = "ArticlesForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-explanation`)).toHaveAttribute(
      "data-testid",
      `${testId}-explanation`,
    );
    expect(screen.getByTestId(`${testId}-dateAdded`)).toHaveAttribute(
      "data-testid",
      `${testId}-dateAdded`,
    );
    expect(screen.getByTestId(`${testId}-submit`)).toHaveAttribute(
      "data-testid",
      `${testId}-submit`,
    );
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm initialContents={articlesFixtures.oneArticle[0]} />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Name is required/)).toBeInTheDocument();
    expect(await screen.findByText(/URL is required/)).toBeInTheDocument();
    expect(
      await screen.findByText(/Explanation is required/),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/)).toBeInTheDocument();
    expect(await screen.findByText(/Date is required/)).toBeInTheDocument();
  });

  test("that name length validation works", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    const nameInput = screen.getByTestId(`${testId}-name`);
    fireEvent.change(nameInput, { target: { value: "a".repeat(101) } });
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Max length 100 characters/),
    ).toBeInTheDocument();
  });

  test("that url format validation works", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    const urlInput = screen.getByTestId(`${testId}-url`);
    fireEvent.change(urlInput, { target: { value: "not-a-url" } });
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(
        /Must be a valid URL starting with http:\/\/ or https:\/\//,
      ),
    ).toBeInTheDocument();
  });

  test("that email format validation works", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    const emailInput = screen.getByTestId(`${testId}-email`);
    fireEvent.change(emailInput, { target: { value: "not-an-email" } });
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Invalid email address/),
    ).toBeInTheDocument();
  });
});
