import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html'
})
export class SuggestionDetailsComponent implements OnInit {

  suggestion?: Suggestion;

  suggestions: Suggestion[] = [
    { id: 1, title: 'Organiser une journée team building', description: '...', category: 'Activités et événements', date: new Date(), status: 'acceptee', nbLikes: 10 },
    { id: 2, title: 'Améliorer le système de réservation', description: '...', category: 'Technologie et services numériques', date: new Date(), status: 'refusee', nbLikes: 0 }
  ];

 constructor(private route: ActivatedRoute, private router: Router) {
  console.log('❌ DETAILS LOADED');
}

ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');

  const id = Number(idParam);
  if (!idParam || Number.isNaN(id)) {
    // ✅ si quelqu’un arrive ici avec /new => on redirige vers le form
    this.router.navigate(['/suggestions/new']);
    return;
  }

  this.suggestion = this.suggestions.find(s => s.id === id);
}
}