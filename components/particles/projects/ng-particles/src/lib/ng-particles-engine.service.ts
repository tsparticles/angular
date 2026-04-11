import { Injectable } from "@angular/core";
import type { Engine } from "@tsparticles/engine";
import { tsParticles } from "@tsparticles/engine";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NgParticlesEngineService {
  private engine: Engine | undefined;
  private initPromise: Promise<void> | undefined;
  private initialized$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<Error | undefined>(undefined);

  /**
   * Observable that emits true when the engine is ready.
   */
  getInstallationStatus(): Observable<boolean> {
    return this.initialized$.asObservable();
  }

  /**
   * Observable that emits any initialization error.
   */
  getInitializationError(): Observable<Error | undefined> {
    return this.error$.asObservable();
  }

  /**
   * Initialize the engine once per application.
   * Subsequent calls will return the same promise (cached).
   */
  async init(particlesInit: (engine: Engine) => Promise<void> | void): Promise<Engine> {
    // Already initialized, return cached engine
    if (this.engine) {
      return this.engine;
    }

    // Initialization in progress, wait for it
    if (this.initPromise) {
      await this.initPromise;

      if (this.engine) {
        return this.engine;
      }
    }

    // Start initialization
    this.initPromise = (async () => {
      try {
        await particlesInit(tsParticles);

        this.engine = tsParticles;
        this.initialized$.next(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        this.error$.next(error);
        console.error("Failed to initialize particles engine:", error);
        throw error;
      }
    })();

    await this.initPromise;

    if (!this.engine) {
      throw new Error("Engine initialization failed but no error was captured");
    }

    return this.engine;
  }

  /**
   * Get the initialized engine (throws if not initialized).
   */
  getEngine(): Engine {
    if (!this.engine) {
      throw new Error(
        "Engine not initialized. Call init() first or use NgParticlesEngineService.init() in app initialization.",
      );
    }

    return this.engine;
  }

  /**
   * Check if engine is ready synchronously.
   */
  isReady(): boolean {
    return this.initialized$.value;
  }
}
