/** Angular **/
import { Injectable } from '@angular/core';
import { ColumnComponent } from '@progress/kendo-angular-grid';
/** External libraries **/

@Injectable({ providedIn: 'root' })
export class ExportHelpersFacade {

    /** Public methods **/

    getHiddenDataGridColumns(columns: ColumnComponent[]): string[] {
        return columns
            .filter((column: ColumnComponent) => column.hidden)
            .map((column: any) => column.field ? column.field.charAt(0).toUpperCase() + column.field.slice(1) : null);
    }
}
