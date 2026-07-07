import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-name-editor',
  templateUrl: './practice-form.html',
  styleUrls: ['./practice-form.scss'],
  imports: [ReactiveFormsModule],
})
export class PracticeForm {






  practicename = new FormControl('');
}