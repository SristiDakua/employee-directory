// Performance monitoring utility for the employee directory app

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, any[]> = new Map()
  private requestCounts: Map<string, number> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Track timing for operations
  startTimer(operation: string): () => void {
    const start = performance.now()
    
    return () => {
      const duration = performance.now() - start
      this.addMetric(operation, { duration, timestamp: Date.now() })
    }
  }

  // Add a metric
  addMetric(operation: string, data: any) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, [])
    }
    
    const metrics = this.metrics.get(operation)!
    metrics.push(data)
    
    // Keep only last 100 entries to prevent memory leaks
    if (metrics.length > 100) {
      metrics.shift()
    }
  }

  // Track request counts
  incrementRequestCount(endpoint: string) {
    const count = this.requestCounts.get(endpoint) || 0
    this.requestCounts.set(endpoint, count + 1)
  }

  // Get performance statistics
  getStats() {
    const stats: any = {
      requestCounts: Object.fromEntries(this.requestCounts),
      operations: {}
    }

    for (const [operation, metrics] of this.metrics.entries()) {
      if (metrics.length > 0) {
        const durations = metrics.map(m => m.duration).filter(d => d !== undefined)
        
        stats.operations[operation] = {
          count: metrics.length,
          avgDuration: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
          maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
          minDuration: durations.length > 0 ? Math.min(...durations) : 0,
          lastExecuted: Math.max(...metrics.map(m => m.timestamp))
        }
      }
    }

    return stats
  }

  // Log performance summary
  logSummary() {
    const stats = this.getStats()
    console.log('📊 Performance Summary:')
    console.log('Request Counts:', stats.requestCounts)
    
    for (const [operation, data] of Object.entries(stats.operations)) {
      const opData = data as any
      console.log(`${operation}: avg ${opData.avgDuration.toFixed(2)}ms, count ${opData.count}`)
    }
  }

  // Reset metrics
  reset() {
    this.metrics.clear()
    this.requestCounts.clear()
  }
}

// Middleware to track GraphQL performance
export function withPerformanceTracking(resolver: Function, operationName: string) {
  return async (...args: any[]) => {
    const monitor = PerformanceMonitor.getInstance()
    const endTimer = monitor.startTimer(operationName)
    monitor.incrementRequestCount(operationName)
    
    try {
      const result = await resolver(...args)
      endTimer()
      return result
    } catch (error: any) {
      endTimer()
      monitor.addMetric(`${operationName}_error`, { timestamp: Date.now(), error: error?.message || 'Unknown error' })
      throw error
    }
  }
}

// Helper to log slow operations
export function logSlowOperation(operation: string, duration: number, threshold: number = 1000) {
  if (duration > threshold) {
    console.warn(`⚠️ Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`)
  }
}
