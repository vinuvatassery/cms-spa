import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '../providers/configuration.provider';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  appInsights: ApplicationInsights;
  constructor(private readonly configurationProvider: ConfigurationProvider) {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey:
          this.configurationProvider.appSettings.instrumentationKey,
        enableAutoRouteTracking: false, // option to log all route changes
      },
    });
    this.appInsights.loadAppInsights();
  }

  logPageView(name?: string, url?: string) {
    // option to call manually
    this.appInsights.trackPageView({
      name: name,
      uri: url,
    });
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    this.appInsights.trackEvent({ name: name }, properties);
  }

  logMetric(
    name: string,
    average: number,
    properties?: { [key: string]: any }
  ) {
    this.appInsights.trackMetric({ name: name, average: average }, properties);
  }

  logException(exception: Error, severityLevel?: number) {
    this.appInsights.trackException({
      exception: exception,
      severityLevel: severityLevel,
    });
  }

  logTrace(message: string, properties?: { [key: string]: any }) {
    this.appInsights.trackTrace({ message: message }, properties);
  }
}
