import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { MetricsService } from "src/endpoints/metrics/metrics.service";
import { PerformanceProfiler } from "./utils/performance.profiler";

@Injectable()
export class ApiService {
  private readonly logger: Logger

  constructor(
    private readonly metricsService: MetricsService
  ) {
    this.logger = new Logger(ApiService.name);
  }

  async get(url: string): Promise<any> {
    let profiler = new PerformanceProfiler();
    
    try {
      return await axios.get(url);
    } catch(error: any) {
      this.logger.error({
        method: 'GET',
        path: url,
        response: error.response.data,
        status: error.response.status,
      });

      throw error;
    } finally {
      profiler.stop();
      this.metricsService.setExternalCall(this.getHostname(url), profiler.duration);
    }
  }

  async post(url: string, data: any): Promise<any> {
    let profiler = new PerformanceProfiler();
    try {

      let result = await axios.post(url, data);

      return result.data;
    } catch(error: any) {
      this.logger.error({
        method: 'POST',
        url,
        response: error.response.data,
        status: error.response.status,
      });

      throw error;
    } finally {
      profiler.stop();
      this.metricsService.setExternalCall(this.getHostname(url), profiler.duration);
    }
  }

  async head(url: string): Promise<any> {
    let profiler = new PerformanceProfiler();

    try {
      return await axios.head(url);
    } catch(error: any) {
      this.logger.error({
        method: 'HEAD',
        url,
        response: error.response?.data,
        status: error.response?.status,
      });

      throw error;
    } finally {
      profiler.stop();
      this.metricsService.setExternalCall(this.getHostname(url), profiler.duration);
    }
  }

  private getHostname(url: string): string {
    return new URL(url).hostname;
  }
}