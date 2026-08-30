import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateHallRequest, HALL_TYPES, Hall, HallType } from '../hall.models';

@Component({
  selector: 'app-hall-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hall-form.component.html',
  styleUrl: './hall-form.component.css'
})
export class HallFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  @Input() hall: Hall | null = null;
  @Input() serverError: string | null = null;
  @Input() submitting = false;
  @Input() submitLabel = 'Save hall';
  @Output() formSubmit = new EventEmitter<CreateHallRequest>();

  readonly hallTypes = HALL_TYPES;

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    numberOfSeats: [null as number | null, [Validators.required, Validators.min(1)]],
    type: ['', [Validators.required]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['hall']) {
      if (this.hall) {
        this.form.reset({
          title: this.hall.title,
          numberOfSeats: this.hall.numberOfSeats,
          type: this.hall.type
        });
      } else {
        this.form.reset({
          title: '',
          numberOfSeats: null,
          type: ''
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
    this.formSubmit.emit({
      title: (raw.title ?? '').trim(),
      numberOfSeats: Number(raw.numberOfSeats ?? 0),
      type: raw.type as HallType
    });
  }
}
