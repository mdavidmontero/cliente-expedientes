"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Calendar } from "@/components/ui/calendar";

import { toast } from "sonner";
import { Expediente } from "./TableExpediente";
import { FormHTMLAttributes, useRef, useState } from "react";
import DocumentoForm from "./DocumentoForm";
import { Drawer } from "@/components/ui/drawer";
// Schema documento

const cuadernoSchema = z.object({
  numero: z.string().min(3, "El numero es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
});

export type Cuaderno = z.infer<typeof cuadernoSchema>;

interface Props {
  expedienteId: string;
  data: Expediente[];
}

export default function DocumentosTable({ expedienteId, data }: Props) {
  const queryClient = useQueryClient();
  const [cuadernoIdSelect, setCuadernoIdSelect] = useState<string | null>(null);

  // const { data: documentos, isLoading } = useQuery({
  //   queryKey: ["documentos", cuadernoId],
  //   queryFn: async () => {
  //     const { data } = await axios.get(
  //       `http://localhost:3000/cuadernos/${cuadernoId}/documentos`
  //     );
  //     return data;
  //   },
  // });

  const addDocumento = useMutation({
    mutationFn: async (cuadernonew: Cuaderno): Promise<Cuaderno> => {
      const { data } = await axios.post(
        `http://localhost:3000/judicial/${expedienteId}/cuadernos`,
        {
          ...cuadernonew,
          numero: +cuadernonew.numero,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expedientes"] });
      toast.success("Cuaderno creado correctamente");
      // Reset form
    },
    onError: () => {
      toast.error("Error al agregar documento");
    },
  });

  return (
    <div className="p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Agregar Cuaderno</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Cuaderno </DialogTitle>
          </DialogHeader>
          <CuadernoForm onSubmit={addDocumento.mutate} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Descripción</TableHead>
              </TableRow>
            </TableHeader>
            {}
            <TableBody>
              {data?.map((expediente) => (
                <>
                  {expediente.cuadernos.map((cuaderno) => (
                    <TableRow key={cuaderno.id}>
                      <TableCell>{cuaderno.numero}</TableCell>
                      <TableCell>{cuaderno.descripcion}</TableCell>
                      <TableCell>
                        <Drawer
                          onOpenChange={(isOpen) =>
                            setCuadernoIdSelect(isOpen ? cuaderno.id : null)
                          }
                        >
                          <DocumentoForm
                            expedienteId={expedienteId}
                            cuadernoId={cuaderno.id}
                          />
                        </Drawer>
                      </TableCell>
                      {cuaderno.documento.length > 0 && (
                        <TableCell>
                          {cuaderno.documento.map((documento) => (
                            <div key={documento.id}>
                              <p>{documento.nombre}</p>
                              <p>{documento.fechaCreacion}</p>
                              <p>{documento.numeroPaginas}</p>
                              <p>{documento.formato}</p>
                              <p>{documento.tamanio}</p>
                              <p>{documento.origen}</p>
                            </div>
                          ))}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CuadernoForm({ onSubmit }: { onSubmit: (data: Cuaderno) => void }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Cuaderno>({
    resolver: zodResolver(cuadernoSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("numero")} placeholder="Número del cuaderno" />
      {errors.numero && (
        <p className="text-red-500 text-sm">{errors.numero.message}</p>
      )}
      <Input
        {...register("descripcion")}
        placeholder="Descripción del cuaderno"
      />
      {errors.descripcion && (
        <p className="text-red-500 text-sm">{errors.descripcion.message}</p>
      )}

      <Button type="submit" className="w-full">
        Guardar
      </Button>
    </form>
  );
}
