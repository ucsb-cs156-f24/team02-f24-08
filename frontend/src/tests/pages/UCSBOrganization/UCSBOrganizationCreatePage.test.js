import { render, screen, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import userEvent from "@testing-library/user-event";

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

describe("UCSBOrganizationCreatePage tests", () => {
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
  test("Renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Organization Code")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /ucsborganizations", async () => {
    const queryClient = new QueryClient();
    const test_organization = {
      orgCode: "csu",
      orgTranslationShort: "CSU",
      orgTranslation: "UCSB Chinese Student Union",
      inactive: false,
    };

    axiosMock
      .onPost("/api/ucsborganizations/post")
      .reply(200, test_organization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Organization Code")).toBeInTheDocument();
    });

    const orgCodeInput = screen.getByLabelText("Organization Code");
    expect(orgCodeInput).toBeInTheDocument();

    const orgTranslationShortInput = screen.getByLabelText(
      "Organization Translation Short",
    );
    expect(orgTranslationShortInput).toBeInTheDocument();

    const orgTranslationInput = screen.getByLabelText(
      "Organization Translation",
    );
    expect(orgTranslationInput).toBeInTheDocument();

    const inactiveInput = screen.getByLabelText("Inactive");
    expect(inactiveInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    await userEvent.type(orgCodeInput, "csu");
    await userEvent.type(orgTranslationShortInput, "CSU");
    await userEvent.type(orgTranslationInput, "UCSB Chinese Student Union");
    await userEvent.selectOptions(inactiveInput, "false");
    await userEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params.inactive).toBe(false);

    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: "csu",
      orgTranslationShort: "CSU",
      orgTranslation: "UCSB Chinese Student Union",
      inactive: false,
    });

    expect(mockToast).toHaveBeenCalledWith(
      "New UCSB Organization Created - orgCode: csu",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsborganization" });
  });

  test("on submit, makes request to backend, and redirects to /ucsborganizations, inactive = true", async () => {
    const queryClient = new QueryClient();
    const test_organization = {
      orgCode: "csu",
      orgTranslationShort: "CSU",
      orgTranslation: "UCSB Chinese Student Union",
      inactive: true,
    };

    axiosMock
      .onPost("/api/ucsborganizations/post")
      .reply(200, test_organization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Organization Code")).toBeInTheDocument();
    });

    const orgCodeInput = screen.getByLabelText("Organization Code");
    expect(orgCodeInput).toBeInTheDocument();

    const orgTranslationShortInput = screen.getByLabelText(
      "Organization Translation Short",
    );
    expect(orgTranslationShortInput).toBeInTheDocument();

    const orgTranslationInput = screen.getByLabelText(
      "Organization Translation",
    );
    expect(orgTranslationInput).toBeInTheDocument();

    const inactiveInput = screen.getByLabelText("Inactive");
    expect(inactiveInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    await userEvent.type(orgCodeInput, "csu");
    await userEvent.type(orgTranslationShortInput, "CSU");
    await userEvent.type(orgTranslationInput, "UCSB Chinese Student Union");
    await userEvent.selectOptions(inactiveInput, "true");
    await userEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params.inactive).toBe(true);

    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: "csu",
      orgTranslationShort: "CSU",
      orgTranslation: "UCSB Chinese Student Union",
      inactive: true,
    });

    expect(mockToast).toHaveBeenCalledWith(
      "New UCSB Organization Created - orgCode: csu",
    );
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/ucsborganization" });
  });
});
