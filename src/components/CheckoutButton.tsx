// components/DeleteNoteButton.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

interface CheckoutButtonProps {
  noteId: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ noteId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = confirm("Tem certeza que deseja apagar este anúncio?");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/deleteNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId }),
      });

      if (response.ok) {
        // Atualiza a página ou a lista de anúncios
        router.refresh();
      } else {
        alert("Erro ao apagar o anúncio.");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Erro ao deletar o anúncio:", error);
      alert("Erro ao apagar o anúncio.");
      setIsDeleting(false);
    }
  };

  return (
    <Button
    className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded"
      variant="solid"
      onClick={handleDelete}
      disabled={isDeleting}
      size="2"
    >
      {isDeleting ? "Reservando..." : "Reservar"}
    </Button>
  );
};

export default CheckoutButton;
