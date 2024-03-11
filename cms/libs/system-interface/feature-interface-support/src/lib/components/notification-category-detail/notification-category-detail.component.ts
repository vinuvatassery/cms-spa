import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';

@Component({
    selector: 'notification-category-detail',
    templateUrl: './notification-category-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NotiificationGroupDetailComponent implements OnInit {
    showLoader() {
        this.loaderService.show();
    }

    hideLoader() {
        this.loaderService.hide();
    }

    public formUiStyle: UIFormStyle = new UIFormStyle();
    constructor(private formBuilder: FormBuilder,
        private readonly lovFacade: LovFacade,
        private readonly loaderService: LoaderService,
        private cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {

    }






}