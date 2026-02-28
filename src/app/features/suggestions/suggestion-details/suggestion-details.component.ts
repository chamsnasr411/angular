import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SuggestionService } from '../../../core/services/suggestion.service';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html'
})
export class SuggestionDetailsComponent implements OnInit {
  suggestion?: Suggestion;

  constructor(private route: ActivatedRoute, private service: SuggestionService) {}
ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    console.log('DETAIL route idParam=', idParam, '=> id=', id);

    if (!idParam || Number.isNaN(id)) {
      console.error('Invalid id param');
      return;
    }

   this.service.getSuggestionById(id).subscribe({
 next: (data) => {
  this.suggestion = data;  // maintenant data est bien Suggestion
},
  error: (err) => {
    console.error('GET by id error FULL =', err);
  }
  
});}

}