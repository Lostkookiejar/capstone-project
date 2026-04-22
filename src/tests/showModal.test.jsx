import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import { store } from "../../store"; // Adjust path if needed
import Dashboard from "../pages/Dashboard";

// Mock Firebase Auth
vi.mock("firebase/auth", () => {
  const mockAuth = {
    signOut: vi.fn(),
  };
  return {
    getAuth: () => mockAuth,
  };
});

// Mock AuthContext
const mockAuthContextValue = {
  currentUser: { uid: "test-user" },
};

describe("trigger show modal", () => {
  it("renders Dashboard, clicks Create New Review button, and expects modal to be visible", async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <AuthContext.Provider value={mockAuthContextValue}>
            <Dashboard />
          </AuthContext.Provider>
        </BrowserRouter>
      </Provider>,
    );

    // Click the 'Create New Review' button
    const createButton = screen.getByRole("button", {
      name: /create a new review/i,
    });
    await user.click(createButton);

    // Expect the modal to be visible
    // Check for a specific element in the modal, like the placeholder text
    const input = screen.getByPlaceholderText(/enter game name/i);
    expect(input).toBeInTheDocument();
  });
});
