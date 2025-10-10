import React, { useState } from "react";
import { Send } from "lucide-react";

export const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Mensaje enviado:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Contacto</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Información de contacto */}
        <div className="flex flex-col justify-center gap-4">
          <h2 className="text-xl font-semibold">Información de contacto</h2>
          <p>Teléfono: <span className="font-medium">(011) 1234-5678</span></p>
          <p>Email: <span className="font-medium">contacto@fastfood.com</span></p>
          <p>Dirección: <span className="font-medium">Av. Ficticia 123, Ciudad Ejemplo</span></p>
          <div className="flex gap-4 mt-4">
            <span className="cursor-pointer text-blue-600 hover:text-blue-800">Instagram</span>
            <span className="cursor-pointer text-blue-600 hover:text-blue-800">Facebook</span>
            <span className="cursor-pointer text-blue-600 hover:text-blue-800">Twitter</span>
          </div>
          <img
            src="https://via.placeholder.com/400x250?text=Ubicación"
            alt="Mapa de ubicación"
            className="mt-6 rounded shadow-md object-cover w-full"
          />
        </div>

        {/* Formulario */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Envíanos un mensaje</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre"
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Mensaje"
              rows={4}
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-semibold transition-colors"
            >
              Enviar <Send size={16} />
            </button>
            {submitted && <p className="text-green-600 mt-2">¡Mensaje enviado correctamente!</p>}
          </form>
        </div>
      </div>
    </div>
  );
};
