import { Component, OnInit } from '@angular/core';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrls: ['./suggestion-list.component.css']
})
export class SuggestionListComponent implements OnInit {
  searchText = '';
  favorites: Suggestion[] = [];
  suggestions: Suggestion[] = [];

  constructor(private service: SuggestionService) {}

 ngOnInit(): void {
  this.service.getSuggestionsFromApi().subscribe({
    next: (data: Suggestion[]) => (this.suggestions = data),
    error: (err) => console.error(err)
  });

}
  loadFromApi(): void {
    this.service.getSuggestionsFromApi().subscribe({
      next: (data) => (this.suggestions = data),
      error: (err) => console.error('GET all error', err)
    });
  }

  likeSuggestion(s: Suggestion): void {
    if (!this.canInteract(s)) return;

    this.service.likeSuggestion(s).subscribe({
      next: (updated) => (s.nbLikes = updated.nbLikes),
      error: (err) => console.error('LIKE error', err)
    });
  }

  deleteSuggestion(id: number): void {
    this.service.deleteSuggestion(id).subscribe({
      next: () => this.loadFromApi(),
      error: (err) => console.error('DELETE error', err)
    });
  }

  addToFavorites(s: Suggestion): void {
    if (!this.favorites.some(f => f.id === s.id)) this.favorites.push(s);
  }

  matchesSearch(s: Suggestion): boolean {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return true;
    return (s.title ?? '').toLowerCase().includes(q) || (s.category ?? '').toLowerCase().includes(q);
  }

  canInteract(s: Suggestion): boolean {
    return s.status !== 'refusee';
  }
}