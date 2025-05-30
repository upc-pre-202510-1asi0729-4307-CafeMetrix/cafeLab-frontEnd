import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Component for handling invalid routes
 * @class PageNotFoundComponent
 * @description
 * This component is displayed when a user navigates to a route that doesn't exist.
 * It shows the invalid path and provides a button to return to the home page.
 */
@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    MatButton,
    TranslatePipe
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent implements OnInit {
  /** The invalid path that was requested */
  protected invalidPath: string;

  /** Route service for accessing current URL information */
  private route: ActivatedRoute = inject(ActivatedRoute);

  /** Router service for navigation */
  private router: Router = inject(Router);

  /**
   * Creates an instance of PageNotFoundComponent.
   * Initializes the invalidPath property.
   */
  constructor() {
    this.invalidPath = '';
  }

  /**
   * Initializes the component.
   * Extracts the invalid path from the current route.
   */
  ngOnInit(): void {
    this.invalidPath = this.route.snapshot.url.map(url => url.path).join('/');
  }

  /**
   * Navigates back to the home page.
   * Called when the user clicks the home button.
   * @protected
   */
  protected onNavigateHome() {
    this.router.navigate(['home']).then();
  }
}
