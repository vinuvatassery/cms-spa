/** Angular **/
import { Injectable } from '@angular/core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { GridFilterDataType } from '@cms/shared/ui-common';
import { isNumber } from '@progress/kendo-angular-treelist/utils';
import { ConfigurationProvider } from 'libs/shared/util-core/src/lib/api/providers/configuration.provider';
import { IntlService } from '@progress/kendo-angular-intl';
@Injectable({
  providedIn: 'root',
})

export class GridHelperService {

  constructor( 
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider,

  ) {}


  manageSearchFilter(selectedColumn : string ,dropDowncolumns : any[],filterData: CompositeFilterDescriptor, value : any, dateColumns  : any[] =[] )
  {
    
    const dayStartTime = 'T01:01:00.000Z'
    const dayEndTime = 'T23:59:00.000Z'
    const isDateSearch = value.includes('/');
    value = this.formatSearchValue(value, isDateSearch);
    filterData.logic = 'or'

    if (!this.isValidDate(value) &&  value !== '' && isDateSearch) {
      return filterData;
    }
    if(selectedColumn && value)
    {
        if(selectedColumn === 'ALL')
        {
          dropDowncolumns.forEach((column, index) => {
            if(column.columnCode != 'ALL') {
              if(column.dataType ===  GridFilterDataType.String && (isNaN(value) || column.operator==='startswith') && !isDateSearch)
              {
                filterData =  this.addFilterData(column.columnCode  ,value  , filterData, column.operator)
              }
              else 
              if(column.dataType ===  GridFilterDataType.Number && !isNaN(value))
              {
               filterData =  this.addFilterData(column.columnCode  ,value  , filterData, 'eq')
              }
              else  if(column.dataType ===  GridFilterDataType.Date && isDateSearch && isNaN(value))
              {
                filterData =  this.addFilterData(column.columnCode  ,value + dayStartTime  , filterData, 'gte' ,true)

                filterData =  this.addFilterData(column.columnCode  ,value + dayEndTime  , filterData, 'lte' , true)
              }
             
            }
          });
        }
        else
        {
          
          let column = dropDowncolumns.find(o => o.columnCode === selectedColumn);
          if(column?.operator)
          {
              if(column.dataType ===  GridFilterDataType.Date && isDateSearch && isNaN(value))
              {
                filterData =  this.addFilterData(column.columnCode  ,value + dayStartTime  , filterData, 'gte' ,true)

                filterData =  this.addFilterData(column.columnCode  ,value + dayEndTime  , filterData, 'lte' , true)
              }
              else
              {
                filterData = this.addFilterData(selectedColumn  ,value  , filterData, column?.operator)
              }
         }
        }
   }
   return filterData;
  }


    addFilterData(selectedColumn : any ,value : any , filterData: CompositeFilterDescriptor,operator : any, date = false )
    {
      filterData.filters.push(
        {
          filters: [
            {
              field: selectedColumn,
              operator: operator,
              value: value,
            },
          ],
          logic: date === true ?'and' : 'or',
        },
      )

      return filterData;
    }

    private isValidDate = (searchValue: any) =>
    isNaN(searchValue) && !isNaN(Date.parse(searchValue)) && new Date(searchValue).getFullYear() > 1000;

      private formatSearchValue(searchValue: any, isDateSearch: boolean) {
        if (isDateSearch) {
          if (this.isValidDate(searchValue)) {
            return this.intl.formatDate(
              new Date(searchValue),
              this.configProvider?.appSettings?.dateFormat
            );
          } else {
            return '';
          }
        }

        return searchValue;
      }
}

