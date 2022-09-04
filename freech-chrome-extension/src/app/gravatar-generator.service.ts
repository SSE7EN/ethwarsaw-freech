import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GravatarGeneratorService {

    // https://www.gravatar.com/avatar/BXWkQkouWtuzGiqNN26sklGedT4j8R2YVQb-azcaL1I?s=32&d=identicon&r=PG

    private baseUrl: string = "https://www.gravatar.com/avatar/";
    private urlStaticSuffix: string = "&d=identicon&r=PG";


    constructor() {
    }

    public generateGravatarSourceUrl(query: string): string {
        //Remove whitespace characters
        return this.baseUrl + query.replace(/\s/g, "") + this.urlStaticSuffix;
    }


}
