import React, { useState } from "react";
import { useEntity } from "../hooks/useEntity";
import { reportTemplateEntityConfig } from "../entities/ReportTemplate";
import { X, Plus, Save, Eye, Upload, Palette, Layout, FileText, Settings, Trash2, Edit2, Copy } from "lucide-react";

type ReportTemplate = {
  id: number;
  name: string;
  description: string;
  isDefault: string;
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  layout: string;
  headerStyle: string;
  fontSize: string;
  showPageNumbers: string;
  showFooter: string;
  includeSummary: string;
  includeCharts: string;
  includeBreakdown: string;
  includeBenchmark: string;
  includeScenarios: string;
  includeRecommendations: string;
  includeAppendix: string;
  metricsToShow: string;
  chartTypes: string;
  customHeader: string;
  customFooter: string;
  disclaimer: string;
  usageCount: number;
  lastUsedAt: string;
  created_at: string;
  updated_at: string;
};

type ReportTemplateBuilderProps = {
  onClose: () => void;
};

const ReportTemplateBuilder: React.FC<ReportTemplateBuilderProps> = ({ onClose }) => {
  const { items: templates, loading, error, create, update, remove } = useEntity<ReportTemplate>(reportTemplateEntityConfig);
  
  const [activeTab, setActiveTab] = useState<"list" | "create" | "edit" | "preview">("list");
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ReportTemplate | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isDefault: "false",
    companyName: "",
    logoUrl: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    accentColor: "#10B981",
    layout: "executive",
    headerStyle: "centered",
    fontSize: "medium",
    showPageNumbers: "true",
    showFooter: "true",
    includeSummary: "true",
    includeCharts: "true",
    includeBreakdown: "true",
    includeBenchmark: "true",
    includeScenarios: "true",
    includeRecommendations: "true",
    includeAppendix: "false",
    metricsToShow: JSON.stringify(["roi", "payback", "npv", "irr"]),
    chartTypes: JSON.stringify(["bar", "line", "pie"]),
    customHeader: "",
    customFooter: "",
    disclaimer: "",
  });

  const handleCreate = async () => {
    if (!formData.name) {
      alert("Please enter a template name");
      return;
    }

    await create({
      ...formData,
      usageCount: 0,
      lastUsedAt: "",
    });

    setFormData({
      name: "",
      description: "",
      isDefault: "false",
      companyName: "",
      logoUrl: "",
      primaryColor: "#3B82F6",
      secondaryColor: "#8B5CF6",
      accentColor: "#10B981",
      layout: "executive",
      headerStyle: "centered",
      fontSize: "medium",
      showPageNumbers: "true",
      showFooter: "true",
      includeSummary: "true",
      includeCharts: "true",
      includeBreakdown: "true",
      includeBenchmark: "true",
      includeScenarios: "true",
      includeRecommendations: "true",
      includeAppendix: "false",
      metricsToShow: JSON.stringify(["roi", "payback", "npv", "irr"]),
      chartTypes: JSON.stringify(["bar", "line", "pie"]),
      customHeader: "",
      customFooter: "",
      disclaimer: "",
    });

    setActiveTab("list");
  };

  const handleEdit = async () => {
    if (!selectedTemplate || !formData.name) return;

    await update(selectedTemplate.id, formData);
    setSelectedTemplate(null);
    setActiveTab("list");
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await remove(id);
    }
  };

  const handleDuplicate = (template: ReportTemplate) => {
    setFormData({
      name: `${template.name} (Copy)`,
      description: template.description,
      isDefault: "false",
      companyName: template.companyName,
      logoUrl: template.logoUrl,
      primaryColor: template.primaryColor,
      secondaryColor: template.secondaryColor,
      accentColor: template.accentColor,
      layout: template.layout,
      headerStyle: template.headerStyle,
      fontSize: template.fontSize,
      showPageNumbers: template.showPageNumbers,
      showFooter: template.showFooter,
      includeSummary: template.includeSummary,
      includeCharts: template.includeCharts,
      includeBreakdown: template.includeBreakdown,
      includeBenchmark: template.includeBenchmark,
      includeScenarios: template.includeScenarios,
      includeRecommendations: template.includeRecommendations,
      includeAppendix: template.includeAppendix,
      metricsToShow: template.metricsToShow,
      chartTypes: template.chartTypes,
      customHeader: template.customHeader,
      customFooter: template.customFooter,
      disclaimer: template.disclaimer,
    });
    setActiveTab("create");
  };

  const startEdit = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      isDefault: template.isDefault,
      companyName: template.companyName,
      logoUrl: template.logoUrl,
      primaryColor: template.primaryColor,
      secondaryColor: template.secondaryColor,
      accentColor: template.accentColor,
      layout: template.layout,
      headerStyle: template.headerStyle,
      fontSize: template.fontSize,
      showPageNumbers: template.showPageNumbers,
      showFooter: template.showFooter,
      includeSummary: template.includeSummary,
      includeCharts: template.includeCharts,
      includeBreakdown: template.includeBreakdown,
      includeBenchmark: template.includeBenchmark,
      includeScenarios: template.includeScenarios,
      includeRecommendations: template.includeRecommendations,
      includeAppendix: template.includeAppendix,
      metricsToShow: template.metricsToShow,
      chartTypes: template.chartTypes,
      customHeader: template.customHeader,
      customFooter: template.customFooter,
      disclaimer: template.disclaimer,
    });
    setActiveTab("edit");
  };

  const showPreview = (template: ReportTemplate) => {
    setPreviewTemplate(template);
    setActiveTab("preview");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-7 h-7" />
              Report Template Builder
            </h2>
            <p className="text-blue-100 mt-1">Create and manage custom report templates</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all duration-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === "list"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Layout className="w-4 h-4 inline mr-2" />
              My Templates ({templates.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("create");
                setSelectedTemplate(null);
                setFormData({
                  name: "",
                  description: "",
                  isDefault: "false",
                  companyName: "",
                  logoUrl: "",
                  primaryColor: "#3B82F6",
                  secondaryColor: "#8B5CF6",
                  accentColor: "#10B981",
                  layout: "executive",
                  headerStyle: "centered",
                  fontSize: "medium",
                  showPageNumbers: "true",
                  showFooter: "true",
                  includeSummary: "true",
                  includeCharts: "true",
                  includeBreakdown: "true",
                  includeBenchmark: "true",
                  includeScenarios: "true",
                  includeRecommendations: "true",
                  includeAppendix: "false",
                  metricsToShow: JSON.stringify(["roi", "payback", "npv", "irr"]),
                  chartTypes: JSON.stringify(["bar", "line", "pie"]),
                  customHeader: "",
                  customFooter: "",
                  disclaimer: "",
                });
              }}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                activeTab === "create"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create New
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "list" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates yet</h3>
                  <p className="text-gray-600 mb-6">Create your first custom report template to get started</p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Template
                  </button>
                </div>
              ) : (
                templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                  >
                    {/* Logo/Icon */}
                    <div className="mb-4">
                      {template.logoUrl ? (
                        <img src={template.logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                        {template.isDefault === "true" && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{template.description || "No description"}</p>
                    </div>

                    {/* Color Palette */}
                    <div className="flex gap-2 mb-4">
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: template.primaryColor }}></div>
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: template.secondaryColor }}></div>
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: template.accentColor }}></div>
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-gray-500 mb-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <Layout className="w-3 h-3" />
                        <span className="capitalize">{template.layout} layout</span>
                      </div>
                      <div>Used {template.usageCount} times</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => showPreview(template)}
                        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                      <button
                        onClick={() => startEdit(template)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(template)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {(activeTab === "create" || activeTab === "edit") && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {activeTab === "create" ? "Create New Template" : "Edit Template"}
                </h3>

                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      Basic Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Template Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Executive Summary Template"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Describe this template..."
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={formData.isDefault === "true"}
                          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked ? "true" : "false" })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                          Set as default template
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Branding */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-blue-600" />
                      Branding
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your Company Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/logo.png"
                          />
                          {formData.logoUrl && (
                            <div className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                              <img src={formData.logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={formData.primaryColor}
                              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.primaryColor}
                              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={formData.secondaryColor}
                              onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.secondaryColor}
                              onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={formData.accentColor}
                              onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={formData.accentColor}
                              onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Layout Style */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Layout className="w-5 h-5 text-blue-600" />
                      Layout Style
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { value: "executive", label: "Executive", icon: "👔", desc: "Clean, professional summary" },
                        { value: "detailed", label: "Detailed", icon: "📊", desc: "Comprehensive analysis" },
                        { value: "presentation", label: "Presentation", icon: "🎯", desc: "Visual-focused" },
                        { value: "technical", label: "Technical", icon: "⚙️", desc: "In-depth specifications" },
                      ].map((layout) => (
                        <button
                          key={layout.value}
                          onClick={() => setFormData({ ...formData, layout: layout.value })}
                          className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                            formData.layout === layout.value
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="text-2xl mb-2">{layout.icon}</div>
                          <div className="font-semibold text-gray-900">{layout.label}</div>
                          <div className="text-xs text-gray-600 mt-1">{layout.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Header & Footer Options */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Header & Footer Options</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Header Style</label>
                        <select
                          value={formData.headerStyle}
                          onChange={(e) => setFormData({ ...formData, headerStyle: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="centered">Centered</option>
                          <option value="left">Left Aligned</option>
                          <option value="split">Split (Logo Left, Title Right)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <select
                          value={formData.fontSize}
                          onChange={(e) => setFormData({ ...formData, fontSize: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="showPageNumbers"
                            checked={formData.showPageNumbers === "true"}
                            onChange={(e) =>
                              setFormData({ ...formData, showPageNumbers: e.target.checked ? "true" : "false" })
                            }
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <label htmlFor="showPageNumbers" className="text-sm font-medium text-gray-700">
                            Show page numbers
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="showFooter"
                            checked={formData.showFooter === "true"}
                            onChange={(e) => setFormData({ ...formData, showFooter: e.target.checked ? "true" : "false" })}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <label htmlFor="showFooter" className="text-sm font-medium text-gray-700">
                            Show footer
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Header Text</label>
                        <input
                          type="text"
                          value={formData.customHeader}
                          onChange={(e) => setFormData({ ...formData, customHeader: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Confidential - Internal Use Only"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Footer Text</label>
                        <input
                          type="text"
                          value={formData.customFooter}
                          onChange={(e) => setFormData({ ...formData, customFooter: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., © 2024 Your Company. All rights reserved."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Legal Disclaimer</label>
                        <textarea
                          value={formData.disclaimer}
                          onChange={(e) => setFormData({ ...formData, disclaimer: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          placeholder="Add any legal disclaimers or terms..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Report Sections */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Report Sections</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: "includeSummary", label: "Executive Summary" },
                        { key: "includeCharts", label: "Charts & Graphs" },
                        { key: "includeBreakdown", label: "Cost Breakdown" },
                        { key: "includeBenchmark", label: "Benchmark Comparison" },
                        { key: "includeScenarios", label: "Scenario Analysis" },
                        { key: "includeRecommendations", label: "Recommendations" },
                        { key: "includeAppendix", label: "Appendix" },
                      ].map((section) => (
                        <div key={section.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                          <input
                            type="checkbox"
                            id={section.key}
                            checked={formData[section.key as keyof typeof formData] === "true"}
                            onChange={(e) =>
                              setFormData({ ...formData, [section.key]: e.target.checked ? "true" : "false" })
                            }
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <label htmlFor={section.key} className="text-sm font-medium text-gray-700">
                            {section.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setActiveTab("list");
                        setSelectedTemplate(null);
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={activeTab === "create" ? handleCreate : handleEdit}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {activeTab === "create" ? "Create Template" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preview" && previewTemplate && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Template Preview</h3>
                <button
                  onClick={() => setActiveTab("list")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  Back to Templates
                </button>
              </div>

              {/* Preview Container */}
              <div
                className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {/* Header */}
                <div
                  className={`pb-6 mb-8 border-b-2`}
                  style={{ borderColor: previewTemplate.primaryColor }}
                >
                  <div
                    className={`flex items-center ${
                      previewTemplate.headerStyle === "centered"
                        ? "justify-center"
                        : previewTemplate.headerStyle === "split"
                        ? "justify-between"
                        : "justify-start"
                    }`}
                  >
                    {previewTemplate.logoUrl && (
                      <img src={previewTemplate.logoUrl} alt="Logo" className="h-16 w-auto object-contain" />
                    )}
                    <div className={previewTemplate.headerStyle === "split" ? "text-right" : ""}>
                      <h1
                        className={`font-bold ${
                          previewTemplate.fontSize === "large"
                            ? "text-3xl"
                            : previewTemplate.fontSize === "small"
                            ? "text-xl"
                            : "text-2xl"
                        }`}
                        style={{ color: previewTemplate.primaryColor }}
                      >
                        {previewTemplate.companyName || "Company Name"}
                      </h1>
                      <p className="text-gray-600 mt-2">Financial Analysis Report</p>
                    </div>
                  </div>
                  {previewTemplate.customHeader && (
                    <p className="text-sm text-gray-500 mt-4 text-center">{previewTemplate.customHeader}</p>
                  )}
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                  {previewTemplate.includeSummary === "true" && (
                    <section>
                      <h2
                        className="text-xl font-bold mb-4"
                        style={{ color: previewTemplate.secondaryColor }}
                      >
                        Executive Summary
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        This section would contain a high-level overview of the financial analysis, including key
                        findings, recommendations, and critical metrics that executive stakeholders need to know.
                      </p>
                    </section>
                  )}

                  {previewTemplate.includeCharts === "true" && (
                    <section>
                      <h2
                        className="text-xl font-bold mb-4"
                        style={{ color: previewTemplate.secondaryColor }}
                      >
                        Visual Analysis
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          className="h-48 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${previewTemplate.primaryColor}20` }}
                        >
                          <span className="text-gray-600">Chart Placeholder</span>
                        </div>
                        <div
                          className="h-48 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${previewTemplate.accentColor}20` }}
                        >
                          <span className="text-gray-600">Graph Placeholder</span>
                        </div>
                      </div>
                    </section>
                  )}

                  {previewTemplate.includeBreakdown === "true" && (
                    <section>
                      <h2
                        className="text-xl font-bold mb-4"
                        style={{ color: previewTemplate.secondaryColor }}
                      >
                        Cost Breakdown
                      </h2>
                      <div className="space-y-2">
                        {["Labor Costs", "Materials", "Overhead", "Marketing"].map((item, idx) => (
                          <div key={idx} className="flex justify-between p-3 bg-gray-50 rounded">
                            <span className="text-gray-700">{item}</span>
                            <span className="font-semibold" style={{ color: previewTemplate.primaryColor }}>
                              ${(Math.random() * 10000).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {previewTemplate.includeRecommendations === "true" && (
                    <section>
                      <h2
                        className="text-xl font-bold mb-4"
                        style={{ color: previewTemplate.secondaryColor }}
                      >
                        Recommendations
                      </h2>
                      <ul className="space-y-3">
                        {[1, 2, 3].map((num) => (
                          <li key={num} className="flex gap-3">
                            <span
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                              style={{ backgroundColor: previewTemplate.accentColor }}
                            >
                              {num}
                            </span>
                            <p className="text-gray-700">
                              Sample recommendation text that provides actionable insights based on the financial
                              analysis results.
                            </p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>

                {/* Footer */}
                {previewTemplate.showFooter === "true" && (
                  <div className="mt-12 pt-6 border-t border-gray-200">
                    {previewTemplate.customFooter && (
                      <p className="text-sm text-gray-600 text-center mb-2">{previewTemplate.customFooter}</p>
                    )}
                    {previewTemplate.showPageNumbers === "true" && (
                      <p className="text-sm text-gray-500 text-center">Page 1 of 1</p>
                    )}
                    {previewTemplate.disclaimer && (
                      <p className="text-xs text-gray-500 mt-4 leading-relaxed">{previewTemplate.disclaimer}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportTemplateBuilder;
