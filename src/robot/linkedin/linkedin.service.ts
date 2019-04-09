import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Page, Browser, ElementHandle } from 'puppeteer';
import { Company } from 'src/company/company.entity';

const SKIP_RESOURCE_TYPES: string[] = ['image', 'media', 'font', 'eventsource', 'websocket', 'manifest', 'other'];

@Injectable()
export class LinkedinService {

  public async getCompanyDetails(linkedinProfileUrls: string | string[]): Promise<any> {
    
    const browser: Browser = await puppeteer.launch({
      // headless: false,
      defaultViewport: {
        width: 800,
        height: 1200
      }
    });
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
      await browser.close();
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'LinkedIn user unauthorized',
      }, HttpStatus.UNAUTHORIZED);
    }

    const companies: any[] = ( typeof linkedinProfileUrls === 'string' ? [linkedinProfileUrls] : linkedinProfileUrls ).map( (url) => ({ linkedinUrl: url }) );
    for ( let company of companies ) {
      if ( company.linkedinUrl.indexOf('.com/in/') > 0 ) {
        company.linkedinUrl = await this.getUserCompany(company.linkedinUrl, page);
      }
      if ( company.linkedinUrl.indexOf('.com/company/') > 0 ) {
        await page.goto(company.linkedinUrl, { waitUntil: 'domcontentloaded' });
        try {
          if ( company.linkedinUrl.match(/linkedin.com\/company\/[0-9]+\/.*/) ) {
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
            company.linkedinUrl = page.url();
          }
          company.websiteUrl = await page.$eval('[data-control-name="top_card_view_website_custom_cta_btn"]', link => (<any>link).href ) || company.websiteUrl;
          company.name = await page.$eval('.org-top-card-summary__title span', name => (<any>name).textContent ) || company.name;
        } catch(e) {}
      } else {
        company.linkedinUrl = null;
      }
    }

    await browser.close();
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
    await page.focus('#login-email')
    await page.keyboard.type('[EMAIL]');
    await page.focus('#login-password')
    await page.keyboard.type('[PASSWORD]');
    await page.click('#login-submit');
    await page.waitForNavigation({
      waitUntil: 'networkidle2'
    });
    return !!await page.$('.profile-rail-card__actor-link span');
  }

}
