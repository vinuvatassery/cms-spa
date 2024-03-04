//ref: https://damienbod.com/2017/10/16/securing-an-angular-signalr-client-using-jwt-tokens-with-asp-net-core-and-identityserver4/
//ref: https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-6.0&tabs=visual-studio
//ref: https://docs.microsoft.com/en-us/javascript/api/@microsoft/signalr/?view=signalr-js-latest

/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import * as signalR from '@microsoft/signalr';
import { lastValueFrom } from 'rxjs';
/** Internal libraries **/
import {
  HubNames,
  HubMethods,
  ConfigurationProvider,
} from '@cms/shared/util-core';
import { OidcSecurityService } from '@cms/shared/util-oidc';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  /** Private properties **/
  private authenticated!: boolean;
  //private hubConnection!: signalR.HubConnection;
  private signalrEventSubject = new BehaviorSubject<any>(null);
  private hubConnections: Map<string, signalR.HubConnection> = new Map();

  /** Public properties **/
  signalrEvents$ = this.signalrEventSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly oidcSecurityService: OidcSecurityService,
    private readonly configurationProvider: ConfigurationProvider
  ) {
    this.initialize();
  }

  /** Private methods **/
  private notify(methodName: string, payload: any) {
    this.signalrEventSubject.next({
      methodName: methodName,
      payload: payload,
    });
    console.log({
      source: 'SignalR',
      date: new Date().toLocaleString(),
      methodName: methodName,
      payload: payload,
    });
  }

  private initialize() {
    this.oidcSecurityService.isAuthenticated$.subscribe({
      next: ({ isAuthenticated }) => {
        this.authenticated = isAuthenticated;
      },
      error: (err) => {
        console.error('err', err);
      },
    });
    if (this.authenticated) {
      // Connect to notification hub.
      this.startConnection(HubNames.NotificationHub);
      // Connect to other hub...
    }
    this.notify('authenticated', this.authenticated);
  }

  private startConnection(hubName: HubNames) {
    if (this.authenticated && !this.hubConnections.has(hubName)) {
      const signalrHubUrl =
        this.configurationProvider.appSettings.signalrHubUrl + '/' + hubName;
      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(signalrHubUrl, {
          accessTokenFactory: () =>
            lastValueFrom(this.oidcSecurityService.getAccessToken()),
        })
        .withUrl(signalrHubUrl)
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            this.notify('AutoReconnect', retryContext.elapsedMilliseconds);
            const crypto = window.crypto;
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            const randomNum = array[0];
            return randomNum * 10000;

            /*
          NOSONAR
          if (retryContext.elapsedMilliseconds < 60000) {                                       
            // If we've been reconnecting for less than 60 seconds so far,
            // wait between 0 and 10 seconds before the next reconnect attempt.
            return Math.random() * 10000;
          } else {
            // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
            // return null;
            return Math.random() * 10000; //TODO: reconnecting indefinitely?
          }
          */
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      hubConnection.onreconnecting((error) => {
        this.notify(
          signalR.HubConnectionState.Reconnecting,
          'signalr connection lost due to error, ' + error
        );
      });

      hubConnection.onreconnected((connectionId) => {
        this.notify(
          signalR.HubConnectionState.Connected,
          'signalr reconnected with connectionId, ' + connectionId
        );
      });

      hubConnection.onclose((error) => {
        this.notify(
          signalR.HubConnectionState.Disconnected,
          'signalr connection closed due to error, ' + error
        );
      });

      // Register ping message handler.
      hubConnection.on(HubMethods.Ping, (payload) => {
        // Echo ping message.
        hubConnection.send(HubMethods.Ping, payload);
        this.notify(
          HubMethods.Ping,
          'signalr ping with payload, ' + payload
        );
      });

      hubConnection
        .start()
        .then(() => {
          this.notify(
            signalR.HubConnectionState.Connected,
            'signalr connected with hub, ' + hubName
          );
        })
        .catch((error) => {
          this.notify(
            signalR.HubConnectionState.Disconnected,
            'signalr connection closed due to error, ' + error
          );

          setTimeout(() => this.startConnection(hubName), 10000); // withAutomaticReconnect won't configure the HubConnection to retry initial start failures, so start failures handled manually and it triggers fro 10s of failure
        });

      // Add hub connection to the collection.
      this.hubConnections.set(hubName, hubConnection);
    }
  }

  /** Public methods **/
  registerHubMethodHandlers(hubName: HubNames, hubMethods: HubMethods[]) {
    if (this.authenticated) {
      // Get hub connection from the collection.
      const hubConnection = this.hubConnections.get(hubName);

      // Register handler(s) to be called when a hub method
      // with the specified method name is invoked.
      if (hubConnection != null) {
        hubMethods.forEach((methodName) => {
          hubConnection.on(methodName, (payload: any) => {
            this.notify(methodName, payload);
          });
        });
      }
    }
  }

  public getHubConnection(hubName: HubNames) {
    // Returns the connection associated
    // with the specified hub name.
    return this.hubConnections.get(hubName);
  }
}
