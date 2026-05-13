import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RotateCcw, TrendingDown, TrendingUp, Clock, Shield, Zap, Award } from 'lucide-react';
import { CalculatorResults, StaffingOption } from '../App';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface ComparisonViewProps {
  results: CalculatorResults;
  onReset: () => void;
}

export default function ComparisonView({ results, onReset }: ComparisonViewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700 border-green-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      high: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[risk as keyof typeof colors] || colors.medium;
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const recommendedOption = [...results.staffingOptions].sort((a, b) => 
    a.yearThreeTotal - b.yearThreeTotal
  )[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Staffing Options Comparison</h2>
          <p className="text-gray-600 mt-1">
            Detailed side-by-side analysis of all implementation approaches
          </p>
        </div>
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          New Analysis
        </Button>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.staffingOptions.map((option) => {
          const isRecommended = option.type === recommendedOption.type;
          
          return (
            <Card
              key={option.type}
              className={`relative transition-all duration-300 hover:shadow-xl ${
                isRecommended 
                  ? 'border-2 border-green-400 shadow-lg bg-gradient-to-br from-green-50 to-white' 
                  : 'border border-gray-200 hover:border-blue-300'
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-600 text-white px-4 py-1">
                    Recommended
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{option.label}</CardTitle>
                <CardDescription className="text-xs">
                  {option.type === 'direct-hire' && 'Build internal team capacity'}
                  {option.type === 'contractors' && 'Flexible on-demand workforce'}
                  {option.type === 'outsource' && 'Full-service external partner'}
                  {option.type === 'hybrid' && 'Best of both worlds approach'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Cost Summary */}
                <div className="space-y-2">
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-gray-600 mb-1">Year 1 Total</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(option.yearOneTotal)}
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <div className="text-xs text-gray-600 mb-1">3-Year Total</div>
                    <div className="text-xl font-bold text-indigo-600">
                      {formatCurrency(option.yearThreeTotal)}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs text-gray-600 mb-1">Monthly Ongoing</div>
                    <div className="text-lg font-bold text-purple-600">
                      {formatCurrency(option.ongoingMonthly)}
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                    <div className="text-xs text-gray-600">Setup</div>
                    <div className="text-sm font-semibold">{option.setupTime}d</div>
                  </div>
                  
                  <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                    <Shield className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                    <div className="text-xs text-gray-600">Risk</div>
                    <Badge variant="outline" className={`text-xs ${getRiskBadge(option.riskLevel)}`}>
                      {option.riskLevel}
                    </Badge>
                  </div>
                  
                  <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                    <Zap className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                    <div className="text-xs text-gray-600">Flexibility</div>
                    <div className={`text-sm font-semibold ${getScoreColor(option.flexibilityScore)}`}>
                      {option.flexibilityScore}/10
                    </div>
                  </div>
                  
                  <div className="text-center p-2 bg-gray-50 rounded border border-gray-200">
                    <Award className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                    <div className="text-xs text-gray-600">Quality</div>
                    <div className={`text-sm font-semibold ${getScoreColor(option.qualityScore)}`}>
                      {option.qualityScore}/10
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Cost Breakdown Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detailed Cost Breakdown</CardTitle>
          <CardDescription>
            Line-by-line comparison of all cost components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Cost Component</TableHead>
                  {results.staffingOptions.map((option) => (
                    <TableHead key={option.type} className="text-right">
                      {option.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Recruitment Costs */}
                <TableRow>
                  <TableCell className="font-medium">Recruitment</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {option.breakdown.recruitment 
                        ? formatCurrency(option.breakdown.recruitment)
                        : '—'}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Salaries */}
                <TableRow>
                  <TableCell className="font-medium">Salaries</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {option.breakdown.salaries 
                        ? formatCurrency(option.breakdown.salaries)
                        : '—'}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Benefits */}
                <TableRow>
                  <TableCell className="font-medium">Benefits</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {option.breakdown.benefits 
                        ? formatCurrency(option.breakdown.benefits)
                        : '—'}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Overhead */}
                <TableRow>
                  <TableCell className="font-medium">Overhead</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {option.breakdown.overhead 
                        ? formatCurrency(option.breakdown.overhead)
                        : '—'}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Training */}
                <TableRow>
                  <TableCell className="font-medium">Training</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {option.breakdown.training 
                        ? formatCurrency(option.breakdown.training)
                        : '—'}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Contractor Rates */}
                <TableRow>
                  <TableCell className="font-medium">Contractor Rates</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {option.breakdown.contractorRates 
                        ? formatCurrency(option.breakdown.contractorRates)
                        : '—'}
                    </TableCell>
                  ))}
                </TableRow>



                {/* Service Fees */}
                <TableRow>
                  <TableCell className="font-medium">Service Fees</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {option.breakdown.serviceFees 
                        ? formatCurrency(option.breakdown.serviceFees)
                        : '—'}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Management Fees */}
                <TableRow>
                  <TableCell className="font-medium">Management Fees</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {option.breakdown.managementFees 
                        ? formatCurrency(option.breakdown.managementFees)
                        : '—'}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Tooling */}
                <TableRow>
                  <TableCell className="font-medium">Tooling</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {option.breakdown.tooling 
                        ? formatCurrency(option.breakdown.tooling)
                        : '—'}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Year 1 Total */}
                <TableRow className="bg-blue-50 font-bold">
                  <TableCell>Year 1 Total</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {formatCurrency(option.yearOneTotal)}
                    </TableCell>
                  ))}
                </TableRow>

                {/* 3-Year Total */}
                <TableRow className="bg-indigo-50 font-bold">
                  <TableCell>3-Year Total</TableCell>
                  {results.staffingOptions.map((option) => (
                    <TableCell key={option.type} className="text-right">
                      {formatCurrency(option.yearThreeTotal)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pros and Cons */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.staffingOptions.map((option) => (
          <Card key={option.type} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{option.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-sm">Advantages</span>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  {option.type === 'direct-hire' && (
                    <>
                      <li>• Full control over team</li>
                      <li>• Long-term stability</li>
                      <li>• Deep domain knowledge</li>
                      <li>• Cultural alignment</li>
                    </>
                  )}
                  {option.type === 'contractors' && (
                    <>
                      <li>• Quick to scale up/down</li>
                      <li>• Specialized expertise</li>
                      <li>• Fast deployment</li>
                      <li>• No long-term commitment</li>
                    </>
                  )}
                  {option.type === 'outsource' && (
                    <>
                      <li>• Turnkey solution</li>
                      <li>• Proven processes</li>
                      <li>• Lower risk</li>
                      <li>• Focus on core business</li>
                    </>
                  )}
                  {option.type === 'hybrid' && (
                    <>
                      <li>• Balanced approach</li>
                      <li>• Flexibility + stability</li>
                      <li>• Risk mitigation</li>
                      <li>• Optimized costs</li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-sm">Considerations</span>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  {option.type === 'direct-hire' && (
                    <>
                      <li>• Longer setup time</li>
                      <li>• Higher fixed costs</li>
                      <li>• Recruitment overhead</li>
                      <li>• Less flexibility</li>
                    </>
                  )}
                  {option.type === 'contractors' && (
                    <>
                      <li>• Higher hourly rates</li>
                      <li>• Less team cohesion</li>
                      <li>• Knowledge retention</li>
                      <li>• Management overhead</li>
                    </>
                  )}
                  {option.type === 'outsource' && (
                    <>
                      <li>• Less direct control</li>
                      <li>• Vendor dependency</li>
                      <li>• Communication gaps</li>
                      <li>• Contract negotiations</li>
                    </>
                  )}
                  {option.type === 'hybrid' && (
                    <>
                      <li>• Complex management</li>
                      <li>• Coordination overhead</li>
                      <li>• Mixed team dynamics</li>
                      <li>• Requires experience</li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
