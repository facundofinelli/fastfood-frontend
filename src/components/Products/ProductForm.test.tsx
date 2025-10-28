import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ProductForm } from "./ProductForm";
import { describe, it, expect } from "vitest";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ProductForm", () => {
  it("el campo de precio no permite ingresar letras", () => {
    renderWithRouter(<ProductForm />);
    const inputPrecio = screen.getByPlaceholderText("Precio") as HTMLInputElement;

    // Simular letras
    fireEvent.change(inputPrecio, { target: { value: "abc" } });
    expect(inputPrecio.value).toBe("0"); // depende de tu lógica

    // Simular número válido
    fireEvent.change(inputPrecio, { target: { value: "123" } });
    expect(inputPrecio.value).toBe("123");
  });
});
