import { Input, OnInit, Directive, ViewContainerRef, TemplateRef, OnDestroy } from "@angular/core";
import { AuthService } from "@cms/shared/util-oidc";
import { UserDataService } from "@cms/system-config/domain";
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
    private authService: AuthService,
    private readonly userDataService: UserDataService
  ) {}

  public ngOnInit(): void {
    this.subscription.push(

      this.userDataService.getProfile$
      .pipe(first(profile => profile?.length > 0))
      .subscribe((profile:any)=>{
        let permissions : any;       
        for(const profileItem of profile){
          if(permissions == undefined || permissions?.length == 0){
            permissions = profileItem?.permissions 
          }
          else{
            profileItem?.permissions.forEach((newPerm : any) => {
              const permissionExists = permissions.some((existPerm : any) => existPerm.permissionId === newPerm.permissionId);
              if(!permissionExists){
                permissions.push(newPerm);    
              }
            });
          }
        }
        this.permission = permissions;             
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
        permissions = null;
        this.permission = null; 
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
