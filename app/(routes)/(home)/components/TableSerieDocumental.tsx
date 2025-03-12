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

const getSerieDocumental = async () => {
  const { data } = await axios.get(
    "http://localhost:3000/judicial/serie-documental"
  );

  return data;
};

export default function TableSerieDocumental() {
  const { data } = useQuery({
    queryKey: ["serie-documental"],
    queryFn: getSerieDocumental,
    refetchOnWindowFocus: true,
  });

  return (
    <Table className="my-4 bg-white  shadow-md mx-10">
      <TableCaption>Lista de Serie Documental</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Codigo</TableHead>
          <TableHead>Descripción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((serie: any) => (
          <TableRow key={serie.codigo}>
            <TableCell>{serie.codigo}</TableCell>
            <TableCell>{serie.descripcion}</TableCell>
          </TableRow>
        ))}
        <TableRow></TableRow>
      </TableBody>
    </Table>
  );
}
