"use client";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DespachoForm from "../../components/DespachoForm";
import SerieDocumentalForm from "../../components/SerieDocumental";
import TableDespacho from "../../components/TableDespacho";
import TableSerieDocumental from "../../components/TableSerieDocumental";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DespachoPage() {
  // const queryClient = new QueryClient();

  return (
    // <QueryClientProvider client={queryClient}>
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Sección Despacho Judicial */}
        <Card className="shadow-lg rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Despacho Judicial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DespachoForm />
            <div className="mt-6">
              <TableDespacho />
            </div>
          </CardContent>
        </Card>

        {/* Sección Serie Documental */}
        <Card className="shadow-lg rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Serie Documental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SerieDocumentalForm />
            <div className="mt-6">
              <TableSerieDocumental />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    // </QueryClientProvider>
  );
}
