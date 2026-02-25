import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  suggestionForm!: FormGroup;

  categories: string[] = [
    'Infrastructure et bâtiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiène et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  private titleRegex = /^[A-Z][a-zA-Z]*$/;

  constructor(private fb: FormBuilder, private router: Router) {
          console.log('FORM COMPONENT LOADED');

  }

  ngOnInit(): void {

    this.suggestionForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(this.titleRegex)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(30)
      ]],
      category: ['', Validators.required],

      // ✅ valeurs par défaut + readonly dans HTML
      date: [new Date()],
      status: ['en attente']
    });
  }

  get title() { return this.suggestionForm.get('title'); }
  get description() { return this.suggestionForm.get('description'); }
  get category() { return this.suggestionForm.get('category'); }

  onSubmit(): void {
    if (this.suggestionForm.invalid) return;

    const raw = this.suggestionForm.value;

    const newSuggestion = {
      id: Date.now(),   // auto-incrément simple
      title: raw.title,
      description: raw.description,
      category: raw.category,
      date: raw.date,
      status: raw.status,
      nbLikes: 0        // ✅ pas dans le form, mais valeur par défaut
    };

    console.log('Nouvelle suggestion :', newSuggestion);

    // TODO: ajouter à la liste via service si tu veux
    this.router.navigate(['/suggestions']);
  }
}