"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getDespacho = async () => {
  const { data } = await axios.get("http://localhost:3000/judicial/despacho");

  return data;
};

export default function TableDespacho() {
  const { data } = useQuery({
    queryKey: ["despacho"],
    queryFn: getDespacho,
    refetchOnWindowFocus: true,
  });

  return (
    <Table className="my-4 bg-white  shadow-md mx-10">
      <TableCaption>Lista de Despachos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Codigo</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Categoria</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((despacho: any) => (
          <TableRow key={despacho.codigoDespacho}>
            <TableCell>{despacho.codigoDespacho}</TableCell>
            <TableCell>{despacho.nombre}</TableCell>
            <TableCell>{despacho.categoria}</TableCell>
          </TableRow>
        ))}
        <TableRow></TableRow>
      </TableBody>
    </Table>
  );
}
