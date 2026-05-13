import { useState, useEffect } from "react";
import { Upload, Palette, Type, Eye, Save, Download, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useEntity } from "../hooks/useEntity";
import { brandSettingsEntityConfig } from "../entities/BrandSettings";

type BrandSettings = {
  id: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  fontFamily: string;
  fontHeading: string;
  companyName: string;
  tagline: string;
  created_at: string;
  updated_at: string;
};

const professionalFonts = [
  { value: "Inter", label: "Inter - Modern & Clean" },
  { value: "Roboto", label: "Roboto - Professional" },
  { value: "Open Sans", label: "Open Sans - Friendly" },
  { value: "Lato", label: "Lato - Corporate" },
  { value: "Montserrat", label: "Montserrat - Bold" },
  { value: "Poppins", label: "Poppins - Contemporary" },
  { value: "Raleway", label: "Raleway - Elegant" },
  { value: "Merriweather", label: "Merriweather - Classic" },
  { value: "Playfair Display", label: "Playfair - Luxury" },
  { value: "IBM Plex Sans", label: "IBM Plex - Technical" },
];

export default function BrandingStudio() {
  const { items: brandSettings, loading, create, update } = useEntity<BrandSettings>(brandSettingsEntityConfig);
  
  const [settings, setSettings] = useState({
    primaryColor: "#2563eb",
    secondaryColor: "#7c3aed",
    accentColor: "#06b6d4",
    logoUrl: "",
    fontFamily: "Inter",
    fontHeading: "Montserrat",
    companyName: "Lift Metric",
    tagline: "Advanced Financial Analysis",
  });

  const [logoPreview, setLogoPreview] = useState<string>("");
  const [activeTab, setActiveTab] = useState("colors");

  useEffect(() => {
    if (brandSettings.length > 0) {
      const latest = brandSettings[0];
      setSettings({
        primaryColor: latest.primaryColor,
        secondaryColor: latest.secondaryColor,
        accentColor: latest.accentColor,
        logoUrl: latest.logoUrl,
        fontFamily: latest.fontFamily,
        fontHeading: latest.fontHeading,
        companyName: latest.companyName,
        tagline: latest.tagline,
      });
      setLogoPreview(latest.logoUrl);
    }
  }, [brandSettings]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setSettings({ ...settings, logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (brandSettings.length > 0) {
      await update(brandSettings[0].id, settings);
    } else {
      await create(settings);
    }
  };

  const handleReset = () => {
    setSettings({
      primaryColor: "#2563eb",
      secondaryColor: "#7c3aed",
      accentColor: "#06b6d4",
      logoUrl: "",
      fontFamily: "Inter",
      fontHeading: "Montserrat",
      companyName: "Lift Metric",
      tagline: "Advanced Financial Analysis",
    });
    setLogoPreview("");
  };

  const handleExportBranding = () => {
    const brandingData = {
      ...settings,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };
    const blob = new Blob([JSON.stringify(brandingData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${settings.companyName.replace(/\s+/g, "-")}-branding.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading branding settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎨 Branding Studio</h1>
          <p className="text-gray-600">Customize your company's brand identity across all reports and dashboards</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Customization Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Customization</CardTitle>
                <CardDescription>Configure your company's visual identity</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="colors">
                      <Palette className="w-4 h-4 mr-2" />
                      Colors
                    </TabsTrigger>
                    <TabsTrigger value="logo">
                      <Upload className="w-4 h-4 mr-2" />
                      Logo
                    </TabsTrigger>
                    <TabsTrigger value="fonts">
                      <Type className="w-4 h-4 mr-2" />
                      Fonts
                    </TabsTrigger>
                    <TabsTrigger value="info">
                      <Eye className="w-4 h-4 mr-2" />
                      Info
                    </TabsTrigger>
                  </TabsList>

                  {/* Colors Tab */}
                  <TabsContent value="colors" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Brand Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="flex-1"
                          placeholder="#2563eb"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Used for headers, buttons, and key elements</p>
                    </div>

                    <div>
                      <Label htmlFor="secondaryColor">Secondary Brand Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="flex-1"
                          placeholder="#7c3aed"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Used for accents and highlights</p>
                    </div>

                    <div>
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          id="accentColor"
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={settings.accentColor}
                          onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                          className="flex-1"
                          placeholder="#06b6d4"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Used for charts and data visualization</p>
                    </div>

                    <div className="pt-4 border-t">
                      <Label className="mb-2 block">Quick Presets</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSettings({ ...settings, primaryColor: "#2563eb", secondaryColor: "#7c3aed", accentColor: "#06b6d4" })}
                        >
                          <div className="flex gap-1 mr-2">
                            <div className="w-4 h-4 rounded bg-blue-600"></div>
                            <div className="w-4 h-4 rounded bg-purple-600"></div>
                          </div>
                          Blue
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSettings({ ...settings, primaryColor: "#059669", secondaryColor: "#10b981", accentColor: "#34d399" })}
                        >
                          <div className="flex gap-1 mr-2">
                            <div className="w-4 h-4 rounded bg-green-600"></div>
                            <div className="w-4 h-4 rounded bg-green-500"></div>
                          </div>
                          Green
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSettings({ ...settings, primaryColor: "#dc2626", secondaryColor: "#f97316", accentColor: "#fb923c" })}
                        >
                          <div className="flex gap-1 mr-2">
                            <div className="w-4 h-4 rounded bg-red-600"></div>
                            <div className="w-4 h-4 rounded bg-orange-500"></div>
                          </div>
                          Red
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Logo Tab */}
                  <TabsContent value="logo" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="logoUpload">Company Logo</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                        {logoPreview ? (
                          <div className="space-y-4">
                            <img src={logoPreview} alt="Logo preview" className="max-h-32 mx-auto" />
                            <Button variant="outline" onClick={() => document.getElementById("logoUpload")?.click()}>
                              <Upload className="w-4 h-4 mr-2" />
                              Change Logo
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-12 h-12 mx-auto text-gray-400" />
                            <p className="text-gray-600">Click to upload your logo</p>
                            <Button variant="outline" onClick={() => document.getElementById("logoUpload")?.click()}>
                              Select File
                            </Button>
                          </div>
                        )}
                        <input
                          id="logoUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Recommended: PNG or SVG, transparent background, max 500KB
                      </p>
                    </div>
                  </TabsContent>

                  {/* Fonts Tab */}
                  <TabsContent value="fonts" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="fontBody">Body Font</Label>
                      <Select value={settings.fontFamily} onValueChange={(value) => setSettings({ ...settings, fontFamily: value })}>
                        <SelectTrigger id="fontBody" className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {professionalFonts.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-1">Used for paragraphs and regular text</p>
                    </div>

                    <div>
                      <Label htmlFor="fontHeading">Heading Font</Label>
                      <Select value={settings.fontHeading} onValueChange={(value) => setSettings({ ...settings, fontHeading: value })}>
                        <SelectTrigger id="fontHeading" className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {professionalFonts.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-1">Used for titles and headings</p>
                    </div>

                    <div className="pt-4 border-t">
                      <Label className="mb-2 block">Font Preview</Label>
                      <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                        <p style={{ fontFamily: settings.fontHeading }} className="text-2xl font-bold">
                          This is a heading
                        </p>
                        <p style={{ fontFamily: settings.fontFamily }} className="text-base">
                          This is body text. It will appear in reports and descriptions.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Info Tab */}
                  <TabsContent value="info" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={settings.companyName}
                        onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                        placeholder="Enter company name"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tagline">Company Tagline</Label>
                      <Input
                        id="tagline"
                        value={settings.tagline}
                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                        placeholder="Enter tagline"
                        className="mt-2"
                      />
                      <p className="text-sm text-gray-500 mt-1">Appears in report headers</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Branding
              </Button>
              <Button onClick={handleExportBranding} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>See how your branding looks in real-time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Report Header Preview */}
                <div
                  className="border rounded-lg p-6 shadow-sm"
                  style={{
                    borderTopColor: settings.primaryColor,
                    borderTopWidth: "4px",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    {logoPreview && (
                      <img src={logoPreview} alt="Company logo" className="h-12 object-contain" />
                    )}
                    <div className="text-right">
                      <h3
                        style={{
                          fontFamily: settings.fontHeading,
                          color: settings.primaryColor,
                        }}
                        className="text-xl font-bold"
                      >
                        {settings.companyName}
                      </h3>
                      <p
                        style={{ fontFamily: settings.fontFamily }}
                        className="text-sm text-gray-600"
                      >
                        {settings.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4
                      style={{
                        fontFamily: settings.fontHeading,
                        color: settings.primaryColor,
                      }}
                      className="text-lg font-semibold mb-2"
                    >
                      Financial Analysis Report
                    </h4>
                    <p style={{ fontFamily: settings.fontFamily }} className="text-sm text-gray-600">
                      Generated on {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Chart Preview */}
                <div className="border rounded-lg p-4 bg-white">
                  <h4
                    style={{
                      fontFamily: settings.fontHeading,
                      color: settings.primaryColor,
                    }}
                    className="text-lg font-semibold mb-4"
                  >
                    ROI Performance
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span style={{ fontFamily: settings.fontFamily }} className="text-sm">
                          Year 1
                        </span>
                        <span style={{ fontFamily: settings.fontFamily }} className="text-sm font-medium">
                          $125,000
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            backgroundColor: settings.primaryColor,
                            width: "75%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span style={{ fontFamily: settings.fontFamily }} className="text-sm">
                          Year 2
                        </span>
                        <span style={{ fontFamily: settings.fontFamily }} className="text-sm font-medium">
                          $156,000
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            backgroundColor: settings.secondaryColor,
                            width: "90%",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span style={{ fontFamily: settings.fontFamily }} className="text-sm">
                          Year 3
                        </span>
                        <span style={{ fontFamily: settings.fontFamily }} className="text-sm font-medium">
                          $187,500
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            backgroundColor: settings.accentColor,
                            width: "100%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metrics Card Preview */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="border rounded-lg p-4"
                    style={{ borderLeftColor: settings.primaryColor, borderLeftWidth: "4px" }}
                  >
                    <p style={{ fontFamily: settings.fontFamily }} className="text-sm text-gray-600">
                      Total ROI
                    </p>
                    <p
                      style={{
                        fontFamily: settings.fontHeading,
                        color: settings.primaryColor,
                      }}
                      className="text-2xl font-bold mt-1"
                    >
                      142%
                    </p>
                  </div>
                  <div
                    className="border rounded-lg p-4"
                    style={{ borderLeftColor: settings.secondaryColor, borderLeftWidth: "4px" }}
                  >
                    <p style={{ fontFamily: settings.fontFamily }} className="text-sm text-gray-600">
                      Payback
                    </p>
                    <p
                      style={{
                        fontFamily: settings.fontHeading,
                        color: settings.secondaryColor,
                      }}
                      className="text-2xl font-bold mt-1"
                    >
                      18 mo
                    </p>
                  </div>
                </div>

                {/* Button Preview */}
                <div className="space-y-3">
                  <Button
                    style={{
                      backgroundColor: settings.primaryColor,
                      fontFamily: settings.fontFamily,
                    }}
                    className="w-full"
                  >
                    Primary Action Button
                  </Button>
                  <Button
                    variant="outline"
                    style={{
                      borderColor: settings.primaryColor,
                      color: settings.primaryColor,
                      fontFamily: settings.fontFamily,
                    }}
                    className="w-full"
                  >
                    Secondary Action Button
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Applied To */}
            <Card>
              <CardHeader>
                <CardTitle>Applied To</CardTitle>
                <CardDescription>Your branding will appear in:</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.primaryColor }}></div>
                    Financial Analysis Reports
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.primaryColor }}></div>
                    ROI Calculation Dashboards
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.primaryColor }}></div>
                    Chart Visualizations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.primaryColor }}></div>
                    PDF Exports
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.primaryColor }}></div>
                    Shared Calculations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: settings.primaryColor }}></div>
                    Email Reports
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
