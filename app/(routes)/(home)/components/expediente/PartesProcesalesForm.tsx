"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Expediente } from "./TableExpediente";

const parteProcesalSchema = z.object({
  tipoDocumento: z.string().min(1, "El tipo de documento es obligatorio"),
  numeroDocumento: z
    .string()
    .min(5, "El número de documento debe tener al menos 5 caracteres"),
  nombre: z.string().min(3, "El nombre es obligatorio"),
});

type ParteProcesal = z.infer<typeof parteProcesalSchema>;

interface Props {
  expedienteId: string;
  data: Expediente[];
}

export default function PartesProcesalesTable({ expedienteId, data }: Props) {
  const queryClient = useQueryClient();

  const addParteProcesal = useMutation({
    mutationFn: async (nuevoParte: ParteProcesal) => {
      const { data } = await axios.post(
        `http://localhost:3000/judicial/${expedienteId}/partes-procesales`,
        nuevoParte
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expedientes"] });
      toast.success("Parte procesal agregado correctamente");
    },
    onError: () => {
      toast.error("Error al agregar parte procesal");
    },
  });

  const filterAndExpedientId = data.filter(
    (expediente) => expediente.id === expedienteId
  );

  return (
    <div className="p-4">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gestionar Partes Procesales</DialogTitle>
        </DialogHeader>
        <ParteProcesalForm onSubmit={addParteProcesal.mutate} />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo Documento</TableHead>
              <TableHead>Número Documento</TableHead>
              <TableHead>Nombre</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterAndExpedientId.map((parte) => (
              <>
                {parte.partesProcesales.map((parteProcesal) => (
                  <TableRow key={parteProcesal.numeroDocumento}>
                    <TableCell>{parteProcesal.tipoDocumento}</TableCell>
                    <TableCell>{parteProcesal.numeroDocumento}</TableCell>
                    <TableCell>{parteProcesal.nombre}</TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      {/* </Dialog> */}
    </div>
  );
}

function ParteProcesalForm({
  onSubmit,
}: {
  onSubmit: (data: ParteProcesal) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParteProcesal>({
    resolver: zodResolver(parteProcesalSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Tipo de Documento</label>
        <Input {...register("tipoDocumento")} placeholder="CC / TI / CE" />
        {errors.tipoDocumento && (
          <p className="text-red-500 text-sm">{errors.tipoDocumento.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Número de Documento</label>
        <Input {...register("numeroDocumento")} placeholder="123456789" />
        {errors.numeroDocumento && (
          <p className="text-red-500 text-sm">
            {errors.numeroDocumento.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <Input {...register("nombre")} placeholder="Juan Pérez" />
        {errors.nombre && (
          <p className="text-red-500 text-sm">{errors.nombre.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Guardar
      </Button>
    </form>
  );
}
