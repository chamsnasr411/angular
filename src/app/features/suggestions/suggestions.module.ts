import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SuggestionsRoutingModule } from './suggestions-routing.module';
import { SuggestionListComponent } from './suggestion-list/suggestion-list.component';
import { SuggestionDetailsComponent } from './suggestion-details/suggestion-details.component';

@NgModule({
  declarations: [
    SuggestionListComponent,
    SuggestionDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,          // ✅ OBLIGATOIRE pour ngModel
    SuggestionsRoutingModule
  ]
})
export class SuggestionsModule {}
