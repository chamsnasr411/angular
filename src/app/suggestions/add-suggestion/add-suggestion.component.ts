import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionService } from '../../core/services/suggestion.service';
import { Suggestion } from '../../models/suggestion';

@Component({
  selector: 'app-add-suggestion',
  templateUrl: './add-suggestion.component.html',
  styleUrls: ['./add-suggestion.component.css']
})
export class AddSuggestionComponent implements OnInit {

  suggestionForm!: FormGroup;
  isEditMode = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private service: SuggestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Création du formulaire
    this.suggestionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      date: [this.todayDate(), Validators.required],
      status: ['en_attente', Validators.required],
      nbLikes: [0]
    });

    // Vérifier si on est en mode UPDATE
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.id = Number(idParam);

      this.service.getSuggestionById(this.id).subscribe({
        next: (data) => {
          this.suggestionForm.patchValue({
            title: data.title,
            description: data.description,
            category: data.category,
            date: this.formatDate(data.date),
            status: data.status,
            nbLikes: data.nbLikes ?? 0
          });
        },
        error: (err) => console.error('Erreur chargement update', err)
      });
    }
  }

  save(): void {

    if (this.suggestionForm.invalid) {
      this.suggestionForm.markAllAsTouched();
      return;
    }

    const payload = this.suggestionForm.value as Omit<Suggestion, 'id'>;

    // UPDATE
    if (this.isEditMode && this.id != null) {
      this.service.updateSuggestion(this.id, payload).subscribe({
        next: () => this.router.navigate(['/suggestions']),
        error: (err) => console.error('Erreur update', err)
      });
    }
    // ADD
    else {
      this.service.addSuggestion(payload).subscribe({
        next: () => this.router.navigate(['/suggestions']),
        error: (err) => console.error('Erreur ajout', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/suggestions']);
  }

  // Helpers
  private todayDate(): string {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  private formatDate(date: string): string {
    if (!date) return this.todayDate();
    return date.substring(0, 10);
  }
}