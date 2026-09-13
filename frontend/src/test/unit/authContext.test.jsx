import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../../context/AuthContext.jsx";

function TestConsumer() {
  const { user, token, isAuthenticated, login, register, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? "AUTHENTICATED" : "GUEST"}</div>
      <div data-testid="user-name">{user?.name || "No User"}</div>
      <div data-testid="user-role">{user?.role || "No Role"}</div>
      <div data-testid="token-val">{token || "No Token"}</div>
      <button onClick={() => login("admin@due.com", "pass123")}>Do Login</button>
      <button onClick={() => register({ name: "Jane", email: "jane@due.com", role: "Agent" })}>Do Register</button>
      <button onClick={logout}>Do Logout</button>
    </div>
  );
}

describe("Unit Test: AuthContext & AuthProvider Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should initialize as unauthenticated guest when localStorage is empty", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent("GUEST");
    expect(screen.getByTestId("user-name")).toHaveTextContent("No User");
  });

  it("should restore session from localStorage on initial mount", () => {
    localStorage.setItem("token", "stored_jwt_token_123");
    localStorage.setItem("user", JSON.stringify({ name: "Stored User", role: "Admin" }));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent("AUTHENTICATED");
    expect(screen.getByTestId("user-name")).toHaveTextContent("Stored User");
    expect(screen.getByTestId("user-role")).toHaveTextContent("Admin");
  });

  it("should update state and localStorage upon registration", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ userId: 5, name: "Jane", email: "jane@due.com", role: "Agent", token: "reg_token_555" })),
      json: () => Promise.resolve({ userId: 5, name: "Jane", email: "jane@due.com", role: "Agent", token: "reg_token_555" }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText("Do Register").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("AUTHENTICATED");
    expect(screen.getByTestId("user-name")).toHaveTextContent("Jane");
    expect(screen.getByTestId("user-role")).toHaveTextContent("Agent");
    expect(localStorage.getItem("token")).toBeDefined();
  });

  it("should clear session and localStorage upon logout", () => {
    localStorage.setItem("token", "active_token");
    localStorage.setItem("user", JSON.stringify({ name: "Active User" }));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent("AUTHENTICATED");

    act(() => {
      screen.getByText("Do Logout").click();
    });

    expect(screen.getByTestId("auth-status")).toHaveTextContent("GUEST");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});
