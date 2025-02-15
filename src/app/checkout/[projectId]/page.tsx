"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@radix-ui/themes";
import SuccessMessage from "@/components/SuccessMessage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// Alteramos a tipagem para indicar que params é uma Promise
export type ParamsType = Promise<{ projectId: string }>;

interface CheckoutPageProps {
  params: ParamsType;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ params }) => {
  // Desembrulha a Promise dos parâmetros usando o hook experimental React.use()
  const resolvedParams = React.use(params);
  const { projectId } = resolvedParams;

  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [reservationDate, setReservationDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Monte o payload com os dados da reserva
    const payload = {
      name,
      email,
      phone,
      property_id: projectId,
      
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
        setShowSuccess(true);

        setTimeout(() => {
          router.push("/thank-you");
        }, 3000); // Aguarda 2 segundos antes de redirecionar
        // Após a reserva, redirecione para uma página de confirmação ou obrigado
       
      } else {
        toast.error("Erro ao atualizar o imóvel.");
      }
    } catch (error) {
      console.error("Erro na reserva:", error);
      toast.error("Erro ao enviar os dados do imóvel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded">
        <h1 className="text-2xl text-orange-500 font-bold text-center mb-4">
          Checkout - Reserva de Casa
        </h1>
        <p className="text-center mb-6">
          Preencha os dados para reservar a casa
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-orange-500 mb-1 font-semibold">
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
            <label htmlFor="email" className="block text-orange-500 mb-1 font-semibold">
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
            <label htmlFor="phone" className="block text-orange-500 mb-1 font-semibold">
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
          
          <Button
            type="submit"
            className="w-full cursor-pointer bg-orange-600 text-white py-2 rounded hover:bg-orange-300 transition"
            disabled={loading}
          >
             {showSuccess && <SuccessMessage message="Reserva efectuada com sucesso!" />}
            {loading ? "Reservando..." : "Reservar"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/" className="text-orange-600 hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
