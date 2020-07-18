import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";

export const userRole = 'USER';
export const adminRole = 'ADMIN';
export const mentorRole = 'MENTOR';

const appRoutes: Routes = [
  {path: '', redirectTo: 'candidates', pathMatch: 'full'},
  {path: 'candidates', loadChildren: () => import('./candidates/candidates.module').then(m => m.CandidatesModule)},
  {path: 'courses', loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule)},
  {path: 'mentors', loadChildren: () => import('./mentor/mentor.module').then(m => m.MentorModule)},
  {path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
  // {path: '**', redirectTo: 'candidates'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
