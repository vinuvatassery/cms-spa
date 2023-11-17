import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'shell';

  // Toggle class for sidenav Expand and Collapse
  classToggled = false;
  public toggleField() {
    this.classToggled = !this.classToggled;
  }

  overlayContainer: any;

  constructor() { }

  public data: Array<any> = [
    {
      text: "",
    },
  ];
  popupClass = 'userSettingDropdown';
  popupClass1 = 'notificationDropdown';

  public listItems: Array<string> = ["Donna Summer", "David Miller", "Will Smith", "Clone Jack", "Lad Luis"];
  ngOnInit(): void {
  }
  public products: Product[] = [
    { name: 'Donna Summer', id: 'XXXX', dob: 'XX/XX/XXXX', ssn: 'XXX-XX-XXXX' },
    { name: 'David Miller', id: 'XXXX', dob: 'XX/XX/XXXX', ssn: 'XXX-XX-XXXX' },
    { name: 'Philip David', id: 'XXXX', dob: 'XX/XX/XXXX', ssn: 'XXX-XX-XXXX' },
    { name: 'Mike Flex', id: 'XXXX', dob: 'XX/XX/XXXX', ssn: 'XXX-XX-XXXX' },
  ]

  public opened = false;
  public close() {
    this.opened = false;
  }
  public open() {
    this.opened = true;
  }

  public openedAttachment = false;
  public closeAttachment() {
    this.openedAttachment = false;
  }
  public openAttachment() {
    this.openedAttachment = true;
  }

  public show = false;

  @ViewChild("anchor")
  public anchor!: ElementRef;
  @ViewChild("popup", { read: ElementRef })
  public popup!: ElementRef;

  @HostListener("keydown", ["$event"])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.toggle(false);
    }
  }

  @HostListener("document:click", ["$event"])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.toggle(false);
    }
  }

  public toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

}
export interface Product {
  name: string;
  id: string;
  dob: string;
  ssn: string;
}
