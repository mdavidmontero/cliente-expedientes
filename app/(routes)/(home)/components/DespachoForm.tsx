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
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const formSchema = z.object({
  codigoDespacho: z.string().min(2, {
    message: "codigo de despacho es requerido",
  }),
  nombre: z.string().min(2, {
    message: "nombre de despacho es requerido",
  }),
  categoria: z.string().min(2, {
    message: "categoria de despacho es requerido",
  }),
});

export default function DespachoForm() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigoDespacho: "",
      nombre: "",
      categoria: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/judicial/despacho",
        values
      );

      form.reset();
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["despacho"] });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="bg-white p-10 mx-10 rounded-lg shadow justify-center  ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="codigoDespacho"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codigo Despacho</FormLabel>
                <FormControl>
                  <Input placeholder="cod despacho" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de despacho" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="municipal">Municipal</SelectItem>
                    <SelectItem value="circuito">Circuito</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            Guardar
          </Button>
        </form>
      </Form>
    </div>
  );
}
