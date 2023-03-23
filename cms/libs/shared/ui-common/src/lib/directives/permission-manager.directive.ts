import { Input, OnInit, Directive, ViewContainerRef, TemplateRef, OnDestroy } from "@angular/core";
import { AuthService } from "@cms/shared/util-oidc";
import {  first, Subscription } from "rxjs";

@Directive({
  selector: '[ifPermission]'
})
export class PermissionManagerDirective implements OnInit, OnDestroy {
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
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.subscription.push(

      this.authService.getProfile$
      .pipe(first(profile => profile[0]?.permissions != null))
      .subscribe((profile:any)=>{       
            
            this.permission =profile[0]?.permissions 
            
            if (this.permission?.length == 0) {
              // Remove element from DOM
              this.viewContainerRef.clear();
            }            
            const searchPermission  = this.ifPermission;    
            let hasPermissions = false;    
            for (const perm of searchPermission)
            {            
                hasPermissions = this.permission?.some((x : any)=> x.permissionsCode   === perm)   
            }

            if (!hasPermissions) {
              this.viewContainerRef.clear();
            } else {
              // appends the ref element to DOM
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }   
          })      
      );
  }

  /**
   * on destroy cancels the API if its fetching.
   */
  public ngOnDestroy(): void {
    this.subscription.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
