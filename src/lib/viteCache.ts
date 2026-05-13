// Vite cache and HMR management utility
// Helps track module state and cache invalidation

export interface ModuleCache {
  timestamp: number;
  imports: string[];
  exports: string[];
}

class ViteCacheManager {
  private cache: Map<string, ModuleCache> = new Map();
  private hmrCallbacks: Set<() => void> = new Set();

  registerModule(path: string, imports: string[], exports: string[]) {
    this.cache.set(path, {
      timestamp: Date.now(),
      imports,
      exports,
    });
  }

  invalidateModule(path: string) {
    this.cache.delete(path);
    this.notifyHMR();
  }

  invalidateByDependency(importPath: string) {
    const affected: string[] = [];
    this.cache.forEach((mod, path) => {
      if (mod.imports.includes(importPath)) {
        affected.push(path);
      }
    });
    affected.forEach(p => this.invalidateModule(p));
  }

  onHMRUpdate(callback: () => void) {
    this.hmrCallbacks.add(callback);
    return () => this.hmrCallbacks.delete(callback);
  }

  private notifyHMR() {
    this.hmrCallbacks.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('HMR callback error:', e);
      }
    });
  }

  clear() {
    this.cache.clear();
    this.hmrCallbacks.clear();
  }

  getStats() {
    return {
      modules: this.cache.size,
      callbacks: this.hmrCallbacks.size,
    };
  }
}

export const viteCacheManager = new ViteCacheManager();
