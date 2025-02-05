// components/DeleteNoteButton.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

interface DeleteNoteButtonProps {
  noteId: string;
}

const DeleteNoteButton: React.FC<DeleteNoteButtonProps> = ({ noteId }) => {
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
      variant="ghost"
      onClick={handleDelete}
      disabled={isDeleting}
      size="2"
    >
      {isDeleting ? "Apagando..." : "Apagar"}
    </Button>
  );
};

export default DeleteNoteButton;
