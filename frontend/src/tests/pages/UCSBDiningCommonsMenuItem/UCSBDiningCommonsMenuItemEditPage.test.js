import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

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

describe("UCSBDiningCommonsMenuItemEditPage tests", () => {
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
      axiosMock.onGet("/api/ucsbDiningCommonsMenuItem", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit UCSBDiningCommonsMenuItem");
      expect(
        screen.queryByTestId("UCSBDiningCommonsMenuItem-diningCommonsCode"),
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
      axiosMock.onGet("/api/ucsbDiningCommonsMenuItem", { params: { id: 17 } }).reply(200, {
        id: 17,
        diningCommonsCode: "DL",
        name: "Chicken Alfredo",
        station: "Pasta",
      });
      axiosMock.onPut("/api/ucsbDiningCommonsMenuItem").reply(200, {
        id: "17",
        diningCommonsCode: "DL",
        name: "Fettuccine Alfredo",
        station: "Pasta",
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItem-diningCommonsCode");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItem-diningCommonsCode");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const diningCommonsCode = screen.getByTestId("UCSBDiningCommonsMenuItem-diningCommonsCode");
      const nameField = screen.getByTestId("UCSBDiningCommonsMenuItem-name");
      const stationField = screen.getByTestId(
        "UCSBDiningCommonsMenuItem-station",
      );
      const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItem-submit");

      expect(idField).toHaveValue("17");
      expect(diningCommonsCode).toHaveValue("DL");
      expect(nameField).toHaveValue("Chicken Alfredo");
      expect(stationField).toHaveValue("Pasta");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBDiningCommonsMenuItemEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");

      const idField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-id");
      const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
      const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
      const stationField = screen.getByTestId(
        "UCSBDiningCommonsMenuItem-station",
      );
      const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

      expect(idField).toHaveValue("17");
      expect(diningCommonsCodeField).toHaveValue("DL");
      expect(nameField).toHaveValue("Chicken Alfredo");
      expect(stationField).toHaveValue("Pasta");

      expect(submitButton).toBeInTheDocument();

      fireEvent.change(diningCommonsCodeField, { target: { value: "DL" } });
      fireEvent.change(nameField, { target: { value: "Fettuccine Alfredo" } });
      fireEvent.change(stationField, {
        target: { value: "Pasta" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "UCSBDiningCommonsMenuItem Updated - id: 17 name: Fettuccine Alfredo",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/ucsbDiningCommonsMenuItem" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          diningCommonsCode: "DL",
          name: "Fettuccine Alfredo",
          station: "Pasta",
        }),
      ); // posted object
    });
  });
});