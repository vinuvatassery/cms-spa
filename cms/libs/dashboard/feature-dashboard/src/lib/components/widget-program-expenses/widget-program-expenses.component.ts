import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';  
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Subject, takeUntil } from 'rxjs'; 


@Component({
  selector: 'dashboard-widget-program-expenses',
  templateUrl: './widget-program-expenses.component.html',
  styleUrls: ['./widget-program-expenses.component.scss']
})

export class WidgetProgramExpensesComponent implements OnInit, OnDestroy  {
  selectedType:any[]=['MEDICAL_CLAIM','DENTAL_CLAIM','MEDICAL_PREMIUM','DENTAL_PREMIUM','PHARMACY_CLAIM']
  programExpenses: any; 
  private destroy$ = new Subject<void>();
  public formUiStyle: UIFormStyle = new UIFormStyle();


  public isChecked = false;
  dataExp  = [
              {Name : 'Medical Claims',
              Value : 'MEDICAL_CLAIM'
              }, 
              {Name : 'Dental Claims',
              Value : 'DENTAL_CLAIM'
              },
              {Name : 'Medical Premiums',
              Value : 'MEDICAL_PREMIUM'
              }, 
              {Name : 'Dental Premiums',
              Value : 'DENTAL_PREMIUM',
              },
            {
              Name : 'Pharmacy Claims',
              Value : 'PHARMACY_CLAIM',
            }]
  dataMonth  = [{Name : 'Monthly',
                Value : 'M'
                },
                {Name : 'Quarterly',
                Value : 'Q'
                },
                {Name : 'Yearly',
                Value : 'Y'
                }]

  dataYear  = ['Current Year','Last Year']
  selectFrequency ="M"
  selectedTimeFrame = 'Last Year'
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade, private changeDetectorRef: ChangeDetectorRef) {}

  public onClick() {
    this.isChecked = !this.isChecked;
    this.selectedType = this.isChecked ? this.dataExp.map(x=> x.Value):[]
    this.changeDetectorRef.detectChanges()
    this.loadProgramExpensesChart()
  }

   isItemSelected(item:any) {
    console.log(item)
    console.log(this.selectedType)
    const value =  this.selectedType?.some((x) => x === item.Value);
    console.log(value)
    return value
  }

  public onValueChange() {
    this.isChecked = this.selectedType &&  this.selectedType.length === this.dataExp.length;
    this.loadProgramExpensesChart()
  }

  TimeFrameValueChange(event:string){
    this.selectedTimeFrame = event
    this.loadProgramExpensesChart()
  }
  removeWidgetCard(){
    this.removeWidget.emit();
  }

  public get isIndet() {
    return (
      this.selectedType?.length !== 0 && this.selectedType?.length !== this.selectedType?.length
    );
  }

  ngOnInit(): void { 
    this.loadProgramExpensesChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  frequecyValueChange(event:any){
    this.loadProgramExpensesChart()
  }

  onCheckChange(event:any){
    debugger;
  }
  loadProgramExpensesChart() {
 
    const payload= {
      expenseType : this.selectedType ? this.selectedType :this.dataExp.map(x=> x.Value) ,
      frequency : this.selectFrequency,
      TimeFrame : this.selectedTimeFrame
    }
    this.widgetFacade.loadProgramExpensesChart('E2301551-610C-43BF-B7C9-9B623ED425C3',payload);
    this.widgetFacade.programExpensesChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.programExpenses = response;
            this.changeDetectorRef.detectChanges()
          }
        }
      });
  }
}
