import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public page = 1;
  public totalResult = 1;
  public from = 0;
  public to = 10;

  public regions: Array<string>;
  public regionID: string;
  public regionsList: Array<string>;
  public currentRegion = 'все';

  public currenciesList = ['USD', 'EUR'];
  public currentCurrency = 'USD';

  public organizations: object;
  public organizationID: string;
  public organizationsList: any;
  public currentOrganization = 'все';

  public sortIsActive = '';
  public sortCurrencyAskSwitcher = true;
  public sortCurrencyBidSwitcher = true;
  public sortRegionSwitcher = true;
  public sortOrganizationSwitcher = true;
  public sortPhoneSwitcher = true;

  public data: any;
  public currentData = [];
  public changeData: Array<any>;

  public date: any;

  constructor(public appService: AppService) {}

  ngOnInit() {
    this.appService.getData().subscribe((data: any) => {
      this.data = data.organizations;

      const objDate = new Date(data.date);
      this.date = `${objDate.getDate()}.${objDate.getMonth() +
        1}.${objDate.getFullYear()} - ${objDate.getHours()}:${objDate.getMinutes()}`;

      this.currentData = this.data
        .filter(item => this.currentCurrency in item.currencies)
        .slice(this.from, this.to);

      this.changeData = this.data.filter(
        item => this.currentCurrency in item.currencies
      );

      this.totalResult = Math.ceil(data.organizations.length / 10);

      this.regions = data.regions;
      this.regionsList = Object.values(data.regions);

      this.organizations = data.orgTypes;
      this.organizationsList = Object.values(data.orgTypes);
    });
  }

  public currenciesValue(value): object {
    for (const key in value) {
      if (key === this.currentCurrency) {
        return value[key];
      }
    }
  }

  private getKey(object, current): string {
    for (const key in object) {
      if (object[key] === current) {
        return key;
      }
    }
  }

  public selectCurrency(e): void {
    this.currentCurrency = e.target.value;
    this.changeData = this.data.filter(
      item => this.currentCurrency in item.currencies
    );
    this.sortIsActive = '';
    this.filteringData();
  }

  public selectRegion(e): void {
    this.page = 1;
    this.from = 0;
    this.to = 10;
    this.currentRegion = e.target.value;
    this.regionID = this.getKey(this.regions, this.currentRegion);
    this.sortIsActive = '';
    this.filteringData();
  }

  public selectOrganization(e): void {
    this.page = 1;
    this.from = 0;
    this.to = 10;
    this.currentOrganization = e.target.value;
    this.organizationID = this.getKey(
      this.organizations,
      this.currentOrganization
    );
    this.sortIsActive = '';
    this.filteringData();
  }

  private filteringData(): any {
    if (this.currentRegion === 'все' && this.currentOrganization === 'все') {
      this.currentData = this.changeData
        .filter(item => this.currentCurrency in item.currencies)
        .slice(this.from, this.to);
      this.totalResult = Math.ceil(this.data.length / 10);
    } else if (
      this.currentRegion === 'все' &&
      this.currentOrganization !== 'все'
    ) {
      this.currentData = this.changeData.filter(item => {
        return (
          this.currentCurrency in item.currencies &&
          item.orgType === +this.organizationID
        );
      });
      this.totalResult = Math.ceil(this.currentData.length / 10);
      this.currentData = this.currentData.slice(this.from, this.to);
    } else if (
      this.currentRegion !== 'все' &&
      this.currentOrganization === 'все'
    ) {
      this.currentData = this.changeData.filter(item => {
        return (
          this.currentCurrency in item.currencies &&
          item.regionId === this.regionID
        );
      });
      this.totalResult = Math.ceil(this.currentData.length / 10);
      this.currentData = this.currentData.slice(this.from, this.to);
    } else {
      this.currentData = this.changeData.filter(item => {
        return (
          this.currentCurrency in item.currencies &&
          item.regionId === this.regionID &&
          item.orgType === +this.organizationID
        );
      });
      this.totalResult = Math.ceil(this.currentData.length / 10);
      this.currentData = this.currentData.slice(this.from, this.to);
    }
  }

  public sortCurrencyAsk(value, e) {
    this.sortIsActive = e.target.title;
    if (this.sortCurrencyAskSwitcher) {
      this.sortCurrencyAskSwitcher = false;
      this.currentData = this.changeData.sort((a, b) => {
        return this.sortAtoB(
          a[value][this.currentCurrency].ask,
          b[value][this.currentCurrency].ask
        );
      });
    } else {
      this.sortCurrencyAskSwitcher = true;
      this.currentData = this.changeData.sort((a, b) => {
        return this.sortBtoA(
          a[value][this.currentCurrency].ask,
          b[value][this.currentCurrency].ask
        );
      });
    }
    this.filteringData();
  }

  public sortCurrencyBid(value, e) {
    this.sortIsActive = e.target.title;
    if (this.sortCurrencyBidSwitcher) {
      this.sortCurrencyBidSwitcher = false;
      this.currentData = this.changeData.sort((a, b) => {
        return this.sortAtoB(
          a[value][this.currentCurrency].bid,
          b[value][this.currentCurrency].bid
        );
      });
    } else {
      this.sortCurrencyBidSwitcher = true;
      this.currentData = this.changeData.sort((a, b) => {
        return this.sortBtoA(
          a[value][this.currentCurrency].bid,
          b[value][this.currentCurrency].bid
        );
      });
    }
    this.filteringData();
  }

  public sortRegions(value, e) {
    this.sortIsActive = e.target.title;
    if (this.sortRegionSwitcher) {
      this.sortRegionSwitcher = false;
      this.currentData = this.changeData.sort((a, b) => {
        return this.sortAtoB(this.regions[a[value]], this.regions[b[value]]);
      });
    } else {
      this.sortRegionSwitcher = true;
      this.currentData = this.changeData.sort((a, b) => {
        return this.sortBtoA(this.regions[a[value]], this.regions[b[value]]);
      });
    }
    this.filteringData();
  }

  public sortOrganization(value, e) {
    this.sortIsActive = e.target.title;
    if (this.sortOrganizationSwitcher) {
      this.sortOrganizationSwitcher = false;
      this.currentData = this.changeData.sort((a, b) => {
        return this.sortAtoB(a[value], b[value]);
      });
    } else {
      this.sortOrganizationSwitcher = true;
      this.currentData = this.changeData.sort((a, b) => {
        return this.sortBtoA(a[value], b[value]);
      });
    }
    this.filteringData();
  }

  public sortPhone(value, e) {
    this.sortIsActive = e.target.title;
    if (this.sortPhoneSwitcher) {
      this.sortPhoneSwitcher = false;
      this.currentData = this.changeData.sort((a, b) => {
        return this.sortAtoB(a[value], b[value]);
      });
    } else {
      this.sortPhoneSwitcher = true;
      this.currentData = this.changeData.sort((a, b) => {
        return this.sortBtoA(a[value], b[value]);
      });
    }
    this.filteringData();
  }

  public goToPage(page: number): void {
    this.page = page;
    this.from = this.page * 10 - 10;
    this.to = this.page * 10;
    this.filteringData();
  }

  public onNext(): void {
    this.page++;
    this.from = this.page * 10 - 10;
    this.to = this.page * 10;
    this.filteringData();
  }

  public onPrev(): void {
    this.page--;
    this.from = this.page * 10 - 10;
    this.to = this.page * 10;
    this.filteringData();
  }

  private sortAtoB(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }

  private sortBtoA(a, b) {
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  }
}
