// Performance Monitoring System for Lift Metric
// Tracks page load times, interaction delays, and errors

export interface PerformanceMetric {
  id: string;
  timestamp: number;
  metricType: 'page_load' | 'interaction' | 'api_call' | 'render' | 'error';
  name: string;
  duration?: number;
  value?: number;
  metadata?: Record<string, any>;
  userAgent?: string;
  page?: string;
}

export interface PerformanceAlert {
  id: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  metric?: PerformanceMetric;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private thresholds = {
    pageLoad: 3000, // 3 seconds
    interaction: 100, // 100ms
    apiCall: 2000, // 2 seconds
    render: 16, // 16ms (60fps)
  };

  // Track page load performance
  trackPageLoad(pageName: string) {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        const firstPaint = this.getFirstPaint();

        this.recordMetric({
          metricType: 'page_load',
          name: pageName,
          duration: loadTime,
          metadata: {
            domContentLoaded,
            firstPaint,
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            ttfb: navigation.responseStart - navigation.requestStart,
          }
        });

        // Check if load time exceeds threshold
        if (loadTime > this.thresholds.pageLoad) {
          this.createAlert('high', 'Slow Page Load', 
            `Page ${pageName} took ${(loadTime / 1000).toFixed(2)}s to load`);
        }
      }
    });
  }

  // Track user interactions
  trackInteraction(name: string, startTime: number) {
    const duration = performance.now() - startTime;
    
    this.recordMetric({
      metricType: 'interaction',
      name,
      duration,
    });

    if (duration > this.thresholds.interaction) {
      this.createAlert('medium', 'Slow Interaction', 
        `Interaction "${name}" took ${duration.toFixed(2)}ms`);
    }
  }

  // Track API calls
  trackApiCall(endpoint: string, startTime: number, success: boolean, statusCode?: number) {
    const duration = performance.now() - startTime;
    
    this.recordMetric({
      metricType: 'api_call',
      name: endpoint,
      duration,
      metadata: {
        success,
        statusCode,
      }
    });

    if (duration > this.thresholds.apiCall) {
      this.createAlert('medium', 'Slow API Call', 
        `API call to ${endpoint} took ${(duration / 1000).toFixed(2)}s`);
    }

    if (!success) {
      this.createAlert('high', 'API Error', 
        `API call to ${endpoint} failed with status ${statusCode}`);
    }
  }

  // Track render performance
  trackRender(componentName: string, duration: number) {
    this.recordMetric({
      metricType: 'render',
      name: componentName,
      duration,
    });

    if (duration > this.thresholds.render) {
      this.createAlert('low', 'Slow Render', 
        `Component "${componentName}" took ${duration.toFixed(2)}ms to render`);
    }
  }

  // Track errors
  trackError(error: Error, context?: string) {
    this.recordMetric({
      metricType: 'error',
      name: error.name,
      metadata: {
        message: error.message,
        stack: error.stack,
        context,
      }
    });

    this.createAlert('critical', 'Client Error', 
      `${error.name}: ${error.message}${context ? ` (${context})` : ''}`);
  }

  // Record a metric
  private recordMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp' | 'userAgent' | 'page'>) {
    const fullMetric: PerformanceMetric = {
      id: this.generateId(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      page: window.location.pathname,
      ...metric,
    };

    this.metrics.push(fullMetric);
    this.saveToStorage();

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  // Create an alert
  private createAlert(severity: PerformanceAlert['severity'], type: string, message: string) {
    const alert: PerformanceAlert = {
      id: this.generateId(),
      timestamp: Date.now(),
      severity,
      type,
      message,
    };

    this.alerts.push(alert);
    console.warn(`[Performance Alert - ${severity}] ${type}: ${message}`);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  // Get first paint timing
  private getFirstPaint(): number | undefined {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstPaint?.startTime;
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Save to local storage
  private saveToStorage() {
    try {
      localStorage.setItem('lift_metric_performance', JSON.stringify({
        metrics: this.metrics,
        alerts: this.alerts,
      }));
    } catch (e) {
      console.error('Failed to save performance data', e);
    }
  }

  // Load from storage
  loadFromStorage() {
    try {
      const data = localStorage.getItem('lift_metric_performance');
      if (data) {
        const parsed = JSON.parse(data);
        this.metrics = parsed.metrics || [];
        this.alerts = parsed.alerts || [];
      }
    } catch (e) {
      console.error('Failed to load performance data', e);
    }
  }

  // Get all metrics
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Get metrics by type
  getMetricsByType(type: PerformanceMetric['metricType']): PerformanceMetric[] {
    return this.metrics.filter(m => m.metricType === type);
  }

  // Get all alerts
  getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  // Get alerts by severity
  getAlertsBySeverity(severity: PerformanceAlert['severity']): PerformanceAlert[] {
    return this.alerts.filter(a => a.severity === severity);
  }

  // Get performance statistics
  getStats() {
    const now = Date.now();
    const last24h = now - 24 * 60 * 60 * 1000;
    const recentMetrics = this.metrics.filter(m => m.timestamp > last24h);

    const pageLoads = recentMetrics.filter(m => m.metricType === 'page_load');
    const interactions = recentMetrics.filter(m => m.metricType === 'interaction');
    const apiCalls = recentMetrics.filter(m => m.metricType === 'api_call');
    const errors = recentMetrics.filter(m => m.metricType === 'error');

    return {
      totalMetrics: recentMetrics.length,
      avgPageLoad: this.calculateAverage(pageLoads.map(m => m.duration || 0)),
      avgInteraction: this.calculateAverage(interactions.map(m => m.duration || 0)),
      avgApiCall: this.calculateAverage(apiCalls.map(m => m.duration || 0)),
      errorCount: errors.length,
      alertCount: this.alerts.filter(a => a.timestamp > last24h).length,
      criticalAlerts: this.alerts.filter(a => a.timestamp > last24h && a.severity === 'critical').length,
    };
  }

  // Get bottlenecks
  getBottlenecks() {
    const bottlenecks: Array<{
      type: string;
      name: string;
      avgDuration: number;
      count: number;
      severity: 'low' | 'medium' | 'high';
    }> = [];

    // Group metrics by name
    const grouped = new Map<string, PerformanceMetric[]>();
    this.metrics.forEach(metric => {
      const key = `${metric.metricType}-${metric.name}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(metric);
    });

    // Find slow operations
    grouped.forEach((metrics, key) => {
      const durations = metrics.map(m => m.duration || 0).filter(d => d > 0);
      if (durations.length === 0) return;

      const avgDuration = this.calculateAverage(durations);
      const type = metrics[0].metricType;
      const name = metrics[0].name;

      let threshold = 0;
      let severity: 'low' | 'medium' | 'high' = 'low';

      switch (type) {
        case 'page_load':
          threshold = this.thresholds.pageLoad;
          severity = avgDuration > threshold * 1.5 ? 'high' : avgDuration > threshold ? 'medium' : 'low';
          break;
        case 'interaction':
          threshold = this.thresholds.interaction;
          severity = avgDuration > threshold * 2 ? 'high' : avgDuration > threshold ? 'medium' : 'low';
          break;
        case 'api_call':
          threshold = this.thresholds.apiCall;
          severity = avgDuration > threshold * 1.5 ? 'high' : avgDuration > threshold ? 'medium' : 'low';
          break;
      }

      if (avgDuration > threshold) {
        bottlenecks.push({
          type,
          name,
          avgDuration,
          count: metrics.length,
          severity,
        });
      }
    });

    return bottlenecks.sort((a, b) => b.avgDuration - a.avgDuration);
  }

  // Calculate average
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  // Clear old data
  clearOldData(daysToKeep = 7) {
    const cutoff = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
    this.alerts = this.alerts.filter(a => a.timestamp > cutoff);
    this.saveToStorage();
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize on load
if (typeof window !== 'undefined') {
  performanceMonitor.loadFromStorage();
  
  // Track global errors
  window.addEventListener('error', (event) => {
    performanceMonitor.trackError(event.error || new Error(event.message), 'Global error handler');
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    performanceMonitor.trackError(
      new Error(event.reason?.message || 'Unhandled promise rejection'),
      'Promise rejection'
    );
  });

  // Clean up old data periodically
  setInterval(() => {
    performanceMonitor.clearOldData(7);
  }, 24 * 60 * 60 * 1000); // Daily cleanup
}
