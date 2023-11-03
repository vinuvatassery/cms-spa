import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable } from 'rxjs';

@Component({
  selector: 'cms-pharmacy-claims-provider-info',
  templateUrl: './pharmacy-claims-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  @Output() getProviderPanelEvent = new EventEmitter<any>();
  isEditProvider = false;
  @Input() vendorProfile$: Observable<any> | undefined;
  @Output() updateProviderProfileEvent = new EventEmitter<any>();
  @Input() updateProviderPanelSubject$ : Observable<any> | undefined;
  @Input() ddlStates$ : Observable<any> | undefined;
  @Input() paymentMethodCode$ : Observable<any> | undefined;
  @Output() onEditProviderProfileEvent = new EventEmitter<any>();
  vendorProfile: any
  @Input() paymentRequestId:any
  constructor(  
    private readonly changeDetectorRef: ChangeDetectorRef,
    public activeRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
   // this.paymentRequestId= this.paymentRequestId ? this.paymentRequestId : this.activeRoute.snapshot.queryParams['pid'];
    this.paymentRequestId='58f3033e-09da-49e7-a6dd-93a319aaa7c5'
     this.loadVendorInfo()
   }
  public formUiStyle : UIFormStyle = new UIFormStyle();
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }

  editProviderClicked(){
    this.isEditProvider = !this.isEditProvider
  }
  loadVendorInfo() {
    debugger;
    this.vendorProfile$?.subscribe((res:any) => {
      this.changeDetectorRef.markForCheck()
      this.vendorProfile = res;
      this.isEditProvider = false
    })

    this.getProviderPanelEvent.emit(this.paymentRequestId)
  }
  
}
