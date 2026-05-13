import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Card } from "./ui/card";
import { Download, FileText, Table, Image, Check } from "lucide-react";
import { exportToPDF, exportToCSV, exportToPNG } from "../lib/export-utils";
import { useEntity } from "../hooks/useEntity";
import { useAuth } from "../hooks/useAuth";
import { calculationExportEntityConfig } from "../entities/CalculationExport";

interface ExportCalculationsModalProps {
  open: boolean;
  onClose: () => void;
  calculations: any[];
}

type ExportType = "pdf" | "csv" | "png";

export function ExportCalculationsModal({
  open,
  onClose,
  calculations,
}: ExportCalculationsModalProps) {
  const { currentUser } = useAuth();
  const { create } = useEntity(calculationExportEntityConfig);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exportType, setExportType] = useState<ExportType>("pdf");
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleCalculation = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(calculations.map((c) => c.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  const handleExport = async () => {
    if (selectedIds.length === 0) return;

    setExporting(true);
    try {
      const selectedCalculations = calculations.filter((c) =>
        selectedIds.includes(c.id)
      );

      let fileName = "";
      let fileSize = 0;

      switch (exportType) {
        case "pdf":
          await exportToPDF({ calculation: selectedCalculations[0]?.calculation || {} as any, timestamp: new Date().toISOString() });
          fileName = 'export.pdf';
          fileSize = 50000;
          break;
        case "csv":
          await exportToCSV({ calculation: selectedCalculations[0]?.calculation || {} as any, timestamp: new Date().toISOString() });
          fileName = 'export.csv';
          fileSize = 10000;
          break;
        case "png":
          if (selectedCalculations.length === 1) {
            await exportToPNG({ calculation: selectedCalculations[0]?.calculation || {} as any, timestamp: new Date().toISOString() });
            fileName = 'export.png';
            fileSize = 100000; // Estimate
          }
          break;
      }

      // Track export in database
      await create({
        userId: currentUser?.id || "guest",
        calculationIds: selectedIds.join(","),
        exportType,
        exportData: JSON.stringify(selectedCalculations),
        fileName,
        fileSize,
        status: "completed",
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setSelectedIds([]);
      }, 2000);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Export Calculations
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Export Successful!
            </h3>
            <p className="text-gray-600">
              Your calculations have been exported successfully.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Export Format Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                Export Format
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <Card
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    exportType === "pdf"
                      ? "border-blue-500 border-2 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setExportType("pdf")}
                >
                  <div className="text-center">
                    <FileText
                      className={`w-8 h-8 mx-auto mb-2 ${
                        exportType === "pdf"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    />
                    <div className="font-semibold">PDF Report</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Readable format
                    </div>
                  </div>
                </Card>

                <Card
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    exportType === "csv"
                      ? "border-blue-500 border-2 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setExportType("csv")}
                >
                  <div className="text-center">
                    <Table
                      className={`w-8 h-8 mx-auto mb-2 ${
                        exportType === "csv"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    />
                    <div className="font-semibold">CSV Data</div>
                    <div className="text-xs text-gray-500 mt-1">
                      For analysis
                    </div>
                  </div>
                </Card>

                <Card
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    exportType === "png"
                      ? "border-blue-500 border-2 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setExportType("png")}
                >
                  <div className="text-center">
                    <Image
                      className={`w-8 h-8 mx-auto mb-2 ${
                        exportType === "png"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    />
                    <div className="font-semibold">PNG Image</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Shareable
                    </div>
                  </div>
                </Card>
              </div>
              {exportType === "png" && selectedIds.length > 1 && (
                <p className="text-sm text-amber-600 mt-2">
                  ⚠️ PNG export only supports single calculations. Please
                  select one.
                </p>
              )}
            </div>

            {/* Calculation Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">
                  Select Calculations ({selectedIds.length} of{" "}
                  {calculations.length})
                </Label>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAll}
                    disabled={selectedIds.length === calculations.length}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    disabled={selectedIds.length === 0}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                {calculations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No calculations available to export
                  </div>
                ) : (
                  calculations.map((calc) => (
                    <div
                      key={calc.id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <Checkbox
                        checked={selectedIds.includes(calc.id)}
                        onCheckedChange={() => toggleCalculation(calc.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {calc.projectName || "Unnamed Calculation"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(calc.created_at).toLocaleDateString()} •
                          Total Cost: ${calc.results?.totalCost?.toLocaleString() || "N/A"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={
                  selectedIds.length === 0 ||
                  exporting ||
                  (exportType === "png" && selectedIds.length > 1)
                }
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? "Exporting..." : `Export as ${exportType.toUpperCase()}`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
