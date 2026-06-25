import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LoaderService } from '../client-registration/service/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  readonly svc = inject(LoaderService);
}