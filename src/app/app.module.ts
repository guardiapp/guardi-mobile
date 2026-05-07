import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ROOT_REDUCERS } from './state/app.state';
import { ReservationEffects } from './state/effects/reservation.effects';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthEffects } from './state/effects/auth.effects';
import { VisitorEffects } from './state/effects/visitor.effects';
import { metaReducers } from './state/reducers/meta.reducer';
import { tokenInterceptor } from './shared/interceptors/token.interceptor';
import { headersInterceptor } from './shared/interceptors/headers.interceptor';
import { UserEffects } from './state/effects/user.effects';
import { QRCodeModule } from 'angularx-qrcode';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    QRCodeModule,
    AppRoutingModule,
    StoreModule.forRoot(ROOT_REDUCERS, { metaReducers }),
    EffectsModule.forRoot([
      AuthEffects,
      UserEffects,
      ReservationEffects,
      VisitorEffects,
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    FontAwesomeModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(withInterceptors([tokenInterceptor, headersInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
