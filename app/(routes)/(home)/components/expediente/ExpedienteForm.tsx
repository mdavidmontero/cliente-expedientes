"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

const getDespachos = async () => {
  const { data } = await axios.get("http://localhost:3000/judicial/despacho");
  return data;
};

const getSeriesDocumentales = async () => {
  const { data } = await axios.get(
    "http://localhost:3000/judicial/serie-documental"
  );
  return data;
};

const formSchema = z.object({
  departamento: z.string().min(2, { message: "El departamento es requerido" }),
  ciudad: z.string().min(2, { message: "La ciudad es requerida" }),
  despachoId: z.string().min(1, { message: "Debe seleccionar un despacho" }),
  serieId: z
    .string()
    .min(1, { message: "Debe seleccionar una serie documental" }),
  numeroRadicacion: z
    .string()
    .min(5, { message: "El número de radicación es obligatorio" }),
  expedienteFisico: z.boolean(),
  documentosEnSoporteFisico: z.boolean(),
});

export default function ExpedienteForm() {
  const queryClient = useQueryClient();
  const [selectedDespacho, setSelectedDespacho] = useState<any>(null);
  const [selectedSerie, setSelectedSerie] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departamento: "",
      ciudad: "",
      despachoId: "",
      serieId: "",
      numeroRadicacion: "",
      expedienteFisico: false,
      documentosEnSoporteFisico: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        departamento: values.departamento,
        ciudad: values.ciudad,
        despacho: selectedDespacho, // Enviamos el objeto completo
        serie: selectedSerie, // Enviamos el objeto completo
        numeroRadicacion: values.numeroRadicacion,
        expedienteFisico: values.expedienteFisico,
        documentosEnSoporteFisico: values.documentosEnSoporteFisico,
      };

      await axios.post("http://localhost:3000/judicial", payload);
      form.reset();
      setSelectedDespacho(null);
      setSelectedSerie(null);
      toast.success("Registro guardado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["despachos"] });
      queryClient.invalidateQueries({ queryKey: ["expedientes"] });
      queryClient.invalidateQueries({ queryKey: ["series-documentales"] });
    } catch (error) {
      console.log(error);
      toast.error("Error al enviar el formulario");
    }
  }

  const despachosData = useQuery({
    queryKey: ["despachos", selectedDespacho],
    queryFn: getDespachos,
    enabled: true,
  });

  const seriesData = useQuery({
    queryKey: ["series-documentales", selectedSerie],
    queryFn: getSeriesDocumentales,
    enabled: true,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Departamento */}
        <FormField
          control={form.control}
          name="departamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Antioquia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ciudad */}
        <FormField
          control={form.control}
          name="ciudad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Medellín" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seleccionar Despacho */}
        <FormField
          control={form.control}
          name="despachoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Despacho</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const despacho = despachosData.data?.find(
                    (d: any) => d.codigoDespacho === value
                  );
                  setSelectedDespacho(despacho);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un despacho" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {despachosData.data?.map((despacho: any) => (
                    <SelectItem
                      key={despacho.codigoDespacho}
                      value={despacho.codigoDespacho}
                    >
                      {despacho.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seleccionar Serie Documental */}
        <FormField
          control={form.control}
          name="serieId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serie Documental</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const serie = seriesData.data?.find(
                    (s: any) => s.codigo === value
                  );
                  setSelectedSerie(serie);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una serie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {seriesData.data?.map((serie: any) => (
                    <SelectItem key={serie.codigo} value={serie.codigo}>
                      {serie.codigo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número de Radicación */}
        <FormField
          control={form.control}
          name="numeroRadicacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Radicación</FormLabel>
              <FormControl>
                <Input placeholder="Ej. 2023-00001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Expediente Físico (Switch) */}
        <FormField
          control={form.control}
          name="expedienteFisico"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Expediente Físico</FormLabel>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormItem>
          )}
        />

        {/* Documentos en Soporte Físico (Switch) */}
        <FormField
          control={form.control}
          name="documentosEnSoporteFisico"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Documentos en Soporte Físico</FormLabel>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormItem>
          )}
        />

        {/* Botón de envío */}
        <Button type="submit" className="w-full">
          Guardar Registro
        </Button>
      </form>
    </Form>
  );
}
