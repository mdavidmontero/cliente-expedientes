"use client";

import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ExpedienteForm from "../../components/expediente/ExpedienteForm";
import TableExpediente from "../../components/expediente/TableExpediente";

export default function JudicialForm() {
  return (
    <>
      <div className="bg-white p-8 mx-auto rounded-lg shadow-md max-w-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Registro Judicial
        </h2>

        <ExpedienteForm />
      </div>
      <div className="p-5">
        <TableExpediente />
      </div>
    </>
  );
}
