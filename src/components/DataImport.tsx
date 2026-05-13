import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Database, Cloud } from 'lucide-react';

type ImportMethod = 'file' | 'api' | null;
type FileType = 'csv' | 'excel' | null;

interface ParsedData {
  headers: string[];
  rows: any[];
}

interface DataImportProps {
  onDataImported: (data: any) => void;
  acceptedFields: string[];
}

export default function DataImport({ onDataImported, acceptedFields }: DataImportProps) {
  const [importMethod, setImportMethod] = useState<ImportMethod>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parseStatus, setParseStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv' || fileExtension === 'xlsx' || fileExtension === 'xls') {
      setFile(selectedFile);
      parseFile(selectedFile, fileExtension as FileType);
    } else {
      setErrorMessage('Please upload a CSV or Excel file');
      setParseStatus('error');
    }
  };

  const parseFile = async (file: File, fileType: FileType) => {
    setParseStatus('parsing');
    setErrorMessage('');

    try {
      const text = await file.text();
      
      if (fileType === 'csv') {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          throw new Error('CSV file must contain headers and at least one data row');
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
        const rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });

        setParsedData({ headers, rows });
        setParseStatus('success');
        
        // Auto-map data to accepted fields
        mapDataToFields(headers, rows);
      } else {
        setErrorMessage('Excel file parsing requires Pro plan. Please use CSV format or upgrade.');
        setParseStatus('error');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to parse file');
      setParseStatus('error');
    }
  };

  const mapDataToFields = (headers: string[], rows: any[]) => {
    // Smart field mapping based on header names
    const mappedData: any = {};
    
    acceptedFields.forEach(field => {
      const fieldLower = field.toLowerCase();
      const matchingHeader = headers.find(h => 
        h.toLowerCase().includes(fieldLower) || 
        fieldLower.includes(h.toLowerCase())
      );
      
      if (matchingHeader && rows.length > 0) {
        // Use first row of data
        const value = rows[0][matchingHeader];
        mappedData[field] = isNaN(Number(value)) ? value : Number(value);
      }
    });

    onDataImported(mappedData);
  };

  const resetImport = () => {
    setFile(null);
    setParsedData(null);
    setParseStatus('idle');
    setErrorMessage('');
  };

  if (importMethod === null) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900">Import Data</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Choose how you'd like to import your calculation data
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => setImportMethod('file')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
          >
            <Upload className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-gray-900 mb-2">File Upload</h4>
            <p className="text-sm text-gray-600">
              Upload CSV or Excel files with your data
            </p>
            <div className="mt-3 text-xs text-gray-500">
              Supports: CSV, XLSX, XLS
            </div>
          </button>

          <button
            onClick={() => setImportMethod('api')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left group relative"
          >
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                PRO
              </span>
            </div>
            <Cloud className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-gray-900 mb-2">API Connect</h4>
            <p className="text-sm text-gray-600">
              Connect to Salesforce, HubSpot, QuickBooks & more
            </p>
            <div className="mt-3 text-xs text-gray-500">
              Real-time data sync
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (importMethod === 'api') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <button
          onClick={() => setImportMethod(null)}
          className="text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to import options
        </button>

        <div className="text-center py-12">
          <Cloud className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">API Integrations</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Connect your business tools and automatically sync data for calculations
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
            {['Salesforce', 'HubSpot', 'QuickBooks', 'Stripe', 'Shopify', 'Google Analytics', 'Xero', 'Zapier'].map(tool => (
              <div key={tool} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">{tool}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6 max-w-md mx-auto">
            <h4 className="font-semibold text-gray-900 mb-2">Upgrade to Pro</h4>
            <p className="text-sm text-gray-600 mb-4">
              API integrations are available on the Pro plan. Connect unlimited tools and automate your data flow.
            </p>
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              View Pro Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <button
        onClick={() => setImportMethod(null)}
        className="text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        ← Back to import options
      </button>

      {parseStatus === 'idle' && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Upload File</h3>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drag and drop your file here
            </p>
            <p className="text-sm text-gray-600 mb-4">or</p>
            <label className="inline-block">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                Browse Files
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: CSV, XLSX, XLS (max 10MB)
            </p>
          </div>
        </div>
      )}

      {parseStatus === 'parsing' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Parsing file...</p>
        </div>
      )}

      {parseStatus === 'success' && parsedData && (
        <div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Import Successful!</h3>
              <p className="text-sm text-gray-600">
                Found {parsedData.rows.length} rows with {parsedData.headers.length} columns
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Detected Fields:</h4>
            <div className="flex flex-wrap gap-2">
              {parsedData.headers.map(header => (
                <span key={header} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
                  {header}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800">
              ✓ Data has been automatically mapped to your calculator fields
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetImport}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Import Another File
            </button>
            <button
              onClick={() => setImportMethod(null)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {parseStatus === 'error' && (
        <div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Import Failed</h3>
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetImport}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => setImportMethod(null)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
