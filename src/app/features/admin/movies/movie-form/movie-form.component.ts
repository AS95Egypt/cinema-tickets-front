import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { validUrlValidator } from '../../../../shared/validators/valid-url.validator';
import { MOVIE_GENRES, Movie, MovieFormValue, MovieGenre } from '../movie.models';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.css'
})
export class MovieFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() initialValue: Movie | null = null;
  @Input() serverError: string | null = null;
  @Input() submitting = false;
  @Input() submitLabel = 'Save movie';
  @Output() save = new EventEmitter<MovieFormValue>();

  readonly movieGenres = MOVIE_GENRES;

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    genre: ['' as MovieGenre | '', [Validators.required]],
    duration: [null as number | null, [Validators.required, Validators.min(1)]],
    releaseDate: ['', [Validators.required]],
    language: ['', [Validators.required]],
    description: ['', [Validators.required]],
    actors: [''],
    trailerUrl: ['', [validUrlValidator()]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialValue']) {
      if (this.initialValue) {
        this.form.reset({
          title: this.initialValue.title,
          genre: this.initialValue.genre,
          duration: this.initialValue.duration,
          releaseDate: this.toInputDate(this.initialValue.releaseDate),
          language: this.initialValue.language,
          description: this.initialValue.description,
          actors: this.initialValue.actors ?? '',
          trailerUrl: this.initialValue.trailerUrl ?? ''
        });
      } else {
        this.form.reset({
          title: '',
          genre: '',
          duration: null,
          releaseDate: '',
          language: '',
          description: '',
          actors: '',
          trailerUrl: ''
        });
      }
    }
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting) {
      return;
    }

    const raw = this.form.getRawValue();
    this.save.emit({
      title: (raw.title ?? '').trim(),
      genre: raw.genre as MovieGenre | '',
      duration: Number(raw.duration ?? 0),
      releaseDate: raw.releaseDate ?? '',
      language: (raw.language ?? '').trim(),
      description: (raw.description ?? '').trim(),
      actors: (raw.actors ?? '').trim(),
      trailerUrl: (raw.trailerUrl ?? '').trim()
    });
  }

  private toInputDate(value: string): string {
    if (!value) {
      return '';
    }

    return value.length >= 10 ? value.slice(0, 10) : new Date(value).toISOString().slice(0, 10);
  }
}
