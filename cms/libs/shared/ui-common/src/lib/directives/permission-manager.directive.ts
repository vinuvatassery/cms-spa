import { Input, OnInit, Directive, ViewContainerRef, TemplateRef, OnDestroy } from "@angular/core";
import { UserProfileService } from "@cms/shared/util-core";
import {  Subscription } from "rxjs";

@Directive({
  selector: '[ifPermission]'
})
export class PermissionManagerDirective implements OnInit {
  private subscription: Subscription[] = [];
  // the role the user must have
  @Input() public ifPermission!: Array<string>;
   permission! : any;
  /**
   * @param {ViewContainerRef} viewContainerRef -- the location where we need to render the templateRef
   * @param {TemplateRef<any>} templateRef -- the templateRef to be potentially rendered
   * @param {RolesService} rolesService -- will give us access to the roles a user has
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private rolesService: UserProfileService
  ) {}

  public ngOnInit(): void {
 
        this.permission =  this.rolesService.getUserPermissons() 
        
        if (this.permission.length == 0) {
          // Remove element from DOM
          this.viewContainerRef.clear();
        }
        // user Role are checked by a Roles mention in DOM
        const searchPermission  = this.ifPermission;    
        let hasPermissions = false;    
        for (const perm of searchPermission)
        {            
            hasPermissions = this.permission.some((x : any)=> x.permissionsCode   === perm)   
        }

        if (!hasPermissions) {
          this.viewContainerRef.clear();
        } else {
          // appends the ref element to DOM
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }      
   
  }
}
