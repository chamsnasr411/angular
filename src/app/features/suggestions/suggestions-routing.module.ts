import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuggestionListComponent } from './suggestion-list/suggestion-list.component';
import { SuggestionFormComponent } from './suggestion-form/suggestion-form.component';
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';

 const routes: Routes = [
  { path: '', component: SuggestionListComponent, pathMatch: 'full' },

  { path: 'new', component: SuggestionFormComponent },

  { path: 'details/:id', component: SuggestionDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuggestionsRoutingModule {}