/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from '@angular/core';
/** Facades **/
import { ContactFacade, FriendsOrFamilyContactClientProfile, StatusFlag } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { SnackBarNotificationType,NotificationSnackbarService, LoaderService, LoggingService} from '@cms/shared/util-core';
import { of } from 'rxjs';

@Component({
  selector: 'case-management-friend-or-family-detail',
  templateUrl: './friend-or-family-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendOrFamilyDetailComponent implements OnInit {
  /** Input properties **/
  @Input() isEditValue!: boolean;
  @Input() isFriendsorFamilyEditValue!: boolean;
  @Input() clientId!: number;
  @Input() caseEligibilityId!: string;
  @Input() selectedContact!:any;
  @Output() detailModalCloseEvent= new EventEmitter<any>();
  /** Public properties **/
  ddlRelationshipToClient$ = this.lovFacade.lovCntRelationship$;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  clientContact!: FriendsOrFamilyContactClientProfile ;
  contactForm!:FormGroup;
  showLoaderOnRelationType$ = this.lovFacade.showLoaderOnRelationType$;
  contact!:any;



  /** Constructor **/
  constructor(private readonly contactFacade: ContactFacade, private readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder, private loaderService: LoaderService,
    private readonly loggingService: LoggingService, private readonly snackbarService: NotificationSnackbarService,
    private readonly cdr:ChangeDetectorRef) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadDdlRelationshipToClient();
    this.buildForm();
    if(this.isEditValue)
    {
      this.bindDataToForm(this.selectedContact)
    }
  }

  /** Private methods **/
  private loadDdlRelationshipToClient() {
    this.lovFacade.getContactRelationShipsLovs();
  }
  buildForm()
  {
    this.contactForm = this.formBuilder.group({
      contactName:[''],
      relationshipType: [''],
      phoneNbr: [''],
    });
  }
  closePopup(){
    this.contactFacade.showAddContactPopupSubject.next(false);
  }
  resetValidators()
  {
    Object.keys(this.contactForm.controls).forEach((key: string) => {
      this.contactForm.controls[key].removeValidators(Validators.required);
      this.contactForm.controls[key].updateValueAndValidity();
    });
  }
  validateForm()
  {
    this.resetValidators();
    this.contactForm.markAllAsTouched();
    this.contactForm.updateValueAndValidity();
    this.contactForm.controls["contactName"].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 \-]+$')]);
    this.contactForm.controls["contactName"].updateValueAndValidity();
    this.contactForm.controls["relationshipType"].setValidators([Validators.required]);
    this.contactForm.controls["relationshipType"].updateValueAndValidity();
    this.contactForm.controls["phoneNbr"].setValidators([Validators.required, Validators.pattern('[0-9]+')]);
    this.contactForm.controls["phoneNbr"].updateValueAndValidity();
  }
  populateModel(isDeactivateClicked = false)
  {
    if(isDeactivateClicked)
    {
      this.clientContact = {
        clientRelationshipId: this.contact.clientRelationshipId,
        clientId: this.contact.clientId,
        clientCaseEligibilityId: this.contact.clientCaseEligibilityId,
        relationshipSubTypeCode: this.contact.relationshipSubTypeCode,
        firstName: this.contact.firstName,
        phoneNbr: this.contact.phoneNbr,
        activeFlag: StatusFlag.No,
        concurrencyStamp: this.contact.concurrencyStamp
      }
    }
    else
    {
      this.clientContact = {
        clientId: this.clientId,
        clientCaseEligibilityId: this.caseEligibilityId,
        relationshipSubTypeCode: this.contactForm?.controls['relationshipType']?.value,
        firstName: this.contactForm?.controls['contactName']?.value,
        phoneNbr: this.contactForm?.controls['phoneNbr']?.value,
        activeFlag: StatusFlag.Yes
      }
    }
  }
  createContact() {
    this.validateForm();
    this.populateModel();
    if (this.contactForm.valid)
    {
      this.loaderService.show();
      if(!this.isEditValue){
      return this.contactFacade.createContact(this.clientId ?? 0, this.clientContact).subscribe({
        next:(data)=>{
          this.loaderService.hide();
          this.detailModalCloseEvent.emit(true);
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Friend Or Family Contact Saved Successfully.")
        },
        error:(error)=>{
          this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,error)
          this.loggingService.logException(error);
           this.loaderService.hide();
        }
      });
    }
    else
    {
      this.clientContact.clientRelationshipId = this.contact.clientRelationshipId;
      this.clientContact.concurrencyStamp = this.contact.concurrencyStamp;
      return this.contactFacade.updateContact(this.clientId ?? 0, this.clientContact).subscribe({
        next:(data)=>{
          this.loaderService.hide();
          this.detailModalCloseEvent.emit(true);
          this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Friend Or Family Contact Updated Successfully.")
        },
        error:(error)=>{
          this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,error)
          this.loggingService.logException(error);
           this.loaderService.hide();
        }
      });
    }
   }
   return of(false);
 }
 get fAfContact() {
  return this.contactForm.controls as any;
}
bindDataToForm(contact:any)
{
  this.contact = contact;
  this.contactForm.controls["contactName"].setValue(contact.firstName);
  this.contactForm.controls["relationshipType"].setValue(contact.relationshipSubTypeCode);
  this.contactForm.controls["phoneNbr"].setValue(contact.phoneNbr);
  this.contactForm.markAllAsTouched();
  this.cdr.detectChanges();
}
deactivateContact()
{
  this.loaderService.show();
  this.populateModel(true)
    return this.contactFacade.updateContact(this.clientId ?? 0, this.clientContact).subscribe({
      next:(data)=>{
        this.loaderService.hide();
        this.detailModalCloseEvent.emit(true);
        this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Friend Or Family Contact Updated Successfully.")
      },
      error:(error)=>{
        this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,error)
        this.loggingService.logException(error);
         this.loaderService.hide();
      }
    });
}
}
