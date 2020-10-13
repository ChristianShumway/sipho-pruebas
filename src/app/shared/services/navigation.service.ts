import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { AutenticacionService } from './autenticacion.service';
import { environment } from 'environments/environment';

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  
  iconMenu: IMenuItem[] = [];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle: string = "Frequently Accessed";
  // sets iconMenu as default;

  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();


  constructor(
    private http: HttpClient,
    private autenticacionService: AutenticacionService
  ) {
    const currentProfile =   this.autenticacionService.currentProfileValue;
    console.log(currentProfile);
    // this.getMenu(currentProfile);
  }

  getMenu(profile) {
    return this.http.get<IMenuItem[]>(`${environment.apiURL}/dashboard/getMenu/${profile.idPerfil}`).subscribe(
      result => {
        console.log(result);
        this.iconMenu = result;
        this.menuItems.next(this.iconMenu);
      }
    );
  }

  getMenuLoad(id) {
    return this.http.get<IMenuItem[]>(`${environment.apiURL}/dashboard/getMenu/${id}`);
  }

  // iconMenu: IMenuItem[] = [
  //   {
  //     name: "HOME",
  //     type: "icon",
  //     tooltip: "Home",
  //     icon: "home",
  //     state: "home"
  //   },
  //   {
  //     name: "PROFILE",
  //     type: "icon",
  //     tooltip: "Profile",
  //     icon: "person",
  //     state: "profile/overview"
  //   },
   
  //   {
  //     type: "separator",
  //     name: "Main Items"
  //   },
  //   {
  //     name: "DASHBOARD",
  //     type: "dropDown",
  //     tooltip: "Dashboard",
  //     icon: "dashboard",
  //     state: "dashboard",
  //     sub: [
  //       { name: "Default", state: "default" },
  //       { name: "Analytics", state: "analytics" },
  //       { name: "Cryptocurrency", state: "crypto" },
  //       { name: "Dark Cards", state: "dark" }
  //     ]
  //   },
  //   {
  //     name: "PROFILE",
  //     type: "dropDown",
  //     tooltip: "Profile",
  //     icon: "person",
  //     state: "profile",
  //     badges: [{ color: "primary", value: "2" }],
  //     sub: [
  //       { name: "OVERVIEW", state: "overview" },
  //       { name: "SETTINGS", state: "settings" },
  //       { name: "BLANK", state: "blank" }
  //     ]
  //   },
  //   {
  //     name: "CHARTS",
  //     type: "dropDown",
  //     tooltip: "Charts",
  //     icon: "show_chart",
  //     sub: [
  //       { name: "Chart js", state: "charts" }
  //     ]
  //   },
   
  //   {
  //     name: "SESSIONS",
  //     type: "dropDown",
  //     tooltip: "Pages",
  //     icon: "view_carousel",
  //     state: "sessions",
  //     sub: [
  //       { name: "SIGNUP", state: "signup" },
  //       { name: "Signup 2", state: "signup2" },
  //       { name: "Signup 3", state: "signup3" },
  //       { name: "Signup 4", state: "signup4" },
  //       { name: "SIGNIN", state: "signin" },
  //       { name: "Signin 2", state: "signin2" },
  //       { name: "Signin 3", state: "signin3" },
  //       { name: "Signin 4", state: "signin4" },
  //       { name: "FORGOT", state: "forgot-password" },
  //       { name: "LOCKSCREEN", state: "lockscreen" },
  //       { name: "NOTFOUND", state: "404" },
  //       { name: "ERROR", state: "error" }
  //     ]
  //   },
  //   {
  //     name: "OTHERS",
  //     type: "dropDown",
  //     tooltip: "Others",
  //     icon: "blur_on",
  //     state: "others",
  //     sub: [
  //       { name: "GALLERY", state: "gallery" },
  //       { name: "PRICINGS", state: "pricing" },
  //       { name: "USERS", state: "users" },
  //       { name: "BLANK", state: "blank" }
  //     ]
  //   },
  //   {
  //     name: "DOC",
  //     type: "extLink",
  //     tooltip: "Documentation",
  //     icon: "library_books",
  //     state: "http://demos.ui-lib.com/egret-doc/"
  //   }
  // ];

  getPermisosMenu() {
    return this.http.get<any[]>(`${environment.apiURL}/config/getAuthorizedProfiles/7`);
  }

  separatorMenu: IMenuItem[] = [
    {
      type: "separator",
      name: "Custom components"
    },
    {
      name: "DASHBOARD",
      type: "link",
      tooltip: "Dashboard",
      icon: "dashboard",
      state: "dashboard"
    },
    {
      name: "PROFILE",
      type: "dropDown",
      tooltip: "Profile",
      icon: "person",
      state: "profile",
      sub: [
        { name: "OVERVIEW", state: "overview" },
        { name: "SETTINGS", state: "settings" },
        { name: "BLANK", state: "blank" }
      ]
    },
    {
      type: "separator",
      name: "Integrated components"
    },
    
    {
      name: "CHARTS",
      type: "link",
      tooltip: "Charts",
      icon: "show_chart",
      state: "charts"
    },
    {
      type: "separator",
      name: "Other components"
    },
    {
      name: "SESSIONS",
      type: "dropDown",
      tooltip: "Pages",
      icon: "view_carousel",
      state: "sessions",
      sub: [
        { name: "SIGNUP", state: "signup" },
        { name: "SIGNIN", state: "signin" },
        { name: "FORGOT", state: "forgot-password" },
        { name: "LOCKSCREEN", state: "lockscreen" },
        { name: "NOTFOUND", state: "404" },
        { name: "ERROR", state: "error" }
      ]
    },
    {
      name: "OTHERS",
      type: "dropDown",
      tooltip: "Others",
      icon: "blur_on",
      state: "others",
      sub: [
        { name: "GALLERY", state: "gallery" },
        { name: "PRICINGS", state: "pricing" },
        { name: "USERS", state: "users" },
        { name: "BLANK", state: "blank" }
      ]
    },
    {
      name: "MATICONS",
      type: "link",
      tooltip: "Material Icons",
      icon: "store",
      state: "icons"
    },
    {
      name: "DOC",
      type: "extLink",
      tooltip: "Documentation",
      icon: "library_books",
      state: "http://demos.ui-lib.com/egret-doc/"
    }
  ];

  plainMenu: IMenuItem[] = [
    {
      name: "DASHBOARD",
      type: "link",
      tooltip: "Dashboard",
      icon: "dashboard",
      state: "dashboard"
    },
    {
      name: "PROFILE",
      type: "dropDown",
      tooltip: "Profile",
      icon: "person",
      state: "profile",
      sub: [
        { name: "OVERVIEW", state: "overview" },
        { name: "SETTINGS", state: "settings" },
        { name: "BLANK", state: "blank" }
      ]
    },
   
    {
      name: "CHARTS",
      type: "link",
      tooltip: "Charts",
      icon: "show_chart",
      state: "charts"
    },
    {
      name: "SESSIONS",
      type: "dropDown",
      tooltip: "Pages",
      icon: "view_carousel",
      state: "sessions",
      sub: [
        { name: "SIGNUP", state: "signup" },
        { name: "SIGNIN", state: "signin" },
        { name: "FORGOT", state: "forgot-password" },
        { name: "LOCKSCREEN", state: "lockscreen" },
        { name: "NOTFOUND", state: "404" },
        { name: "ERROR", state: "error" }
      ]
    },
    {
      name: "OTHERS",
      type: "dropDown",
      tooltip: "Others",
      icon: "blur_on",
      state: "others",
      sub: [
        { name: "GALLERY", state: "gallery" },
        { name: "PRICINGS", state: "pricing" },
        { name: "USERS", state: "users" },
        { name: "BLANK", state: "blank" }
      ]
    },
    {
      name: "MATICONS",
      type: "link",
      tooltip: "Material Icons",
      icon: "store",
      state: "icons"
    },
    {
      name: "DOC",
      type: "extLink",
      tooltip: "Documentation",
      icon: "library_books",
      state: "http://demos.ui-lib.com/egret-doc/"
    }
  ];

  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string) {
    switch (menuType) {
      case "separator-menu":
        this.menuItems.next(this.separatorMenu);
        break;
      case "icon-menu":
        this.menuItems.next(this.iconMenu);
        break;
      default:
        this.menuItems.next(this.plainMenu);
    }
  }
}
