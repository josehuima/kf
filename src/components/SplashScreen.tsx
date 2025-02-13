"use client";

import React from "react";
import { Spinner, Text } from "@radix-ui/themes";

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <Spinner size="3" />
      <Text className="mt-4 text-white text-xl font-bold">
        Carregando...
      </Text>
    </div>
  );
};

export default SplashScreen;
