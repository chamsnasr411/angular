import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suggestion } from '../../models/suggestion';
import { map } from 'rxjs/operators'; // ajoute cet import

@Injectable({ providedIn: 'root' })
export class SuggestionService {
  private readonly suggestionUrl = 'http://localhost:3000/suggestions';

  constructor(private http: HttpClient) {}
// ✅ Alias compatible avec ton ListComponent
getSuggestionsFromApi(): Observable<Suggestion[]> {
  return this.http.get<Suggestion[]>(this.suggestionUrl);
}

 
getSuggestionById(id: number): Observable<Suggestion> {
  return this.http.get<any>(`${this.suggestionUrl}/${id}`).pipe(
    map(res => res?.suggestion ?? res) // ✅ si wrapper, prend res.suggestion, sinon res direct
  );
}

  deleteSuggestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.suggestionUrl}/${id}`);
  }

  addSuggestion(payload: Omit<Suggestion, 'id'>): Observable<Suggestion> {
    return this.http.post<Suggestion>(this.suggestionUrl, payload);
  }

  updateSuggestion(id: number, payload: Omit<Suggestion, 'id'>): Observable<Suggestion> {
    return this.http.put<Suggestion>(`${this.suggestionUrl}/${id}`, payload);
  }

 likeSuggestion(s: Suggestion): Observable<Suggestion> {
  const payload: Omit<Suggestion, 'id'> = {
    suggestion: s.suggestion,          // ✅ AJOUTÉ (obligatoire dans ton modèle)
    title: s.title,
    description: s.description,
    category: s.category,
    date: s.date,                      // garde Date si ton modèle est Date
    status: s.status,
    nbLikes: (s.nbLikes ?? 0) + 1
  };

  return this.http.put<Suggestion>(`${this.suggestionUrl}/${s.id}`, payload);
}
}