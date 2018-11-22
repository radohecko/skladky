import { Component, OnInit, Input, Output, HostBinding, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-buttons',
  templateUrl: './toggle-buttons.component.html',
  styleUrls: ['./toggle-buttons.component.scss']
})
export class ToggleButtonsComponent implements OnInit {

  @Input() selectedValue: ToggleGroupValue = null;
  @Input() options: ToggleGroupOption[];
  @Input() @HostBinding('class.full-width') fullWidth = false;
  @Output() selectedValueChange: EventEmitter<ToggleGroupValue> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  isSelected(option: ToggleGroupOption) {
    return ((this.selectedValue as string) || '') === option.value;
  }

  onButtonClick(option: ToggleGroupOption) {
    if (this.selectedValue !== option.value) {
      this.selectedValue = option.value;
      this.selectedValueChange.emit(this.selectedValue);
    }
  }

}

export type ToggleGroupValue = string | string[] | null;

export interface ToggleGroupOption {
  value: string;
  label: string;
}
