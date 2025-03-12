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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PartesProcesalesForm from "./PartesProcesalesForm";
import DocumentosTable from "./CuadernoForm";

interface Cuaderno {
  id: string;
  numero: number;
  descripcion: string;
  documento: any[];
}

export interface Expediente {
  id: string;
  departamento: string;
  ciudad: string;
  despacho: Despacho;
  serie: Serie;
  numeroRadicacion: string;
  expedienteFisico: boolean;
  documentosEnSoporteFisico: boolean;
  partesProcesales: any[];
  cuadernos: Cuaderno[];
}

export interface Despacho {
  codigoDespacho: string;
  nombre: string;
  categoria: string;
}

export interface Serie {
  id: string;
  codigo: string;
  descripcion: string;
}

const getExpedientes = async (): Promise<Expediente[]> => {
  const { data } = await axios.get("http://localhost:3000/judicial");
  return data;
};

export default function TableExpediente() {
  const [showDialog, setShowDialog] = useState(false);
  const { data } = useQuery({
    queryKey: ["expedientes"],
    queryFn: getExpedientes,
    refetchOnWindowFocus: true,
  });

  const [selectedExpedienteId, setSelectedExpedienteId] = useState<
    string | null
  >(null);
  const [selectedDespacho, setSelectedDespacho] = useState<Despacho | null>(
    null
  );
  const [selectedSerie, setSelectedSerie] = useState<Serie | null>(null);

  return (
    <>
      <Table className="my-4 bg-white shadow-md mx-10">
        <TableCaption>Lista de Expedientes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Despacho</TableHead>
            <TableHead>Serie</TableHead>
            <TableHead>Número Radicación</TableHead>
            <TableHead>Expediente Físico</TableHead>
            <TableHead>Soporte Físico</TableHead>
            <TableHead>Partes Procesales</TableHead>
            <TableHead>Cuadernos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((expediente) => (
            <TableRow key={expediente.id}>
              <TableCell>{expediente.id}</TableCell>
              <TableCell>{expediente.departamento}</TableCell>
              <TableCell>{expediente.ciudad}</TableCell>

              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDespacho(expediente.despacho)}
                    >
                      Ver Despacho
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </TableCell>

              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSerie(expediente.serie)}
                    >
                      Ver Serie
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </TableCell>

              <TableCell>{expediente.numeroRadicacion}</TableCell>
              <TableCell>{expediente.expedienteFisico ? "Sí" : "No"}</TableCell>
              <TableCell>
                {expediente.documentosEnSoporteFisico ? "Sí" : "No"}
              </TableCell>

              <TableCell>
                <Dialog
                  open={selectedExpedienteId === expediente.id}
                  onOpenChange={(isOpen) =>
                    setSelectedExpedienteId(isOpen ? expediente.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExpedienteId(expediente.id)}
                    >
                      Ver Partes Procesales
                    </Button>
                  </DialogTrigger>

                  <PartesProcesalesForm
                    expedienteId={expediente.id}
                    data={data}
                  />
                </Dialog>
              </TableCell>

              <TableCell>
                <Dialog
                  open={selectedExpedienteId === expediente.id}
                  onOpenChange={(isOpen) =>
                    setSelectedExpedienteId(isOpen ? expediente.id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExpedienteId(expediente.id)}
                    >
                      Ver Cuadernos
                    </Button>
                  </DialogTrigger>

                  <DocumentosTable expedienteId={expediente.id} data={data} />
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedDespacho && (
        <Dialog
          open={!!selectedDespacho}
          onOpenChange={() => setSelectedDespacho(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles del Despacho</DialogTitle>
              <DialogDescription>
                <p>
                  <span>Código:</span> {selectedDespacho.codigoDespacho}
                </p>
                <p>
                  <span>Nombre:</span> {selectedDespacho.nombre}
                </p>
                <p>
                  <span>Categoría:</span> {selectedDespacho.categoria}
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal para Serie */}
      {selectedSerie && (
        <Dialog
          open={!!selectedSerie}
          onOpenChange={() => setSelectedSerie(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalles de la Serie</DialogTitle>
              <DialogDescription>
                <p>
                  <strong>ID:</strong> {selectedSerie.id}
                </p>
                <p>
                  <strong>Código:</strong> {selectedSerie.codigo}
                </p>
                <p>
                  <strong>Descripción:</strong> {selectedSerie.descripcion}
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
