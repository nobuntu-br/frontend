import { Component, Output, EventEmitter } from '@angular/core';
import { ViewToggleService } from 'app/shared/services/view-toggle.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-view-toggle',
  templateUrl: './view-toggle.component.html',
  styleUrls: ['./view-toggle.component.scss'],
})
export class ViewToggleComponent {
  constructor(private viewToggleService: ViewToggleService) {}
  @Output() viewModeChanged = new EventEmitter<string>();

  changeViewMode(mode: string) {
    this.viewToggleService.changeViewMode(mode);
  }
}
