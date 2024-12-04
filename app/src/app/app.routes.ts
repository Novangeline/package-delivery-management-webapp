import { Routes } from '@angular/router';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { ListDriversComponent } from './list-drivers/list-drivers.component';
import { DeleteDriverComponent } from './delete-driver/delete-driver.component';
import { UpdateDriverComponent } from './update-driver/update-driver.component';
import { AddPackageComponent } from './add-package/add-package.component';
import { ListPackagesComponent } from './list-packages/list-packages.component';
import { DeletePackageComponent } from './delete-package/delete-package.component';
import { UpdatePackageComponent } from './update-package/update-package.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InvalidDataComponent } from './invalid-data/invalid-data.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TranslateComponent } from './translate/translate.component';
import { TextToSpeechComponent } from './text-to-speech/text-to-speech.component';
import { GenerativeAiComponent } from './generative-ai/generative-ai.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    {path: '', component: DashboardComponent, canActivate: [AuthenticationGuard]},
    {path: 'add-driver', component: AddDriverComponent, canActivate: [AuthenticationGuard]},
    {path: 'list-drivers', component: ListDriversComponent, canActivate: [AuthenticationGuard]},
    {path: 'delete-driver', component: DeleteDriverComponent, canActivate: [AuthenticationGuard]},
    {path: 'update-driver', component: UpdateDriverComponent, canActivate: [AuthenticationGuard]},
    {path: 'add-package', component: AddPackageComponent, canActivate: [AuthenticationGuard]},
    {path: 'list-packages', component: ListPackagesComponent, canActivate: [AuthenticationGuard]},
    {path: 'delete-package', component: DeletePackageComponent, canActivate: [AuthenticationGuard]},
    {path: 'update-package', component: UpdatePackageComponent, canActivate: [AuthenticationGuard]},
    {path: 'statistics', component: StatisticsComponent, canActivate: [AuthenticationGuard]},
    {path: 'translate', component: TranslateComponent, canActivate: [AuthenticationGuard]},
    {path: 'text-to-speech', component: TextToSpeechComponent, canActivate: [AuthenticationGuard]},
    {path: 'generative-ai', component: GenerativeAiComponent, canActivate: [AuthenticationGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'invalid-data', component: InvalidDataComponent},
    {path: '**', component: PageNotFoundComponent, canActivate: [AuthenticationGuard]}
];
