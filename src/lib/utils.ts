import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const sanitizeFileName = (fileName: string): string =>{

  return fileName

  //Normalizando para separar caracters acentuados dos seus acentos
  .normalize("NFC")
  //Remokve os acentoss
  .replace(/[\u0300-\u036f]/g, "")
  //substitui os espaços e caracters invalidos sublinhados
  .replace(/[^\w.-]/g, "_")
}