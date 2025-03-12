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
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const formSchema = z.object({
  codigo: z.string().min(2, {
    message: "nombre de despacho es requerido",
  }),
  descripcion: z.string().min(2, {
    message: "categoria de despacho es requerido",
  }),
});

export default function SerieDocumentalForm() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: "",
      descripcion: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/judicial/serie-documental",
        values
      );

      form.reset();
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["serie-documental"] });
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
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Codigo de serie documental" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input placeholder="Descripción" {...field} />
                </FormControl>

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
