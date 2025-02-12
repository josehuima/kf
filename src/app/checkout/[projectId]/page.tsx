"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [reservationDate, setReservationDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Monte o payload com os dados da reserva
    const payload = {
      name,
      email,
      phone,
      reservationDate,
      // Você pode incluir também o id da casa, se for necessário,
      // por exemplo: houseId: <valor>
    };

    try {
      // Chamada para o endpoint de reserva (ajuste a rota conforme sua API)
      const response = await fetch("/api/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Reserva realizada com sucesso!");
        // Após a reserva, redirecione para uma página de confirmação ou obrigado
        router.push("/thank-you");
      } else {
        alert("Erro ao realizar a reserva. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro na reserva:", error);
      alert("Erro ao realizar a reserva. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-bold text-center mb-4">
          Checkout - Reserva de Casa
        </h1>
        <p className="text-center mb-6">
          Preencha os dados para reservar a casa
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">
              Nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1 font-semibold">
              Telefone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block mb-1 font-semibold">
              Data da Reserva
            </label>
            <input
              id="date"
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Reservando..." : "Reservar"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/">
            <a className="text-blue-600 hover:underline">
              Voltar para a página inicial
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
