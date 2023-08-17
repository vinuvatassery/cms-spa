export class GridFilterParam {

    constructor(skipCount?: any,
        maxResultCount?: any,
        sorting?: string,
        sortType?: string,
        filter?: string) {
        this.skipCount = skipCount;
        this.sorting = sorting;
        this.sortType = sortType;
        this.maxResultCount = maxResultCount;
        this.filter = filter;
    };

    skipCount?: number;
    maxResultCount?: number;
    sorting?: string;
    sortType?: string;
    filter?: string;

    convertToQueryString(): string {
        let params: string = '';
        for (const [key, value] of Object.entries(this)) {
            if (value === null || value === undefined || value === '') {
                continue;
            }
            if (params) {
                params = params + '&' + key + '=' + value;
            } else {
                params = key + '=' + value;
            }
        }
        return params ? '?' + params : '';
    }
}