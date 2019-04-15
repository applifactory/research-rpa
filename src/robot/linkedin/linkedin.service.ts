import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Page, Browser, ElementHandle } from 'puppeteer';
import { ConfigService } from 'src/config/config.service';

const SKIP_RESOURCE_TYPES: string[] = ['image', 'media', 'font', 'eventsource', 'websocket', 'manifest', 'other'];

@Injectable()
export class LinkedinService {

  private browserInstance: Browser;
  private browserInitializing: Promise<Browser>;

  get browser(): Promise<Browser> {
    if ( !this.browserInstance && this.browserInitializing ) {
      return this.browserInitializing;
    }
    return this.browserInitializing = new Promise<Browser>( resolve => {
      if ( this.browserInstance ) {
        return resolve(this.browserInstance);
      }
      puppeteer.launch({
        headless: false,
        slowMo: 1,
        defaultViewport: {
          width: 1200,
          height: 1200
        }
      }).then( (browser) => {
        this.browserInstance = browser;
        return resolve(browser);
      })
    })
  }

  constructor(private config: ConfigService) {}

  public async getCompanyDetails(linkedinProfileUrls: string | string[]): Promise<any> {
    
    const browser: Browser = await this.browser;
    const page: Page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', request => {
      if ( SKIP_RESOURCE_TYPES.includes( request.resourceType() ) ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    if ( !await this.login(page) ) {
      await page.close();
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'LinkedIn user unauthorized',
      }, HttpStatus.UNAUTHORIZED);
    }

    const companies: any[] = ( typeof linkedinProfileUrls === 'string' ? [linkedinProfileUrls] : linkedinProfileUrls ).map( (url) => ({ linkedinCompanyUrl: url }) );
    for ( let company of companies ) {
      if ( company.linkedinCompanyUrl.indexOf('.com/in/') > 0 ) {
        company.linkedinPersonUrl = company.linkedinCompanyUrl;
        company.linkedinCompanyUrl = await this.getUserCompany(company.linkedinCompanyUrl, page);
      }
      if ( company.linkedinCompanyUrl.indexOf('.com/company/') > 0 ) {
        await page.goto(company.linkedinCompanyUrl, { waitUntil: 'domcontentloaded' });
        if ( company.linkedinCompanyUrl.match(/linkedin.com\/company\/[0-9]+\/.*/) ) {
          await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
          company.linkedinCompanyUrl = page.url();
        }
        try {
          company.websiteUrl = await page.$eval('[data-control-name="top_card_view_website_custom_cta_btn"]', link => (<any>link).href ) || company.websiteUrl;
        } catch(e) {}
        if ( !company.websiteUrl ) {
          try {
            company.websiteUrl = await page.$eval('[data-control-name="top_card_learn_more_custom_cta_btn"]', link => (<any>link).href ) || company.websiteUrl;
          } catch(e) {}
        }
        try {
          company.name = await page.$eval('.org-top-card-summary__title span', name => (<any>name).textContent ) || company.name;
        } catch(e) {}
      } else {
        company.linkedinCompanyUrl = null;
      }
    }

    await page.close();
    return companies;
  }

  private async getUserCompany(linkedInProfile: string, page: Page): Promise<string> {
    await page.goto(linkedInProfile, { waitUntil: 'domcontentloaded' });
    await page.hover('div');
    try {
      return await page.$eval('#experience-section li a', link => (<any>link).href );
    } catch(e) {
      return null;
    }
  }

  private async login(page: Page): Promise<boolean> {
    await page.goto('https://linkedin.com', {
      waitUntil: 'domcontentloaded'
    });
    try {
      await page.focus('#login-email')
      await page.keyboard.type(this.config.get('LINKEDIN_EMAIL'));
      await page.focus('#login-password')
      await page.keyboard.type(this.config.get('LINKEDIN_PASSWORD'));
      await page.click('#login-submit');
      await page.waitForNavigation({
        waitUntil: 'networkidle2'
      });
      return !!await page.$('.profile-rail-card__actor-link span');
    } catch(e) {}
    try {
      return !!await page.$('.profile-rail-card__actor-link span');
    } catch(e) {}
    return false;
  }

}
