import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const documentoSchema = z.object({
  nombre: z.string().min(3, "El nombre es obligatorio"),
  fechaCreacion: z.string().min(1, "La fecha es obligatoria"),
  fechaIncorporacion: z
    .string()
    .min(1, "La fecha de incorporación es obligatoria"),
  orden: z.number().min(1, "El orden es obligatorio"),
  numeroPaginas: z.number().min(1, "Debe tener al menos 1 página"),
  paginaInicio: z.number().min(1, "La página de inicio es obligatoria"),
  paginaFin: z.number().min(1, "La página de fin es obligatoria"),
  formato: z.string().min(1, "El formato es obligatorio"),
  tamanio: z.string().min(1, "El tamaño es obligatorio"),
  origen: z.string().min(1, "El origen es obligatorio"),
  observaciones: z.string().optional(),
});
type Documento = z.infer<typeof documentoSchema>;

interface Props {
  expedienteId: string;
  cuadernoId: string;
}

export default function DocumentoForm({ expedienteId, cuadernoId }: Props) {
  const queryClient = useQueryClient();
  const addDocumento = useMutation({
    mutationFn: async (cuaderno: Documento): Promise<Documento> => {
      const { data } = await axios.post(
        `http://localhost:3000/judicial/${expedienteId}/documentos/${cuadernoId}`,
        {
          ...cuaderno,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expedientes"] });
      toast.success("Documento creado correctamente");
      // Reset form
    },
    onError: () => {
      toast.error("Error al agregar documento");
    },
  });
  return (
    <>
      <DrawerTrigger asChild>
        <Button>
          Add doc <Paperclip className="h-4 w-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Agregar Documento</DrawerTitle>
        </DrawerHeader>
        <CuadernoForm onSubmit={addDocumento.mutate} />

        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </>
  );
}

function CuadernoForm({ onSubmit }: { onSubmit: (data: Documento) => void }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Documento>({
    resolver: zodResolver(documentoSchema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 mx-10 overflow-scroll"
    >
      <Input {...register("nombre")} placeholder="Nombre del documento" />
      {errors.nombre && (
        <p className="text-red-500 text-sm">{errors.nombre.message}</p>
      )}

      <Input
        {...register("fechaCreacion")}
        placeholder="Fecha de creación"
        defaultValue={new Date().toLocaleDateString()}
      />
      {errors.fechaCreacion && (
        <p className="text-red-500 text-sm">{errors.fechaCreacion.message}</p>
      )}
      <Input
        {...register("fechaIncorporacion")}
        placeholder="Fecha de creación"
      />
      {errors.fechaIncorporacion && (
        <p className="text-red-500 text-sm">
          {errors.fechaIncorporacion.message}
        </p>
      )}

      <Input
        type="number"
        {...register("orden", { valueAsNumber: true })}
        placeholder="Orden"
      />
      {errors.orden && (
        <p className="text-red-500 text-sm">{errors.orden.message}</p>
      )}

      <Input
        type="number"
        {...register("numeroPaginas", { valueAsNumber: true })}
        placeholder="Número de páginas"
      />
      {errors.numeroPaginas && (
        <p className="text-red-500 text-sm">{errors.numeroPaginas.message}</p>
      )}
      <Input
        type="number"
        {...register("paginaInicio", { valueAsNumber: true })}
        placeholder="Pagina Inicio"
      />
      {errors.paginaInicio && (
        <p className="text-red-500 text-sm">{errors.paginaInicio.message}</p>
      )}
      <Input
        type="number"
        {...register("paginaFin", { valueAsNumber: true })}
        placeholder="Pagina Fin"
      />
      {errors.paginaFin && (
        <p className="text-red-500 text-sm">{errors.paginaFin.message}</p>
      )}

      <Input {...register("formato")} placeholder="Formato (PDF, DOCX, etc.)" />
      {errors.formato && (
        <p className="text-red-500 text-sm">{errors.formato.message}</p>
      )}

      <Input {...register("tamanio")} placeholder="Tamaño, eje: 100KB, 1MB " />
      {errors.tamanio && (
        <p className="text-red-500 text-sm">{errors.tamanio.message}</p>
      )}
      <Input {...register("origen")} placeholder="origen del documento" />
      {errors.origen && (
        <p className="text-red-500 text-sm">{errors.origen.message}</p>
      )}
      <Input {...register("observaciones")} placeholder="Observaciones" />
      {errors.observaciones && (
        <p className="text-red-500 text-sm">{errors.observaciones.message}</p>
      )}

      <Button type="submit" className="w-full">
        Guardar
      </Button>
    </form>
  );
}
