import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuggestionService } from '../../../core/services/suggestion.service';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-form',
  templateUrl: './suggestion-form.component.html',
  styleUrls: ['./suggestion-form.component.css']
})
export class SuggestionFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private service: SuggestionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      category: ['', Validators.required],
      date: [this.todayDateInput(), Validators.required],   // string YYYY-MM-DD
      status: ['en_attente', Validators.required],
      nbLikes: [0]
    });

    // ✅ Détecter le mode update
    
this.route.paramMap.subscribe(params => {
  const idParam = params.get('id');
  console.log('FORM route idParam =', idParam);

  if (idParam === 'undefined') {
    console.error('You navigated to update/undefined -> check routerLink');
    this.isEditMode = false;
    this.id = undefined;
    return;
  }
      if (idParam) {
        const parsed = Number(idParam);
        if (!Number.isNaN(parsed)) {
          this.isEditMode = true;
          this.id = parsed;

          // ✅ Charger les données et remplir le formulaire
         this.service.getSuggestionById(this.id).subscribe({
  next: (s) => {
    this.form.patchValue({
      title: s.title,
      description: s.description,
      category: s.category,
      date: String(s.date).substring(0,10),
      status: s.status,
      nbLikes: s.nbLikes ?? 0
    });
  
            },
            error: (err) => console.error('LOAD for update error', err)
          });
        }
      } else {
        // mode add
        this.isEditMode = false;
        this.id = undefined;
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    // ✅ payload conforme à ton modèle (avec suggestion obligatoire)
    const payload: Omit<Suggestion, 'id'> = {
      suggestion: raw.title,               // obligatoire chez toi
      title: raw.title,
      description: raw.description,
      category: raw.category,
      date: raw.date,                      // string
      status: raw.status,
      nbLikes: raw.nbLikes ?? 0
    };

    if (this.isEditMode && this.id != null) {
      // ✅ UPDATE
      this.service.updateSuggestion(this.id, payload).subscribe({
        next: () => this.router.navigate(['/suggestions']),
        error: (err) => console.error('UPDATE error', err)
      });
    } else {
      // ✅ ADD
      this.service.addSuggestion(payload).subscribe({
        next: () => this.router.navigate(['/suggestions']),
        error: (err) => console.error('ADD error', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/suggestions']);
  }

  private todayDateInput(): string {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  private toDateInput(date: string): string {
    // si backend renvoie "2026-02-28T00:00:00.000Z" -> on garde YYYY-MM-DD
    return String(date).substring(0, 10);
  }
  isInvalid(controlName: string): boolean {
  const c = this.form.get(controlName);
  return !!c && c.invalid && (c.touched || c.dirty);
}
}