import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule, ScreenTrackingService } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';

import { Request } from '@utils/request';
import { AuthService } from '@core/auth.service';
import { AuthGuard } from '@core/auth.guard';
import { environment } from '@environment';
import { ThemeService } from '@services/theme/theme.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    HttpClientModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
    ThemeService,
    Request,
    ScreenTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
