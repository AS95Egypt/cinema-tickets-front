import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Movie {
  id: string;
  title: string;
  genre: string;
  durationMinutes: number;
  description?: string;
  releaseDate: string;
}

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {
  movies: Movie[] = [
    {
      id: '1',
      title: 'The Midnight Horizon',
      genre: 'Sci-Fi',
      durationMinutes: 132,
      description: 'An astronaut discovers a hidden signal.',
      releaseDate: '2024-10-18'
    },
    {
      id: '2',
      title: 'Golden Street',
      genre: 'Drama',
      durationMinutes: 108,
      description: 'A family legacy is challenged in the city.',
      releaseDate: '2023-08-09'
    }
  ];

  movieForm: Movie = this.createEmptyMovie();
  editingMovieId: string | null = null;

  saveMovie(): void {
    if (!this.movieForm.title.trim() || !this.movieForm.genre.trim() || !this.movieForm.durationMinutes || !this.movieForm.releaseDate) {
      return;
    }

    const payload: Movie = {
      ...this.movieForm,
      id: this.editingMovieId ?? crypto.randomUUID(),
      title: this.movieForm.title.trim(),
      genre: this.movieForm.genre.trim(),
      description: this.movieForm.description?.trim() || '',
      durationMinutes: Number(this.movieForm.durationMinutes),
      releaseDate: this.movieForm.releaseDate
    };

    if (this.editingMovieId) {
      this.movies = this.movies.map((movie) => (movie.id === this.editingMovieId ? payload : movie));
    } else {
      this.movies = [payload, ...this.movies];
    }

    this.resetForm();
  }

  editMovie(movie: Movie): void {
    this.movieForm = { ...movie };
    this.editingMovieId = movie.id;
  }

  deleteMovie(id: string): void {
    this.movies = this.movies.filter((movie) => movie.id !== id);

    if (this.editingMovieId === id) {
      this.resetForm();
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private createEmptyMovie(): Movie {
    return {
      id: '',
      title: '',
      genre: '',
      durationMinutes: 0,
      description: '',
      releaseDate: ''
    };
  }

  private resetForm(): void {
    this.movieForm = this.createEmptyMovie();
    this.editingMovieId = null;
  }
}
