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

  public data;

  public sortIsActive = false;
  public firstSort = true;

  public regions: Array<string>;
  public regionID;
  public regionsList: Array<string>;
  public currentRegion = 'все';

  public currenciesList = ['USD', 'EUR'];
  public currentCurrency = 'USD';

  public organizations;
  public organizationID;
  public organizationsList: any;
  public currentOrganization = 'все';

  public sortCurrencyAskSwitcher = true;
  public sortCurrencyBidSwitcher = true;
  public sortRegionSwitcher = true;
  public sortOrganizationSwitcher = true;
  public sortPhoneSwitcher = true;

  public currentData = [];
  public changeData;

  constructor(public appService: AppService) {}

  ngOnInit() {
    this.appService.getData().subscribe((data: any) => {
      this.data = data.organizations;

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

  public currenciesValue(value) {
    for (const key in value) {
      if (key === this.currentCurrency) {
        return value[key];
      }
    }
  }

  public selectCurrency(e) {
    this.currentCurrency = e.target.value;
    this.changeData = this.data.filter(
      item => this.currentCurrency in item.currencies
    );
    this.sortIsActive = false;
    this.filteringData();
  }

  public selectRegion(e) {
    this.page = 1;
    this.from = 0;
    this.to = 10;
    this.currentRegion = e.target.value;
    this.regionID = this.getKey(this.regions, this.currentRegion);
    this.sortIsActive = false;
    this.filteringData();
  }

  public selectOrganization(e) {
    this.page = 1;
    this.from = 0;
    this.to = 10;
    this.currentOrganization = e.target.value;
    this.organizationID = this.getKey(
      this.organizations,
      this.currentOrganization
    );
    this.sortIsActive = false;
    this.filteringData();
  }

  private getKey(object, current) {
    for (const key in object) {
      if (object[key] === current) {
        return key;
      }
    }
  }

  private filteringData() {
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

  sort(e) {
    this.sortIsActive = e.target.innerText;
  }

  public sortCurrencyAsk(value) {
    if (this.sortCurrencyAskSwitcher) {
      this.sortCurrencyAskSwitcher = false;
      this.currentData = this.changeData.sort((a, b) => {
        const currentCurrency = this.currentCurrency;
        if (a[value][currentCurrency].ask < b[value][currentCurrency].ask) {
          return -1;
        }
        if (a[value][currentCurrency].ask > b[value][currentCurrency].ask) {
          return 1;
        }
        return 0;
      });
    } else {
      this.sortCurrencyAskSwitcher = true;
      this.currentData = this.changeData.reverse();
    }
    this.filteringData();
  }

  public sortCurrencyBid(value) {
    if (this.sortCurrencyBidSwitcher) {
      this.sortCurrencyBidSwitcher = false;
      this.currentData = this.changeData.sort((a, b) => {
        const currentCurrency = this.currentCurrency;
        if (a[value][currentCurrency].bid < b[value][currentCurrency].bid) {
          return -1;
        }
        if (a[value][currentCurrency].bid > b[value][currentCurrency].bid) {
          return 1;
        }
        return 0;
      });
    } else {
      this.sortCurrencyBidSwitcher = true;
      this.currentData = this.changeData.reverse();
    }
    this.filteringData();
  }

  public sortRegions(value) {
    if (this.sortRegionSwitcher) {
      this.sortRegionSwitcher = false;
      this.currentData = this.changeData.sort((a, b) => {
        if (this.regions[a[value]] < this.regions[b[value]]) {
          return -1;
        }
        if (this.regions[a[value]] > this.regions[b[value]]) {
          return 1;
        }
        return 0;
      });
    } else {
      this.sortRegionSwitcher = true;
      this.currentData = this.changeData.reverse();
    }
    this.filteringData();
  }

  public sortOrganization(value) {
    if (this.sortOrganizationSwitcher) {
      this.sortOrganizationSwitcher = false;
      this.changeData.sort((a, b) => {
        const nameA = a[value];
        const nameB = b[value];
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.currentData = this.changeData;
    } else {
      this.sortOrganizationSwitcher = true;
      this.currentData = this.changeData.reverse();
    }
    this.filteringData();
  }

  public sortPhone(value) {
    if (this.sortPhoneSwitcher) {
      this.sortPhoneSwitcher = false;
      this.changeData.sort((a, b) => {
        const nameA = a[value];
        const nameB = b[value];
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.currentData = this.changeData;
    } else {
      this.sortPhoneSwitcher = true;
      this.currentData = this.changeData.reverse();
    }
    this.filteringData();
  }

  public getRegionsName(id) {
    for (const key in this.regions) {
      if (key === id) {
        return this.regions[key];
      }
    }
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
}
