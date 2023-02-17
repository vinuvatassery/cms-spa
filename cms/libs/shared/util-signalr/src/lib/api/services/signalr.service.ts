//ref: https://damienbod.com/2017/10/16/securing-an-angular-signalr-client-using-jwt-tokens-with-asp-net-core-and-identityserver4/
//ref: https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client?view=aspnetcore-6.0&tabs=visual-studio
//ref: https://docs.microsoft.com/en-us/javascript/api/@microsoft/signalr/?view=signalr-js-latest

/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Enums **/
import { HubMethodTypes } from '@cms/shared/util-core';
/** Providers **/
import { ConfigurationProvider } from '@cms/shared/util-core';
/** Services **/
import { OidcSecurityService } from '@cms/shared/util-oidc';
/** rxjs **/
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  /** Private properties **/
  private authenticated!: boolean;
  private hubConnection!: signalR.HubConnection;
  private signalrNotificationsSubject = new BehaviorSubject<any>(null);

  /** Public properties **/
  signalrNotifications$ = this.signalrNotificationsSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly oidcSecurityService: OidcSecurityService,
    private readonly configurationProvider: ConfigurationProvider
  ) {
    //this.initialize();
  }

  /** Private methods **/
  private notify(type: any, data: any) {
    this.signalrNotificationsSubject.next({ type: type, payload: data });
    console.log({
      source: 'SignalR',
      date: new Date().toLocaleString(),
      type: type,
      payload: data,
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
      this.startConnection();
    }
    this.notify('authenticated', this.authenticated);
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.configurationProvider.appSettings.signalrHubUrl, {
        accessTokenFactory: () => lastValueFrom(this.oidcSecurityService.getAccessToken())
      })
      //.withUrl(this.configurationProvider.appSettings.signalrHubUrl)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          this.notify('AutoReconnect', retryContext.elapsedMilliseconds);
          const crypto = window.crypto;
          var array = new Uint32Array(1);
          crypto.getRandomValues(array); 
          const randomNum = array[0];
          return randomNum * 10000;

          // if (retryContext.elapsedMilliseconds < 60000) {
          //   // If we've been reconnecting for less than 60 seconds so far,
          //   // wait between 0 and 10 seconds before the next reconnect attempt.
          //   return Math.random() * 10000;
          // } else {
          //   // If we've been reconnecting for more than 60 seconds so far, stop reconnecting.
          //   // return null;
          //   return Math.random() * 10000; //TODO: reconnecting indefinitely?
          // }
        },
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.onreconnecting((error) => {
      this.notify(
        signalR.HubConnectionState.Reconnecting,
        'signalr connection lost due to error, ' + error
      );
    });

    this.hubConnection.onreconnected((connectionId) => {
      this.notify(
        signalR.HubConnectionState.Connected,
        'signalr reconnected with connectionId, ' + connectionId
      );
    });

    this.hubConnection.onclose((error) => {
      this.notify(
        signalR.HubConnectionState.Disconnected,
        'signalr connection closed due to error, ' + error
      );
    });

    this.hubConnection
      .start()
      .then(() => {
        this.notify(
          signalR.HubConnectionState.Connected,
          'signalr connection with connectionId'
        );
      })
      .catch((error) => {
        this.notify(
          signalR.HubConnectionState.Disconnected,
          'signalr connection closed due to error, ' + error
        );

        setTimeout(() => this.startConnection(), 10000); // withAutomaticReconnect won't configure the HubConnection to retry initial start failures, so start failures handled manually and it triggers fro 10s of failure
      });
  }

  /** Public methods **/
  registerCustomEvents(eventName: HubMethodTypes) {
    if (this.authenticated) {
      this.hubConnection.on(eventName, (data: any) => {
        this.notify(eventName, data);
      });
    }
  }
}
